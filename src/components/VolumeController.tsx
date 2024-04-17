import DisplayIcon from "./DisplayIcon";
import style from "./VolumeController.module.css";

export default function VolumeController(props: {
  enabled: boolean;
  visible: boolean;
}) {
  const { React } = Spicetify;
  const { useState, useEffect, useRef } = React;
  const [volume, setVolume] = useState(Spicetify.Player.getVolume());
  const [isMuted, setIsMuted] = useState(Spicetify.Player.getMute());
  const mouseDown = useRef(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const onClick = (e: MouseEvent) => {
    if (sliderRef.current == null) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = sliderRef.current.clientHeight;
    let volume = 1 - y / height;
    if (volume > 1) volume = 1;
    if (volume < 0) volume = 0;
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

  useEffect(() => {
    const mouseUpListener = () => {
      mouseDown.current = false;
    };
    const mouseMoveListener = (e: MouseEvent) => {
      if (mouseDown.current) onClick(e as any);
    };
    document.addEventListener("mouseup", mouseUpListener);
    document.addEventListener("mousemove", mouseMoveListener);
    return () => {
      document.removeEventListener("mouseup", mouseUpListener);
      document.removeEventListener("mousemove", mouseMoveListener);
    };
  }, []);

  console.log("VolumeController rendered", props.visible);

  return (
    <div
      className={
        style.volumeController +
        " " +
        (props.enabled && props.visible ? style.enabled : "")
      }
      id="bfs-volume-controller-container"
    >
      <span
        className={style.volumeIcon}
        onClick={() => {
          setIsMuted((m) => {
            Spicetify.Player.setMute(!m);
            return !m;
          });
        }}
        id="bfs-volume-icon"
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

      <div
        className={style.volumeSlider}
        onClick={onClick as any}
        onMouseDown={() => (mouseDown.current = true)}
        id="bfs-volume-controller-slider"
        ref={sliderRef}
      >
        <div
          id="bfs-volume-controller-inner"
          className={style.volumeInner}
          style={{
            height: `${volume * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
