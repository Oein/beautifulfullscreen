import { get } from "../lib/config";
import UI from "./ui";

const FULLSCREEN_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.25 3C0.25 2.0335 1.0335 1.25 2 1.25H5.375V2.75H2C1.86193 2.75 1.75 2.86193 1.75 3V5.42857H0.25V3ZM14 2.75H10.625V1.25H14C14.9665 1.25 15.75 2.0335 15.75 3V5.42857H14.25V3C14.25 2.86193 14.1381 2.75 14 2.75ZM1.75 10.5714V13C1.75 13.1381 1.86193 13.25 2 13.25H5.375V14.75H2C1.0335 14.75 0.25 13.9665 0.25 13V10.5714H1.75ZM14.25 13V10.5714H15.75V13C15.75 13.9665 14.9665 14.75 14 14.75H10.625V13.25H14C14.1381 13.25 14.25 13.1381 14.25 13Z" fill="currentColor"></path></svg>`;

const REPLACE_SPOTIFY_CSS = `
  .bfs-fullscreen-button { order: 9999 !important; }
  .main-nowPlayingBar-extraControls { display: flex !important; }
  button[data-testid="fullscreen-mode-button"] { display: none !important; }
`;

export default function FullscreenButton() {
  const { React, ReactDOM } = Spicetify;
  window.bfsOpen = false;

  let initialized = false;

  const openFullscreen = () => {
    window.bfsOpen = true;
    if (!initialized) {
      const container = document.createElement("div");
      container.id = "beautiful-fullscreen";
      document.body.appendChild(container);
      ReactDOM.createRoot(container).render(React.createElement(UI, {}));
      initialized = true;
    }
    window.bfsCallback?.();
  };

  let lastButtonMode: "spotify" | "add" | null = null;

  const ensureButton = () => {
    const buttonMode = get("replaceSpotifyFullscreen") ? "spotify" : "add";
    if (lastButtonMode === buttonMode) {
      setTimeout(ensureButton, 300);
      return;
    }

    // Clean up previous button
    document.querySelector(".bfs-fullscreen-button")?.remove();
    document.getElementById("bfs-fullscreen-button-css")?.remove();

    const button = new Spicetify.Playbar.Button(
      "Beautiful Fullscreen",
      buttonMode === "spotify" ? FULLSCREEN_SVG : "play",
      () => openFullscreen(),
      false,
      false,
      true,
    );
    button.tippy.setContent("Beautiful Fullscreen");
    button.element.classList.add("bfs-fullscreen-button");

    if (buttonMode === "spotify") {
      const style = document.createElement("style");
      style.id = "bfs-fullscreen-button-css";
      style.textContent = REPLACE_SPOTIFY_CSS;
      document.head.appendChild(style);
    }

    lastButtonMode = buttonMode;
    setTimeout(ensureButton, 300);
  };

  ensureButton();

  if (get("autoStart")) setTimeout(openFullscreen, 1000);
}
