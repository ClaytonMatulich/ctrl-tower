/**
 * Keyboard shortcut definitions
 * 
 * Centralized keyboard bindings for the application.
 * Makes it easy to document and modify shortcuts.
 */

export const keyBindings = {
  // Tab navigation
  nextTab: 'Tab',
  prevTab: 'Shift+Tab',
  jumpToTab1: '1',
  jumpToTab2: '2',
  jumpToTab3: '3',
  jumpToTab4: '4',

  // List navigation
  moveUp: 'ArrowUp',
  moveDown: 'ArrowDown',
  moveLeft: 'ArrowLeft',
  moveRight: 'ArrowRight',

  // Actions
  select: 'Enter',
  goBack: 'Escape',
  refresh: 'r',
  toggleMapMode: 'm',
  showHelp: '?',
  quit: 'q',
} as const;

export const keyDescriptions: Record<string, string> = {
  [keyBindings.nextTab]: 'Switch to next tab',
  [keyBindings.prevTab]: 'Switch to previous tab',
  [keyBindings.jumpToTab1]: 'Go to Arrivals',
  [keyBindings.jumpToTab2]: 'Go to Departures',
  [keyBindings.jumpToTab3]: 'Go to Live Map',
  [keyBindings.jumpToTab4]: 'Go to Help',
  [keyBindings.moveUp]: 'Navigate up',
  [keyBindings.moveDown]: 'Navigate down',
  [keyBindings.select]: 'Select item',
  [keyBindings.goBack]: 'Go back / Close',
  [keyBindings.refresh]: 'Refresh data',
  [keyBindings.toggleMapMode]: 'Toggle map view',
  [keyBindings.showHelp]: 'Show help',
  [keyBindings.quit]: 'Quit application',
};
