// File: /api/youtube.js (ROOT folder)

export default async function handler(req, res) {
  const { mood } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing in Vercel" });
  }

  // Your exact custom mix queries!
  const QUERIES = {
    "gym": "phonk drift workout high bass telugu motivation",
    "chill": "telugu chill lofi songs calming",
    "study": "telugu focus study music instrumental",
    "night-drive": "telugu night drive songs hit tracks",
    "sleep": "telugu sleep melodies relaxing songs",
    "chaganti": "chaganti koteswara rao pravachanam latest",
    "garikapati": "garikapati narasimha rao latest speech",
    "love": "telugu romantic love songs playlist hit tracks"
  };

  const moodKey = mood ? mood.toLowerCase() : '';
  const query = QUERIES[moodKey] || "ambient music";

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoDuration=medium&videoEmbeddable=true&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Clean up titles exactly how you had it
    const songs = data.items
      .filter(item => item.id && item.id.videoId) // Ensure valid videos
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'),
        mood: moodKey
      }));

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from YouTube" });
  }
}
