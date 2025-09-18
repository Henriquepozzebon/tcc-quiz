import React, { useEffect, useState } from "react";

export default function Timer({ duration = 180, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          if (typeof onTimeUp === "function") onTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [duration, onTimeUp]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div style={{fontWeight: "bold", fontSize: 18, color: "#222", background: "#fff", borderRadius: 8, padding: "4px 16px", border: "1px solid #eee", minWidth: 80, textAlign: "center"}}>
      {minutes}:{seconds}
    </div>
  );
}
