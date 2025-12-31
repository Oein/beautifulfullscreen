import { useRef, type MouseEventHandler } from "react";

import Lay0 from "./layers/Lay0-background";
import s from "./ui.module.css";
import Ovr0 from "./layers/Ovr0-config";
import Lay1 from "./layers/Lay1-music";
import Lay2 from "./layers/Lay2-lyrics";
import Lay3 from "./layers/Lay3-nextMusic";
import Lay4 from "./layers/Lay4-clock";

export default function UI() {
  const React = Spicetify.React;
  const ReactDOM = Spicetify.ReactDOM;
  const { useEffect, useState } = React;

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [pointerShown, setPointerShown] = useState(true);

  useEffect(() => {
    window.bfsCallback = () => {
      setOpen(window.bfsOpen);
    };
    setOpen(window.bfsOpen);

    window.setBFScolor = (color: string) => {
      setColor(color);
    };
  }, []);

  useEffect(() => {
    if (open) document.documentElement.requestFullscreen();
  }, [open]);

  const doubleClickCallback = () => {
    setOpen(false);
    document.exitFullscreen();
  };
  const oncontextmenu: MouseEventHandler = (e) => {
    e.preventDefault();
    const modalContainer = document.createElement("div");
    ReactDOM.render(React.createElement(Ovr0, {}), modalContainer);

    Spicetify.PopupModal.display({
      title: "Config",
      content: modalContainer,
    });
  };

  const pointerTimeout = useRef<number | null>(null);
  const pointerMove = () => {
    setPointerShown(true);
    if (pointerTimeout.current) {
      clearTimeout(pointerTimeout.current);
    }
    pointerTimeout.current = window.setTimeout(() => {
      setPointerShown(false);
    }, 2000);
  };

  return (
    <div
      style={{
        transform: `translateY(${open ? "0" : "100"}px)`,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        color,
        cursor: pointerShown ? "default" : "none",
        // @ts-ignore
        "--color": color,
      }}
      className={s.bfs}
      onDoubleClick={doubleClickCallback}
      onContextMenu={oncontextmenu}
      onPointerMove={pointerMove}
    >
      <Lay0 />
      <Lay1 />
      <Lay2 open={open} textColor={color} />
      <Lay3 />
      <Lay4 />
    </div>
  );
}
