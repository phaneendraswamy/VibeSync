// GitHub Pages is static, so the YouTube Data API key must never be bundled
// into the browser. These are embeddable fallback videos; no API key is used.
const PLAYLISTS = {
  "gym": [
    { id: "5qap5aO4i9A", title: "Workout Focus Radio" },
    { id: "jfKfPfyJRdk", title: "Focus Beats" }
  ],
  "chill": [
    { id: "jfKfPfyJRdk", title: "Chill Lo-fi Radio" },
    { id: "5qap5aO4i9A", title: "Relaxing Beats" }
  ],
  "study": [
    { id: "jfKfPfyJRdk", title: "Study Lo-fi Radio" },
    { id: "5qap5aO4i9A", title: "Deep Focus Beats" }
  ],
  "night-drive": [
    { id: "5qap5aO4i9A", title: "Night Drive Radio" },
    { id: "jfKfPfyJRdk", title: "Late-night Beats" }
  ],
  "sleep": [
    { id: "jfKfPfyJRdk", title: "Sleep Lo-fi Radio" },
    { id: "5qap5aO4i9A", title: "Calm Night Sounds" }
  ],
  "chaganti": [
    { id: "5qap5aO4i9A", title: "Spiritual Radio" }
  ],
  "garikapati": [
    { id: "5qap5aO4i9A", title: "Inspirational Radio" }
  ],
  "love": [
    { id: "jfKfPfyJRdk", title: "Romantic Lo-fi Radio" },
    { id: "5qap5aO4i9A", title: "Love Songs Radio" }
  ]
};

export const fetchMoodPlaylist = async (moodId) => {
  const cacheKey = `mood_cache_v3_${moodId}`;

  try {
    const cachedString = localStorage.getItem(cacheKey);
    if (cachedString) {
      return JSON.parse(cachedString);
    }
  } catch {
    // Continue with the embedded catalog if local storage is unavailable.
  }

  const playlist = (PLAYLISTS[moodId] || PLAYLISTS.chill).map((song) => ({
    ...song,
    mood: moodId
  }));

  try {
    localStorage.setItem(cacheKey, JSON.stringify(playlist));
  } catch {
    // Playback should still work when the browser blocks local storage.
  }

  return playlist;
};
