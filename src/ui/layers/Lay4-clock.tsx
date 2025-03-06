import { addChangeListener, get } from "../../lib/config";
import s from "./lay4.module.css";

export default function Lay4() {
  const { React } = Spicetify;
  const { useState, useEffect } = React;

  const [timeStr, setTimeStr] = useState("00:00:00");
  const [showClock, setShowClock] = useState(get("showClock"));

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setTimeStr(
        `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes()
        ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return addChangeListener("showClock", () => {
      setShowClock(get("showClock"));
    });
  }, []);

  const putCSS: any =
    showClock == "disable"
      ? { opacity: 0, pointerEvents: "none", top: "1rem", left: "1rem" }
      : showClock == "top-left"
      ? { top: "1rem", left: "1rem" }
      : showClock == "top-right"
      ? {
          top: "1rem",
          left: "calc(100% - 1rem)",
          transform: "translate(-100%, 0)",
        }
      : showClock == "bottom-left"
      ? {
          top: "calc(100% - 1rem)",
          left: "1rem",
          transform: "translate(0, -100%)",
        }
      : showClock == "bottom-right"
      ? {
          top: "calc(100% - 1rem)",
          left: "calc(100% - 1rem)",
          transform: "translate(-100%, -100%)",
        }
      : { opacity: 0, pointerEvents: "none", top: "1rem", left: "1rem" };

  return (
    <div className={s.clock} style={putCSS}>
      {timeStr}
    </div>
  );
}
