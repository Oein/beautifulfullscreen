import CONFIG from "../config";
import { appendUpdateVisual, removeUpdateVisual } from "../updateVisual";
import eventEmitter from "../utils/eventEmitter";
import { lyricsExsist } from "../utils/utils";
import DisplayIcon from "./DisplayIcon";

import style from "./textdata.module.css";

export default function TextData(props: {
  title: string;
  artist: string;
  alignMusic: "left" | "center" | "right";
}) {
  const { React } = Spicetify;
  const { useState, useEffect } = React;

  const [titleWeight, setTitleWeight] = useState<string>(
    CONFIG.get<string>("titleFontWeight") || "normal"
  );
  const [artistWeight, setArtistWeight] = useState<string>(
    CONFIG.get<string>("artistFontWeight") || "normal"
  );
  const [titleSize, setTitleSize] = useState<string>(
    CONFIG.get<string>("titleFontSize") || "auto"
  );
  const [artistSizeState, setArtistSize] = useState<string>(
    CONFIG.get<string>("artistFontSize") || "auto"
  );
  const [textColor, setTextColor] = useState("#ffffff");

  const upv = () => {
    setTitleWeight(CONFIG.get<string>("titleFontWeight") || "normal");
    setArtistWeight(CONFIG.get<string>("artistFontWeight") || "normal");
    setTitleSize(CONFIG.get<string>("titleFontSize") || "auto");
    setArtistSize(CONFIG.get<string>("artistFontSize") || "auto");
  };

  useEffect(() => {
    appendUpdateVisual(upv);
    eventEmitter.on("textColorChange", setTextColor);
    return () => {
      removeUpdateVisual(upv);
      eventEmitter.off("textColorChange", setTextColor);
    };
  }, []);

  const getTitleAndArtistSize = () => {
    const titleText = props.title.length;
    let size = "87px";
    let artistSize = "32px";
    if (!lyricsExsist()) {
      if (titleText > 45) {
        size = "50px";
        artistSize = "26px";
      } else if (titleText > 35) {
        size = "60px";
        artistSize = "29px";
      } else if (titleText > 30) {
        size = "70px";
      }
    } else {
      size = "54px";
      artistSize = "31px";
      if (titleText > 30) {
        size = "35px";
        artistSize = "20px";
      } else if (titleText > 20) {
        size = "40px";
        artistSize = "28px";
      }
    }

    if (titleSize !== "auto") {
      size = titleSize;
    }
    if (artistSizeState !== "auto") {
      artistSize = artistSizeState;
    }

    return [size, artistSize];
  };

  return (
    <>
      {React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: props.title,
        },
        className: style.title,
        style: {
          fontSize: getTitleAndArtistSize()[0],
          fontWeight: titleWeight,
          color: textColor,
          textAlign: props.alignMusic,
        },
        id: "bfs-title",
      })}
      <div
        className={style.artist}
        style={{
          fontSize: getTitleAndArtistSize()[1],
          fontWeight: artistWeight,
        }}
        id="bfs-artist-container"
      >
        <DisplayIcon
          icon={Spicetify.SVGIcons.artist}
          size={parseInt(getTitleAndArtistSize()[1].replace("px", ""))}
        />
        <span
          className={style.artistSpan}
          id="bfs-artist"
          style={{
            color: textColor,
          }}
        >
          {props.artist}
        </span>
      </div>
    </>
  );
}
