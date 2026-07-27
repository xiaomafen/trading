// Vercel serverless function — proxies OCR/document-extraction requests to Anthropic.
// The API key lives ONLY here (as an environment variable), never in the browser.
//
// Deploy: put this file at  api/ocr.js  in your project root (alongside the
// tradeready_dashboard.html), push to GitHub, import the repo in Vercel,
// and set the environment variable ANTHROPIC_API_KEY in the Vercel project
// settings (Settings -> Environment Variables). Vercel auto-detects files
// under /api as serverless functions -- no extra config needed.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured: ANTHROPIC_API_KEY is not set" });
    return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
