import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar as RNCalendar, LocaleConfig, DateData } from "react-native-calendars";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface CalendarProps {
  onDayPress?: (day: DateData) => void;
  markedDates?: Record<string, any>;
  current?: string;
  minDate?: string;
  maxDate?: string;
  style?: object;
}

// Optional: configure locale
LocaleConfig.locales["en"] = LocaleConfig.locales["en"];
LocaleConfig.defaultLocale = "en";

export function Calendar({
  onDayPress,
  markedDates,
  current,
  minDate,
  maxDate,
  style,
}: CalendarProps) {
  return (
    <View style={[styles.container, style]}>
      <RNCalendar
        current={current}
        minDate={minDate}
        maxDate={maxDate}
        onDayPress={onDayPress}
        markingType={"period"} // supports range selection
        markedDates={markedDates}
        theme={{
          backgroundColor: "#1f2937", // dark background
          calendarBackground: "#1f2937",
          textSectionTitleColor: "#d1d5db", // muted text
          dayTextColor: "#fff",
          todayTextColor: "#2563eb", // primary
          selectedDayBackgroundColor: "#3b82f6",
          selectedDayTextColor: "#fff",
          arrowColor: "#fff",
          monthTextColor: "#fff",
          textDisabledColor: "#6b7280",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        renderArrow={(direction: "left" | "right") =>
    direction === "left" ? (
      <ChevronLeft color="#fff" size={20} />
    ) : (
      <ChevronRight color="#fff" size={20} />
    )
  }
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1f2937",
  },
});