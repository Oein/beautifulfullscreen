import { loadConfig } from "./lib/config";
import UI from "./ui/ui";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');`;

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const { React, ReactDOM } = Spicetify;
  window.bfsOpen = false;

  let initialized = false;

  loadConfig();

  let style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const button = new Spicetify.Playbar.Button(
    "Beautiful Fullscreen",
    "play",
    (self) => {
      window.bfsOpen = true;
      if (!initialized) {
        const div = document.createElement("div");
        div.id = "beautiful-fullscreen";
        document.body.appendChild(div);
        ReactDOM.render(React.createElement(UI, {}), div);
        initialized = true;
      }
      if ("bfsCallback" in window) {
        window.bfsCallback();
      }
    }
  );

  // You can also change properties of the Tippy instance. For more information, see https://atomiks.github.io/tippyjs/v6/tippy-instance/.
  button.tippy.setContent("Beautiful Fullscreen");
}

export default main;
