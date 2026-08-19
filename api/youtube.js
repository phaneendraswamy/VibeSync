// File: /api/youtube.js

export default async function handler(req, res) {
  const { mood } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing in Vercel" });
  }

  // 1. Exact match your README to specific Telugu/Thematic queries
  const moodQueries = {
    // Mixed languages, high vibe
    gym: "gym workout motivation high intensity heavy bass songs", 
    
    // Telugu specific
    chill: "telugu lo-fi beats acoustic covers chill cafe music",
    study: "study focus minimalist piano alpha waves no vocals",
    drive: "telugu retro remixes synthwave night drive music",
    sleep: "sleep delta waves slow rain drone textures",
    chaganti: "chaganti koteswara rao discourses pravachanam",
    garikapati: "garikapati narasimha rao sahitya avadhanam",
    love: "telugu melody hits romantic duets soulful lyrics"
  };

  // Convert the mood to lowercase to match the object above
  const moodKey = mood ? mood.toLowerCase() : '';
  
  // Get the specific query, or fallback to a default Telugu search
  let searchQuery = moodQueries[moodKey] || `telugu ${mood} music songs`;

  // 2. Add secret keywords to force YouTube to avoid Shorts and 10 hour loops
  // Adding "-shorts" tells YouTube to exclude shorts.
  searchQuery += " -shorts -mashup";

  try {
    // 3. We use videoDuration=medium to only get videos between 4 to 20 minutes!
    // This perfectly cuts out the 10-hour mixes and the 30-second shorts.
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(searchQuery)}&type=video&videoDuration=medium&videoEmbeddable=true&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.items) {
      return res.status(200).json([]);
    }

    const liveSongs = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
    }));

    res.status(200).json(liveSongs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from YouTube" });
  }
}
