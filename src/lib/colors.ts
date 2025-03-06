type RGB = {
  r: number;
  g: number;
  b: number;
};

type Hex = string;

export default function bgrgb2fgcolor(rgb: RGB): Hex {
  const brightness = Math.round(
    (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  );
  // console.log("BRI", brightness);
  return brightness > 195 ? "#3D3D3D" : "#ffffff";
}

export function hex2rgb(hex: Hex): RGB {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgb2hex(rgb: RGB): Hex {
  return (
    "#" +
    ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
  );
}

export function parseHex(hex: string): Hex {
  if (!hex.startsWith("#")) hex = `#${hex}`;
  return hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
}

export function parseRGB(rgb: string): RGB {
  const [r, g, b] = rgb.replace(/[^\d,]/g, "").split(",");
  return {
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b),
  };
}
