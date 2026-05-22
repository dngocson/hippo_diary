import {
  ModalProvider,
  useModalContext,
} from "@/components/custom/ModalContext";
import { Fab, FabIcon } from "@/components/ui/fab";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { MoonIcon, SlashIcon, SunIcon } from "@/components/ui/icon";
import { useColorScheme } from "@/components/useColorScheme";
import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/libs/queryClient";
import { validateConfig } from "@/app/config";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);

  // Validate app configuration
  useEffect(() => {
    validateConfig();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<"system" | "light" | "dark">("system");

  // Determine effective color scheme
  const effectiveColorScheme =
    mode === "system" ? (systemColorScheme ?? "light") : mode;

  const handleToggleTheme = () => {
    if (mode === "system") {
      setMode("light");
    } else if (mode === "light") {
      setMode("dark");
    } else {
      setMode("system");
    }
  };

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <GluestackUIProvider mode={mode}>
            <ThemeProvider
              value={effectiveColorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <RootLayoutContent
                mode={mode}
                handleToggleTheme={handleToggleTheme}
                effectiveColorScheme={effectiveColorScheme}
              />
            </ThemeProvider>
          </GluestackUIProvider>
        </ModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutContent({
  mode,
  handleToggleTheme,
  effectiveColorScheme,
}: {
  mode: "system" | "light" | "dark";
  handleToggleTheme: () => void;
  effectiveColorScheme: "light" | "dark";
}) {
  const pathname = usePathname();
  const { isAnyModalOpen } = useModalContext();

  return (
    <>
      <Slot />
      {pathname.startsWith("/tabs") && !isAnyModalOpen && (
        <Fab onPress={handleToggleTheme} className="m-6" size="lg">
          <FabIcon
            as={
              mode === "system"
                ? SlashIcon
                : effectiveColorScheme === "dark"
                  ? MoonIcon
                  : SunIcon
            }
          />
        </Fab>
      )}
    </>
  );
}
