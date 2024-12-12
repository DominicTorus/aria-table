import { useEffect, RefObject } from 'react';

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  ignoreClicksOn?: RefObject<HTMLElement>[]
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!ignoreClicksOn || !ignoreClicksOn.some((ignoreRef) => ignoreRef.current?.contains(event.target as Node)))
      ) {
        callback();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [ref, callback, ignoreClicksOn]);
};

export default useClickOutside;