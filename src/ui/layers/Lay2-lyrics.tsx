import { addChangeListener, get } from "../../lib/config";
import s from "./lay2.module.css";

export default function Lay2(props: { open: boolean; textColor: string }) {
  const React = Spicetify.React;
  const { useEffect, useState, useRef } = React;

  const [putMusic, setPutMusic] = useState(get("putMusic"));
  const [showLyrics, setShowLyrics] = useState(get("showLyrics"));
  const [verticalMode, setVerticalMode] = useState(get("verticalMode"));

  useEffect(() => {
    const rm = [
      addChangeListener("putMusic", () => setPutMusic(get("putMusic"))),
      addChangeListener("showLyrics", () => setShowLyrics(get("showLyrics"))),
      addChangeListener("verticalMode", () =>
        setVerticalMode(get("verticalMode"))
      ),
    ];

    return () => rm.forEach((f) => f());
  }, []);

  const lastApp = useRef("");

  const checkLyricsPlus = () => {
    return (
      Spicetify.Config?.custom_apps?.includes("lyrics-plus") ||
      !!document.querySelector("a[href='/lyrics-plus']")
    );
  };
  const requestLyricsPlus = () => {
    if (get("showLyrics") && checkLyricsPlus()) {
      lastApp.current = Spicetify.Platform.History.location.pathname;
      if (lastApp.current !== "/lyrics-plus") {
        Spicetify.Platform.History.push("/lyrics-plus");
      }
      window.dispatchEvent(new Event("fad-request"));
    }
  };

  useEffect(() => {
    if (props.open) {
      requestLyricsPlus();
      return;
    }

    if (lastApp.current && lastApp.current !== "/lyrics-plus") {
      Spicetify.Platform.History.push(lastApp.current);
      window.dispatchEvent(new Event("fad-request"));
    }
  }, [props.open]);

  return (
    props.open &&
    showLyrics &&
    (verticalMode ? putMusic != "center" : true) && (
      <div
        style={{
          // @ts-ignore
          "--color": "#fff",

          // @ts-ignore
          "--lyrics-color-active": props.textColor,
          // @ts-ignore
          "--lyrics-color-inactive": props.textColor + "50",

          left:
            putMusic == "left" ? "50%" : putMusic == "right" ? "0px" : "unset",
          opacity: putMusic == "center" ? 0 : 1,
          pointerEvents: putMusic == "center" ? "none" : "auto",
        }}
        className={s.container}
        id="fad-lyrics-plus-container"
      ></div>
    )
  );
}
