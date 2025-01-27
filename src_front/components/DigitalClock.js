import { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-4">
      <h3>{time.toLocaleTimeString()}</h3>
      <p>{time.toLocaleDateString()}</p>
    </div>
  );
};

export default DigitalClock;