import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animated dots for loading indicator
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Auto-complete after duration
    const completeTimeout = setTimeout(() => {
      clearInterval(dotsInterval);
      onComplete();
    }, duration);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, duration]);

  const logo = [
    '╔══════════════════════════════════════════════════════════╗',
    '║                                                          ║',
    '║        ░█████╗░████████╗██████╗░██╗░░░░░              ║',
    '║        ██╔══██╗╚══██╔══╝██╔══██╗██║░░░░░              ║',
    '║        ██║░░╚═╝░░░██║░░░██████╔╝██║░░░░░              ║',
    '║        ██║░░██╗░░░██║░░░██╔══██╗██║░░░░░              ║',
    '║        ╚█████╔╝░░░██║░░░██║░░██║███████╗              ║',
    '║        ░╚════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝              ║',
    '║                                                          ║',
    '║       ████████╗░█████╗░░██╗░░░░░░░██╗███████╗██████╗   ║',
    '║       ╚══██╔══╝██╔══██╗░██║░░██╗░░██║██╔════╝██╔══██╗  ║',
    '║       ░░░██║░░░██║░░██║░╚██╗████╗██╔╝█████╗░░██████╔╝  ║',
    '║       ░░░██║░░░██║░░██║░░████╔═████║░██╔══╝░░██╔══██╗  ║',
    '║       ░░░██║░░░╚█████╔╝░░╚██╔╝░╚██╔╝░███████╗██║░░██║  ║',
    '║       ░░░╚═╝░░░░╚════╝░░░░╚═╝░░░╚═╝░░╚══════╝╚═╝░░╚═╝  ║',
    '║                                                          ║',
    '║            FLIGHT INFORMATION MANAGEMENT SYSTEM          ║',
    '║                    Version 0.1.0                         ║',
    '║                                                          ║',
    `║                  [ INITIALIZING${dots.padEnd(3)} ]                   ║`,
    '║                                                          ║',
    '╚══════════════════════════════════════════════════════════╝',
  ];

  return (
    <box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {logo.map((line, i) => (
        <text key={i} fg="#FFA500">{line}</text>
      ))}
    </box>
  );
}
