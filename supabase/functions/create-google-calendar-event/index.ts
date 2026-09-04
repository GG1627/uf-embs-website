// supabase/functions/create-google-calendar-event/index.ts

const allowedOrigins = [
  "https://www.ufembs.com",
  "http://localhost:5173",
];

const getCorsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

// Build a JWT from the service account credentials and exchange it for an access token
async function getAccessToken(serviceAccount: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/calendar.events",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const unsignedToken = `${encode(header)}.${encode(payload)}`;

  // Import the RSA private key
  const pemBody = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${unsignedToken}.${sig}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token exchange failed: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// Google Calendar all-day events use an exclusive end date, i.e. one day past the event date
function nextDay(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

type EventPayload = {
  name: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  description?: string;
  location?: string;
  allDay?: boolean;     // true when the event's time is TBD
};

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const cors = getCorsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: cors });

  try {
    const body: EventPayload = await req.json();

    // Validate required fields
    if (!body.name || !body.date || !body.startTime || !body.endTime) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields: name, date, startTime, endTime" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Get service account credentials from Supabase secrets
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!serviceAccountJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
    }
    const serviceAccount = JSON.parse(serviceAccountJson);

    // Get calendar ID from env
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
    if (!calendarId) {
      throw new Error("GOOGLE_CALENDAR_ID not configured");
    }

    // Get access token using service account
    const accessToken = await getAccessToken(serviceAccount);

    // Build the Google Calendar event object
    // Use America/New_York timezone since this is a UF (University of Florida) org
    // All-day events (time TBD) use date-only start/end with an exclusive end date
    const calendarEvent = body.allDay
      ? {
          summary: body.name,
          description: body.description || "",
          location: body.location || "",
          start: { date: body.date },
          end: { date: nextDay(body.date) },
        }
      : {
          summary: body.name,
          description: body.description || "",
          location: body.location || "",
          start: {
            dateTime: `${body.date}T${body.startTime}:00`,
            timeZone: "America/New_York",
          },
          end: {
            dateTime: `${body.date}T${body.endTime}:00`,
            timeZone: "America/New_York",
          },
        };

    // Create the event via Google Calendar API
    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calendarEvent),
      }
    );

    if (!calRes.ok) {
      const errText = await calRes.text();
      throw new Error(`Google Calendar API error: ${errText}`);
    }

    const createdEvent = await calRes.json();

    return new Response(
      JSON.stringify({ ok: true, eventId: createdEvent.id, htmlLink: createdEvent.htmlLink }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error creating Google Calendar event:", e);
    return new Response(
      JSON.stringify({ ok: false, error: e.message }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
