import style from "./progressbar.module.css";

export default function ProgressBar() {
  const { React } = Spicetify;
  const { useState, useEffect, useRef } = React;

  const [value, setValue] = useState(Spicetify.Player.getProgress());
  useEffect(() => {
    const update = ({ data }: any) => setValue(data);
    Spicetify.Player.addEventListener("onprogress", update);
    return () => Spicetify.Player.removeEventListener("onprogress", update);
  });
  const duration = Spicetify.Platform.PlayerAPI._state.duration;

  const mouseDown = useRef(false);
  const [mouseHovered, setMouseHovered] = useState(false);
  const [mouseHoveredT, setMouseHoveredT] = useState(-1);

  const sliderRef = useRef<HTMLDivElement>(null);
  const toSeeked = useRef(-1);
  const seekTimeout = useRef(-1);

  const onClick = (e: any, apply: boolean) => {
    const ect = sliderRef.current;
    if (ect === null) return;
    const rect = (ect as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.right - rect.left;
    const percent = x / w;
    let time = percent * duration;
    if (time < 0) time = 0;
    if (time > duration) time = duration;
    time = Math.floor(time);
    if (apply) {
      toSeeked.current = time;
      setValue(time);
      if (seekTimeout.current === -1) {
        seekTimeout.current = setTimeout(() => {
          Spicetify.Player.seek(toSeeked.current);
          setValue(toSeeked.current);
          seekTimeout.current = -1;
        }, 50) as any;
      }
    } else setMouseHoveredT(time);
  };

  useEffect(() => {
    const mouseUpHandler = () => {
      mouseDown.current = false;
      if (toSeeked.current !== -1) {
        Spicetify.Player.seek(toSeeked.current);
        setValue(toSeeked.current);
        toSeeked.current = -1;
      }
      if (seekTimeout.current !== -1) {
        clearTimeout(seekTimeout.current);
        seekTimeout.current = -1;
      }
    };
    const mouseMoveHandler = (e: MouseEvent) => {
      onClick(e, mouseDown.current);
    };
    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <div className={style.progressBarContainer} id="bfs-progressbar-container">
      <span className={style.eslaped} id="bfs-progressbar-eslaped">
        {Spicetify.Player.formatTime(mouseHovered ? mouseHoveredT : value)}
      </span>
      <div
        className={style.progressBar}
        onClick={(e) => onClick(e, true)}
        onMouseDown={() => (mouseDown.current = true)}
        onMouseEnter={() => {
          setMouseHovered(true);
        }}
        onMouseLeave={() => {
          setMouseHovered(false);
        }}
        ref={sliderRef}
        id="bfs-progressbar-progressbar"
      >
        <div
          className={style.progressBarInner}
          id="bfs-progressbar-progressbar-inner"
          style={{
            width: `${
              ((mouseDown.current ? toSeeked.current : value) / duration) * 100
            }%`,
          }}
        ></div>
      </div>
      <span className={style.duration} id="bfs-progressbar-duration">
        {Spicetify.Player.formatTime(duration)}
      </span>
    </div>
  );
}
