import { useState } from 'react';
import { SplashScreen } from './components/splash/SplashScreen';

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <box
      flexDirection="column"
      height="100%"
      padding={1}
    >
      <text fg="#FFD700">Ctrl-Tower - Flight Information System</text>
      <text fg="#FFA500">Main application coming soon...</text>
    </box>
  );
}
