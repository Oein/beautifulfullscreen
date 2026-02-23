import { loadConfig } from "./lib/config";
import FullscreenButton from "./ui/FullscreenButton";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');`;

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  loadConfig();

  let style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  FullscreenButton();
}

export default main;
