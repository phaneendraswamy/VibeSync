import { writeFile } from 'node:fs/promises';

const outputUrl = new URL('../src/data/generatedPlaylists.js', import.meta.url);
const apiKey = process.env.YOUTUBE_API_KEY;

const queries = {
  gym: 'phonk drift workout high bass telugu motivation',
  chill: 'telugu chill lofi songs calming',
  study: 'telugu focus study music instrumental',
  'night-drive': 'telugu night drive songs hit tracks',
  sleep: 'telugu sleep melodies relaxing songs',
  chaganti: 'chaganti koteswara rao pravachanam latest',
  garikapati: 'garikapati narasimha rao latest speech',
  love: 'telugu romantic love songs playlist hit tracks'
};

const fallback = {
  gym: [{ id: '5qap5aO4i9A', title: 'Workout Focus Radio' }],
  chill: [{ id: 'jfKfPfyJRdk', title: 'Chill Lo-fi Radio' }],
  study: [{ id: 'jfKfPfyJRdk', title: 'Study Lo-fi Radio' }],
  'night-drive': [{ id: '5qap5aO4i9A', title: 'Night Drive Radio' }],
  sleep: [{ id: 'jfKfPfyJRdk', title: 'Sleep Lo-fi Radio' }],
  chaganti: [{ id: '5qap5aO4i9A', title: 'Spiritual Radio' }],
  garikapati: [{ id: '5qap5aO4i9A', title: 'Inspirational Radio' }],
  love: [{ id: 'jfKfPfyJRdk', title: 'Romantic Lo-fi Radio' }]
};

async function searchYouTube(query) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.search = new URLSearchParams({
    part: 'snippet',
    maxResults: '15',
    q: query,
    type: 'video',
    videoDuration: 'medium',
    videoEmbeddable: 'true',
    key: apiKey
  });

  const response = await fetch(url);
  if (!response.ok) throw new Error(`YouTube returned ${response.status}`);

  const data = await response.json();
  const videos = data.items
    .filter((item) => item.id?.videoId)
    .map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
    }));

  if (!videos.length) throw new Error('No embeddable videos returned');
  return videos;
}

const playlists = { ...fallback };

if (!apiKey) {
  console.warn('YOUTUBE_API_KEY is unavailable; using the safe fallback catalog.');
} else {
  await Promise.all(Object.entries(queries).map(async ([mood, query]) => {
    try {
      playlists[mood] = await searchYouTube(query);
    } catch (error) {
      console.warn(`Keeping fallback for ${mood}: ${error.message}`);
    }
  }));
}

await writeFile(
  outputUrl,
  `// Generated at build time. This file contains no API key.\nconst playlistByMood = ${JSON.stringify(playlists, null, 2)};\n\nexport default playlistByMood;\n`
);
