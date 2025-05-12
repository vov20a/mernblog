import { RefObject, useEffect } from 'react';

// type UseYo<T extends HTMLElement> = {
//   ref: RefObject<T>;
//   callback: { (): void; (): void; (): void };
// };

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: { (): void; (): void; (): void },
): void {
  const handleClick: (this: Document, e: MouseEvent) => any = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e?.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });
}
