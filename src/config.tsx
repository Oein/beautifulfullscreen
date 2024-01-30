import DisplayIcon from "./components/DisplayIcon";
import style from "./config.module.css";
import updateVisual from "./updateVisual";

type FontWeight =
  | "100"
  | "200"
  | "300"
  | "normal"
  | "500"
  | "600"
  | "bold"
  | "800"
  | "900";

type Config = {
  trimTitle: boolean;
  showAllArtists: boolean;
  fadeAnimation: boolean;
  showLyrics: boolean;
  enableProgressbar: boolean;
  enableController: boolean;
  advancedController: boolean;
  enableVolumeController: boolean;
  verticalMode: boolean;
  showNextSong: boolean;
  alignMusic: "left" | "center" | "right";

  titleFontWeight: FontWeight;
  artistFontWeight: FontWeight;
};

class ConfigInstance {
  private _defaultConfig: Config = {
    trimTitle: false,
    showAllArtists: false,
    fadeAnimation: false,
    showLyrics: true,
    enableProgressbar: true,
    enableController: true,
    advancedController: false,
    enableVolumeController: false,
    verticalMode: false,
    showNextSong: false,
    alignMusic: "center",

    titleFontWeight: "normal",
    artistFontWeight: "normal",
  };
  private _config: Config = this._defaultConfig;
  constructor() {
    this.loadConfig();
  }

  public loadConfig() {
    if (Spicetify.LocalStorage.get("extensions.beautifulfullscreen") == null) {
      Spicetify.LocalStorage.set(
        "extensions.beautifulfullscreen",
        JSON.stringify(this._defaultConfig)
      );
    }

    try {
      const loadedConf =
        Spicetify.LocalStorage.get("extensions.beautifulfullscreen") ||
        JSON.stringify(this._defaultConfig);
      this._config = JSON.parse(loadedConf);
    } catch (e) {
      console.error(e);
      this._config = this._defaultConfig;
      Spicetify.LocalStorage.set(
        "extensions.beautifulfullscreen",
        JSON.stringify(this._config)
      );
    }
  }

  public saveConfig() {
    Spicetify.LocalStorage.set(
      "extensions.beautifulfullscreen",
      JSON.stringify(this._config)
    );
  }

  public get<T = Config[keyof Config]>(key: keyof Config): T {
    return this._config[key] as any;
  }

  public set<T = keyof Config>(key: T, value: any): void {
    (this._config as any)[key] = value;
    this.saveConfig();
  }
}

const CONFIG = new ConfigInstance();

export default CONFIG;

function Seperator() {
  const { React } = Spicetify;
  return <div className={style.sep}></div>;
}

function ConfigItem(props: {
  name: string;
  field: keyof Config;
  func?: () => any;
  disabled?: boolean;
}) {
  const { React } = Spicetify;
  const { useState } = React;
  const { name, field, func, disabled } = props;
  const [value, setValue] = useState(CONFIG.get<boolean>(field) || false);
  return (
    <div className={style.configRow}>
      <label className={style.col + " " + style.description}>{name}</label>
      <div className={style.col + " " + style.action}>
        <button
          className={
            style.switch +
            " " +
            (disabled || value == false ? style.disabled : "")
          }
          disabled={disabled}
          onClick={() => {
            setValue((v) => {
              const state = !v;
              CONFIG.set(field, state);
              if (func) func();
              return state;
            });
          }}
        >
          <DisplayIcon icon={Spicetify.SVGIcons.check} size={16} />
        </button>
      </div>
    </div>
  );
}

function SelectConfigItem(props: {
  name: string;
  field: keyof Config;
  options: (string | { name: string; key: string })[];
  func?: () => any;
}) {
  const { React } = Spicetify;
  const { useState } = React;
  const { name, field, func } = props;
  const [value, setValue] = useState(CONFIG.get<string>(field));
  return (
    <div className={style.configRow}>
      <label className={style.col + " " + style.description}>{name}</label>
      <div className={style.col + " " + style.action}>
        <select
          value={value}
          onChange={(e) => {
            setValue(() => {
              const state = e.target.value;
              CONFIG.set(field, state);
              if (func) func();
              return state;
            });
          }}
          className={style.select}
        >
          {props.options.map((option) =>
            typeof option === "string" ? (
              <option value={option}>{option}</option>
            ) : (
              <option value={option.key}>{option.name}</option>
            )
          )}
        </select>
      </div>
    </div>
  );
}

function FontWeightConfig(props: {
  name: string;
  field: keyof Config;
  func?: () => any;
}) {
  const { React } = Spicetify;
  const { useState } = React;
  const { name, field, func } = props;
  const [value, setValue] = useState(CONFIG.get<string>(field));

  const options = [
    "100",
    "200",
    "300",
    "normal",
    "500",
    "600",
    "bold",
    "800",
    "900",
  ];

  return (
    <div className={style.configRow}>
      <label className={style.col + " " + style.description}>{name}</label>
      <div className={style.col + " " + style.action}>
        <select
          value={value}
          onChange={(e) => {
            setValue(() => {
              const state = e.target.value;
              CONFIG.set(field, state);
              if (func) func();
              return state;
            });
          }}
          className={style.select}
        >
          {options.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ConfigView() {
  const { React } = Spicetify;
  return (
    <>
      {/* Processing Part */}
      <ConfigItem name="Trim Title" field="trimTitle" func={updateVisual} />
      <ConfigItem
        name="Show All Artists"
        field="showAllArtists"
        func={updateVisual}
      />
      <ConfigItem
        name="Fade Animation"
        field="fadeAnimation"
        func={updateVisual}
      />

      <Seperator />
      {/* Features Part */}
      <ConfigItem
        name="Enable Progressbar"
        field="enableProgressbar"
        func={updateVisual}
      />
      <ConfigItem
        name="Show Next Song"
        field="showNextSong"
        func={updateVisual}
      />

      <Seperator />
      {/* Controllers Part */}
      <ConfigItem
        name="Enable Volume Controller"
        field="enableVolumeController"
        func={updateVisual}
      />
      <ConfigItem
        name="Enable Controller"
        field="enableController"
        func={updateVisual}
      />
      <ConfigItem
        name="Advanced Controller"
        field="advancedController"
        func={updateVisual}
        disabled={!CONFIG.get("enableController")}
      />

      <Seperator />
      {/* Visual part */}
      <ConfigItem
        name="Vertical Mode"
        field="verticalMode"
        func={updateVisual}
      />
      <ConfigItem name="Show Lyrics" field="showLyrics" func={updateVisual} />

      <Seperator />
      {/* Visual Options */}
      <SelectConfigItem
        name="Align Music"
        field="alignMusic"
        options={["left", "center", "right"]}
        func={updateVisual}
      />
      <FontWeightConfig
        name="Title Font Weight"
        field="titleFontWeight"
        func={updateVisual}
      />
      <FontWeightConfig
        name="Artist Font Weight"
        field="artistFontWeight"
        func={updateVisual}
      />
    </>
  );
}

export function openConfig() {
  const { React } = Spicetify;
  const configContainer = React.createElement(ConfigView);
  Spicetify.PopupModal.display({
    title: "Beautiful Fullscreen",
    content: configContainer as any,
  });
}
