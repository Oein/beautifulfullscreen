export default function ExternalSupport(props: { open: boolean }) {
  const React = Spicetify.React;

  if (!open) return <></>;
  const styles = [
    `
.lyrics-lyricsContainer-LyricsContainer.fad-enabled .lyrics-lyricsContainer-LyricsLine {
  margin-right: 15px !important;
}`,
  ];
  return (
    <>
      {styles.map((style, index) => (
        <style key={index}>{style}</style>
      ))}
    </>
  );
}
