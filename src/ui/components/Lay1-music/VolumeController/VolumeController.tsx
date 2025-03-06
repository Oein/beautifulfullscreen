import { addChangeListener, get } from "../../../../lib/config";
import DisplayIcon from "../DisplayIcon";
import style from "./VolumeController.module.css";

export default function VolumeController() {
  const { React } = Spicetify;
  const { useState, useEffect, useRef } = React;
  const [volume, setVolume] = useState(Spicetify.Player.getVolume());
  const [isMuted, setIsMuted] = useState(Spicetify.Player.getMute());
  const [enabled, setEnabled] = useState(get("volumeController"));
  const mouseDown = useRef(false);

  const sliderRef = useRef(null);

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

  useEffect(
    () =>
      addChangeListener("volumeController", () =>
        setEnabled(get("volumeController"))
      ),
    []
  );

  return (
    <div
      className={
        style.volumeController +
        " " +
        (enabled != "disable" ? style.enabled : "")
      }
      style={{
        ...(enabled == "right"
          ? {
              left: "unset",
              right: "calc((50px + 32px) / 2)",
              transform: "translateY(-50%) translateX(50%)",
            }
          : {}),
      }}
    >
      <span
        className={style.volumeIcon}
        onClick={() => {
          setIsMuted((m: any) => {
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

      <div
        className={style.volumeSlider}
        onClick={onClick as any}
        onMouseDown={() => (mouseDown.current = true)}
        ref={sliderRef}
      >
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
