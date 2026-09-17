/**
 * TVMaze API Service
 * Endpoint documentation: https://www.tvmaze.com/api
 */

const BASE_URL = 'https://api.tvmaze.com';

/**
 * Normalizes raw TVMaze show data to consistent movie/show model
 */
export function normalizeShow(raw) {
  if (!raw) return null;
  const show = raw.show ? raw.show : raw;
  
  const premieredYear = show.premiered ? show.premiered.split('-')[0] : 'N/A';
  const ratingValue = show.rating?.average ? show.rating.average.toFixed(1) : null;
  
  return {
    id: show.id,
    name: show.name || 'Untitled',
    premiered: show.premiered || null,
    year: premieredYear,
    rating: ratingValue,
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
    embeddedCast: show._embedded?.cast || []
  };
}

/**
 * Fetch initial / popular shows list
 * @param {number} page
 */
export async function fetchAllShows(page = 0) {
  try {
    const res = await fetch(`${BASE_URL}/shows?page=${page}`);
    if (!res.ok) throw new Error(`Failed to fetch shows: ${res.statusText}`);
    const data = await res.json();
    return data.map(normalizeShow).filter(Boolean);
  } catch (error) {
    console.error('Error in fetchAllShows:', error);
    throw error;
  }
}

/**
 * Search shows by title
 * @param {string} query
 */
export async function searchShows(query) {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
    const data = await res.json();
    return data.map(normalizeShow).filter(Boolean);
  } catch (error) {
    console.error('Error in searchShows:', error);
    throw error;
  }
}

/**
 * Fetch detailed show metadata with embedded cast
 * @param {number|string} id
 */
export async function fetchShowDetailsWithCast(id) {
  try {
    const res = await fetch(`${BASE_URL}/shows/${id}?embed=cast`);
    if (!res.ok) throw new Error(`Failed to fetch show details: ${res.statusText}`);
    const data = await res.json();
    return normalizeShow(data);
  } catch (error) {
    console.error(`Error in fetchShowDetailsWithCast for id ${id}:`, error);
    throw error;
  }
}
