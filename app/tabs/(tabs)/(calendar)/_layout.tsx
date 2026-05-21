import { Stack } from "expo-router";

export default function CalendarStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="day-detail"
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Calendar",
        }}
      />
    </Stack>
  );
}
