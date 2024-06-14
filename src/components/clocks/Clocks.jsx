import React, { useState, useEffect } from "react";
import "./clocks.css";

function Clocks() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeState, setTimeState] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
      console.log(newTime);
    }, 50); // Update every 50 milliseconds for smooth second hand

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newMilliseconds = currentTime.getMilliseconds();
    const oldSeconds = new Date(currentTime.getTime() - 50).getSeconds();
    const newSeconds = currentTime.getSeconds();

    // Disable transition if moving from 59.x to 0.x seconds in the last 100 milliseconds
    if (oldSeconds === 59 && newSeconds === 0 && newMilliseconds < 100) {
      setTransitionEnabled(false);
      setTimeout(() => setTransitionEnabled(true), 100); // Re-enable transition after 100ms
    } else {
      setTransitionEnabled(true);
    }
  }, [currentTime]);

  const addTimer = (e) => {
    e.preventDefault();
    const [hours, minutes] = timeState.split(":");
    const newSelectedTime = new Date();
    newSelectedTime.setHours(hours);
    newSelectedTime.setMinutes(minutes);
    setSelectedTime(newSelectedTime);
  };

  const calculatePosition = (i) => {
    const angle = ((i - 15) * 6 * (Math.PI / 180)) % (2 * Math.PI);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  const totalDots = 60;
  const radius = 13.75;
  const activeSecond = Math.floor(currentTime.getSeconds() + currentTime.getMilliseconds() / 1000);
  const dotsArray = Array.from({ length: totalDots }).map((_, i) => (i + 55) % totalDots);

  const secondDegree = (currentTime.getSeconds() + currentTime.getMilliseconds() / 1000) * 6 - 90;
  const minuteDegree = currentTime.getMinutes() * 6 - 90;
  const hourDegree = ((currentTime.getHours() % 12) + currentTime.getMinutes() / 60) * 30 - 90;

  const formatNumber = (num, isLast = false) => {
    const digits = num.toString().padStart(2, "0").split("");
    return digits.map((digit, index) => (
      <>
        <span key={index} className="digit">
          {digit}
        </span>
        {index === 1 && !isLast ? <span className="colon">:</span> : null}
      </>
    ));
  };

  return (
    <div>
      <h1>Clocks</h1>
      <div className="digital">
        {/*  <form onSubmit={addTimer}>
          <input type="time" onChange={(e) => setTimeState(e.target.value)} className="add-time" />
          <button className="add-button" type="submit">
            Add
          </button>
        </form> */}
        {selectedTime && selectedTime.getHours() + ":"}{" "}
        {selectedTime && selectedTime.getMinutes() + ":"}
        {selectedTime && selectedTime.getSeconds()}
      </div>

      <div className="analog">
        <div className="digits">
          {formatNumber(currentTime.getHours())}
          {formatNumber(currentTime.getMinutes())}
          {formatNumber(currentTime.getSeconds(), true)}
        </div>

        {dotsArray.map((i) => {
          const { x, y } = calculatePosition(i);
          const isNumber = i % 5 === 0;
          const className = `dot ${isNumber ? "number" : ""} ${
            i === Math.floor(activeSecond) ? "active" : ""
          }`;
          return (
            <div
              key={i}
              className={className}
              style={{
                left: `calc(50% + ${x}dvw)`,
                top: `calc(50% + ${y}dvw)`
              }}
            >
              {isNumber ? (i / 5) % 12 || 12 : ""}
            </div>
          );
        })}
        <div className="pointers">
          <div
            className="pointer-hour"
            style={{ transform: `translateY(-50%) rotate(${hourDegree}deg)` }}
          ></div>
          <div
            className="pointer-minute"
            style={{ transform: `translateY(-50%) rotate(${minuteDegree}deg)` }}
          ></div>
          <div
            className={`pointer-second ${!transitionEnabled ? "no-transition" : ""}`}
            style={{ transform: `translateY(-50%) rotate(${secondDegree}deg)` }}
          ></div>
          <div className="pointer-center-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default Clocks;
