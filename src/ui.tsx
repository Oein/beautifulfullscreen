let container: HTMLDivElement = document.createElement("div");

import style from "./style.module.css";
import CONFIG, { Fit50, openConfig } from "./config";
import BackgroundCanvas from "./components/BackgroundCanvas";
import TextData from "./components/TextData";
import Controller from "./components/Controller";
import Cover from "./components/Cover";
import { lyricsExsist } from "./utils/utils";
import { appendUpdateVisual, removeUpdateVisual } from "./updateVisual";
import VolumeController from "./components/VolumeController";
import NextMusic from "./components/NextMusic";
import eventEmitter from "./utils/eventEmitter";
import names from "./utils/classNames";

container.className = style.bfs;
container.id = "bfs-root";

function Foreground(props: {
  title: string;
  artist: string;
  coverURL: string;
  visible: boolean;
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
  const [containerScale, setContainerScale] = React.useState<number>(1);
  const [fit50, setFit50] = React.useState<Fit50>(
    CONFIG.get<Fit50>("fit50Mode") || "When overflow"
  );
  const [transformX, setTransformX] = React.useState<number>(0);
  const mainContainer = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<number>(1);

  Spicetify.Platform.History.listen((location: Location) => {
    lastApp.current = location.pathname;
  });

  function requestLyricsPlus() {
    if (lastApp.current !== "/lyrics-plus") {
      Spicetify.Platform.History.push("/lyrics-plus");
    }
  }

  const upv = () => {
    setShowLyrics(lyricsExsist());
    setAlignMusic(CONFIG.get<string>("alignMusic") || "center");
    setVerticalMode(CONFIG.get<boolean>("verticalMode") || false);
    setVolumeController(CONFIG.get<boolean>("enableVolumeController") || false);
    setFit50(CONFIG.get<Fit50>("fit50Mode") || "When overflow");
  };

  useEffect(() => {
    // requestLyricsPlus();
    appendUpdateVisual(upv);
    return () => {
      removeUpdateVisual(upv);
    };
  }, []);

  const lastApply = useRef<number>(0);
  const applyTimeout = useRef<NodeJS.Timeout | null>(null);
  const finalizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const secondFinalizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const boundTime = 200;
  const finalizeTime = 400;
  const secondFinalizeTime = 1000;

  const resizeApplyer = () => {
    console.log("APPLY!", Date.now() - lastApply.current);
    const fit50 = CONFIG.get<Fit50>("fit50Mode");
    const _50vw = window.innerWidth / 2;
    const nowW = mainContainer.current?.getBoundingClientRect().width || 0;
    const originalWidth = nowW / scaleRef.current;
    const needSclae =
      fit50 == "Disalbed"
        ? 1
        : fit50 == "Always" || originalWidth > _50vw
        ? _50vw / originalWidth
        : 1;
    const needTransform =
      fit50 == "Disalbed"
        ? 0
        : fit50 == "Always" || originalWidth > _50vw
        ? (41 + 32 + 25) * (1 - needSclae)
        : 0;

    scaleRef.current = needSclae;

    console.log(
      "50vw",
      _50vw,
      "nowW",
      nowW,
      "scaleRef",
      scaleRef.current,
      "originalWidth",
      originalWidth,
      "originalScale",
      containerScale,
      "needSclae",
      needSclae
    );

    setContainerScale(needSclae);
    setTransformX(needTransform);
  };

  const setFinalize = () => {
    finalizeTimeout.current = setTimeout(() => {
      resizeApplyer();
      applyTimeout.current = null;
    }, finalizeTime);
    secondFinalizeTimeout.current = setTimeout(() => {
      resizeApplyer();
      applyTimeout.current = null;
      finalizeTimeout.current = null;
    }, secondFinalizeTime);
  };

  const onresize = () => {
    if (
      Date.now() - lastApply.current > boundTime &&
      applyTimeout.current == null
    ) {
      resizeApplyer();
      lastApply.current = Date.now();
      setFinalize();
      return;
    }

    if (applyTimeout.current == null) return;
    clearTimeout(applyTimeout.current);

    if (finalizeTimeout.current != null) clearTimeout(finalizeTimeout.current);
    if (secondFinalizeTimeout.current != null)
      clearTimeout(secondFinalizeTimeout.current);

    applyTimeout.current = setTimeout(() => {
      resizeApplyer();
      applyTimeout.current = null;
    }, boundTime);
    setFinalize();
  };

  useEffect(() => {
    // on mainContainer resize
    const observer = new ResizeObserver(onresize);
    if (mainContainer.current) observer.observe(mainContainer.current);
    return () => {
      if (mainContainer.current) observer.unobserve(mainContainer.current);
    };
  }, []);

  useEffect(() => {
    if (fit50 == "Disalbed") {
      setContainerScale(1);
      scaleRef.current = 1;
      return;
    }
    onresize();
  }, [fit50, showLyrics]);

  useEffect(() => {
    Spicetify.Player.addEventListener("songchange", onresize);
    window.addEventListener("resize", onresize);
    return () => {
      Spicetify.Player.removeEventListener("songchange", onresize);
      window.removeEventListener("resize", onresize);
    };
  }, []);

  useEffect(() => {
    if (!props.visible) return;
    if (!showLyrics) return;
    requestLyricsPlus();
  }, [showLyrics, props.visible]);

  return (
    <div
      className={style.foreground + " " + (showLyrics ? style.showLyrics : "")}
      id="bfs-foreground-container"
    >
      <div
        className={style.lcont + " " + (showLyrics ? style.showLyrics : "")}
        id="bfs-leftside-container"
      >
        <div
          className={names(
            style.left,
            showLyrics && style.showLyrics,
            alignMusic == "right" && style.alignRight,
            verticalMode && style.verticalMode,
            alignMusic == "left" && style.alignLeft,
            volumeController &&
              (showLyrics || alignMusic == "left") &&
              style.volumeController
          )}
          style={{
            justifyContent:
              alignMusic === "center"
                ? "center"
                : alignMusic === "left"
                ? "start"
                : "end",
            transform: `scale(${containerScale}) translateX(${transformX}px)`,
            width: verticalMode ? "unset" : "fit-content",
            maxWidth: "unset",
          }}
          id="bfs-foreground-music-container"
          ref={mainContainer}
        >
          <Cover imgURL={props.coverURL} marginBottom={verticalMode} />
          <div
            className={names(
              style.details,
              verticalMode && style.verticalMode,
              alignMusic == "right" && style.alignRight,
              alignMusic == "left" && style.alignLeft
            )}
            id="bfs-foreground-music-details"
          >
            <TextData
              title={props.title}
              artist={props.artist}
              alignMusic={alignMusic as "right" | "left" | "center"}
            />
            <Controller />
          </div>
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
  const { useState, useEffect } = React;

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverURL, setCoverURL] = useState("");
  const [visible, setVisible] = useState(props.visible);
  const [volumeController, setVolumeController] = useState(
    CONFIG.get<boolean>("enableVolumeController") || false
  );

  const [textColor, setTextColor] = useState("#ffffff");

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

    // console.log("meta", meta);
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

  useEffect(() => {
    eventEmitter.on("textColorChange", setTextColor);
    return () => {
      eventEmitter.off("textColorChange", setTextColor);
    };
  }, []);

  return (
    <div
      className={names(style.container, visible && style.visible)}
      id="bfs-container"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openConfig();
      }}
      onDoubleClick={() => {
        if (CONFIG.get("showLyrics")) Spicetify.Platform.History.goBack();
        setVisible(false);
      }}
      style={{
        color: textColor,
        "--color": textColor,
      }}
    >
      <BackgroundCanvas imgURL={coverURL} />
      <VolumeController enabled={volumeController} visible={visible} />
      <NextMusic />
      <Foreground
        title={title}
        artist={artist}
        coverURL={coverURL}
        visible={visible}
      />
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
