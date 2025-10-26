import * as React from "react";
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CollapsibleProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: any;
};

function Collapsible({ children, open = false, onOpenChange, style }: CollapsibleProps) {
  const [expanded, setExpanded] = React.useState(open);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      onOpenChange?.(!prev);
      return !prev;
    });
  };

  return (
    <View style={style}>
      {React.Children.map(children, (child: any) => {
        if (!React.isValidElement(child)) return child;

        // Pass expanded state and toggle function to trigger/content
        return React.cloneElement(child as React.ReactElement<any>, { expanded, toggle });
      })}
    </View>
  );
}

type CollapsibleTriggerProps = {
  children: React.ReactNode;
  expanded?: boolean;
  toggle?: () => void;
  style?: any;
};

function CollapsibleTrigger({ children, expanded, toggle, style }: CollapsibleTriggerProps) {
  return (
    <TouchableOpacity onPress={toggle} style={style}>
      {children}
    </TouchableOpacity>
  );
}

type CollapsibleContentProps = {
  children: React.ReactNode;
  expanded?: boolean;
  style?: any;
};

function CollapsibleContent({ children, expanded, style }: CollapsibleContentProps) {
  if (!expanded) return null;

  return <View style={style}>{children}</View>;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
