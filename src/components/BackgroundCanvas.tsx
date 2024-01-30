import CONFIG from "../config";
import style from "./backgroundcanvas.module.css";

export default function BackgroundCanvas(props: { imgURL: string }) {
  const { React } = Spicetify;
  const { useState, useEffect, useRef } = React;

  const backgroundCanvas = useRef<HTMLCanvasElement>(null);
  const lastURL = useRef<string>("");
  const lastImg = useRef<HTMLImageElement | null>(null);

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

  const renderCanvas = (imgURLX: string) => {
    // no need to render again
    if (lastImg.current && lastImg.current.src === imgURLX) return;

    const img = new Image();
    img.src = imgURLX;
    img.onload = () => {
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
      // img.src =
      //   "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCI+CiAgPHJlY3Qgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB4PSIwIiB5PSIwIiAvPgogIDxwYXRoIGZpbGw9IiNCM0IzQjMiIGQ9Ik0yNi4yNSAxNi4xNjJMMjEuMDA1IDEzLjEzNEwyMS4wMTIgMjIuNTA2QzIwLjU5NCAyMi4xOTIgMjAuMDgxIDIxLjk5OSAxOS41MTkgMjEuOTk5QzE4LjE0MSAyMS45OTkgMTcuMDE5IDIzLjEyMSAxNy4wMTkgMjQuNDk5QzE3LjAxOSAyNS44NzggMTguMTQxIDI2Ljk5OSAxOS41MTkgMjYuOTk5QzIwLjg5NyAyNi45OTkgMjIuMDE5IDI1Ljg3OCAyMi4wMTkgMjQuNDk5QzIyLjAxOSAyNC40MjIgMjIuMDA2IDE0Ljg2NyAyMi4wMDYgMTQuODY3TDI1Ljc1IDE3LjAyOUwyNi4yNSAxNi4xNjJaTTE5LjUxOSAyNS45OThDMTguNjkyIDI1Ljk5OCAxOC4wMTkgMjUuMzI1IDE4LjAxOSAyNC40OThDMTguMDE5IDIzLjY3MSAxOC42OTIgMjIuOTk4IDE5LjUxOSAyMi45OThDMjAuMzQ2IDIyLjk5OCAyMS4wMTkgMjMuNjcxIDIxLjAxOSAyNC40OThDMjEuMDE5IDI1LjMyNSAyMC4zNDYgMjUuOTk4IDE5LjUxOSAyNS45OThaIi8+Cjwvc3ZnPgo=";
    };
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

  return (
    <canvas
      className={style.backgroundCanvas}
      ref={backgroundCanvas}
      id="bfs-background-canvas"
    />
  );
}
