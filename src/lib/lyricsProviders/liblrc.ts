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

export async function getLiblrcLyrics(
  trackInfo: TrackInfo
): Promise<LibLRCResponse | { error: string; uri: string }> {
  const url = new URL("https://lrclib.net/api/get");
  url.searchParams.set("track_name", trackInfo.title);
  url.searchParams.set("artist_name", trackInfo.artist);
  url.searchParams.set("album_name", trackInfo.album);
  url.searchParams.set("duration", String(trackInfo.duration / 1000));

  const response = await fetch(url.toString(), {
    headers: {
      "x-user-agent": `spicetify v${Spicetify.Config.version} (https://github.com/spicetify/cli)`,
    },
  });

  if (response.status !== 200) {
    return { error: "Request error: Track wasn't found", uri: trackInfo.uri };
  }

  return (await response.json()) as LibLRCResponse;
}
