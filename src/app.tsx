import { useState } from 'react';
import { TitleScreen } from './components/title/TitleScreen';
import { MainApp } from './components/main/MainApp';

export function App() {
  const [showTitle, setShowTitle] = useState(true);

  if (showTitle) {
    return <TitleScreen onComplete={() => setShowTitle(false)} />;
  }

  return <MainApp />;
}
