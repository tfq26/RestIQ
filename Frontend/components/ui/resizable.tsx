import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import { GripVertical } from "lucide-react-native";

type Direction = "horizontal" | "vertical";

interface ResizablePanelGroupProps {
  direction?: Direction;
  children: React.ReactNode[];
  style?: any;
}

interface ResizablePanelProps {
  children: React.ReactNode;
  flex?: number;
  style?: any;
}

interface ResizableHandleProps {
  direction?: Direction;
  onDrag?: (delta: number) => void;
  withHandle?: boolean;
}

export const ResizablePanelGroup: React.FC<ResizablePanelGroupProps> = ({
  direction = "horizontal",
  children,
  style,
}) => {
  const [sizes, setSizes] = useState<number[]>(
    Array(React.Children.count(children)).fill(1 / React.Children.count(children))
  );
  const totalFlex = sizes.reduce((a, b) => a + b, 0);

  const handleDrag = (index: number, delta: number) => {
    setSizes((prev) => {
      const next = [...prev];
      const change = delta / 200; // Adjust drag sensitivity
      next[index] = Math.max(0.1, next[index] + change);
      next[index + 1] = Math.max(0.1, next[index + 1] - change);
      return next;
    });
  };

  return (
    <View
      style={[
        styles.group,
        direction === "vertical" && styles.groupVertical,
        style,
      ]}
    >
      {React.Children.map(children, (child, i) => {
        // ✅ Type narrow to ensure 'child' is a valid React element
        if (!React.isValidElement(child)) return child;

        const panel = (
          <View
            key={`panel-${i}`}
            style={[
              styles.panel,
              { flex: sizes[i] / totalFlex },
              // ✅ Safe access: only use .props.style when defined
              (child.props as any)?.style,
            ]}
          >
            {child}
          </View>
        );

        if (i < React.Children.count(children) - 1) {
          return (
            <>
              {panel}
              <ResizableHandle
                direction={direction}
                onDrag={(d) => handleDrag(i, d)}
                withHandle
              />
            </>
          );
        }

        return panel;
      })}
    </View>
  );
};


export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  style,
}) => <View style={[styles.panel, style]}>{children}</View>;

export const ResizableHandle: React.FC<ResizableHandleProps> = ({
  direction = "horizontal",
  onDrag,
  withHandle = true,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (direction === "horizontal") {
          onDrag?.(gesture.dx);
        } else {
          onDrag?.(gesture.dy);
        }
      },
      onPanResponderRelease: () => {
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        direction === "horizontal" ? styles.handleVertical : styles.handleHorizontal,
      ]}
    >
      {withHandle && (
        <View style={styles.handleInner}>
          <GripVertical size={14} color="#6b7280" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  groupVertical: {
    flexDirection: "column",
  },
  panel: {
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },
  handleVertical: {
    width: 8,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  handleHorizontal: {
    height: 8,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  handleInner: {
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    padding: 2,
  },
});
