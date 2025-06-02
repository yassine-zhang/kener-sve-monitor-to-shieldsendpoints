import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/status", async (c) => {
  const env = c.env;
  const host = env.KENER_HOST;
  const tag = env.KENER_MONITOR_TAG;
  const apikey = env.KENER_APIKEY;

  let url = `https://${host}/api/monitor`;
  if (tag) {
    url += `?tag=${encodeURIComponent(tag)}`;
  }
  try {
    const response = await fetch(url, {
      headers: { Authorization: apikey },
    });
    const data = await response.json();
    const monitor = Array.isArray(data) ? data[0] : data;
    const status = monitor?.status || "UNKNOWN";
    const color = status === "ACTIVE" ? "mediumpurple" : "red";
    return c.json({
      schemaVersion: 1,
      label: "status",
      message: status,
      color,
      style: "flat-square",
    });
  } catch (e) {
    return c.json(
      {
        schemaVersion: 1,
        label: "status",
        message: "exception",
        color: "red",
        style: "flat-square",
      },
      500
    );
  }
});

app.get("/uptime", async (c) => {
  const env = c.env;
  const host = env.KENER_HOST;
  const tag = env.KENER_MONITOR_TAG;
  const apikey = env.KENER_APIKEY;

  let url = `https://${host}/api/status`;
  if (tag) {
    url += `?tag=${encodeURIComponent(tag)}`;
  }
  try {
    const response = await fetch(url, {
      headers: { Authorization: apikey },
    });
    const data = await response.json();
    const { uptime } = data as { uptime?: string };
    return c.json({
      schemaVersion: 1,
      label: "uptime",
      message: uptime ?? "UNKNOWN",
      color: "mediumpurple",
      style: "flat-square",
    });
  } catch (e) {
    return c.json(
      {
        schemaVersion: 1,
        label: "uptime",
        message: "exception",
        color: "red",
        style: "flat-square",
      },
      500
    );
  }
});

export default app;
