import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { WELCOME_DEALS } from '@/data/products';

interface CarouselLayout {
  isCompact: boolean;
  isSmallHeight: boolean;
  cardWidth: number;
  cardHeight: number;
  cardGap: number;
  snapInterval: number;
  horizontalInset: number;
  boxWidth: number;
  buttonWidth: number;
  imageWrapperHeight: number;
}

interface UsePromoCarouselReturn {
  layout: CarouselLayout;
  activeIndex: number;
  currentDeal: (typeof WELCOME_DEALS)[number];
  scrollRef: React.RefObject<ScrollView | null>;
  scrollX: Animated.Value;
  sparkleAnim: Animated.Value;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollToIndex: (index: number) => void;
  onCarouselLayout: () => void;
}

export function usePromoCarousel(isVisible: boolean): UsePromoCarouselReturn {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const layout = useMemo<CarouselLayout>(() => {
    const isCompact = screenHeight < 740 || screenWidth < 370;
    const isSmallHeight = screenHeight < 680;
    const cardWidth = Math.min(
      236,
      Math.max(200, Math.round(screenWidth * (screenWidth < 360 ? 0.72 : 0.64)))
    );
    const cardHeight = isCompact ? 218 : 236;
    const cardGap = 10;
    const snapInterval = cardWidth + cardGap;
    const horizontalInset = Math.max(0, (screenWidth - cardWidth) / 2);
    const boxWidth = Math.min(screenWidth * 0.9, isCompact ? 306 : 332);
    const buttonWidth = Math.min(boxWidth, isCompact ? 276 : 295);
    const imageWrapperHeight = isCompact ? 88 : 100;

    return {
      isCompact,
      isSmallHeight,
      cardWidth,
      cardHeight,
      cardGap,
      snapInterval,
      horizontalInset,
      boxWidth,
      buttonWidth,
      imageWrapperHeight,
    };
  }, [screenWidth, screenHeight]);

  const [activeIndex, setActiveIndex] = useState(1);
  const scrollRef = useRef<ScrollView>(null);
  const hasInitializedScroll = useRef(false);

  const [sparkleAnim] = useState(() => new Animated.Value(0));
  const [scrollX] = useState(() => new Animated.Value(1 * layout.snapInterval));

  useEffect(() => {
    if (isVisible) {
      scrollX.setValue(1 * layout.snapInterval);
      hasInitializedScroll.current = false;

      const sparkleLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      sparkleLoop.start();

      // Initial scroll to center deal (index 1) on both Android & iOS
      const timer = setTimeout(() => {
        if (!hasInitializedScroll.current) {
          hasInitializedScroll.current = true;
          scrollRef.current?.scrollTo({
            x: 1 * layout.snapInterval,
            animated: false,
          });
        }
      }, 60);

      return () => {
        clearTimeout(timer);
        sparkleLoop.stop();
      };
    }
  }, [isVisible, sparkleAnim, layout.snapInterval, scrollX]);

  const onCarouselLayout = useCallback(() => {
    if (!hasInitializedScroll.current) {
      hasInitializedScroll.current = true;
      scrollRef.current?.scrollTo({
        x: 1 * layout.snapInterval,
        animated: false,
      });
    }
  }, [layout.snapInterval]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / layout.snapInterval);
      if (index >= 0 && index < WELCOME_DEALS.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [layout.snapInterval, activeIndex]
  );

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / layout.snapInterval);
      if (index >= 0 && index < WELCOME_DEALS.length) {
        setActiveIndex(index);
      }
    },
    [layout.snapInterval]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollRef.current?.scrollTo({
        x: index * layout.snapInterval,
        animated: true,
      });
    },
    [layout.snapInterval]
  );

  const currentDeal = useMemo(
    () => WELCOME_DEALS[activeIndex] ?? WELCOME_DEALS[0],
    [activeIndex]
  );

  return {
    layout,
    activeIndex,
    currentDeal,
    scrollRef,
    scrollX,
    sparkleAnim,
    handleScroll,
    handleMomentumScrollEnd,
    scrollToIndex,
    onCarouselLayout,
  };
}
