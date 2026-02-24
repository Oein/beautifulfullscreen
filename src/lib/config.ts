// export type Fit50 = "Disabled" | "When overflow" | "Always";
export type ArtistFontSize =
  | "auto"
  | "32px"
  | "31px"
  | "29px"
  | "28px"
  | "26px"
  | "20px";
export type TitleFontSize =
  | "auto"
  | "87px"
  | "70px"
  | "60px"
  | "54px"
  | "50px"
  | "35px"
  | "40px";
export type FontWeight =
  | "100"
  | "200"
  | "300"
  | "normal"
  | "500"
  | "600"
  | "bold"
  | "800"
  | "900"
  | "950";
export type Background =
  | "Cover"
  | "Desaturated"
  | "Light Vibrant"
  | "Vibrant"
  | "Vibrant non alarming"
  | "Prominent";
export type AlignMusic = "left" | "center" | "right";
export type VolumeController = "left" | "disable" | "right";
export type ScreenBorders =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const STORAGE_KEY = "beautiful-fullscreen";

export const __defaultConfig__ = {
  trimTitle: false,
  showAllArtists: false,
  fadeAnimation: false,
  showLyrics: true,
  enableProgressbar: true,
  enableController: true,
  advancedController: false,
  volumeController: "disable" as VolumeController,
  verticalMode: false,
  showNextSong: false,
  withLyricsSizedMusic: false,

  reverseMusic: false,
  alignMusic: "center" as AlignMusic,
  putMusic: "center" as AlignMusic,
  background: "Cover" as Background,

  titleFontWeight: "normal" as FontWeight,
  titleFontSize: "auto" as TitleFontSize,
  artistFontWeight: "normal" as FontWeight,
  artistFontSize: "auto" as ArtistFontSize,
  showClock: "disable" as ScreenBorders | "disable",
  replaceSpotifyFullscreen: false,
  autoStart: false,
} as const;

type Config = { -readonly [K in keyof typeof __defaultConfig__]: (typeof __defaultConfig__)[K] };

let config: Config = { ...__defaultConfig__ };

export function loadConfig(): void {
  let saved = Spicetify.LocalStorage.get(STORAGE_KEY);
  if (typeof saved !== "string") {
    Spicetify.LocalStorage.set(STORAGE_KEY, JSON.stringify(config));
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    config = { ...__defaultConfig__, ...parsed };
  } catch {
    config = { ...__defaultConfig__ };
  }
}

const changeListeners: Partial<
  Record<keyof typeof __defaultConfig__, (() => void)[]>
> = {};

export function addChangeListener<K extends keyof typeof __defaultConfig__>(
  key: K,
  callback: () => void
): () => void {
  if (!changeListeners[key]) changeListeners[key] = [];
  changeListeners[key]!.push(callback);

  return () => {
    changeListeners[key] = changeListeners[key]!.filter((cb) => cb !== callback);
  };
}

export function get<K extends keyof typeof __defaultConfig__>(
  key: K
): (typeof __defaultConfig__)[K] {
  return config[key];
}

export function set<K extends keyof typeof __defaultConfig__>(
  key: K,
  value: (typeof __defaultConfig__)[K]
): void {
  config[key] = value;
  Spicetify.LocalStorage.set(STORAGE_KEY, JSON.stringify(config));
  changeListeners[key]?.forEach((cb) => cb());
}
