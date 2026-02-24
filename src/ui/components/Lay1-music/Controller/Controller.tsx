import { useConfigs } from "../../../../lib/useConfig";
import ButtonIcon from "./ButtonIcon";
import DisplayIcon from "../DisplayIcon";
import ProgressBar from "./ProgressBar";
import style from "./controller.module.css";

function SimpleController({ playing }: { playing: boolean }) {
  const React = Spicetify.React;
  return (
    <div className={style.playpause}>
      <ButtonIcon
        icon={Spicetify.SVGIcons["skip-back"]}
        onClick={Spicetify.Player.back}
      />
      <ButtonIcon
        icon={playing ? Spicetify.SVGIcons.pause : Spicetify.SVGIcons.play}
        onClick={Spicetify.Player.togglePlay}
      />
      <ButtonIcon
        icon={Spicetify.SVGIcons["skip-forward"]}
        onClick={Spicetify.Player.next}
      />
    </div>
  );
}

function OnOffIconButton({
  icon,
  onClick,
  enabled = true,
}: {
  icon: string;
  onClick: () => void;
  enabled?: boolean;
}) {
  const React = Spicetify.React;
  return (
    <button
      className={`${style.onoffbtn} ${enabled ? "" : style.disabled}`}
      onClick={(e) => {
        onClick();
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <DisplayIcon icon={icon} size={20} />
    </button>
  );
}

function AdvancedController({ playing }: { playing: boolean }) {
  const React = Spicetify.React;
  const { useState, useEffect } = React;

  const [shuffle, setShuffle] = useState(Spicetify.Player.getShuffle());
  const [repeat, setRepeat] = useState(Spicetify.Player.getRepeat());
  const [heart, setHeart] = useState(Spicetify.Player.getHeart());

  useEffect(() => {
    const interval = setInterval(() => {
      setShuffle(Spicetify.Player.getShuffle());
      setRepeat(Spicetify.Player.getRepeat());
      setHeart(Spicetify.Player.getHeart());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={style.advancedController}>
      <div className={style.lefta}>
        <OnOffIconButton
          icon={Spicetify.SVGIcons.shuffle}
          onClick={() => {
            Spicetify.Player.toggleShuffle();
            setShuffle((v: boolean) => !v);
          }}
          enabled={shuffle}
        />
        <OnOffIconButton
          icon={
            repeat === 2
              ? Spicetify.SVGIcons["repeat-once"]
              : Spicetify.SVGIcons["repeat"]
          }
          onClick={() => {
            Spicetify.Player.toggleRepeat();
            setRepeat((v: number) => (v + 1) % 3);
          }}
          enabled={repeat > 0}
        />
      </div>
      <div className={style.centera}>
        <SimpleController playing={playing} />
      </div>
      <div className={style.righta}>
        <ButtonIcon
          icon={
            heart
              ? Spicetify.SVGIcons["heart-active"]
              : Spicetify.SVGIcons.heart
          }
          onClick={() => {
            Spicetify.Player.toggleHeart();
            setHeart((v: boolean) => !v);
          }}
        />
      </div>
    </div>
  );
}

export default function Controller() {
  const React = Spicetify.React;
  const { useState, useEffect } = React;
  const classnames = Spicetify.classnames;

  const [playing, setPlaying] = useState(Spicetify.Player.isPlaying());

  const config = useConfigs([
    "enableProgressbar",
    "enableController",
    "advancedController",
  ] as const);

  useEffect(() => {
    const onPlayPause = ({ data }: any) => setPlaying(!data.isPaused);
    Spicetify.Player.addEventListener("onplaypause", onPlayPause);
    return () =>
      Spicetify.Player.removeEventListener("onplaypause", onPlayPause);
  }, []);

  return (
    <div
      className={classnames(
        style.controllerContainer,
        config.advancedController && style.advanced,
      )}
      x-type={config.advancedController ? "advanced" : "simple"}
    >
      {config.enableController &&
        (config.advancedController ? (
          <AdvancedController playing={playing} />
        ) : (
          <SimpleController playing={playing} />
        ))}
      {config.enableProgressbar && <ProgressBar />}
    </div>
  );
}
