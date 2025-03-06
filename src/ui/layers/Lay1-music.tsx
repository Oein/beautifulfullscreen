import { addChangeListener, get } from "../../lib/config";
import Controller from "../components/Lay1-music/Controller/Controller";
import Cover from "../components/Lay1-music/Cover/Cover";
import TextData from "../components/Lay1-music/Textdata/Textdata";
import VolumeController from "../components/Lay1-music/VolumeController/VolumeController";
import s from "./lay1.module.css";

export default function Lay1() {
  const React = Spicetify.React;
  const { useEffect, useState } = React;

  const [putMusic, setPutMusic] = useState(get("putMusic"));
  const [alignMusic, setAlignMusic] = useState(get("alignMusic"));
  const [withLyricsSizedMusic, setWithLyricsSizedMusic] = useState(
    get("withLyricsSizedMusic")
  );
  const [showLyrics, setShowLyrics] = useState(get("showLyrics"));
  const [verticalMode, setVerticalMode] = useState(get("verticalMode"));
  const [reverseMusic, setReverseMusic] = useState(get("reverseMusic"));
  const [enableVolumeController, setEnableVolumeController] = useState(
    get("volumeController")
  );

  useEffect(() => {
    const rm = [
      addChangeListener("putMusic", () => setPutMusic(get("putMusic"))),
      addChangeListener("alignMusic", () => setAlignMusic(get("alignMusic"))),
      addChangeListener("withLyricsSizedMusic", () =>
        setWithLyricsSizedMusic(get("withLyricsSizedMusic"))
      ),
      addChangeListener("showLyrics", () => setShowLyrics(get("showLyrics"))),
      addChangeListener("verticalMode", () =>
        setVerticalMode(get("verticalMode"))
      ),
      addChangeListener("reverseMusic", () =>
        setReverseMusic(get("reverseMusic"))
      ),
      addChangeListener("volumeController", () =>
        setEnableVolumeController(get("volumeController"))
      ),
    ];

    return () => rm.forEach((f) => f());
  }, []);

  const width = showLyrics || withLyricsSizedMusic ? "50dvw" : "100dvw";
  const putCSS =
    width == "100dvw"
      ? { left: 0 }
      : putMusic == "left"
      ? { left: 0 }
      : putMusic == "right"
      ? { left: "50%" }
      : { left: "50%", transform: "translateX(-50%)" };
  const alignCSS = verticalMode
    ? // vertical
      { alignItems: "center", justifyContent: "center" }
    : reverseMusic
    ? // reverse, no vertical
      alignMusic == "left"
      ? { justifyContent: "flex-end", alignItems: "center" }
      : alignMusic == "right"
      ? { justifyContent: "flex-start", alignItems: "center" }
      : { justifyContent: "center", alignItems: "center" }
    : // no reverse, no vertical
    alignMusic == "left"
    ? { justifyContent: "flex-start", alignItems: "center" }
    : alignMusic == "right"
    ? { justifyContent: "flex-end", alignItems: "center" }
    : { justifyContent: "center", alignItems: "center" };
  const flexDirection = verticalMode
    ? "column"
    : reverseMusic
    ? "row-reverse"
    : "row";
  const putFlexLoc =
    putMusic == "right"
      ? "flex-end"
      : putMusic == "left"
      ? "flex-start"
      : "center";

  return (
    <div>
      <VolumeController />
      <div
        className={s.wrapper}
        style={{
          width,
          justifyContent: putFlexLoc,
          ...putCSS,
        }}
      >
        <div
          className={s.container}
          style={{
            flexDirection,
            ...alignCSS,
            alignItems: verticalMode ? putFlexLoc : "center",
            padding:
              enableVolumeController == "disable"
                ? "0 40px"
                : enableVolumeController == "left"
                ? "0 40px 0 calc((50px + 32px) / 2 + 24px + 12px)"
                : "0 calc((50px + 32px) / 2 + 24px + 12px) 0 40px",
          }}
        >
          <Cover />
          <div
            className={s.details}
            style={{
              paddingLeft: verticalMode ? "0" : reverseMusic ? "0" : "40px",
              paddingRight: verticalMode ? "0" : reverseMusic ? "40px" : "0",
              alignItems: verticalMode
                ? putMusic == "right"
                  ? "flex-end"
                  : putMusic == "left"
                  ? "flex-start"
                  : "center"
                : alignMusic == "left"
                ? "flex-start"
                : alignMusic == "right"
                ? "flex-end"
                : "center",
              textAlign: verticalMode ? putMusic : alignMusic,
            }}
          >
            <TextData />
            <Controller />
          </div>
        </div>
      </div>
    </div>
  );
}
