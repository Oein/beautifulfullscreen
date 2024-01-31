const DisplayIcon = ({ icon, size }: { icon: string; size: number }) => {
  const { React } = Spicetify;

  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "var(--color)",
    dangerouslySetInnerHTML: {
      __html: icon,
    },
  });
};

export default DisplayIcon;
