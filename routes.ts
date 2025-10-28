export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/auth/reset",
  "/auth/new-password",
  "/onboarding",
  "/onboarding/new",
  "/api/ollama",
  "/community",
  "/story/*",
  "/episode/*",
];

export const authRoutes = ["/auth/register", "/auth/login", "/auth/error"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/onboarding";

export const TEXTAREA_ROUTE = "/textarea";
