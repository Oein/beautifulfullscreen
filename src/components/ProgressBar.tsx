import style from "./progressbar.module.css";

export default function ProgressBar() {
  const { React } = Spicetify;
  const { useState, useEffect } = React;

  const [value, setValue] = useState(Spicetify.Player.getProgress());
  useEffect(() => {
    const update = ({ data }: any) => setValue(data);
    Spicetify.Player.addEventListener("onprogress", update);
    return () => Spicetify.Player.removeEventListener("onprogress", update);
  });
  const duration = Spicetify.Platform.PlayerAPI._state.duration;

  const onClick = (e: any) => {
    const ect = e.currentTarget;
    if (ect === null) return;
    const rect = (ect as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.right - rect.left;
    const percent = x / w;
    const time = percent * duration;
    Spicetify.Player.seek(time);
  };

  return (
    <div className={style.progressBarContainer}>
      <span className={style.eslaped}>
        {Spicetify.Player.formatTime(value)}
      </span>
      <div className={style.progressBar} onClick={onClick}>
        <div
          className={style.progressBarInner}
          style={{
            width: `${(value / duration) * 100}%`,
          }}
        ></div>
      </div>
      <span className={style.duration}>
        {Spicetify.Player.formatTime(duration)}
      </span>
    </div>
  );
}
