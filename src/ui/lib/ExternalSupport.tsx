const EXTERNAL_STYLES = [
  `.lyrics-lyricsContainer-LyricsContainer.fad-enabled .lyrics-lyricsContainer-LyricsLine {
  margin-right: 15px !important;
  margin-left: 15px !important;
}`,
] as const;

export default function ExternalSupport({ open }: { open: boolean }) {
  const React = Spicetify.React;
  if (!open) return null;

  return (
    <>
      {EXTERNAL_STYLES.map((css, index) => (
        <style key={index}>{css}</style>
      ))}
    </>
  );
}
