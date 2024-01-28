import CONFIG from "../config";

export const lyricsSupported = () => {
  return (
    Spicetify.Config?.custom_apps?.includes("lyrics-plus") ||
    !!document.querySelector("a[href='/lyrics-plus']")
  );
};

export const lyricsExsist = () => {
  return lyricsSupported() && CONFIG.get<boolean>("showLyrics") === true;
};
