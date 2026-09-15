-- Preserve the points awarded at check-in so later event edits do not rewrite
-- a member's history.
ALTER TABLE public.event_attendance
  ADD COLUMN IF NOT EXISTS points_awarded integer;

UPDATE public.event_attendance AS attendance
SET points_awarded = events.points
FROM public.events AS events
WHERE attendance.event_id = events.id
  AND attendance.points_awarded IS NULL;

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS legacy_2025_2026_points_adjustment integer NOT NULL DEFAULT 0;

-- Snapshot the six known legacy discrepancies. Future check-ins update the
-- cumulative member total and attendance ledger equally, so this adjustment
-- remains isolated to the founding academic year.
UPDATE public.members AS member
SET legacy_2025_2026_points_adjustment =
  COALESCE(member.points, 0) - COALESCE((
    SELECT SUM(attendance.points_awarded)
    FROM public.event_attendance AS attendance
    WHERE attendance.member_id = member.user_id
  ), 0);

CREATE OR REPLACE FUNCTION public.claim_event(
  p_member_id uuid,
  p_event_id uuid,
  p_code text
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event public.events%rowtype;
  v_member_exists boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM public.members
    WHERE user_id = p_member_id
  ) INTO v_member_exists;

  IF NOT v_member_exists THEN
    RETURN 'Member not found';
  END IF;

  SELECT * INTO v_event
  FROM public.events
  WHERE id = p_event_id
    AND code = p_code
    AND end_time > now();

  IF NOT FOUND THEN
    RETURN 'Invalid or expired code';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.event_attendance
    WHERE member_id = p_member_id
      AND event_id = p_event_id
  ) THEN
    RETURN 'Already claimed';
  END IF;

  INSERT INTO public.event_attendance (
    member_id,
    event_id,
    claimed_at,
    points_awarded
  ) VALUES (
    p_member_id,
    p_event_id,
    now(),
    v_event.points
  );

  UPDATE public.members
  SET points = COALESCE(points, 0) + v_event.points,
      events_attended = COALESCE(events_attended, 0) + 1
  WHERE user_id = p_member_id;

  IF NOT FOUND THEN
    RETURN 'Failed to update member stats';
  END IF;

  RETURN 'Points claimed successfully!';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Database error: ' || SQLERRM;
END;
$$;

ALTER TABLE public.event_attendance
  ALTER COLUMN points_awarded SET NOT NULL;

ALTER TABLE public.event_attendance
  ADD CONSTRAINT event_attendance_points_awarded_nonnegative
  CHECK (points_awarded >= 0);

COMMENT ON COLUMN public.event_attendance.points_awarded IS
  'Immutable snapshot of the points awarded when attendance was claimed.';

COMMENT ON COLUMN public.members.legacy_2025_2026_points_adjustment IS
  'One-time reconciliation between the legacy cumulative total and attendance ledger.';

-- Admin academic-year totals now use the event date and immutable point
-- snapshot. The legacy adjustment is assigned to Fall 2025, matching the old
-- dashboard behavior, and is never carried into future school years.
CREATE OR REPLACE FUNCTION public.get_members_with_filtered_points(
  start_date timestamp with time zone,
  end_date timestamp with time zone
) RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  email text,
  points bigint,
  national_member text
)
LANGUAGE sql
AS $$
  SELECT
    member.id,
    member.first_name,
    member.last_name,
    member.email,
    (
      COALESCE(SUM(
        CASE
          WHEN event.id IS NOT NULL THEN attendance.points_awarded
          ELSE 0
        END
      ), 0)
      + CASE
          WHEN start_date <= TIMESTAMPTZ '2025-08-01 00:00:00-04'
            AND end_date > TIMESTAMPTZ '2025-08-01 00:00:00-04'
          THEN member.legacy_2025_2026_points_adjustment
          ELSE 0
        END
    )::bigint AS points,
    member.national_member
  FROM public.members AS member
  LEFT JOIN public.event_attendance AS attendance
    ON member.user_id = attendance.member_id
  LEFT JOIN public.events AS event
    ON attendance.event_id = event.id
    AND event.start_time >= start_date
    AND event.start_time < end_date
  GROUP BY
    member.id,
    member.first_name,
    member.last_name,
    member.email,
    member.national_member,
    member.legacy_2025_2026_points_adjustment
  ORDER BY points DESC, member.last_name, member.first_name;
$$;
