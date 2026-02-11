import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  useWindowDimensions,
} from "react-native";
import { Image, Text, YStack } from "tamagui";

type Card = {
  id: string;
  image: any;
  text: string;
};

type Props = {
  cards: Card[];
  heightRatio?: number;
  speed?: number; // ms for one direction
};

export function MarqueeCarousel({
  cards,
  heightRatio = 0.28,
  speed = 26000,
}: Props) {
  const { width, height } = useWindowDimensions();

  const CARD_WIDTH = Math.min(width * 0.7, 240);
  const CARD_HEIGHT = height * heightRatio;
  const GAP = 16;

  const ITEM_WIDTH = CARD_WIDTH + GAP;
  const TOTAL_WIDTH = ITEM_WIDTH * cards.length;

  const translateX = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const direction = useRef<-1 | 1>(-1);
  const lastOffset = useRef(0);
  const [paused, setPaused] = useState(false);

  /* --------------------------------------------------
     Auto marquee animation
  --------------------------------------------------- */
  const startAnimation = () => {
    animationRef.current?.stop();

    animationRef.current = Animated.timing(translateX, {
      toValue: direction.current === -1 ? -TOTAL_WIDTH : 0,
      duration: speed,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    animationRef.current.start(({ finished }) => {
      if (finished && !paused) {
        direction.current = direction.current === -1 ? 1 : -1;
        startAnimation();
      }
    });
  };

  useEffect(() => {
    if (!paused) startAnimation();
    return () => animationRef.current?.stop();
  }, [paused]);

  /* --------------------------------------------------
     Drag / touch handling
  --------------------------------------------------- */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setPaused(true);
        animationRef.current?.stop();
        translateX.stopAnimation((value) => {
          lastOffset.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = lastOffset.current + gesture.dx;
        translateX.setValue(Math.max(-TOTAL_WIDTH, Math.min(0, next)));
      },
      onPanResponderRelease: () => {
        setPaused(false);
      },
    }),
  ).current;

  return (
    <YStack height={CARD_HEIGHT + 40} overflow="hidden">
      {/* ================= BACKGROUND ================= */}
      {cards.map((card, index) => {
        const opacity = translateX.interpolate({
          inputRange: [
            -(index + 1) * ITEM_WIDTH,
            -index * ITEM_WIDTH,
            -(index - 1) * ITEM_WIDTH,
          ],
          outputRange: [0, 0.5, 0],
          extrapolate: "clamp",
        });

        return (
          <Animated.Image
            key={`bg-${card.id}`}
            source={card.image}
            resizeMode="cover"
            style={{
              position: "absolute",
              width: "120%",
              height: "120%",
              opacity,
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [-TOTAL_WIDTH, 0],
                    outputRange: [-60, 0],
                  }),
                },
              ],
            }}
          />
        );
      })}

      {/* ================= FOREGROUND ================= */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flexDirection: "row",
          paddingHorizontal: 24,
          paddingTop: 24,
          transform: [{ translateX }],
        }}
      >
        {[...cards, ...cards].map((card, index) => {
          const position = Animated.add(
            translateX,
            new Animated.Value(index * ITEM_WIDTH),
          );

          const scale = position.interpolate({
            inputRange: [-CARD_WIDTH, 0, CARD_WIDTH, CARD_WIDTH * 2],
            outputRange: [0.88, 1, 0.88, 0.85],
            extrapolate: "clamp",
          });

          const opacity = position.interpolate({
            inputRange: [-CARD_WIDTH, 0, CARD_WIDTH, CARD_WIDTH * 2],
            outputRange: [0.6, 1, 0.6, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`${card.id}-${index}`}
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                marginRight: GAP,
                borderRadius: 20,
                overflow: "hidden",
                backgroundColor: "#000",
                transform: [{ scale }],
                opacity,
              }}
            >
              <Image  source={card.image} width="100%" height="100%" />

              <YStack position="absolute" bottom={16} left={16} right={16}>
                <Text
                  color="white"
                  fontSize="$3"
                  fontWeight="400"
                  textAlign="center"
                >
                  {card.text}
                </Text>
              </YStack>
            </Animated.View>
          );
        })}
      </Animated.View>
    </YStack>
  );
}