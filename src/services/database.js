/**
 * CineNova Database Service Layer
 * 
 * LOCALSTORAGE IMPLEMENTATION (VERSION 1.0)
 * ----------------------------------------
 * For the initial working release, all catalog data (movies, series, episodes, settings)
 * is persisted in the browser's LocalStorage. Data persists across browser refreshes and sessions.
 * 
 * FUTURE FIREBASE / SUPABASE INTEGRATION GUIDE:
 * ---------------------------------------------
 * This service layer isolates all data access from the UI components.
 * To migrate to a cloud database:
 * 
 * 1. For Firebase Firestore:
 *    - Initialize Firebase: import { initializeApp } from "firebase/app";
 *    - Connect Firestore: import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
 *    - Replace LocalStorage calls below with async Firestore collection queries:
 *      e.g. getMovies() => (await getDocs(collection(db, "movies"))).docs.map(...)
 * 
 * 2. For Supabase:
 *    - Initialize Supabase: import { createClient } from "@supabase/supabase-js";
 *    - Replace LocalStorage calls below with Supabase queries:
 *      e.g. getMovies() => const { data } = await supabase.from('movies').select('*');
 * 
 * Security Rule: Never expose secret Service Role keys or master tokens in frontend code!
 */

import { INITIAL_MOVIES, INITIAL_SERIES, INITIAL_EPISODES, INITIAL_SETTINGS } from '../data/sampleData';

const STORAGE_KEYS = {
  MOVIES: 'cinenova_movies_v1',
  SERIES: 'cinenova_series_v1',
  EPISODES: 'cinenova_episodes_v1',
  SETTINGS: 'cinenova_settings_v1',
  INITIALIZED: 'cinenova_catalog_initialized_v1'
};

// Initialize default sample data if LocalStorage is empty
function ensureCatalogInitialized() {
  try {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
      localStorage.setItem(STORAGE_KEYS.SERIES, JSON.stringify(INITIAL_SERIES));
      localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(INITIAL_EPISODES));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch (err) {
    console.error('Error initializing LocalStorage database:', err);
  }
}

// Run initialization immediately on module load
ensureCatalogInitialized();

/* ==========================================================================
   MOVIES API
   ========================================================================== */

/**
 * Retrieve all movies from the catalog
 * @returns {Array} List of movie objects
 */
export function getMovies() {
  ensureCatalogInitialized();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MOVIES);
    return data ? JSON.parse(data) : INITIAL_MOVIES;
  } catch (err) {
    console.error('Error loading movies:', err);
    return INITIAL_MOVIES;
  }
}

/**
 * Retrieve single movie by ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getMovieById(id) {
  const movies = getMovies();
  return movies.find(m => String(m.id) === String(id)) || null;
}

/**
 * Save a new movie to the catalog
 * @param {Object} movieData 
 * @returns {Object} Newly created movie with generated ID
 */
export function saveMovie(movieData) {
  const movies = getMovies();
  const newMovie = {
    ...movieData,
    id: movieData.id || `mov-${Date.now()}`,
    year: Number(movieData.year) || new Date().getFullYear(),
    rating: Number(movieData.rating) || 7.5,
    cast: Array.isArray(movieData.cast) ? movieData.cast : (movieData.cast ? movieData.cast.split(',').map(s => s.trim()) : []),
    featured: Boolean(movieData.featured),
    trending: Boolean(movieData.trending),
    createdAt: new Date().toISOString()
  };
  const updatedMovies = [newMovie, ...movies];
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(updatedMovies));
  return newMovie;
}

/**
 * Update an existing movie
 * @param {string} id 
 * @param {Object} movieData 
 * @returns {Object|null}
 */
export function updateMovie(id, movieData) {
  const movies = getMovies();
  const index = movies.findIndex(m => String(m.id) === String(id));
  if (index === -1) return null;

  const updatedMovie = {
    ...movies[index],
    ...movieData,
    id,
    year: Number(movieData.year) || movies[index].year,
    rating: Number(movieData.rating) || movies[index].rating,
    cast: Array.isArray(movieData.cast) ? movieData.cast : (movieData.cast ? movieData.cast.split(',').map(s => s.trim()) : movies[index].cast),
    featured: Boolean(movieData.featured),
    trending: Boolean(movieData.trending),
    updatedAt: new Date().toISOString()
  };

  movies[index] = updatedMovie;
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  return updatedMovie;
}

/**
 * Delete a movie from the catalog
 * @param {string} id 
 * @returns {boolean}
 */
