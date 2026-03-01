import PixiApp from "./core/App";
const pixiApp = new PixiApp();
await pixiApp.begin();

// @ts-expect-error property added for dev tools
window.__PIXI_APP__ = pixiApp.app;