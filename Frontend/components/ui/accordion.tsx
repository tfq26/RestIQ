import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function Accordion({
  sections,
}: {
  sections: { title: string; content: string | React.ReactNode }[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {sections.map((section, index) => {
        const isOpen = activeIndex === index;
        return (
          <View key={index} style={styles.item}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSection(index)}
              style={styles.trigger}
            >
              <Text style={styles.title}>{section.title}</Text>
              <ChevronDown
                size={20}
                color="#aaa"
                style={{
                  transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.contentWrapper}>
                {typeof section.content === "string" ? (
                  <Text style={styles.contentText}>{section.content}</Text>
                ) : (
                  section.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contentWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  contentText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 20,
  },
});
