import DisplayIcon from "./DisplayIcon";
import style from "./VolumeController.module.css";

export default function VolumeController(props: { enabled: boolean }) {
  const { React } = Spicetify;
  const { useState, useEffect } = React;
  const [volume, setVolume] = useState(Spicetify.Player.getVolume());
  const [isMuted, setIsMuted] = useState(Spicetify.Player.getMute());

  const onClick = (e: MouseEvent) => {
    if (e.currentTarget == null) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = (e.currentTarget as HTMLDivElement).clientHeight;
    const volume = 1 - y / height;
    // console.log(y, height);
    Spicetify.Player.setVolume(volume);
    setVolume(volume);
    if (volume === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(Spicetify.Player.getVolume());
      setIsMuted(Spicetify.Player.getMute());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={
        style.volumeController + " " + (props.enabled ? style.enabled : "")
      }
    >
      <span
        className={style.volumeIcon}
        onClick={() => {
          setIsMuted((m) => {
            Spicetify.Player.setMute(!m);
            return !m;
          });
        }}
      >
        <DisplayIcon
          icon={
            isMuted
              ? Spicetify.SVGIcons["volume-off"]
              : volume < 0.1
              ? Spicetify.SVGIcons["volume-one-wave"]
              : volume < 0.5
              ? Spicetify.SVGIcons["volume-two-wave"]
              : Spicetify.SVGIcons["volume"]
          }
          size={24}
        />
      </span>

      <div className={style.volumeSlider} onClick={onClick as any}>
        <div
          className={style.volumeInner}
          style={{
            height: `${volume * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
