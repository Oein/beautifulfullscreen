interface DisplayIconProps {
  icon: string;
  size: number;
}

export default function DisplayIcon({ icon, size }: DisplayIconProps) {
  return Spicetify.React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "var(--color)",
    dangerouslySetInnerHTML: { __html: icon },
  });
}
