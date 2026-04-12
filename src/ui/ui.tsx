import type { CSSProperties, MouseEventHandler } from "react";

import BackgroundLayer from "./layers/Lay0-background";
import s from "./ui.module.css";
import ConfigOverlay from "./layers/Ovr0-config";
import MusicLayer from "./layers/Lay1-music";
import LyricsLayer from "./layers/Lay2-lyrics";
import NextMusicLayer from "./layers/Lay3-nextMusic";
import ClockLayer from "./layers/Lay4-clock";
import ExternalSupport from "./lib/ExternalSupport";

export default function UI() {
  const React = Spicetify.React;
  const { useEffect, useState, useRef } = React;

  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [pointerShown, setPointerShown] = useState(true);
  const pointerTimeout = useRef(null as number | null);

  useEffect(() => {
    window.bfsCallback = () => setOpen(window.bfsOpen);
    setOpen(window.bfsOpen);
    window.setBFScolor = (c: string) => setColor(c);
  }, []);

  useEffect(() => {
    if (open) document.documentElement.requestFullscreen();
    if (!open) setConfigOpen(false);
  }, [open]);

  const handleDoubleClick = () => {
    setOpen(false);
    document.exitFullscreen();
  };

  const handleContextMenu: MouseEventHandler = (e) => {
    e.preventDefault();
    setConfigOpen((v) => !v);
  };

  const handlePointerMove = () => {
    setPointerShown(true);
    if (pointerTimeout.current) clearTimeout(pointerTimeout.current);
    pointerTimeout.current = window.setTimeout(() => {
      setPointerShown(false);
    }, 2000);
  };

  return (
    <div
      style={
        {
          transform: `translateY(${open ? "0" : "100"}px)`,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          color,
          cursor: pointerShown ? "default" : "none",
          "--color": color,
        } as CSSProperties
      }
      className={s.bfs}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onPointerMove={handlePointerMove}
    >
      <BackgroundLayer />
      <MusicLayer />
      <LyricsLayer open={open} textColor={color} />
      <NextMusicLayer />
      <ClockLayer />
      <ExternalSupport open={open} />
      {configOpen && (
        <div
          className={s.configModal}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.stopPropagation()}
        >
          <div className={s.configHeader}>
            <span className={s.configTitle}>Config</span>
            <button className={s.configClose} onClick={() => setConfigOpen(false)}>
              ✕
            </button>
          </div>
          <ConfigOverlay />
        </div>
      )}
    </div>
  );
}
