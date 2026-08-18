const API_KEY = "AIzaSyBGFt1mOihtJiMvDqEghxoTYLJGNFnc7BE";

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

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

export const fetchMoodPlaylist = async (moodId) => {
  const query = QUERIES[moodId] || "ambient music";
  const cacheKey = `mood_cache_v2_${moodId}`;
  
  // 1. Check Cache
  try {
    const cachedString = localStorage.getItem(cacheKey);
    if (cachedString) {
      const cachedData = JSON.parse(cachedString);
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log(`[Cache Hit] Loaded ${moodId} from local storage.`);
        return cachedData.songs;
      }
    }
  } catch (e) {
    console.error("Cache parsing error", e);
  }

  // 2. Fetch from YouTube API
  console.log(`[API Request] Fetching live data for ${moodId}...`);
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoDuration=medium&videoEmbeddable=true&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map data to our app's format
    const songs = data.items
      .filter(item => item.id && item.id.videoId) // Ensure valid videos
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'),
        mood: moodId
      }));

    if (songs.length === 0) {
      throw new Error("No videos found.");
    }

    // 3. Save to Cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        songs: songs
      }));
    } catch (e) {
      console.warn("Could not save to cache", e);
    }

    return songs;

  } catch (error) {
    console.error("Failed to fetch playlist:", error);
    
    // Fallback: Return whatever is in cache even if expired, OR a fallback list
    try {
      const cachedString = localStorage.getItem(cacheKey);
      if (cachedString) {
        const cachedData = JSON.parse(cachedString);
        return cachedData.songs;
      }
    } catch (e) {}

    // Ultimate fallback if no internet and no cache
    return [
      { id: "5qap5aO4i9A", title: "API Fetch Failed - Playing Fallback Radio", mood: moodId }
    ];
  }
};
