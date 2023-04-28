import { useState, useEffect, useCallback, useMemo, useRef } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    if (isActive) {
      previousTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(updateTimer);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive]);

  useEffect(() => {
    if (seconds === 0) {
      setIsActive(false);
      previousTimeRef.current = null;
    }
  }, [seconds]);

  const updateTimer = useCallback(() => {
    const currentTime = Date.now();
    const deltaTime = currentTime - previousTimeRef.current;

    if (deltaTime >= 1000) {
      setSeconds((prevSeconds) => Math.max(0, prevSeconds - 1));
      previousTimeRef.current = currentTime;
    }

    if (seconds > 0) {
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  }, [seconds]);

  const handleStart = useCallback(() => {
    if (inputValue && !isNaN(inputValue) && parseInt(inputValue) > 0) {
      setIsActive(true);
      setSeconds(parseInt(inputValue, 10));
    } else {
      alert("Минимальное значение 1");
    }
  }, [inputValue]);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const remainingSeconds = seconds - hours * 3600 - minutes * 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }, [seconds]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <input
          disabled={isActive}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <button
        disabled={isActive}
        onClick={handleStart}
        style={{ marginBottom: 10 }}
      >
        {isActive ? "Ждем окончания" : "Запуск"}
      </button>
      <div>
        {isActive ? formattedTime : "Введите значение и запустите таймер"}
      </div>
    </div>
  );
}

export default Timer;
