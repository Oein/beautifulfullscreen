import bgrgb2fgcolor, { hex2rgb } from "../../lib/colors";
import { addChangeListener, get } from "../../lib/config";
import s from "./lay0.module.css";

export default function Lay0() {
  const React = Spicetify.React;
  const { useEffect, useState, useRef } = React;

  const [colors, setColors] = useState({
    Deasturated: "#000",
    "Light Vibrant": "#000",
    Prominent: "#000",
    Vibrant: "#000",
    "Vibrant non alarming": "#000",
  });
  const [colorType, setColorType] = useState(get("background"));

  const canvasRef = useRef(null);
  const lastImg = useRef(null);
  const lastURL = useRef(null);

  const lastColorType = useRef("");

  useEffect(() => {
    try {
      if (colorType != "Cover") {
        const hexColor =
          colors[colorType == "Cover" ? "Vibrant non alarming" : colorType];
        console.log(
          "CT",
          colorType == "Cover" ? "Vibrant non alarming" : colorType
        );
        console.log("HEX", hexColor, colors);
        const textColor = bgrgb2fgcolor(hex2rgb(hexColor));
        console.log("TC", textColor);

        window?.setBFScolor(textColor);
      } else {
        window?.setBFScolor("#ffffff");
      }
    } catch (e) {}
  }, [colorType, colors]);

  useEffect(() => {
    const songChangeListener: any = async () => {
      if (!Spicetify.Player.data) return console.log("No song playing");
      const coverURL = Spicetify.Player.data.item.metadata.image_xlarge_url;
      lastURL.current = coverURL;
      handleCanvas(coverURL);
      const colors: any = await Spicetify.colorExtractor(coverURL);
      setColors({
        Deasturated: colors.DESATURATED || colors.undefined,
        "Light Vibrant": colors.LIGHT_VIBRANT || colors.undefined,
        Prominent: colors.PROMINENT || colors.undefined,
        Vibrant: colors.VIBRANT || colors.undefined,
        "Vibrant non alarming": colors.VIBRANT_NON_ALARMING || colors.undefined,
      });
    };

    const rmv = addChangeListener("background", () => {
      if (get("background") == "Cover" && lastColorType.current != "Cover") {
        lastColorType.current = "Cover";
        songChangeListener();
      } else {
        lastColorType.current = get("background");
      }
    });

    // initial call for the first song on load
    songChangeListener();
    Spicetify.Player.addEventListener("songchange", songChangeListener);
    return () => [
      rmv(),
      Spicetify.Player.removeEventListener("songchange", songChangeListener),
    ];
  }, []);

  useEffect(
    () =>
      addChangeListener("background", () => {
        setColorType(get("background"));
      }),
    []
  );

  useEffect(() => {
    let timeo: number | null;
    let lcall = 0;
    const handleResize = () => {
      const now = Date.now();
      if (now - lcall < 50) {
        if (timeo) clearTimeout(timeo);
        timeo = setTimeout(() => {
          handleCanvas(lastURL.current);
          timeo = null;
        }, 50);
      } else {
        handleCanvas(lastURL.current);
      }
      lcall = now;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const prepareCanvas = () => {
    const canv = canvasRef.current;
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

  const animateCanvas = (newImage: HTMLImageElement) => {
    let lastImage = (lastImg.current || newImage).cloneNode(
      true
    ) as HTMLImageElement;

    const dt = prepareCanvas();
    if (!dt) return;
    const { size, x, y, ctx } = dt;

    lastImg.current = newImage;

    let factor = 0.0;
    const animate = () => {
      ctx.globalAlpha = 1;
      ctx.drawImage(lastImage, x, y, size, size);
      ctx.globalAlpha = Math.sin((Math.PI / 2) * factor);

      //   console.log("animate", ctx.globalAlpha);
      ctx.drawImage(newImage, x, y, size, size);

      if (factor < 1.0) {
        factor += 0.016;
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleCanvas = (coverUrl: string) => {
    const img = new Image();
    img.src = coverUrl;
    img.onload = () => {
      const dt = prepareCanvas();
      window?.setBFScolor("#ffffff");
      if (!dt) return;
      if (get("fadeAnimation")) {
        animateCanvas(img);
      } else {
        const { size, x, y, ctx } = dt;
        ctx.drawImage(img, x, y, size, size);
        lastImg.current = img;
      }
      return;
    };
    img.onerror = (e) => {
      console.error("Failed to load image", e, coverUrl);
    };
  };

  return (
    <div
      className={s.lay0}
      style={{
        background:
          colors[colorType == "Cover" ? "Vibrant non alarming" : colorType],
      }}
    >
      {colorType == "Cover" && <canvas className={s.lay0} ref={canvasRef} />}
    </div>
  );
}
