import type { TrackInfo } from "../lyrics";

export interface LibLRCResponse {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics?: string;
  syncedLyrics?: string;
}

export async function getLiblrcLyrics(trackInfo: TrackInfo) {
  const baseURL = "https://lrclib.net/api/get";
  const durr = trackInfo.duration / 1000;
  const params = {
    track_name: trackInfo.title,
    artist_name: trackInfo.artist,
    album_name: trackInfo.album,
    duration: durr,
  };

  const finalURL = `${baseURL}?${Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent((params as any)[key])}`)
    .join("&")}`;

  const body = await fetch(finalURL, {
    headers: {
      "x-user-agent": `spicetify v${Spicetify.Config.version} (https://github.com/spicetify/cli)`,
    },
  });

  if (body.status !== 200) {
    return {
      error: "Request error: Track wasn't found",
      uri: trackInfo.uri,
    };
  }

  return (await body.json()) as LibLRCResponse;
}
