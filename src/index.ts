import { render } from "./ui";

const main = () => {
  // render(true);
  new Spicetify.Topbar.Button(
    "Beautiful Fullscreen",
    `<svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">${Spicetify.SVGIcons.visualizer}</svg>`,
    () => {
      render(false);
    }
  );
};

const waitForLoad = (): any => {
  if (
    !Spicetify.Keyboard ||
    !Spicetify.React ||
    !Spicetify.ReactDOM ||
    document.querySelector(".main-topBar-container") == null
  )
    return setTimeout(waitForLoad, 200);
  main();
};

waitForLoad();
