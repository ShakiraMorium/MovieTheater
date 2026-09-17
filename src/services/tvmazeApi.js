const BASE_URL = 'https://api.tvmaze.com';

// Format show data to a consistent object shape
export function formatShowData(raw) {
  if (!raw) return null;
  const show = raw.show ? raw.show : raw;
  
  const releaseYear = show.premiered ? show.premiered.slice(0, 4) : 'N/A';
  const averageRating = show.rating?.average ? show.rating.average.toFixed(1) : null;
  
  return {
    id: show.id,
    name: show.name || 'Untitled',
    premiered: show.premiered || null,
    year: releaseYear,
    rating: averageRating,
    genres: show.genres || [],
    summary: show.summary || '<p>No description available for this title.</p>',
    image: show.image?.original || show.image?.medium || null,
    posterMedium: show.image?.medium || show.image?.original || null,
    backdrop: show.image?.original || show.image?.medium || null,
    status: show.status || 'Unknown',
    runtime: show.runtime || show.averageRuntime || null,
    language: show.language || 'English',
    network: show.network?.name || show.webChannel?.name || 'Various Networks',
    officialSite: show.officialSite || show.url || null,
    cast: show._embedded?.cast || []
  };
}

// Fetch shows for the home/listing page
export async function getShows(page = 0) {
  try {
    const res = await fetch(`${BASE_URL}/shows?page=${page}`);
    if (!res.ok) throw new Error('Failed to load shows');
    const data = await res.json();
    return data.map(formatShowData).filter(Boolean);
  } catch (err) {
    console.error('Error fetching shows:', err);
    throw err;
  }
}

// Search shows by query string
export async function searchShows(query) {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return data.map(formatShowData).filter(Boolean);
  } catch (err) {
    console.error('Error searching shows:', err);
    throw err;
  }
}

// Get show details and embedded cast list
export async function getShowWithCast(id) {
  try {
    const res = await fetch(`${BASE_URL}/shows/${id}?embed=cast`);
    if (!res.ok) throw new Error('Failed to fetch details');
    const data = await res.json();
    return formatShowData(data);
  } catch (err) {
    console.error(`Error fetching details for show ${id}:`, err);
    throw err;
  }
}
