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

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>

const MovieDetailsScreen: React.FC = () => {
  const dispatch = useDispatch()
  const route = useRoute<MovieDetailsScreenRouteProp>()

  const { movieId, movie } = route.params

  const movieDetails = useSelector(
    (state: RootState) => state.movies.movieDetails[movieId],
  )

  useEffect(() => {
    // Fetch movie details if not already loaded
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
        <Text>Loading...</Text>
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
      {/* Backdrop Image */}
      {backdropUrl && (
        <View style={styles.backdropContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={styles.backdropOverlay} />
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.movieInfo}>
          {/* Poster and Basic Info */}
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
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {currentMovie.vote_average.toFixed(1)}
                </Text>
                <Text style={styles.voteCount}>
                  ({currentMovie.vote_count} votes)
                </Text>
              </View>

              <View style={styles.metaInfo}>
                <Text style={styles.releaseDate}>
                  {new Date(currentMovie.release_date).getFullYear()}
                </Text>
                {movieDetails?.runtime && (
                  <>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.runtime}>
                      {movieDetails.runtime} min
                    </Text>
                  </>
                )}
              </View>

              {/* Genres */}
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

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons
              name={currentMovie.isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={currentMovie.isFavorite ? '#FF3B30' : '#007AFF'}
            />
            <Text
              style={[
                styles.favoriteButtonText,
                { color: currentMovie.isFavorite ? '#FF3B30' : '#007AFF' },
              ]}
            >
              {currentMovie.isFavorite
                ? 'Remove from Favorites'
                : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{currentMovie.overview}</Text>
          </View>

          {/* Additional Details for MovieDetails */}
          {movieDetails && (
            <>
              {movieDetails.budget > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Budget</Text>
                  <Text style={styles.detailText}>
                    ${movieDetails.budget.toLocaleString()}
                  </Text>
                </View>
              )}

              {movieDetails.revenue > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Revenue</Text>
                  <Text style={styles.detailText}>
                    ${movieDetails.revenue.toLocaleString()}
                  </Text>
                </View>
              )}

              {movieDetails.production_companies.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Production Companies</Text>
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
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropContainer: {
    position: 'relative',
    height: 250,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // height: 100,
    // backgroundColor: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    marginTop: -50, // Overlap with backdrop
    paddingTop: 50,
  },
  movieInfo: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 1,
  },
  movieHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
  movieBasicInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  runtime: {
    fontSize: 14,
    color: '#666',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genreChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
    color: '#666',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
})

export default MovieDetailsScreen
