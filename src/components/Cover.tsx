import CONFIG from "../config";
import DisplayIcon from "./DisplayIcon";
import style from "./cover.module.css";

export default function Cover(props: { imgURL: string }) {
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
      className={
        style.coverContainer +
        " " +
        (CONFIG.get("showLyrics") === true ? style.lyrics : "")
      }
    >
      <div className={style.shadow} />
      <div
        style={{ backgroundImage: `url(${props.imgURL})` }}
        className={
          style.cover + " " + (CONFIG.get("fadeAnimation") ? style.fade : "")
        }
      />
      <div
        className={style.likeButton}
        onClick={() => {
          Spicetify.Player.toggleHeart();
          setHeart((h) => !h);
        }}
      >
        <div>
          <DisplayIcon
            icon={Spicetify.SVGIcons[heart ? "heart-active" : "heart"]}
            size={50}
          />
        </div>
      </div>
    </div>
  );
}
