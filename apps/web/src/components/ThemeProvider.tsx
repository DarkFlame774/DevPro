"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: any) {
  // Casting NextThemesProvider to any circumvents React 19 typings issues
  const Provider = NextThemesProvider as any;
  return (
    <Provider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </Provider>
  );
}