export function deleteMovie(id) {
  const movies = getMovies();
  const filtered = movies.filter(m => String(m.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(filtered));
  return true;
}

/* ==========================================================================
   WEB SERIES API
   ========================================================================== */

/**
 * Retrieve all web series from the catalog
 * @returns {Array} List of series objects
 */
export function getSeries() {
  ensureCatalogInitialized();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SERIES);
    return data ? JSON.parse(data) : INITIAL_SERIES;
  } catch (err) {
    console.error('Error loading series:', err);
    return INITIAL_SERIES;
  }
}

/**
 * Retrieve single series by ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getSeriesById(id) {
  const seriesList = getSeries();
  return seriesList.find(s => String(s.id) === String(id)) || null;
}

/**
 * Save a new web series
 * @param {Object} seriesData 
 * @returns {Object}
 */
export function saveSeries(seriesData) {
  const seriesList = getSeries();
  const newSeries = {
    ...seriesData,
    id: seriesData.id || `ser-${Date.now()}`,
    year: Number(seriesData.year) || new Date().getFullYear(),
    rating: Number(seriesData.rating) || 8.0,
    cast: Array.isArray(seriesData.cast) ? seriesData.cast : (seriesData.cast ? seriesData.cast.split(',').map(s => s.trim()) : []),
    seasonsCount: Number(seriesData.seasonsCount) || 1,
    episodesCount: Number(seriesData.episodesCount) || 0,
    featured: Boolean(seriesData.featured),
    trending: Boolean(seriesData.trending),
    createdAt: new Date().toISOString()
  };
  const updatedSeries = [newSeries, ...seriesList];
  localStorage.setItem(STORAGE_KEYS.SERIES, JSON.stringify(updatedSeries));
  return newSeries;
}

/**
 * Update an existing web series
 * @param {string} id 
 * @param {Object} seriesData 
 * @returns {Object|null}
 */
export function updateSeries(id, seriesData) {
  const seriesList = getSeries();
  const index = seriesList.findIndex(s => String(s.id) === String(id));
  if (index === -1) return null;

  const updated = {
    ...seriesList[index],
    ...seriesData,
    id,
    year: Number(seriesData.year) || seriesList[index].year,
    rating: Number(seriesData.rating) || seriesList[index].rating,
    cast: Array.isArray(seriesData.cast) ? seriesData.cast : (seriesData.cast ? seriesData.cast.split(',').map(s => s.trim()) : seriesList[index].cast),
    seasonsCount: Number(seriesData.seasonsCount) || seriesList[index].seasonsCount,
    featured: Boolean(seriesData.featured),
    trending: Boolean(seriesData.trending),
    updatedAt: new Date().toISOString()
  };

  seriesList[index] = updated;
  localStorage.setItem(STORAGE_KEYS.SERIES, JSON.stringify(seriesList));
  return updated;
}

/**
 * Delete a web series and its associated episodes
 * @param {string} id 
 * @returns {boolean}
 */
export function deleteSeries(id) {
  const seriesList = getSeries();
  const filteredSeries = seriesList.filter(s => String(s.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.SERIES, JSON.stringify(filteredSeries));

  // Also remove associated episodes
  const episodes = getAllEpisodes();
  const filteredEpisodes = episodes.filter(e => String(e.seriesId) !== String(id));
  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(filteredEpisodes));
  return true;
}

/* ==========================================================================
   EPISODES API
   ========================================================================== */

/**
 * Retrieve all episodes in database
 * @returns {Array}
 */
export function getAllEpisodes() {
  ensureCatalogInitialized();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EPISODES);
    return data ? JSON.parse(data) : INITIAL_EPISODES;
  } catch (err) {
    console.error('Error loading episodes:', err);
    return INITIAL_EPISODES;
  }
}

/**
 * Retrieve all episodes for a specific series, sorted by season and episode number
 * @param {string} seriesId 
 * @param {number} [season] Optional filter by season number
 * @returns {Array}
 */
export function getEpisodes(seriesId, season = null) {
  const all = getAllEpisodes();
  return all
    .filter(ep => String(ep.seriesId) === String(seriesId) && (season === null || Number(ep.season) === Number(season)))
    .sort((a, b) => {
      if (a.season !== b.season) return a.season - b.season;
      return a.episodeNumber - b.episodeNumber;
    });
}

/**
 * Retrieve single episode by ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getEpisodeById(id) {
  const all = getAllEpisodes();
  return all.find(e => String(e.id) === String(id)) || null;
}

/**
 * Save new episode and update parent series episode counter
 * @param {Object} episodeData 
 * @returns {Object}
 */
