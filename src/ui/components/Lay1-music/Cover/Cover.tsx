import { addChangeListener, get } from "../../../../lib/config";
import DisplayIcon from "../DisplayIcon";
import style from "./cover.module.css";

export default function Cover() {
  const { React } = Spicetify;
  const names = Spicetify.classnames;
  const { useState, useEffect } = React;
  const [heart, setHeart] = useState(Spicetify.Player.getHeart());
  const [verticalMode, setVerticalMode] = useState(get("verticalMode"));
  const [imageURL, setImageURL] = useState("");
  const [showLyrics, setShowLyrics] = useState(get("showLyrics"));
  const [withLyricsSizedMusic, setWithLyricsSizedMusic] = useState(
    get("withLyricsSizedMusic")
  );

  useEffect(() => {
    if (Spicetify.Player.data) {
      setHeart(Spicetify.Player.getHeart());
      setImageURL(Spicetify.Player.data.item.metadata.image_xlarge_url);
    }

    const update = ({ data }: any) => {
      setHeart(data.isHearted);
      setImageURL(data.item.metadata.image_xlarge_url);
    };
    Spicetify.Player.addEventListener("songchange", update);
    return () => Spicetify.Player.removeEventListener("songchange", update);
  }, []);

  useEffect(() => {
    const inter = setInterval(() => {
      setHeart(Spicetify.Player.getHeart());
    }, 100);
    return () => clearInterval(inter);
  }, []);

  useEffect(() => {
    const rm = [
      addChangeListener("verticalMode", () =>
        setVerticalMode(get("verticalMode"))
      ),
      addChangeListener("showLyrics", () => setShowLyrics(get("showLyrics"))),
      addChangeListener("withLyricsSizedMusic", () =>
        setWithLyricsSizedMusic(get("withLyricsSizedMusic"))
      ),
    ];

    return () => rm.forEach((f) => f());
  }, []);

  return (
    <div
      className={names(
        style.coverContainer,
        showLyrics || withLyricsSizedMusic ? style.lyrics : ""
      )}
      style={{
        marginBottom: verticalMode ? "1.5rem" : "0",
      }}
    >
      <div className={style.shadow} />
      <div
        style={{ backgroundImage: `url(${imageURL})` }}
        className={names(style.cover, get("fadeAnimation") && style.fade)}
      />
      <div
        className={style.likeButton}
        onClick={() => {
          Spicetify.Player.toggleHeart();
          setHeart((h: any) => !h);
        }}
      >
        <div
          style={{
            // @ts-ignore
            "--color": "#fff",
          }}
        >
          <DisplayIcon
            icon={Spicetify.SVGIcons[heart ? "heart-active" : "heart"]}
            size={50}
          />
        </div>
      </div>
    </div>
  );
}
