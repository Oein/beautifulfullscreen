import CONFIG from "../config";
import { appendUpdateVisual, removeUpdateVisual } from "../updateVisual";
import names from "../utils/classNames";
import ButtonIcon from "./ButtonIcon";
import DisplayIcon from "./DisplayIcon";
import ProgressBar from "./ProgressBar";
import style from "./controller.module.css";

function SimpleController(props: { playing: boolean }) {
  const { React } = Spicetify;
  return (
    <div className={style.playpause}>
      <ButtonIcon
        icon={Spicetify.SVGIcons["skip-back"]}
        onClick={Spicetify.Player.back}
      />
      <ButtonIcon
        icon={
          props.playing ? Spicetify.SVGIcons.pause : Spicetify.SVGIcons.play
        }
        onClick={Spicetify.Player.togglePlay}
      />
      <ButtonIcon
        icon={Spicetify.SVGIcons["skip-forward"]}
        onClick={Spicetify.Player.next}
      />
    </div>
  );
}

function OnOffIconButton(props: {
  icon: string;
  onClick: () => any;
  enabled?: boolean;
}) {
  const { React } = Spicetify;
  return (
    <button
      className={style.onoffbtn + " " + (props.enabled ? "" : style.disabled)}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick();
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <DisplayIcon icon={props.icon} size={20} />
    </button>
  );
}

function AdvancedController(props: { playing: boolean }) {
  const { React } = Spicetify;
  const { useState, useEffect } = React;
  const [shuffle, setShuffle] = useState(Spicetify.Player.getShuffle());
  const [repeat, setRepeat] = useState(Spicetify.Player.getRepeat());
  const [heart, setHeart] = useState(Spicetify.Player.getHeart());

  useEffect(() => {
    const inter = setInterval(() => {
      setShuffle(Spicetify.Player.getShuffle());
      setRepeat(Spicetify.Player.getRepeat());
      setHeart(Spicetify.Player.getHeart());
    }, 100);
    return () => clearInterval(inter);
  }, []);

  return (
    <div className={style.advancedController}>
      <div className={style.lefta}>
        <OnOffIconButton
          icon={Spicetify.SVGIcons.shuffle}
          onClick={() => {
            Spicetify.Player.toggleShuffle();
            setShuffle((v) => !v);
          }}
          enabled={shuffle}
        />
        <OnOffIconButton
          icon={
            repeat == 2
              ? Spicetify.SVGIcons["repeat-once"]
              : Spicetify.SVGIcons["repeat"]
          }
          onClick={() => {
            Spicetify.Player.toggleRepeat();
            setRepeat((v) => (v + 1) % 3);
          }}
          enabled={repeat > 0}
        />
      </div>
      <div className={style.centera}>
        <SimpleController playing={props.playing} />
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
            setHeart((v) => !v);
          }}
        />
      </div>
    </div>
  );
}

export default function Controller() {
  const { React } = Spicetify;
  const { useState, useEffect } = React;

  const [playing, setPlaying] = useState(Spicetify.Player.isPlaying());
  const [useAdvancedController, setUseAdvancedController] = useState(
    CONFIG.get<boolean>("advancedController") || false
  );
  useEffect(() => {
    const update = ({ data }: any) => setPlaying(!data.isPaused);
    Spicetify.Player.addEventListener("onplaypause", update);
    return () => Spicetify.Player.removeEventListener("onplaypause", update);
  }, []);

  const [showProgressBar, setShowProgressBar] = useState(
    CONFIG.get<boolean>("enableProgressbar")
  );
  const [showController, setShowController] = useState(
    CONFIG.get<boolean>("enableController")
  );

  const upv = () => {
    setShowProgressBar(CONFIG.get<boolean>("enableProgressbar") || false);
    setShowController(CONFIG.get<boolean>("enableController") || false);
    setUseAdvancedController(
      CONFIG.get<boolean>("advancedController") || false
    );
  };

  useEffect(() => {
    appendUpdateVisual(upv);
    return () => {
      removeUpdateVisual(upv);
    };
  }, []);

  return (
    <div
      className={names(
        style.controllerContainer,
        useAdvancedController && style.advanced
      )}
      id="bfs-controller-container"
      x-type={useAdvancedController ? "advanced" : "simple"}
    >
      {showController &&
        (useAdvancedController ? (
          <AdvancedController playing={playing} />
        ) : (
          <SimpleController playing={playing} />
        ))}
      {showProgressBar && <ProgressBar />}
    </div>
  );
}
