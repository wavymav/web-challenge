"use client";

import { ApolloProvider } from "./apollo-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <ApolloProvider>
          {children}
          <Toaster richColors />
        </ApolloProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
