import type { CSSProperties } from "react";
import { useConfig } from "../../lib/useConfig";
import s from "./lay4.module.css";

const POSITION_STYLES: Record<string, CSSProperties> = {
  "top-left": { top: "1rem", left: "1rem" },
  "top-right": {
    top: "1rem",
    left: "calc(100% - 1rem)",
    transform: "translate(-100%, 0)",
  },
  "bottom-left": {
    top: "calc(100% - 1rem)",
    left: "1rem",
    transform: "translate(0, -100%)",
  },
  "bottom-right": {
    top: "calc(100% - 1rem)",
    left: "calc(100% - 1rem)",
    transform: "translate(-100%, -100%)",
  },
};

const HIDDEN_STYLE: CSSProperties = {
  opacity: 0,
  pointerEvents: "none",
  top: "1rem",
  left: "1rem",
};

function formatTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function ClockLayer() {
  const React = Spicetify.React;
  const { useState, useEffect } = React;

  const [timeStr, setTimeStr] = useState(() => formatTime(new Date()));
  const showClock = useConfig("showClock");

  useEffect(() => {
    const interval = setInterval(
      () => setTimeStr(formatTime(new Date())),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const positionCSS = POSITION_STYLES[showClock] ?? HIDDEN_STYLE;

  return (
    <div className={s.clock} style={positionCSS}>
      {timeStr}
    </div>
  );
}
