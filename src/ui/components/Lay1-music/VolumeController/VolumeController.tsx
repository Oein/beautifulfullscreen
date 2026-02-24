import { useConfig } from "../../../../lib/useConfig";
import DisplayIcon from "../DisplayIcon";
import style from "./VolumeController.module.css";

function getVolumeIcon(volume: number, isMuted: boolean): string {
  if (isMuted) return Spicetify.SVGIcons["volume-off"];
  if (volume < 0.1) return Spicetify.SVGIcons["volume-one-wave"];
  if (volume < 0.5) return Spicetify.SVGIcons["volume-two-wave"];
  return Spicetify.SVGIcons["volume"];
}

export default function VolumeController() {
  const React = Spicetify.React;
  const { useState, useEffect, useRef } = React;

  const [volume, setVolume] = useState(Spicetify.Player.getVolume());
  const [isMuted, setIsMuted] = useState(Spicetify.Player.getMute());
  const enabled = useConfig("volumeController");
  const mouseDown = useRef(false);
  const sliderRef = useRef(null as HTMLDivElement | null);

  const handleSliderClick = (e: MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let newVolume = 1 - y / slider.clientHeight;
    newVolume = Math.max(0, Math.min(1, newVolume));

    Spicetify.Player.setVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Poll volume/mute state
  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(Spicetify.Player.getVolume());
      setIsMuted(Spicetify.Player.getMute());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Global mouse listeners for drag behavior
  useEffect(() => {
    const onMouseUp = () => {
      mouseDown.current = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (mouseDown.current) handleSliderClick(e);
    };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((m: boolean) => {
      Spicetify.Player.setMute(!m);
      return !m;
    });
  };

  const isEnabled = enabled !== "disable";
  const positionStyle =
    enabled === "right"
      ? {
          left: "unset",
          right: "calc((50px + 32px) / 2)",
          transform: "translateY(-50%) translateX(50%)",
        }
      : {};

  return (
    <div
      className={`${style.volumeController} ${isEnabled ? style.enabled : ""}`}
      style={positionStyle}
    >
      <span className={style.volumeIcon} onClick={toggleMute}>
        <DisplayIcon icon={getVolumeIcon(volume, isMuted)} size={24} />
      </span>

      <div
        className={style.volumeSlider}
        onClick={handleSliderClick as any}
        onMouseDown={() => (mouseDown.current = true)}
        ref={sliderRef}
      >
        <div
          className={style.volumeInner}
          style={{ height: `${volume * 100}%` }}
        />
      </div>
    </div>
  );
}
