import playlistByMood from '../data/generatedPlaylists';

// The YouTube Data API is used only by GitHub Actions during the build.
// The browser receives only video IDs and titles, never a credential.
export const fetchMoodPlaylist = async (moodId) => {
  const cacheKey = `mood_cache_v4_${moodId}`;

  try {
    const cachedString = localStorage.getItem(cacheKey);
    if (cachedString) {
      return JSON.parse(cachedString);
    }
  } catch {
    // Continue with the generated catalog if local storage is unavailable.
  }

  const playlist = (playlistByMood[moodId] || playlistByMood.chill).map((song) => ({
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
