// File: /api/youtube.js (In the ROOT of your project)

export default async function handler(req, res) {
  const { mood } = req.query;
  
  // Vercel automatically injects your secret key here!
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing in Vercel" });
  }

  try {
    // Search YouTube dynamically based on the mood selected
    const searchQuery = `${mood} aesthetic lofi music ambient`;
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(searchQuery)}&type=video&videoEmbeddable=true&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    // Format the data exactly how your App.jsx expects it
    const liveSongs = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
    }));

    res.status(200).json(liveSongs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from YouTube" });
  }
}
