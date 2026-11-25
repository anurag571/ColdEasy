import React, { useEffect, useRef, useState } from 'react';

export const CartCount: React.FC<{ count: number; className: string }> = ({
  count,
  className,
}) => {
  const previous = useRef(count);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (count > previous.current) setTick((value) => value + 1);
    previous.current = count;
  }, [count]);

  return (
    <span key={tick} className={`${className}${tick > 0 ? ' cart-count-tick' : ''}`}>
      {count}
    </span>
  );
};
