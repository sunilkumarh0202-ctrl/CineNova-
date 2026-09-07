import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Genres from './pages/Genres';
import Search from './pages/Search';
import Details from './pages/Details';
import VideoPlayer from './components/VideoPlayer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddMovie from './pages/AddMovie';
import AddSeries from './pages/AddSeries';
import ManageEpisodes from './pages/ManageEpisodes';

import {
  getMovies,
  getSeries,
  saveMovie,
  updateMovie,
  saveSeries,
  updateSeries,
} from './services/database';
import { isAuthenticated, logout } from './services/auth';

export default function App() {
  // Catalog State
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  // Navigation State
  // routes: 'home' | 'movies' | 'series' | 'genres' | 'search' | 'details' | 'watch' | 'admin' | 'admin-login' | 'add-movie' | 'add-series' | 'manage-episodes'
  const [currentRoute, setCurrentRoute] = useState('home');
  const [routeParams, setRouteParams] = useState({});
  const [selectedGenreForBrowse, setSelectedGenreForBrowse] = useState('All');

  // Load database content
  const loadDatabase = useCallback(() => {
    const loadedMovies = getMovies();
    const loadedSeries = getSeries();
    setMovies(loadedMovies);
    setSeries(loadedSeries);
  }, []);

  useEffect(() => {
    loadDatabase();
  }, [loadDatabase]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const parts = hash.split('/');
      const root = parts[0];

      if (root === 'details' && parts[1]) {
        setCurrentRoute('details');
        setRouteParams({ id: parts[1], type: parts[2] || 'movie' });
      } else if (['home', 'movies', 'series', 'genres', 'search', 'admin', 'admin-login'].includes(root)) {
        setCurrentRoute(root);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial sync
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash for browser history
    if (route === 'details' && params.id) {
      window.location.hash = `details/${params.id}/${params.type || 'movie'}`;
    } else if (['home', 'movies', 'series', 'genres', 'search', 'admin', 'admin-login'].includes(route)) {
      window.location.hash = route;
    }
  };

  // Watch Action
  const handleWatch = (item, episode = null) => {
    navigate('watch', { item, episode });
  };

  // Details Action
  const handleDetails = (id, type = 'movie') => {
    navigate('details', { id, type });
  };

  // Genre selection from Home
  const handleGenreSelect = (genre) => {
    setSelectedGenreForBrowse(genre);
    navigate('genres');
  };

  // Admin Actions
  const handleAdminAuthCheck = () => {
    if (isAuthenticated()) {
      navigate('admin');
    } else {
      navigate('admin-login');
    }
  };

  const handleSaveMovie = (movieData) => {
    if (movieData.id) {
      updateMovie(movieData.id, movieData);
    } else {
      saveMovie(movieData);
    }
    loadDatabase();
    navigate('admin');
  };

  const handleSaveSeries = (seriesData) => {
    if (seriesData.id) {
      updateSeries(seriesData.id, seriesData);
    } else {
      saveSeries(seriesData);
    }
    loadDatabase();
    navigate('admin');
  };

  // Active Player view (full window layout)
  if (currentRoute === 'watch') {
    return (
      <VideoPlayer
        item={routeParams.item}
        episode={routeParams.episode}
        onBack={() => {
          if (routeParams.item?.id) {
            handleDetails(routeParams.item.id, routeParams.episode ? 'series' : 'movie');
          } else {
            navigate('home');
          }
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar
        currentRoute={currentRoute}
        navigate={(route) => {
          if (route === 'admin') {
            handleAdminAuthCheck();
          } else {
            navigate(route);
          }
        }}
        onOpenSearch={() => navigate('search')}
      />

      {/* Main Routed Content */}
      <main className="main-content" role="main">
        {currentRoute === 'home' && (
          <Home
            movies={movies}
            series={series}
            onWatch={handleWatch}
            onDetails={handleDetails}
            navigate={navigate}
            onGenreSelect={handleGenreSelect}
          />
        )}

        {currentRoute === 'movies' && (
          <Movies
            movies={movies}
            onWatch={handleWatch}
            onDetails={handleDetails}
          />
        )}

        {currentRoute === 'series' && (
          <Series
            series={series}
            onDetails={handleDetails}
          />
        )}

        {currentRoute === 'genres' && (
          <Genres
            movies={movies}
            series={series}
            initialGenre={selectedGenreForBrowse}
            onWatch={handleWatch}
            onDetails={handleDetails}
          />
        )}

        {currentRoute === 'search' && (
          <Search
            movies={movies}
            series={series}
            onWatch={handleWatch}
            onDetails={handleDetails}
          />
        )}

        {currentRoute === 'details' && (
          <Details
            itemId={routeParams.id}
            itemType={routeParams.type || 'movie'}
            movies={movies}
            series={series}
            onWatch={handleWatch}
            onDetails={handleDetails}
            onBack={() => navigate(routeParams.type === 'series' ? 'series' : 'movies')}
          />
        )}

        {currentRoute === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={() => navigate('admin')}
            onLogout={() => {
              logout();
              navigate('home');
            }}
            onBack={() => navigate('home')}
          />
        )}

        {currentRoute === 'admin' && (
          isAuthenticated() ? (
            <AdminDashboard
              movies={movies}
              series={series}
              onAddMovie={() => navigate('add-movie')}
              onAddSeries={() => navigate('add-series')}
              onEditMovie={(movie) => navigate('add-movie', { editMovie: movie })}
              onEditSeries={(s) => navigate('add-series', { editSeries: s })}
              onManageEpisodes={(s) => navigate('manage-episodes', { series: s })}
              onLogout={() => {
                logout();
                navigate('home');
              }}
              onRefreshData={loadDatabase}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={() => navigate('admin')}
              onLogout={() => navigate('home')}
              onBack={() => navigate('home')}
            />
          )
        )}

        {currentRoute === 'add-movie' && (
          <AddMovie
            editMovie={routeParams.editMovie}
            onSave={handleSaveMovie}
            onCancel={() => navigate('admin')}
          />
        )}

        {currentRoute === 'add-series' && (
          <AddSeries
            editSeries={routeParams.editSeries}
            onSave={handleSaveSeries}
            onCancel={() => navigate('admin')}
          />
        )}

        {currentRoute === 'manage-episodes' && (
          <ManageEpisodes
            series={routeParams.series}
            onBack={() => navigate('admin')}
            onWatchEpisode={(s, ep) => handleWatch(s, ep)}
          />
        )}
      </main>

      {/* CineNova Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}
