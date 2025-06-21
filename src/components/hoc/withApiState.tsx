import React from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { ApiState } from '@/types'

interface WithApiStateProps {
  apiState: ApiState
  onRetry?: () => void
  emptyMessage?: string
  showEmptyState?: boolean
}

export function withApiState<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithApiStateComponent(props: P & WithApiStateProps) {
    const { apiState, onRetry, emptyMessage, showEmptyState, ...otherProps } =
      props

    // Show loading state
    if (apiState.isLoading && !apiState.isRefreshing) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )
    }

    // Show error state
    if (apiState.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>⚠️ {apiState.error}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      )
    }

    // Show empty state if needed
    if (showEmptyState) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>
            {emptyMessage || 'No data available'}
          </Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
      )
    }

    // Show the wrapped component
    return <WrappedComponent {...(otherProps as P)} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
