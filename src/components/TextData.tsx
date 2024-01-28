import { lyricsExsist } from "../utils/utils";
import DisplayIcon from "./DisplayIcon";

import style from "./textdata.module.css";

export default function TextData(props: { title: string; artist: string }) {
  const { React } = Spicetify;

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
        },
      })}
      <div
        className={style.artist}
        style={{
          fontSize: getTitleAndArtistSize()[1],
        }}
      >
        <DisplayIcon icon={Spicetify.SVGIcons.artist} size={35} />
        <span className={style.artistSpan}>{props.artist}</span>
      </div>
    </>
  );
}
