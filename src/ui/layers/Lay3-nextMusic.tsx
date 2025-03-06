import { addChangeListener, get } from "../../lib/config";
import style from "./lay3.module.css";

export default function Lay3() {
  const { React } = Spicetify;
  const { useState, useEffect } = React;
  const names = Spicetify.classnames;
  const [nextMusic, setNextMusic] = useState(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(get("showNextSong"));

  const processTitle = (t: string) => {
    if (get("trimTitle"))
      return t
        .replace(/\(.+?\)/g, "")
        .replace(/\[.+?\]/g, "")
        .replace(/\s\-\s.+?$/, "")
        .replace(/,.+?$/, "")
        .trim();
    return t;
  };

  const processArtistName = () => {
    if (
      !nextMusic ||
      !nextMusic.contextTrack ||
      !nextMusic.contextTrack.metadata
    )
      return "";
    const meta = nextMusic.contextTrack.metadata;
    let artistName: string;
    if (get("showAllArtists")) {
      artistName = Object.keys(meta)
        .filter((key) => key.startsWith("artist_name"))
        .sort()
        .map((key) => (meta as any)[key])
        .join(", ");
    } else {
      artistName = meta.artist_name || "";
    }
    return artistName;
  };

  useEffect(() => {
    const rupdate = () => {
      const data = Spicetify.Queue.nextTracks;
      if (data.length === 0) setNextMusic(null);
      else setNextMusic(data[0]);
    };
    const update = () => {
      setTimeout(rupdate, 1000);
    };
    update();
    Spicetify.Player.addEventListener("songchange", update);
    return () => {
      Spicetify.Player.removeEventListener("songchange", update);
    };
  }, []);

  const onProgress = () => {
    const progress = Spicetify.Player.getProgressPercent();
    if (progress > 0.8) setVisible(true);
    else setVisible(false);
  };

  useEffect(() => {
    Spicetify.Player.addEventListener("onprogress", onProgress);
    return () => {
      Spicetify.Player.removeEventListener("onprogress", onProgress);
    };
  }, []);

  useEffect(
    () =>
      addChangeListener("showNextSong", () => setEnabled(get("showNextSong"))),
    []
  );

  return (
    <div
      className={names(style.nextMusic, visible && enabled && style.visible)}
    >
      {!nextMusic ||
      nextMusic.contextTrack == undefined ||
      nextMusic.contextTrack.metadata == undefined ? (
        <></>
      ) : (
        <>
          <div className={style.text}>
            <div className={style.upnext}>Up next</div>
            <div className={style.title}>
              {processTitle(nextMusic.contextTrack.metadata.title || "")}
              {" · "}
              {processArtistName()}
            </div>
          </div>
          <img
            src={nextMusic.contextTrack.metadata.image_xlarge_url}
            className={style.cover}
          />
        </>
      )}
    </div>
  );
}
