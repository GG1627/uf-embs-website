// Events with no confirmed time are stored spanning the full day (00:00–23:59)
// so start_time/end_time stay non-null; this sentinel is how the UI detects "Time TBD".
export const TBD_START_TIME = "00:00";
export const TBD_END_TIME = "23:59";

export function isTimeTBD(startTimeISO, endTimeISO) {
  if (!startTimeISO || !endTimeISO) return false;
  const start = new Date(startTimeISO);
  const end = new Date(endTimeISO);
  return (
    start.getHours() === 0 && start.getMinutes() === 0 &&
    end.getHours() === 23 && end.getMinutes() === 59
  );
}
