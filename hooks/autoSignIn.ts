import { useRef, useEffect } from 'react';
import { autoSignIn } from '@/utility/fetch';

export function useAutoSignIn() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleAutoSignIn = (expiresIn: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await autoSignIn();
        if (res?.expiresIn) {
          scheduleAutoSignIn(res.expiresIn);
        }
      } catch (err) {
        console.error("Auto sign-in failed:", err);
      }
    }, (expiresIn - 60) * 1000); // convert to ms
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { scheduleAutoSignIn };
}
