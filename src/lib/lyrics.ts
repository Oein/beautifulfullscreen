import { getGeniusLyrics } from "./lyricsProviders/genius";
import { getLiblrcLyrics } from "./lyricsProviders/liblrc";
import { getNeteaseLyrics } from "./lyricsProviders/netseae";
import { getSpotifyLyrics } from "./lyricsProviders/spotify";

export type TrackInfo = {
  duration: number;
  album: string;
  artist: string;
  title: string;
  uri: string;
};

export function trackInfoFromPlaying() {
  if (!Spicetify.Player.data) {
    return null;
  }
  const track = Spicetify.Player.data.item;
  return {
    duration: track.duration.milliseconds,
    album: track.metadata.album_title,
    artist: track.metadata.artist_name,
    title: track.metadata.title,
    uri: track.uri,
  };
}

export async function getLyrics(trackInfo: TrackInfo) {
  return await getNeteaseLyrics(trackInfo);
}
