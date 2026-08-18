// Safe fallback catalog for local development and builds without a YouTube API key.
// GitHub Actions refreshes this file with current search results during deployment.
const playlistByMood = {
  "gym": [
    { "id": "5qap5aO4i9A", "title": "Workout Focus Radio" },
    { "id": "jfKfPfyJRdk", "title": "Focus Beats" }
  ],
  "chill": [
    { "id": "jfKfPfyJRdk", "title": "Chill Lo-fi Radio" },
    { "id": "5qap5aO4i9A", "title": "Relaxing Beats" }
  ],
  "study": [
    { "id": "jfKfPfyJRdk", "title": "Study Lo-fi Radio" },
    { "id": "5qap5aO4i9A", "title": "Deep Focus Beats" }
  ],
  "night-drive": [
    { "id": "5qap5aO4i9A", "title": "Night Drive Radio" },
    { "id": "jfKfPfyJRdk", "title": "Late-night Beats" }
  ],
  "sleep": [
    { "id": "jfKfPfyJRdk", "title": "Sleep Lo-fi Radio" },
    { "id": "5qap5aO4i9A", "title": "Calm Night Sounds" }
  ],
  "chaganti": [
    { "id": "5qap5aO4i9A", "title": "Spiritual Radio" }
  ],
  "garikapati": [
    { "id": "5qap5aO4i9A", "title": "Inspirational Radio" }
  ],
  "love": [
    { "id": "jfKfPfyJRdk", "title": "Romantic Lo-fi Radio" },
    { "id": "5qap5aO4i9A", "title": "Love Songs Radio" }
  ]
};

export default playlistByMood;
