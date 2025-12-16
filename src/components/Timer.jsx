import { useState, useEffect, useRef } from "react";

const Timer = ({ startTime }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  let interval = null;

  useEffect(() => {
    const getTime = () => {
      const time = Date.now() - startTime;
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    };

    interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (Math.floor(((Date.now() - startTime) / 1000) % 60) > 0) {
    return (
      <div className="timer">
        {hours < 10 ? "0" + hours : hours}:
        {minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
        <button onClick={() => clearInterval(interval)}>reset</button>
      </div>
    );
  } else {
    return <div className="timer">00:00:00</div>;
  }
};

export default Timer;
