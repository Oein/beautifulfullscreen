import type { ChangeEvent } from "react";
import { __defaultConfig__, get, set } from "../../lib/config";
import Checkbox from "../components/Checkbox/Checkbox";
import s from "./ovr0.module.css";

type ConfigKey = keyof typeof __defaultConfig__;

function BooleanOption({ id, name }: { id: ConfigKey; name?: string }) {
  const React = Spicetify.React;
  const { useState } = React;
  const [value, setValue] = useState(get(id) as boolean);
  const label = name ?? id;

  const handleChange = () => {
    const next = !value;
    setValue(next);
    (set as (k: ConfigKey, v: boolean) => void)(id, next);
  };

  return (
    <div className={s.option}>
      <label>{label}</label>
      <Checkbox checked={value} onChange={handleChange} label={label} />
    </div>
  );
}

function SelectOption({
  id,
  name,
  options,
}: {
  id: ConfigKey;
  name?: string;
  options: string[];
}) {
  const React = Spicetify.React;
  const { useState } = React;
  const [value, setValue] = useState(get(id) as string);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    (set as (k: ConfigKey, v: string) => void)(id, e.target.value);
  };

  return (
    <div className={s.option}>
      <div className={s.optname}>{name ?? id}</div>
      <div className={s.selectContainer}>
        <div className={s.selectWrapper}>
          <select value={value} onChange={handleChange} className={s.select}>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function ConfigOverlay() {
  const React = Spicetify.React;
  return (
    <div className={s.container}>
      <div className={s.title + " " + s.nouppad}>UI</div>
      <BooleanOption id="fadeAnimation" name="Fade Animation for background" />
      <BooleanOption id="showLyrics" name="Show lyrics" />
      <BooleanOption id="showNextSong" name="Show next song" />
      <BooleanOption
        id="replaceSpotifyFullscreen"
        name="Replace Spotify fullscreen"
      />

      <SelectOption
        id="background"
        name="Background"
        options={[
          "Cover",
          "Desaturated",
          "Light Vibrant",
          "Vibrant",
          "Vibrant non alarming",
          "Prominent",
        ]}
      />
      <SelectOption
        id="showClock"
        name="Show clock"
        options={[
          "disable",
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
        ]}
      />

      <div className={s.title}>Music viewer</div>
      <BooleanOption id="verticalMode" name="Vertical mode" />
      <BooleanOption id="withLyricsSizedMusic" name="With lyrics sized music" />
      <BooleanOption id="reverseMusic" name="Reverse music" />
      <SelectOption
        id="alignMusic"
        name="Music align"
        options={["left", "center", "right"]}
      />
      <SelectOption
        id="putMusic"
        name="Where to put music"
        options={["left", "center", "right"]}
      />

      <div className={s.title}>Controllers</div>
      <BooleanOption id="enableProgressbar" name="Enable progress bar" />
      <BooleanOption id="enableController" name="Enable controller" />
      <BooleanOption id="advancedController" name="Use advanced controller" />
      <SelectOption
        id="volumeController"
        name="Volume controller"
        options={["left", "disable", "right"]}
      />

      <div className={s.title}>Title</div>
      <BooleanOption id="trimTitle" name="Trim Title" />
      <SelectOption
        id="titleFontWeight"
        name="Title font weight"
        options={[
          "100",
          "200",
          "300",
          "normal",
          "500",
          "600",
          "bold",
          "800",
          "900",
          "950",
        ]}
      />
      <SelectOption
        id="titleFontSize"
        name="Title font size"
        options={[
          "auto",
          "87px",
          "70px",
          "60px",
          "54px",
          "50px",
          "35px",
          "40px",
        ]}
      />

      <div className={s.title}>Artist</div>
      <BooleanOption id="showAllArtists" name="Show All Artists" />
      <SelectOption
        id="artistFontWeight"
        name="Artist font weight"
        options={[
          "100",
          "200",
          "300",
          "normal",
          "500",
          "600",
          "bold",
          "800",
          "900",
          "950",
        ]}
      />
      <SelectOption
        id="artistFontSize"
        name="Artist font size"
        options={["auto", "32px", "31px", "29px", "28px", "26px", "20px"]}
      />

      <div className={s.title}>Miscellaneous</div>
      <BooleanOption id="autoStart" name="Auto start" />

      <div className={s.bottomPad} />
    </div>
  );
}
