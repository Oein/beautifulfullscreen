import CONFIG from "../config";
import names from "../utils/classNames";
import DisplayIcon from "./DisplayIcon";
import style from "./cover.module.css";

export default function Cover(props: {
  imgURL: string;
  marginBottom: boolean;
}) {
  const { React } = Spicetify;
  const { useState, useEffect } = React;
  const [heart, setHeart] = useState(Spicetify.Player.getHeart());

  useEffect(() => {
    const update = ({ data }: any) => setHeart(data.isHearted);
    Spicetify.Player.addEventListener("songchange", update);
    return () => Spicetify.Player.removeEventListener("songchange", update);
  }, []);

  useEffect(() => {
    const inter = setInterval(() => {
      setHeart(Spicetify.Player.getHeart());
    }, 100);
    return () => clearInterval(inter);
  }, []);

  return (
    <div
      className={names(
        style.coverContainer,
        CONFIG.get("showLyrics") === true && style.lyrics
      )}
      id="bfs-cover-container"
      style={{
        marginBottom: props.marginBottom ? "1.5rem" : "0",
      }}
    >
      <div className={style.shadow} id="bfs-cover-shadow" />
      <div
        style={{ backgroundImage: `url(${props.imgURL})` }}
        className={names(
          style.cover,
          CONFIG.get("fadeAnimation") && style.fade
        )}
        id="bfs-cover"
      />
      <div
        className={style.likeButton}
        onClick={() => {
          Spicetify.Player.toggleHeart();
          setHeart((h) => !h);
        }}
        id="bfs-like-button-container"
      >
        <div id="bfs-like-button">
          <DisplayIcon
            icon={Spicetify.SVGIcons[heart ? "heart-active" : "heart"]}
            size={50}
          />
        </div>
      </div>
    </div>
  );
}
