import { useState, useEffect, useCallback, useMemo } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((p) => p - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

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
