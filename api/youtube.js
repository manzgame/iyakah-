// api/youtube.js
export default async function handler(request) {
  const { url } = request.query;

  if (!url) {
    return new Response(
      JSON.stringify({ ok: false, message: "Link YouTube tidak ditemukan" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const form = new URLSearchParams({
      auth: "20250901majwlqo",
      domain: "api-ak.vidssave.com",
      origin: "cache",
      link: url
    });

    const apiRes = await fetch("https://api.vidssave.com/api/contentsite_api/media/parse", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    const data = await apiRes.json();

    return new Response(
      JSON.stringify({
        ok: true,
        data: data.data || data
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
