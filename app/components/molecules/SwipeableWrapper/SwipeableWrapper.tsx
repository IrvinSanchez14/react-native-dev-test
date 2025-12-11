import React, { useRef } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import { Icon, Text } from '../../atoms';
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../../theme/theme';
import { styles } from './SwipeableWrapper.styles';

export interface SwipeableWrapperProps {
  children: React.ReactNode;
  onDelete: () => void;
  threshold?: number;
  showDelete?: boolean;
}

const DEFAULT_SWIPE_THRESHOLD = 120;

export function SwipeableWrapper({
  children,
  onDelete,
  threshold = DEFAULT_SWIPE_THRESHOLD,
  showDelete = true,
}: SwipeableWrapperProps) {
  const theme = useTheme<AppTheme>();
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {

        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -threshold) {

          Animated.timing(translateX, {
            toValue: -500,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {

          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!showDelete) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      {/* Delete button background */}
      <View style={[styles.deleteBackground, { backgroundColor: theme.custom.colors.error }]}>
        <Icon name="delete" size={24} color="#FFFFFF" />
        <Text style={styles.deleteText}>Delete</Text>
      </View>

      {/* Swipeable content */}
      <Animated.View
        style={[styles.cardContainer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}
