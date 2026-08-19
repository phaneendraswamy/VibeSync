// File: /src/api/youtube.js

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

export const fetchMoodPlaylist = async (moodId) => {
  const cacheKey = `mood_cache_v2_${moodId}`;
  
  // 1. Check Cache First
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

  // 2. Fetch from your SECURE Vercel Backend
  console.log(`[API Request] Fetching live data for ${moodId}...`);
  try {
    const response = await fetch(`/api/youtube?mood=${moodId}`);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const songs = await response.json();

    if (!songs || songs.length === 0) {
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
    
    // Fallback: Return whatever is in cache even if expired
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
