import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TitleScreen } from './components/title/TitleScreen';
import { MainApp } from './components/main/MainApp';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,          // Never auto-refetch (manual refresh only)
      gcTime: 1000 * 60 * 10,       // Cache for 10 minutes
      retry: 2,                      // Retry failed requests 2 times
      refetchOnWindowFocus: false,   // No auto-refetch on window focus
      refetchOnReconnect: false,     // No auto-refetch on reconnect
    },
  },
});

export function App() {
  const [showTitle, setShowTitle] = useState(true);

  if (showTitle) {
    return <TitleScreen onComplete={() => setShowTitle(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}
