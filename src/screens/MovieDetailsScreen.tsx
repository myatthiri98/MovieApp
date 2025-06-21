import React, { useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute, RouteProp } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import { withApiState } from '@/components/hoc/withApiState'
import {
  fetchMovieDetailsRequest,
  toggleFavorite,
} from '@/store/actions/movieActions'
import {
  RootStackParamList,
  RootState,
  Genre,
  ProductionCompany,
} from '@/types'
import { API_CONFIG } from '@/config/api'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  DIMENSIONS,
  STRINGS,
  SCREEN_NAMES,
  formatString,
} from '@/constants'

type MovieDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof SCREEN_NAMES.MovieDetails
>

const MovieDetailsScreen: React.FC = () => {
  const dispatch = useDispatch()
  const route = useRoute<MovieDetailsScreenRouteProp>()

  const { movieId, movie } = route.params

  const movieDetails = useSelector(
    (state: RootState) => state.movies.movieDetails[movieId],
  )

  useEffect(() => {
    if (!movieDetails) {
      dispatch(fetchMovieDetailsRequest({ movieId }))
    }
  }, [dispatch, movieId, movieDetails])

  const handleToggleFavorite = useCallback(() => {
    const movieToToggle = movieDetails || movie
    if (movieToToggle) {
      dispatch(toggleFavorite({ movie: movieToToggle }))
    }
  }, [dispatch, movieDetails, movie])

  const currentMovie = movieDetails || movie

  if (!currentMovie) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{STRINGS.loading.default}</Text>
      </View>
    )
  }

  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${currentMovie.backdrop_path}`
    : null

  const posterUrl = currentMovie.poster_path
    ? `${API_CONFIG.imageBaseUrl}${currentMovie.poster_path}`
    : null

  const MovieDetailsComponent = withApiState(() => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {backdropUrl && (
        <View style={styles.backdropContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.movieInfo}>
          <View style={styles.movieHeader}>
            {posterUrl && (
              <Image source={{ uri: posterUrl }} style={styles.poster} />
            )}

            <View style={styles.movieBasicInfo}>
              <Text style={styles.title}>{currentMovie.title}</Text>

              {currentMovie.tagline && (
                <Text style={styles.tagline}>{currentMovie.tagline}</Text>
              )}

              <View style={styles.ratingContainer}>
                <Ionicons
                  name="star"
                  size={FONT_SIZES.lg}
                  color={COLORS.rating}
                />
                <Text style={styles.rating}>
                  {currentMovie.vote_average.toFixed(1)}
                </Text>
                <Text style={styles.voteCount}>
                  {formatString.votes(currentMovie.vote_count)}
                </Text>
              </View>

              <View style={styles.metaInfo}>
                <Text style={styles.releaseDate}>
                  {formatString.year(currentMovie.release_date)}
                </Text>
                {movieDetails?.runtime && (
                  <>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.runtime}>
                      {formatString.runtime(movieDetails.runtime)}
                    </Text>
                  </>
                )}
              </View>

              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  {movieDetails.genres.map((genre: Genre) => (
                    <View key={genre.id} style={styles.genreChip}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons
              name={currentMovie.isFavorite ? 'heart' : 'heart-outline'}
              size={FONT_SIZES.xxxl}
              color={currentMovie.isFavorite ? COLORS.favorite : COLORS.primary}
            />
            <Text
              style={[
                styles.favoriteButtonText,
                {
                  color: currentMovie.isFavorite
                    ? COLORS.favorite
                    : COLORS.primary,
                },
              ]}
            >
              {currentMovie.isFavorite
                ? STRINGS.movies.removeFromFavorites
                : STRINGS.movies.addToFavorites}
            </Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{STRINGS.movies.overview}</Text>
            <Text style={styles.overview}>{currentMovie.overview}</Text>
          </View>

          {movieDetails && (
            <>
              {movieDetails.budget > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {STRINGS.movies.budget}
                  </Text>
                  <Text style={styles.detailText}>
                    {formatString.currency(movieDetails.budget)}
                  </Text>
                </View>
              )}

              {movieDetails.revenue > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {STRINGS.movies.revenue}
                  </Text>
                  <Text style={styles.detailText}>
                    {formatString.currency(movieDetails.revenue)}
                  </Text>
                </View>
              )}

              {movieDetails.production_companies.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {STRINGS.movies.productionCompanies}
                  </Text>
                  <Text style={styles.detailText}>
                    {movieDetails.production_companies
                      .map((company: ProductionCompany) => company.name)
                      .join(', ')}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  ))

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <MovieDetailsComponent
        apiState={{ isLoading: false, error: null }}
        onRetry={() => dispatch(fetchMovieDetailsRequest({ movieId }))}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropContainer: {
    position: 'relative',
    height: DIMENSIONS.backdrop.height,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginTop: -DIMENSIONS.backdrop.overlap, // Overlap with backdrop
    paddingTop: DIMENSIONS.backdrop.overlap,
  },
  movieInfo: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SPACING.xl,
    borderTopRightRadius: SPACING.xl,
    padding: SPACING.xl,
    flex: 1,
  },
  movieHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  poster: {
    width: DIMENSIONS.poster.medium.width,
    height: DIMENSIONS.poster.medium.height,
    borderRadius: BORDER_RADIUS.xl,
    marginRight: SPACING.lg,
  },
  movieBasicInfo: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.lg,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  rating: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  voteCount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  releaseDate: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  separator: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.sm,
  },
  runtime: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  genreChip: {
    backgroundColor: COLORS.backgroundGray,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md / 2,
    borderRadius: BORDER_RADIUS.xxl,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  genreText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xxxl,
  },
  favoriteButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  overview: {
    fontSize: FONT_SIZES.lg,
    lineHeight: SPACING.xxxl,
    color: COLORS.textSecondary,
  },
  detailText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
})

export default MovieDetailsScreen
