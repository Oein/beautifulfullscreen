let container: HTMLDivElement = document.createElement("div");

import style from "./style.module.css";
import CONFIG, { openConfig } from "./config";
import BackgroundCanvas from "./components/BackgroundCanvas";
import TextData from "./components/TextData";
import Controller from "./components/Controller";
import Cover from "./components/Cover";
import { lyricsExsist } from "./utils/utils";
import { appendUpdateVisual, removeUpdateVisual } from "./updateVisual";
import VolumeController from "./components/VolumeController";
import NextMusic from "./components/NextMusic";

container.className = style.bfs;

function Foreground(props: {
  title: string;
  artist: string;
  coverURL: string;
}) {
  const { React } = Spicetify;
  const { useRef, useEffect } = React;

  const lastApp = useRef<string>("");
  const [showLyrics, setShowLyrics] = React.useState<boolean>(lyricsExsist());
  const [alignMusic, setAlignMusic] = React.useState<string>(
    CONFIG.get<string>("alignMusic") || "center"
  );
  const [verticalMode, setVerticalMode] = React.useState<boolean>(
    CONFIG.get<boolean>("verticalMode") || false
  );
  const [volumeController, setVolumeController] = React.useState<boolean>(
    CONFIG.get<boolean>("enableVolumeController") || false
  );

  function requestLyricsPlus() {
    lastApp.current = Spicetify.Platform.History.location.pathname;
    if (lastApp.current !== "/lyrics-plus") {
      Spicetify.Platform.History.push("/lyrics-plus");
    }
    window.dispatchEvent(new Event("fad-request"));
  }

  const upv = () => {
    setShowLyrics(lyricsExsist());
    setAlignMusic(CONFIG.get<string>("alignMusic") || "center");
    setVerticalMode(CONFIG.get<boolean>("verticalMode") || false);
    setVolumeController(CONFIG.get<boolean>("enableVolumeController") || false);
  };

  useEffect(() => {
    // requestLyricsPlus();
    appendUpdateVisual(upv);
    return () => {
      removeUpdateVisual(upv);
    };
  }, []);

  useEffect(() => {
    if (showLyrics) requestLyricsPlus();
  }, [showLyrics]);

  return (
    <div className={style.foreground}>
      <div
        className={
          style.left +
          " " +
          (showLyrics ? style.showLyrics : "") +
          " " +
          (alignMusic == "right" ? style.alignRight : "") +
          " " +
          (verticalMode ? style.verticalMode : "") +
          " " +
          (alignMusic == "left" ? style.alignLeft : "") +
          " " +
          (volumeController && (showLyrics || alignMusic == "left")
            ? style.volumeController
            : "")
        }
        style={{
          justifyContent:
            alignMusic === "center"
              ? "center"
              : alignMusic === "left"
              ? "start"
              : "end",
        }}
      >
        <Cover imgURL={props.coverURL} />
        <div
          className={
            style.details +
            " " +
            (verticalMode ? style.verticalMode : "") +
            " " +
            (alignMusic == "right" ? style.alignRight : "") +
            " " +
            (alignMusic == "left" ? style.alignLeft : "")
          }
        >
          <TextData title={props.title} artist={props.artist} />
          <Controller />
        </div>
      </div>
      {showLyrics && (
        <div>
          <div
            id="fad-lyrics-plus-container"
            className={style.lyricsPlusContainer}
            style={{
              "--lyrics-color-active": "#ffffff",
              "--lyrics-color-inactive": "#ffffff50",
            }}
          />
        </div>
      )}
    </div>
  );
}

let mountAgain: Function | null = null;

function UI(props: { visible: boolean }) {
  const { React } = Spicetify;
  const { useState, useEffect, useRef } = React;

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverURL, setCoverURL] = useState("");
  const [visible, setVisible] = useState(props.visible);
  const [volumeController, setVolumeController] = useState(
    CONFIG.get<boolean>("enableVolumeController") || false
  );

  const fetchData = () => {
    const meta = Spicetify.Player.data.item.metadata;
    setVolumeController(CONFIG.get<boolean>("enableVolumeController") || false);

    // prepare title
    let rawTitle = meta.title;
    if (CONFIG.get<boolean>("trimTitle")) {
      rawTitle = rawTitle
        .replace(/\(.+?\)/g, "")
        .replace(/\[.+?\]/g, "")
        .replace(/\s\-\s.+?$/, "")
        .replace(/,.+?$/, "")
        .trim();
    }
    setTitle(rawTitle);

    // prepare artist
    let artistName: string;
    if (CONFIG.get<boolean>("showAllArtists")) {
      artistName = Object.keys(meta)
        .filter((key) => key.startsWith("artist_name"))
        .sort()
        .map((key) => (meta as any)[key])
        .join(", ");
    } else {
      artistName = meta.artist_name;
    }
    setArtist(artistName);

    console.log("meta", meta);
    setCoverURL(meta.image_xlarge_url);
  };

  useEffect(() => {
    appendUpdateVisual(fetchData);

    fetchData();
    Spicetify.Player.addEventListener("songchange", fetchData);
    return () => {
      removeUpdateVisual(fetchData);
      Spicetify.Player.removeEventListener("songchange", fetchData);
    };
  }, []);

  useEffect(() => {
    mountAgain = () => {
      setVisible(true);
    };

    return () => {
      mountAgain = null;
    };
  }, []);

  return (
    <div
      className={style.container + " " + (visible ? "" : style.hidden)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openConfig();
      }}
      onDoubleClick={() => {
        setVisible(false);
      }}
    >
      <BackgroundCanvas imgURL={coverURL} />
      <VolumeController enabled={volumeController} />
      <NextMusic />
      <Foreground title={title} artist={artist} coverURL={coverURL} />
    </div>
  );
}

let containerAdded = false;

export function render(justMount?: boolean) {
  if (!containerAdded) {
    document.body.appendChild(container);
    containerAdded = true;
  }

  if (mountAgain) {
    mountAgain();
  } else {
    const { React } = Spicetify;
    Spicetify.ReactDOM.render(
      React.createElement(UI, {
        visible: !justMount,
      }),
      container
    );
  }
}
