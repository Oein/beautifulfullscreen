import CONFIG, { Background } from "../config";
import { appendUpdateVisual, removeUpdateVisual } from "../updateVisual";
import bgrgb2fgcolor, { hex2rgb } from "../utils/color";
import eventEmitter from "../utils/eventEmitter";
import style from "./backgroundcanvas.module.css";

const COLOR_BASED_TYPE = [
  "Deasturated",
  "Light Vibrant",
  "Vibrant",
  "Vibrant non alarming",
  "Prominent",
];

export default function BackgroundCanvas(props: { imgURL: string }) {
  const { React } = Spicetify;
  const { useState, useEffect, useRef } = React;

  const backgroundCanvas = useRef<HTMLCanvasElement>(null);
  const lastURL = useRef<string>("");
  const lastImg = useRef<HTMLImageElement | null>(null);

  const [backgroundColor, setBackgroundColor] = useState<string>("#000000");
  const [backgroundType, setBackgroundType] = useState<Background>(
    CONFIG.get("background") || "Cover"
  );

  const prepareCanvas = () => {
    const canv = backgroundCanvas.current;
    if (!canv) {
      console.error("Failed to get canvas");
      return;
    }
    const { innerWidth: width, innerHeight: height } = window;
    canv.width = width;
    canv.height = height;

    const ctx = canv.getContext("2d");
    if (!ctx) {
      console.error("Failed to get context");
      return;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.filter = "blur(30px) brightness(0.6)";
    const blur = 30;

    const x = -blur * 2;

    let y: number;
    let dim: number;

    if (width > height) {
      dim = width;
      y = x - (width - height) / 2;
    } else {
      dim = height;
      y = x;
    }

    const size = dim + 4 * blur;

    ctx.globalAlpha = 1;

    return { size, x, y, ctx };
  };

  const animateCanvas = (newImg: HTMLImageElement) => {
    let lastImage = (lastImg.current || newImg).cloneNode(
      true
    ) as HTMLImageElement;

    const dt = prepareCanvas();
    if (!dt) return;
    const { size, x, y, ctx } = dt;

    lastImg.current = newImg;

    let factor = 0.0;
    const animate = () => {
      ctx.globalAlpha = 1;
      ctx.drawImage(lastImage, x, y, size, size);
      ctx.globalAlpha = Math.sin((Math.PI / 2) * factor);

      //   console.log("animate", ctx.globalAlpha);
      ctx.drawImage(newImg, x, y, size, size);

      if (factor < 1.0) {
        factor += 0.016;
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const workWithCover = (imgURLX: string) => {
    const img = new Image();
    img.src = imgURLX;
    img.onload = () => {
      eventEmitter.emit("textColorChange", "#ffffff");
      const dt = prepareCanvas();
      if (!dt) return;
      if (CONFIG.get("fadeAnimation")) {
        animateCanvas(img);
      } else {
        const { size, x, y, ctx } = dt;
        ctx.drawImage(img, x, y, size, size);
        lastImg.current = img;
      }
      return;
    };
    img.onerror = (e) => {
      console.error("Failed to load image", e, imgURLX);
    };
  };

  const workWithColors = async (imgURLX: string) => {
    const colors = await Spicetify.colorExtractor(imgURLX);
    let res = "#000000";
    // console.log(backgroundType, colors);
    const cunde = (colors as any).undefined;
    const tx = (k: string) => {
      if (k in colors) return (colors as any)[k];
      return cunde;
    };
    switch (backgroundType) {
      case "Deasturated":
        res = tx("DESATURATED");
        break;
      case "Light Vibrant":
        res = tx("LIGHT_VIBRANT");
        break;
      case "Prominent":
        res = tx("PROMINENT");
        break;
      case "Vibrant":
        res = tx("VIBRANT");
        break;
      case "Vibrant non alarming":
        res = tx("VIBRANT_NON_ALARMING");
        break;
    }

    setBackgroundColor(res);

    eventEmitter.emit("textColorChange", bgrgb2fgcolor(hex2rgb(res)));
  };

  const renderCanvas = (imgURLX: string) => {
    // no need to render again
    if (lastImg.current && lastImg.current.src === imgURLX) return;

    // console.log("Load background image", imgURLX);
    if (!imgURLX.startsWith("spotify")) return;

    if (backgroundType == "Cover") return workWithCover(imgURLX);
    if (COLOR_BASED_TYPE.includes(backgroundType))
      return workWithColors(imgURLX);
  };

  useEffect(() => {
    // console.log("props.imgURL", props.imgURL);
    renderCanvas(props.imgURL);
    lastURL.current = props.imgURL;
  }, [props.imgURL]);

  useEffect(() => {
    let timeo: NodeJS.Timeout | null;
    let lcall = 0;
    const handleResize = () => {
      const now = Date.now();
      if (now - lcall < 50) {
        if (timeo) clearTimeout(timeo);
        timeo = setTimeout(() => {
          renderCanvas(lastURL.current);
          timeo = null;
        }, 50);
      } else {
        renderCanvas(lastURL.current);
      }
      lcall = now;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const upv = () => {
      setBackgroundType(CONFIG.get("background") || "Cover");
    };

    appendUpdateVisual(upv);
    return () => removeUpdateVisual(upv);
  }, []);

  const lastRenderedType = useRef<Background>(backgroundType);

  useEffect(() => {
    if (lastRenderedType.current === backgroundType) return;
    lastRenderedType.current = backgroundType;
    renderCanvas(props.imgURL);
  }, [backgroundType]);

  return (
    <>
      {COLOR_BASED_TYPE.includes(backgroundType) && (
        <div
          style={{
            backgroundColor,
          }}
          className={style.backgroundDiv}
        />
      )}
      {backgroundType == "Cover" && (
        <canvas
          className={style.backgroundCanvas}
          ref={backgroundCanvas}
          id="bfs-background-canvas"
        />
      )}
    </>
  );
}
