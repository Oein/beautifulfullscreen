import style from "./progressbar.module.css";

export default function ProgressBar() {
  const React = Spicetify.React;
  const { useState, useEffect, useRef } = React;

  const [value, setValue] = useState(Spicetify.Player.getProgress());
  const mouseDown = useRef(false);
  const [mouseHovered, setMouseHovered] = useState(false);
  const [mouseHoveredTime, setMouseHoveredTime] = useState(-1);

  const sliderRef = useRef(null as HTMLDivElement | null);
  const pendingSeek = useRef(-1);
  const seekTimeout = useRef(null as ReturnType<typeof setTimeout> | null);

  const duration = Spicetify.Platform.PlayerAPI._state.duration;

  // Subscribe to progress updates
  useEffect(() => {
    const onProgress = (
      e:
        | (Event & {
            data: number;
          })
        | undefined,
    ) => {
      e && setValue(e.data);
    };
    Spicetify.Player.addEventListener("onprogress", onProgress);
    // @ts-ignore -- Spotify's typings are wrong for this event
    return () => Spicetify.Player.removeEventListener("onprogress", onProgress);
  }, []);

  const calculateTime = (e: MouseEvent | React.MouseEvent, apply: boolean) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / (rect.right - rect.left);
    const time = Math.max(
      0,
      Math.min(duration, Math.floor(percent * duration)),
    );

    if (apply) {
      pendingSeek.current = time;
      setValue(time);
      if (!seekTimeout.current) {
        seekTimeout.current = setTimeout(() => {
          Spicetify.Player.seek(pendingSeek.current);
          setValue(pendingSeek.current);
          seekTimeout.current = null;
        }, 50);
      }
    } else {
      setMouseHoveredTime(time);
    }
  };

  // Global mouse listeners for drag behavior
  useEffect(() => {
    const onMouseUp = () => {
      mouseDown.current = false;
      if (pendingSeek.current !== -1) {
        Spicetify.Player.seek(pendingSeek.current);
        setValue(pendingSeek.current);
        pendingSeek.current = -1;
      }
      if (seekTimeout.current) {
        clearTimeout(seekTimeout.current);
        seekTimeout.current = null;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      calculateTime(e, mouseDown.current);
    };

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const displayedValue = mouseDown.current ? pendingSeek.current : value;
  const progressPercent = (displayedValue / duration) * 100;

  return (
    <div className={style.progressBarContainer}>
      <span className={style.elapsed}>
        {Spicetify.Player.formatTime(mouseHovered ? mouseHoveredTime : value)}
      </span>
      <div
        className={style.progressBar}
        onClick={(e) => calculateTime(e as any, true)}
        onMouseDown={() => (mouseDown.current = true)}
        onMouseEnter={() => setMouseHovered(true)}
        onMouseLeave={() => setMouseHovered(false)}
        ref={sliderRef}
      >
        <div
          className={style.progressBarInner}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className={style.duration}>
        {Spicetify.Player.formatTime(duration)}
      </span>
    </div>
  );
}
