import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  FlatListProps,
  TouchableOpacity,
} from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native"; // use RN version
import { Button } from "./button";

type Orientation = "horizontal" | "vertical";

type CarouselContextProps = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: Orientation;
};

const CarouselContext = createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}

type CarouselProps<ItemT> = {
  orientation?: Orientation;
  children: ReactNode;
  data?: ItemT[];
  renderItem?: FlatListProps<ItemT>["renderItem"];
  itemWidth?: number;
  itemHeight?: number;
};

export function Carousel<ItemT>({
  orientation = "horizontal",
  data,
  renderItem,
  itemWidth,
  itemHeight,
}: CarouselProps<ItemT>) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    flatListRef.current?.scrollToIndex({
      index: currentIndex - 1,
      animated: true,
    });
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, [currentIndex]);

  const scrollNext = useCallback(() => {
    if (!data) return;
    if (currentIndex >= data.length - 1) return;
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
    setCurrentIndex((prev) => Math.min(prev + 1, data.length - 1));
  }, [currentIndex, data]);

  return (
    <CarouselContext.Provider
      value={{
        scrollPrev,
        scrollNext,
        canScrollPrev: currentIndex > 0,
        canScrollNext: data ? currentIndex < data.length - 1 : false,
        orientation,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal={orientation === "horizontal"}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        snapToInterval={orientation === "horizontal" ? itemWidth : itemHeight}
        decelerationRate="fast"
        style={{ flexGrow: 0 }}
      />
    </CarouselContext.Provider>
  );
}

// Carousel Item
export function CarouselItem({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[{ flex: 0 }, style]}>{children}</View>;
}

// Carousel Previous Button
export function CarouselPrevious({ size = 40 }: { size?: number }) {
  const { scrollPrev, canScrollPrev, orientation } = useCarousel();
  if (!canScrollPrev) return null;
  return (
    <TouchableOpacity
      onPress={scrollPrev}
      style={[
        styles.button,
        orientation === "horizontal"
          ? { left: -size / 2, top: "50%", transform: [{ translateY: -size / 2 }] }
          : { top: -size / 2, left: "50%", transform: [{ translateX: -size / 2 }, { rotate: "90deg" }] },
      ]}
    >
      <ArrowLeft width={size} height={size} />
    </TouchableOpacity>
  );
}

// Carousel Next Button
export function CarouselNext({ size = 40 }: { size?: number }) {
  const { scrollNext, canScrollNext, orientation } = useCarousel();
  if (!canScrollNext) return null;
  return (
    <TouchableOpacity
      onPress={scrollNext}
      style={[
        styles.button,
        orientation === "horizontal"
          ? { right: -size / 2, top: "50%", transform: [{ translateY: -size / 2 }] }
          : { bottom: -size / 2, left: "50%", transform: [{ translateX: -size / 2 }, { rotate: "90deg" }] },
      ]}
    >
      <ArrowRight width={size} height={size} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    zIndex: 10,
  },
});
