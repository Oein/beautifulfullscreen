import type { TrackInfo } from "../lyrics";

interface Synced {
  startTime: string;
  text: string;
}

interface SpotifyLyrics {
  uri: string;
  karaoke?: any;
  synced?: Synced[];
  unsynced?: Synced[];
  provider: string;
  copyright?: any;
}

export async function getSpotifyLyrics(info: TrackInfo): Promise<
  | SpotifyLyrics
  | {
      error: string;
      uri: string;
    }
> {
  const result = {
    uri: info.uri,
    karaoke: null,
    synced: null,
    unsynced: null,
    provider: "Spotify",
    copyright: null,
  };

  const baseURL = "https://spclient.wg.spotify.com/color-lyrics/v2/track/";
  const id = info.uri.split(":")[2];
  let body;
  try {
    body = await Spicetify.CosmosAsync.get(
      `${baseURL + id}?format=json&vocalRemoval=false&market=from_token`
    );
  } catch {
    return { error: "Request error", uri: info.uri };
  }

  const lyrics = body.lyrics;
  if (!lyrics) {
    return { error: "No lyrics", uri: info.uri };
  }

  const lines = lyrics.lines;
  if (lyrics.syncType === "LINE_SYNCED") {
    result.synced = lines.map((line: any) => ({
      startTime: line.startTimeMs,
      text: line.words,
    }));
    result.unsynced = result.synced;
  } else {
    result.unsynced = lines.map((line: any) => ({
      text: line.words,
    }));
  }

  /**
   * to distinguish it from the existing Musixmatch, the provider will remain as Spotify.
   * if Spotify official lyrics support multiple providers besides Musixmatch in the future, please uncomment the under section. */
  // result.provider = lyrics.provider;

  return result as any;
}
