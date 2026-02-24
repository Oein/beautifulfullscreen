import type { CSSProperties } from "react";
import { useConfigs } from "../../lib/useConfig";
import s from "./lay2.module.css";

interface LyricsLayerProps {
  open: boolean;
  textColor: string;
}

function hasLyricsPlusApp(): boolean {
  return (
    Spicetify.Config?.custom_apps?.includes("lyrics-plus") ||
    Spicetify.Config?.custom_apps?.includes("ivLyrics") ||
    !!document.querySelector("a[href='/lyrics-plus']")
  );
}

function getLyricsPlusContainerId(): string {
  if (Spicetify.Config?.custom_apps?.includes("ivLyrics"))
    return "fad-ivLyrics-container";
  return "fad-lyrics-plus-container";
}

function getLyricsPlusPath(): string {
  if (Spicetify.Config?.custom_apps?.includes("ivLyrics")) return "/ivLyrics";
  return "/lyrics-plus";
}

export default function LyricsLayer({ open, textColor }: LyricsLayerProps) {
  const React = Spicetify.React;
  const { useEffect, useRef } = React;

  const { putMusic, showLyrics, verticalMode } = useConfigs([
    "putMusic",
    "showLyrics",
    "verticalMode",
  ] as const);

  const lastApp = useRef("");

  const requestLyricsPlus = () => {
    if (showLyrics && hasLyricsPlusApp()) {
      lastApp.current = Spicetify.Platform.History.location.pathname;
      if (lastApp.current !== getLyricsPlusPath()) {
        Spicetify.Platform.History.push(getLyricsPlusPath());
      }
      window.dispatchEvent(new Event("fad-request"));
    }
  };

  useEffect(() => {
    if (open) {
      requestLyricsPlus();
      return;
    }

    if (lastApp.current && lastApp.current !== "/lyrics-plus") {
      Spicetify.Platform.History.push(lastApp.current);
      window.dispatchEvent(new Event("fad-request"));
    }
  }, [open, putMusic, showLyrics]);

  const isHidden = verticalMode && putMusic === "center";
  if (!open || !showLyrics || isHidden) return null;

  const leftPosition =
    putMusic === "left" ? "50%" : putMusic === "right" ? "0px" : "unset";

  return (
    <div className={s.container} style={{ left: leftPosition }}>
      <div
        style={
          {
            "--color": "#fff",
            "--lyrics-color-active": textColor,
            "--lyrics-color-inactive": `${textColor}50`,
            opacity: putMusic === "center" ? 0 : 1,
            pointerEvents: putMusic === "center" ? "none" : "auto",
          } as CSSProperties
        }
        id={getLyricsPlusContainerId()}
        data-fad-lyrics
      />
    </div>
  );
}
