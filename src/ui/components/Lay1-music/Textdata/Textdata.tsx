import { useConfigs } from "../../../../lib/useConfig";
import { getDisplayTitle, getArtistName } from "../../../../lib/trackUtils";
import DisplayIcon from "../DisplayIcon";
import style from "./textdata.module.css";

function computeFontSizes(
  titleLength: number,
  isLyricsMode: boolean,
  titleSizeOverride: string,
  artistSizeOverride: string,
): [string, string] {
  let titleSize: string;
  let artistSize: string;

  if (!isLyricsMode) {
    if (titleLength > 45) {
      titleSize = "50px";
      artistSize = "26px";
    } else if (titleLength > 35) {
      titleSize = "60px";
      artistSize = "29px";
    } else if (titleLength > 30) {
      titleSize = "70px";
      artistSize = "32px";
    } else {
      titleSize = "87px";
      artistSize = "32px";
    }
  } else {
    if (titleLength > 30) {
      titleSize = "35px";
      artistSize = "20px";
    } else if (titleLength > 20) {
      titleSize = "40px";
      artistSize = "28px";
    } else {
      titleSize = "54px";
      artistSize = "31px";
    }
  }

  if (titleSizeOverride !== "auto") titleSize = titleSizeOverride;
  if (artistSizeOverride !== "auto") artistSize = artistSizeOverride;

  return [titleSize, artistSize];
}

export default function TextData() {
  const React = Spicetify.React;
  const { useState, useEffect } = React;

  const config = useConfigs([
    "titleFontWeight",
    "artistFontWeight",
    "titleFontSize",
    "artistFontSize",
    "reverseMusic",
    "showLyrics",
    "withLyricsSizedMusic",
    "trimTitle",
    "showAllArtists",
    "verticalMode",
  ] as const);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    const onTrackChange = () => {
      const data = Spicetify.Player.data;
      if (!data) return;

      const meta = data.item.metadata;
      setTitle(getDisplayTitle(meta.title, config.trimTitle));
      setArtist(
        getArtistName(meta as Record<string, string>, config.showAllArtists),
      );
    };

    onTrackChange();
    Spicetify.Player.addEventListener("songchange", onTrackChange);
    return () =>
      Spicetify.Player.removeEventListener("songchange", onTrackChange);
  }, [config.trimTitle, config.showAllArtists]);

  const isLyricsMode = config.showLyrics || config.withLyricsSizedMusic;
  const [titleFontSize, artistFontSize] = computeFontSizes(
    title.length,
    isLyricsMode,
    config.titleFontSize,
    config.artistFontSize,
  );
  const artistIconSize = parseInt(artistFontSize.replace("px", ""), 10);

  return (
    <>
      {Spicetify.React.createElement("div", {
        dangerouslySetInnerHTML: { __html: title },
        className: style.title,
        style: {
          fontSize: titleFontSize,
          fontWeight: config.titleFontWeight,
        },
      })}
      <div
        className={style.artist}
        style={
          {
            fontSize: artistFontSize,
            fontWeight: config.artistFontWeight,
            paddingLeft: config.verticalMode ? "0" : undefined,
            flexDirection: config.reverseMusic ? "row-reverse" : "row",
            "--color": "currentColor",
          } as React.CSSProperties
        }
      >
        <DisplayIcon icon={Spicetify.SVGIcons.artist} size={artistIconSize} />
        <span className={style.artistSpan} style={{ color: "currentColor" }}>
          {artist}
        </span>
      </div>
    </>
  );
}
