import bgrgb2fgcolor, { hex2rgb } from "../../lib/colors";
import { get } from "../../lib/config";
import { useConfig } from "../../lib/useConfig";
import s from "./lay0.module.css";

type ColorMap = Record<
  | "Desaturated"
  | "Light Vibrant"
  | "Prominent"
  | "Vibrant"
  | "Vibrant non alarming",
  string
>;

const DEFAULT_COLORS: ColorMap = {
  Desaturated: "#000",
  "Light Vibrant": "#000",
  Prominent: "#000",
  Vibrant: "#000",
  "Vibrant non alarming": "#000",
};

const BLUR = 30;

export default function BackgroundLayer() {
  const React = Spicetify.React;
  const { useEffect, useState, useRef } = React;

  const [colors, setColors] = useState<ColorMap>(DEFAULT_COLORS);
  const colorType = useConfig("background");

  const canvasRef = useRef(null as HTMLCanvasElement | null);
  const lastImg = useRef(null as HTMLImageElement | null);
  const lastURL = useRef("");

  // Update text color based on background type
  useEffect(() => {
    try {
      if (colorType !== "Cover") {
        const hexColor = colors[colorType];
        const textColor = bgrgb2fgcolor(hex2rgb(hexColor));
        window?.setBFScolor(textColor);
      } else {
        window?.setBFScolor("#ffffff");
      }
    } catch {
      // Color extraction may fail for some images
    }
  }, [colorType, colors]);

  // Listen for song changes and update cover/colors
  useEffect(() => {
    const onSongChange = async () => {
      if (!Spicetify.Player.data) return;

      const coverURL = Spicetify.Player.data.item.metadata.image_xlarge_url;
      lastURL.current = coverURL;
      drawCover(coverURL);

      const extracted: Record<string, string> =
        await Spicetify.colorExtractor(coverURL);
      setColors({
        Desaturated: extracted.DESATURATED ?? extracted.undefined,
        "Light Vibrant": extracted.LIGHT_VIBRANT ?? extracted.undefined,
        Prominent: extracted.PROMINENT ?? extracted.undefined,
        Vibrant: extracted.VIBRANT ?? extracted.undefined,
        "Vibrant non alarming":
          extracted.VIBRANT_NON_ALARMING ?? extracted.undefined,
      });
    };

    onSongChange();
    Spicetify.Player.addEventListener("songchange", onSongChange);
    return () => {
      Spicetify.Player.removeEventListener("songchange", onSongChange);
    };
  }, []);

  // Redraw canvas on window resize (debounced)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastCall = 0;

    const handleResize = () => {
      const now = Date.now();
      if (now - lastCall < 50) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          drawCover(lastURL.current);
          timeout = null;
        }, 50);
      } else {
        drawCover(lastURL.current);
      }
      lastCall = now;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const { innerWidth: width, innerHeight: height } = window;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = false;
    ctx.filter = `blur(${BLUR}px) brightness(0.6)`;

    const offset = -BLUR * 2;
    const maxDim = Math.max(width, height);
    const y = width > height ? offset - (width - height) / 2 : offset;
    const size = maxDim + 4 * BLUR;

    ctx.globalAlpha = 1;
    return { size, x: offset, y, ctx };
  };

  const animateCanvas = (newImage: HTMLImageElement) => {
    const previousImage = (lastImg.current ?? newImage).cloneNode(
      true,
    ) as HTMLImageElement;
    const prepared = prepareCanvas();
    if (!prepared) return;

    const { size, x, y, ctx } = prepared;
    lastImg.current = newImage;

    let progress = 0;
    const animate = () => {
      ctx.globalAlpha = 1;
      ctx.drawImage(previousImage, x, y, size, size);
      ctx.globalAlpha = Math.sin((Math.PI / 2) * progress);
      ctx.drawImage(newImage, x, y, size, size);

      if (progress < 1) {
        progress += 0.016;
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const drawCover = (coverUrl: string) => {
    if (!coverUrl) return;

    const img = new Image();
    img.src = coverUrl;
    img.onload = () => {
      window?.setBFScolor("#ffffff");
      const prepared = prepareCanvas();
      if (!prepared) return;

      if (get("fadeAnimation")) {
        animateCanvas(img);
      } else {
        const { size, x, y, ctx } = prepared;
        ctx.drawImage(img, x, y, size, size);
        lastImg.current = img;
      }
    };
    img.onerror = (e) => {
      console.error("Failed to load cover image", e, coverUrl);
    };
  };

  const resolvedColorType =
    colorType === "Cover" ? "Vibrant non alarming" : colorType;

  return (
    <div className={s.lay0} style={{ background: colors[resolvedColorType] }}>
      {colorType === "Cover" && <canvas className={s.lay0} ref={canvasRef} />}
    </div>
  );
}
