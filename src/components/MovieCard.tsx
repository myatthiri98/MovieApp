import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Movie } from '@/types'
import { API_CONFIG } from '@/config/api'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  DIMENSIONS,
} from '@/constants'

interface MovieCardProps {
  movie: Movie
  onPress: (movie: Movie) => void
  onToggleFavorite: (movie: Movie) => void
}

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - SPACING.lg * 3) / 2 // 2 columns with padding

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  onToggleFavorite,
}) => {
  const posterUrl = movie.poster_path
    ? `${API_CONFIG.imageBaseUrl}${movie.poster_path}`
    : null

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.placeholderPoster]}>
            <Ionicons
              name="film-outline"
              size={FONT_SIZES.xxxl}
              color={COLORS.textSecondary}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(movie)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={movie.isFavorite ? 'heart' : 'heart-outline'}
            size={FONT_SIZES.lg}
            color={movie.isFavorite ? COLORS.favorite : COLORS.textWhite}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={FONT_SIZES.sm} color={COLORS.rating} />
          <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
        </View>

        <Text style={styles.releaseDate}>
          {new Date(movie.release_date).getFullYear()}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5, // 3:2 aspect ratio
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
  placeholderPoster: {
    backgroundColor: COLORS.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.overlay,
    borderRadius: BORDER_RADIUS.round,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: SPACING.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  rating: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  releaseDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
})
