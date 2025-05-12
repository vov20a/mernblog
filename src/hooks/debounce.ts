import { useEffect, useState } from 'react';

export function useDebounce(value: string, delay = 800): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
export function useTagsDebounce(value: string, delay = 800): string[] {
  const [debounced, setDebounced] = useState<string[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const arr = value.split(' ');
      const clearArr = [];
      for (let str of arr) {
        if (str !== '') clearArr.push(str);
      }
      setDebounced(clearArr);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
