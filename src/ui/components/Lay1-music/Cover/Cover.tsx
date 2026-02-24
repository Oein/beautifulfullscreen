import { get } from "../../../../lib/config";
import { useConfigs } from "../../../../lib/useConfig";
import DisplayIcon from "../DisplayIcon";
import style from "./cover.module.css";

export default function Cover() {
  const { React } = Spicetify;
  const classnames = Spicetify.classnames;
  const { useState, useEffect } = React;

  const [heart, setHeart] = useState(Spicetify.Player.getHeart());
  const [imageURL, setImageURL] = useState("");

  const config = useConfigs([
    "verticalMode",
    "showLyrics",
    "withLyricsSizedMusic",
    "fadeAnimation",
  ] as const);

  // Update cover image and heart state on song change
  useEffect(() => {
    if (Spicetify.Player.data) {
      setHeart(Spicetify.Player.getHeart());
      setImageURL(Spicetify.Player.data.item.metadata.image_xlarge_url);
    }

    const onSongChange = ({ data }: any) => {
      setHeart(data.isHearted);
      setImageURL(data.item.metadata.image_xlarge_url);
    };
    Spicetify.Player.addEventListener("songchange", onSongChange);
    return () =>
      Spicetify.Player.removeEventListener("songchange", onSongChange);
  }, []);

  // Poll heart state (Spicetify doesn't have a heart change event)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeart(Spicetify.Player.getHeart());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const isLyricsMode = config.showLyrics || config.withLyricsSizedMusic;

  const toggleHeart = () => {
    Spicetify.Player.toggleHeart();
    setHeart((h: boolean) => !h);
  };

  return (
    <div
      className={classnames(style.coverContainer, isLyricsMode && style.lyrics)}
      style={{ marginBottom: config.verticalMode ? "1.5rem" : "0" }}
    >
      <div className={style.shadow} />
      <div
        style={{ backgroundImage: `url(${imageURL})` }}
        className={classnames(style.cover, config.fadeAnimation && style.fade)}
      />
      <div className={style.likeButton} onClick={toggleHeart}>
        <div style={{ "--color": "#fff" } as React.CSSProperties}>
          <DisplayIcon
            icon={Spicetify.SVGIcons[heart ? "heart-active" : "heart"]}
            size={50}
          />
        </div>
      </div>
    </div>
  );
}
