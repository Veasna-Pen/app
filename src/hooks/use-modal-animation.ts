import { useEffect, useRef, useState, useCallback } from 'react';
import { Animated } from 'react-native';

interface UseModalAnimationReturn {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  animatedClose: (onClosed: () => void) => void;
}

export function useModalAnimation(isVisible: boolean): UseModalAnimationReturn {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const isClosing = useRef(false);

  useEffect(() => {
    if (isVisible) {
      isClosing.current = false;
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 75,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isClosing.current) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
    }
  }, [isVisible, fadeAnim, scaleAnim]);

  const animatedClose = useCallback(
    (onClosed: () => void) => {
      isClosing.current = true;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        onClosed();
      });
    },
    [fadeAnim]
  );

  return { fadeAnim, scaleAnim, animatedClose };
}
