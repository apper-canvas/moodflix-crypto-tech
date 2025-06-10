import Home from '../pages/Home'
import Discover from '../pages/Discover'
import Watchlist from '../pages/Watchlist'
import MovieNights from '../pages/MovieNights'
import NotFound from '../pages/NotFound'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  discover: {
    id: 'discover',
    label: 'Discover',
    path: '/discover',
    icon: 'Search',
    component: Discover
  },
  watchlist: {
    id: 'watchlist',
    label: 'Watchlist',
    path: '/watchlist',
    icon: 'Bookmark',
    component: Watchlist
  },
  movieNights: {
    id: 'movieNights',
    label: 'Movie Nights',
    path: '/movie-nights',
    icon: 'Users',
    component: MovieNights
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    component: NotFound
  }
}

export const routeArray = Object.values(routes).filter(route => route.id !== 'notFound')