export function saveEpisode(episodeData) {
  const all = getAllEpisodes();
  const newEpisode = {
    ...episodeData,
    id: episodeData.id || `ep-${Date.now()}`,
    season: Number(episodeData.season) || 1,
    episodeNumber: Number(episodeData.episodeNumber) || 1,
    createdAt: new Date().toISOString()
  };

  const updatedList = [...all, newEpisode];
  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(updatedList));

  // Update parent series episodes count & seasons count if needed
  updateSeriesCounts(episodeData.seriesId);

  return newEpisode;
}

/**
 * Update existing episode
 * @param {string} id 
 * @param {Object} episodeData 
 * @returns {Object|null}
 */
export function updateEpisode(id, episodeData) {
  const all = getAllEpisodes();
  const index = all.findIndex(e => String(e.id) === String(id));
  if (index === -1) return null;

  const updated = {
    ...all[index],
    ...episodeData,
    id,
    season: Number(episodeData.season) || all[index].season,
    episodeNumber: Number(episodeData.episodeNumber) || all[index].episodeNumber
  };

  all[index] = updated;
  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(all));
  updateSeriesCounts(updated.seriesId);
  return updated;
}

/**
 * Delete an episode
 * @param {string} id 
 * @returns {boolean}
 */
export function deleteEpisode(id) {
  const all = getAllEpisodes();
  const ep = all.find(e => String(e.id) === String(id));
  const seriesId = ep ? ep.seriesId : null;

  const filtered = all.filter(e => String(e.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(filtered));

  if (seriesId) {
    updateSeriesCounts(seriesId);
  }
  return true;
}

/**
 * Helper to update seasonsCount and episodesCount on a series
 */
function updateSeriesCounts(seriesId) {
  if (!seriesId) return;
  const series = getSeriesById(seriesId);
  if (!series) return;

  const episodes = getEpisodes(seriesId);
  const seasons = new Set(episodes.map(e => Number(e.season)));
  const maxSeason = seasons.size > 0 ? Math.max(...Array.from(seasons)) : 1;

  updateSeries(seriesId, {
    episodesCount: episodes.length,
    seasonsCount: Math.max(series.seasonsCount || 1, maxSeason)
  });
}

/* ==========================================================================
   SETTINGS & STATS
   ========================================================================== */

/**
 * Retrieve application settings
 */
export function getSettings() {
  ensureCatalogInitialized();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch (err) {
    console.error('Error loading settings:', err);
    return INITIAL_SETTINGS;
  }
}

/**
 * Update application settings
 */
export function updateSettings(settings) {
  const current = getSettings();
  const updated = {
    ...current,
    ...settings,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

/**
 * Compute dashboard stats
 */
export function getCatalogStats() {
  const movies = getMovies();
  const series = getSeries();
  const episodes = getAllEpisodes();
  const featuredCount = movies.filter(m => m.featured).length + series.filter(s => s.featured).length;

  return {
    totalMovies: movies.length,
    totalSeries: series.length,
    totalEpisodes: episodes.length,
    featuredTitles: featuredCount
  };
}

/**
 * Search all catalog items by title, genre, year, or cast
 * @param {string} query 
 * @returns {{ movies: Array, series: Array }}
 */
export function searchCatalog(query) {
  if (!query || !query.trim()) {
    return { movies: [], series: [] };
  }
  const clean = query.trim().toLowerCase();
  const movies = getMovies();
  const series = getSeries();

  const matchedMovies = movies.filter(m => {
    return (
      m.title.toLowerCase().includes(clean) ||
      m.genre.toLowerCase().includes(clean) ||
      String(m.year).includes(clean) ||
      (m.director && m.director.toLowerCase().includes(clean)) ||
      (Array.isArray(m.cast) && m.cast.some(c => c.toLowerCase().includes(clean)))
    );
  });

  const matchedSeries = series.filter(s => {
    return (
      s.title.toLowerCase().includes(clean) ||
      s.genre.toLowerCase().includes(clean) ||
      String(s.year).includes(clean) ||
      (s.director && s.director.toLowerCase().includes(clean)) ||
      (Array.isArray(s.cast) && s.cast.some(c => c.toLowerCase().includes(clean)))
    );
  });

  return { movies: matchedMovies, series: matchedSeries };
}

/**
 * Reset local catalog to initial sample data
 */
export function resetToSampleData() {
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
  localStorage.setItem(STORAGE_KEYS.SERIES, JSON.stringify(INITIAL_SERIES));
  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(INITIAL_EPISODES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  return true;
}
