// api/youtube.js
'use strict';

const VIDSSAVE_API = 'https://api.vidssave.com/api/contentsite_api/media/parse';
const AUTH = '20250901majwlqo';

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.end(JSON.stringify(data));
}

async function fetchVidssave(url) {
  const form = new URLSearchParams({
    auth: AUTH,
    domain: 'api-ak.vidssave.com',
    origin: 'cache',
    link: url
  });

  const response = await fetch(VIDSSAVE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0'
    },
    body: form.toString()
  });

  const json = await response.json();
  
  if (json.status === 1 && json.data) {
    return {
      ok: true,
      data: json.data
    };
  }
  
  throw new Error(json.message || 'Gagal mengambil data');
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return send(res, 204, {});
  }

  try {
    const url = req.query.url || req.query.link;
    if (!url) {
      return send(res, 400, { ok: false, message: 'Link YouTube tidak ditemukan' });
    }

    const result = await fetchVidssave(url);
    send(res, 200, result);
  } catch (error) {
    console.error(error);
    send(res, 500, { 
      ok: false, 
      message: error.message || 'Terjadi kesalahan server' 
    });
  }
};
