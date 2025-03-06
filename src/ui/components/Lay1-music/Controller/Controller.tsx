import ButtonIcon from "./ButtonIcon";
import DisplayIcon from "../DisplayIcon";
import ProgressBar from "./ProgressBar";
import style from "./controller.module.css";
import { addChangeListener, get } from "../../../../lib/config";

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
            setShuffle((v: any) => !v);
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
            setRepeat((v: any) => (v + 1) % 3);
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
            setHeart((v: any) => !v);
          }}
        />
      </div>
    </div>
  );
}

export default function Controller() {
  const { React } = Spicetify;
  const { useState, useEffect } = React;
  const names = Spicetify.classnames;

  const [playing, setPlaying] = useState(Spicetify.Player.isPlaying());
  const [useAdvancedController, setUseAdvancedController] = useState(
    get("advancedController")
  );
  useEffect(() => {
    const update = ({ data }: any) => setPlaying(!data.isPaused);
    Spicetify.Player.addEventListener("onplaypause", update);
    return () => Spicetify.Player.removeEventListener("onplaypause", update);
  }, []);

  const [showProgressBar, setShowProgressBar] = useState(
    get("enableProgressbar")
  );
  const [showController, setShowController] = useState(get("enableController"));

  useEffect(() => {
    const update = () => {
      setShowProgressBar(get("enableProgressbar"));
      setShowController(get("enableController"));
      setUseAdvancedController(get("advancedController"));
    };
    addChangeListener("enableProgressbar", update);
    addChangeListener("enableController", update);
    addChangeListener("advancedController", update);
    return () => {
      Spicetify.Player.removeEventListener("enableProgressbar", update);
    };
  }, []);

  return (
    <div
      className={names(
        style.controllerContainer,
        useAdvancedController && style.advanced
      )}
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
