import { addChangeListener, get } from "../../../../lib/config";
import DisplayIcon from "../DisplayIcon";

import style from "./textdata.module.css";

export default function TextData() {
  const { React } = Spicetify;
  const { useState, useEffect } = React;

  const [titleWeight, setTitleWeight] = useState(get("titleFontWeight"));
  const [artistWeight, setArtistWeight] = useState(get("artistFontWeight"));
  const [titleSize, setTitleSize] = useState(get("titleFontSize"));
  const [artistSizeState, setArtistSize] = useState(get("artistFontSize"));
  const [reverse, setReverse] = useState(get("reverseMusic"));
  const [showLyrics, setShowLyrics] = useState(get("showLyrics"));
  const [withLyricsSizedMusic, setWithLyricsSizedMusic] = useState(
    get("withLyricsSizedMusic")
  );
  const [trimTitle, setTrimTitle] = useState(get("trimTitle"));
  const [showAllArtists, setShowAllArtists] = useState(get("showAllArtists"));
  const [verticalMode, setVerticalMode] = useState(get("verticalMode"));

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    const rm = [
      addChangeListener("titleFontWeight", () =>
        setTitleWeight(get("titleFontWeight"))
      ),
      addChangeListener("artistFontWeight", () =>
        setArtistWeight(get("artistFontWeight"))
      ),
      addChangeListener("titleFontSize", () =>
        setTitleSize(get("titleFontSize"))
      ),
      addChangeListener("artistFontSize", () =>
        setArtistSize(get("artistFontSize"))
      ),
      addChangeListener("showLyrics", () => setShowLyrics(get("showLyrics"))),
      addChangeListener("withLyricsSizedMusic", () =>
        setWithLyricsSizedMusic(get("withLyricsSizedMusic"))
      ),
      addChangeListener("trimTitle", () => setTrimTitle(get("trimTitle"))),
      addChangeListener("showAllArtists", () =>
        setShowAllArtists(get("showAllArtists"))
      ),
      addChangeListener("verticalMode", () =>
        setVerticalMode(get("verticalMode"))
      ),
      addChangeListener("reverseMusic", () => setReverse(get("reverseMusic"))),
    ];

    return () => rm.forEach((f) => f());
  }, []);

  const getTitleAndArtistSize = () => {
    const titleText = title.length;
    let size = "87px";
    let artistSize = "32px";
    if (!showLyrics && !withLyricsSizedMusic) {
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

  useEffect(() => {
    const onTrackChange = () => {
      const data = Spicetify.Player.data;
      if (!data) return;
      const meta = data.item.metadata;

      let title = meta.title;

      if (trimTitle) {
        title = title
          .replace(/\(.+?\)/g, "")
          .replace(/\[.+?\]/g, "")
          .replace(/\s\-\s.+?$/, "")
          .replace(/,.+?$/, "")
          .trim();
      }

      setTitle(title);

      let artistName: string;
      if (showAllArtists) {
        artistName = Object.keys(meta)
          .filter((key) => key.startsWith("artist_name"))
          .sort()
          .map((key) => (meta as any)[key])
          .join(", ");
      } else {
        artistName = meta.artist_name;
      }
      setArtist(artistName);
    };

    onTrackChange();
    Spicetify.Player.addEventListener("songchange", onTrackChange);
    return () =>
      Spicetify.Player.removeEventListener("songchange", onTrackChange);
  }, []);

  return (
    <>
      {React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: title,
        },
        className: style.title,
        style: {
          fontSize: getTitleAndArtistSize()[0],
          fontWeight: titleWeight,
        },
      })}
      <div
        className={style.artist}
        style={{
          fontSize: getTitleAndArtistSize()[1],
          fontWeight: artistWeight,
          paddingLeft: verticalMode ? "0" : undefined,
          flexDirection: reverse ? "row-reverse" : "row",
          // @ts-ignore
          "--color": "currentColor",
        }}
      >
        <DisplayIcon
          icon={Spicetify.SVGIcons.artist}
          size={parseInt(getTitleAndArtistSize()[1].replace("px", ""))}
        />
        <span
          className={style.artistSpan}
          style={{
            color: "currentColor",
          }}
        >
          {artist}
        </span>
      </div>
    </>
  );
}
