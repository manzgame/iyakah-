export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, auth, domain, origin } = req.body;

    // Validate input
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Make the actual request to vidssave API
    const body = new URLSearchParams({
      auth: auth || '20250901majwlqo',
      domain: domain || 'api-ak.vidssave.com',
      origin: origin || 'source',
      link: url
    }).toString();

    const response = await fetch('https://api.vidssave.com/api/contentsite_api/media/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(json);
  } catch (error) {
    console.error('Proxy error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(500).json({
      error: error.message || 'Internal server error',
      status: 0
    });
  }
}
