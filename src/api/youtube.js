export const fetchMoodPlaylist = async (mood) => {
  try {
    const response = await fetch(`/api/youtube?mood=${mood}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching mood playlist:", error);
    return []; 
  }
};
