import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (onExpire) {
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onExpire]);

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(initialTime);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return { timeLeft, reset, stop };
};
