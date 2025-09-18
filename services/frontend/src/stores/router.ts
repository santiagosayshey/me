import { writable, derived } from 'svelte/store';

export const currentPath = writable(window.location.pathname);

export const currentLocation = derived(currentPath, $path => $path);

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    currentPath.set(window.location.pathname);
  });
  
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    currentPath.set(window.location.pathname);
  };
  
  const originalReplaceState = history.replaceState;
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    currentPath.set(window.location.pathname);
  };
}