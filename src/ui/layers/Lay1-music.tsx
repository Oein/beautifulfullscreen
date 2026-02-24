import { useConfigs } from "../../lib/useConfig";
import Controller from "../components/Lay1-music/Controller/Controller";
import Cover from "../components/Lay1-music/Cover/Cover";
import TextData from "../components/Lay1-music/Textdata/Textdata";
import VolumeController from "../components/Lay1-music/VolumeController/VolumeController";
import s from "./lay1.module.css";

type FlexAlign = "flex-start" | "flex-end" | "center";

function resolveAlignment(align: string, reverse: boolean): FlexAlign {
  if (reverse) {
    if (align === "left") return "flex-end";
    if (align === "right") return "flex-start";
    return "center";
  }
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  return "center";
}

function resolvePutFlex(put: string): FlexAlign {
  if (put === "right") return "flex-end";
  if (put === "left") return "flex-start";
  return "center";
}

export default function MusicLayer() {
  const React = Spicetify.React;
  const config = useConfigs([
    "putMusic",
    "alignMusic",
    "withLyricsSizedMusic",
    "showLyrics",
    "verticalMode",
    "reverseMusic",
    "volumeController",
  ] as const);

  const isHalfWidth = config.showLyrics || config.withLyricsSizedMusic;
  const width = isHalfWidth ? "50dvw" : "100dvw";
  const putFlexLoc = resolvePutFlex(config.putMusic);

  const putCSS = !isHalfWidth
    ? { left: 0 }
    : config.putMusic === "left"
      ? { left: 0 }
      : config.putMusic === "right"
        ? { left: "50%" }
        : { left: "50%", transform: "translateX(-50%)" };

  const alignCSS = config.verticalMode
    ? { alignItems: "center" as const, justifyContent: "center" as const }
    : {
        justifyContent: resolveAlignment(
          config.alignMusic,
          config.reverseMusic,
        ),
        alignItems: "center" as const,
      };

  const flexDirection = config.verticalMode
    ? ("column" as const)
    : config.reverseMusic
      ? ("row-reverse" as const)
      : ("row" as const);

  const volumePadding = (() => {
    const vc = config.volumeController;
    if (vc === "disable") return "0 40px";
    const volumeOffset = "calc((50px + 32px) / 2 + 24px + 12px)";
    if (config.verticalMode) return `0 ${volumeOffset}`;
    return vc === "left"
      ? `0 40px 0 ${volumeOffset}`
      : `0 ${volumeOffset} 0 40px`;
  })();

  const detailsAlign = config.verticalMode
    ? resolvePutFlex(config.putMusic)
    : resolveAlignment(config.alignMusic, false);

  const detailsTextAlign = config.verticalMode
    ? config.putMusic
    : config.alignMusic;

  return (
    <div>
      <VolumeController />
      <div
        className={s.wrapper}
        style={{ width, justifyContent: putFlexLoc, ...putCSS }}
      >
        <div
          className={s.container}
          style={{
            flexDirection,
            ...alignCSS,
            alignItems: config.verticalMode ? putFlexLoc : "center",
            padding: volumePadding,
          }}
        >
          <Cover />
          <div
            className={s.details}
            style={{
              paddingLeft: config.verticalMode
                ? "0"
                : config.reverseMusic
                  ? "0"
                  : "40px",
              paddingRight: config.verticalMode
                ? "0"
                : config.reverseMusic
                  ? "40px"
                  : "0",
              alignItems: detailsAlign,
              textAlign: detailsTextAlign,
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
