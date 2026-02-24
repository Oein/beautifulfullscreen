import { useConfig } from "../../lib/useConfig";
import { getDisplayTitle, getArtistName } from "../../lib/trackUtils";
import { get } from "../../lib/config";
import style from "./lay3.module.css";

export default function NextMusicLayer() {
  const { React } = Spicetify;
  const { useState, useEffect } = React;
  const classnames = Spicetify.classnames;

  const [nextTrack, setNextTrack] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const enabled = useConfig("showNextSong");

  // Listen for song changes and update the next track
  useEffect(() => {
    const updateNextTrack = () => {
      setTimeout(() => {
        const queue = Spicetify.Queue.nextTracks;
        setNextTrack(queue.length > 0 ? queue[0] : null);
      }, 1000);
    };

    updateNextTrack();
    Spicetify.Player.addEventListener("songchange", updateNextTrack);
    return () => {
      Spicetify.Player.removeEventListener("songchange", updateNextTrack);
    };
  }, []);

  // Show the "up next" overlay when progress exceeds 80%
  useEffect(() => {
    const onProgress = () => {
      const progress = Spicetify.Player.getProgressPercent();
      setVisible(progress > 0.8);
    };

    Spicetify.Player.addEventListener("onprogress", onProgress);
    return () => {
      Spicetify.Player.removeEventListener("onprogress", onProgress);
    };
  }, []);

  const metadata = nextTrack?.contextTrack?.metadata;
  if (!metadata) {
    return <div className={classnames(style.nextMusic)} />;
  }

  const title = getDisplayTitle(metadata.title ?? "", get("trimTitle"));
  const artist = getArtistName(metadata, get("showAllArtists"));

  return (
    <div
      className={classnames(
        style.nextMusic,
        visible && enabled && style.visible,
      )}
    >
      <div className={style.text}>
        <div className={style.upnext}>Up next</div>
        <div className={style.title}>
          {title} {" · "} {artist}
        </div>
      </div>
      <img src={metadata.image_xlarge_url} className={style.cover} />
    </div>
  );
}
