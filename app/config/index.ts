/**
 * App Configuration
 * Quản lý tất cả environment variables với type safety
 */

interface AppConfig {
  api: {
    baseUrl: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    version: string;
  };
  features: {
    analytics: boolean;
    debug: boolean;
  };
}

/**
 * Lấy env variable với validation
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (!value && !defaultValue) {
    console.warn(`⚠️ Environment variable ${key} is not set`);
    return "";
  }

  return value || defaultValue || "";
};

/**
 * Parse boolean từ string
 */
const parseBoolean = (value: string | undefined): boolean => {
  return value === "true" || value === "1";
};

/**
 * App Configuration Object
 */
export const config: AppConfig = {
  api: {
    baseUrl: getEnvVar("EXPO_PUBLIC_API_URL", "http://localhost:3000/api"),
  },
  supabase: {
    url: getEnvVar("EXPO_PUBLIC_SUPABASE_URL", ""),
    anonKey: getEnvVar("EXPO_PUBLIC_SUPABASE_ANON_KEY", ""),
  },
  app: {
    name: getEnvVar("EXPO_PUBLIC_APP_NAME", "Hippo Diary"),
    version: getEnvVar("EXPO_PUBLIC_APP_VERSION", "1.0.0"),
  },
  features: {
    analytics: parseBoolean(getEnvVar("EXPO_PUBLIC_ENABLE_ANALYTICS", "false")),
    debug: parseBoolean(getEnvVar("EXPO_PUBLIC_ENABLE_DEBUG", "true")),
  },
};

/**
 * Validate configuration khi app start
 */
export const validateConfig = (): boolean => {
  const errors: string[] = [];

  // Check API URL
  if (!config.api.baseUrl) {
    errors.push("❌ EXPO_PUBLIC_API_URL is required");
  }

  // Nếu dùng Supabase, check config
  if (config.supabase.url && !config.supabase.anonKey) {
    errors.push(
      "❌ EXPO_PUBLIC_SUPABASE_ANON_KEY is required when using Supabase",
    );
  }

  if (errors.length > 0) {
    console.error("🚨 Configuration Errors:");
    errors.forEach((error) => console.error(error));
    console.error(
      "\n💡 Tip: Check your .env file and restart expo with: npx expo start -c",
    );
    return false;
  }

  // Log config nếu debug mode
  if (config.features.debug) {
    console.log("✅ App Configuration:");
    console.log("  API URL:", config.api.baseUrl);
    console.log("  App Name:", config.app.name);
    console.log("  Version:", config.app.version);
    console.log("  Features:", config.features);
  }

  return true;
};

/**
 * Check nếu đang ở môi trường development
 */
export const isDevelopment = (): boolean => {
  return __DEV__;
};

/**
 * Check nếu đang ở môi trường production
 */
export const isProduction = (): boolean => {
  return !__DEV__;
};

// Export default
export default config;
