import HomePage from '@/components/pages/HomePage';
import DiscoverPage from '@/components/pages/DiscoverPage';
import WatchlistPage from '@/components/pages/WatchlistPage';
import MovieNightsPage from '@/components/pages/MovieNightsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  discover: {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    icon: 'Search',
    component: DiscoverPage
  },
  watchlist: {
    id: 'watchlist',
    label: 'Watchlist',
    path: '/watchlist',
    icon: 'Bookmark',
    component: WatchlistPage
  },
  movieNights: {
    id: 'movieNights',
    label: 'Movie Nights',
    path: '/movie-nights',
    icon: 'Users',
    component: MovieNightsPage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    component: NotFoundPage
  }
}

export const routeArray = Object.values(routes).filter(route => route.id !== 'notFound')