import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { MovieCard } from '../components/MovieCard'
import { withApiState } from '../components/hoc/withApiState'
import {
  fetchUpcomingMoviesRequest,
  fetchPopularMoviesRequest,
  toggleFavorite,
  loadFavorites,
} from '../store/actions/movieActions'
import { RootStackParamList, Movie, RootState } from '../types'

type MovieListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MovieList'
>

type TabType = 'upcoming' | 'popular'

const MovieListScreen: React.FC = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation<MovieListScreenNavigationProp>()
  const [activeTab, setActiveTab] = useState<TabType>('upcoming')

  const { upcoming, popular } = useSelector((state: RootState) => state.movies)

  const currentData = activeTab === 'upcoming' ? upcoming : popular

  useEffect(() => {
    // Load favorites from storage
    dispatch(loadFavorites())

    // Fetch initial data
    if (upcoming.movies.length === 0) {
      dispatch(fetchUpcomingMoviesRequest({ page: 1 }))
    }
    if (popular.movies.length === 0) {
      dispatch(fetchPopularMoviesRequest({ page: 1 }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const handleRefresh = useCallback(() => {
    if (activeTab === 'upcoming') {
      dispatch(fetchUpcomingMoviesRequest({ page: 1, refresh: true }))
    } else {
      dispatch(fetchPopularMoviesRequest({ page: 1, refresh: true }))
    }
  }, [dispatch, activeTab])

  const handleLoadMore = useCallback(() => {
    if (currentData.hasMore && !currentData.api.isLoading) {
      const nextPage = currentData.page + 1
      if (activeTab === 'upcoming') {
        dispatch(fetchUpcomingMoviesRequest({ page: nextPage }))
      } else {
        dispatch(fetchPopularMoviesRequest({ page: nextPage }))
      }
    }
  }, [dispatch, activeTab, currentData])

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      navigation.navigate('MovieDetails', { movieId: movie.id, movie })
    },
    [navigation],
  )

  const handleToggleFavorite = useCallback(
    (movie: Movie) => {
      dispatch(toggleFavorite({ movie }))
    },
    [dispatch],
  )

  const renderMovieCard = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard
        movie={item}
        onPress={handleMoviePress}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [handleMoviePress, handleToggleFavorite],
  )

  const renderFooter = useCallback(() => {
    if (currentData.api.isLoading && currentData.movies.length > 0) {
      return (
        <View style={styles.loadingFooter}>
          <Text>Loading more...</Text>
        </View>
      )
    }
    return null
  }, [currentData])

  const MovieListComponent = withApiState(({ movies }: { movies: Movie[] }) => (
    <FlatList
      data={movies}
      renderItem={renderMovieCard}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={currentData.api.isRefreshing || false}
          onRefresh={handleRefresh}
          colors={['#007AFF']}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
    />
  ))

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{'Welcome to the Movie App'}</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.activeTabText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'popular' && styles.activeTab]}
            onPress={() => setActiveTab('popular')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'popular' && styles.activeTabText,
              ]}
            >
              Popular
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <MovieListComponent
        movies={currentData.movies}
        apiState={currentData.api}
        onRetry={handleRefresh}
        showEmptyState={
          currentData.movies.length === 0 && !currentData.api.isLoading
        }
        emptyMessage={`No ${activeTab} movies found`}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
  },
})

export default MovieListScreen
