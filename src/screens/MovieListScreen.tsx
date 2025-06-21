import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react'
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

import { MovieCard } from '@/components/MovieCard'
import { withApiState } from '@/components/hoc/withApiState'
import {
  fetchUpcomingMoviesRequest,
  fetchPopularMoviesRequest,
  toggleFavorite,
  loadFavorites,
} from '@/store/actions/movieActions'
import { RootStackParamList, Movie, RootState } from '@/types'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  STRINGS,
  SCREEN_NAMES,
  PAGINATION,
  formatString,
} from '@/constants'

type MovieListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof SCREEN_NAMES.MovieList
>

type TabType = 'upcoming' | 'popular'

const MovieListScreen: React.FC = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation<MovieListScreenNavigationProp>()
  const [activeTab, setActiveTab] = useState<TabType>('upcoming')
  const flatListRef = useRef<FlatList>(null)
  const scrollPosition = useRef(0)
  const [preservedScrollY, setPreservedScrollY] = useState(0)
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(false)

  const { upcoming, popular } = useSelector((state: RootState) => state.movies)

  const currentData = activeTab === 'upcoming' ? upcoming : popular

  useEffect(() => {
    dispatch(loadFavorites())
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
      navigation.navigate(SCREEN_NAMES.MovieDetails, {
        movieId: movie.id,
        movie,
      })
    },
    [navigation],
  )

  const handleToggleFavorite = useCallback(
    (movie: Movie) => {
      // Preserve current scroll position before dispatch
      setPreservedScrollY(scrollPosition.current)
      setShouldRestoreScroll(true)

      dispatch(toggleFavorite({ movie }))
    },
    [dispatch],
  )

  const handleScroll = useCallback((event: any) => {
    scrollPosition.current = event.nativeEvent.contentOffset.y
  }, [])

  // Restore scroll position after favorite toggle
  useLayoutEffect(() => {
    if (shouldRestoreScroll && flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: preservedScrollY,
        animated: false,
      })
      setShouldRestoreScroll(false)
    }
  }, [shouldRestoreScroll, preservedScrollY, currentData.movies])

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
          <Text>{STRINGS.loading.loadingMore}</Text>
        </View>
      )
    }
    return null
  }, [currentData])

  const MovieListContent = withApiState(() => (
    <View style={{ flex: 1 }}>
      {currentData.movies.length === 0 && !currentData.api.isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {formatString.emptyMovies(activeTab)}
          </Text>
        </View>
      ) : null}
    </View>
  ))

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.app.welcomeTitle}</Text>
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
              {STRINGS.tabs.upcoming}
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
              {STRINGS.tabs.popular}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={currentData.movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={currentData.api.isRefreshing || false}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={PAGINATION.endReachedThreshold}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        ListEmptyComponent={
          currentData.movies.length === 0 && !currentData.api.isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {formatString.emptyMovies(activeTab)}
              </Text>
            </View>
          ) : null
        }
      />

      <MovieListContent apiState={currentData.api} onRetry={handleRefresh} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.huge,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundGray,
    borderRadius: BORDER_RADIUS.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.textWhite,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingFooter: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})

export default MovieListScreen
