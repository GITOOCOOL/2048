// import { useState,useEffect } from "react"

// const Timer = () => {
//   const [timer,setTimer] = useState(0)
//   useEffect(() => {
//     setTimer(Date.now())
//   },[timer])
//   return (
//     <div>{timer}</div>
//   )
// }

// export default Timer

import { useState, useEffect } from 'react';

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const startTime = Date.now() - 55000;


  const getTime = () => {
    const time = Date.now()-startTime;

    // setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
        {hours < 10 ? "0" + hours : hours}:
        {minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
    </div>
  );
};

export default Timer;