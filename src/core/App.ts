import { Application, Ticker, Container } from "pixi.js";
import AssetLoader from "./AssetLoader";
import Game from "../scenes/Game";

export interface SceneUtils {
  assetLoader: AssetLoader;
}

export default class App {
  public app: Application;
  public stage!: Container;
  public ticker!: Ticker;
  private game!: Game;

  constructor() {
    this.app = new Application();
  }
  async begin() {
    await this.app.init({
       canvas: document.querySelector("#app") as HTMLCanvasElement,
       autoDensity: true,
      resizeTo: window,
      powerPreference: "high-performance",
      backgroundColor: 0x23272a,

    })
     
    this.stage = this.app.stage;
    this.ticker = this.app.ticker;

    const sceneUtils: SceneUtils = {
      assetLoader: new AssetLoader(),
    };

    this.game = new Game(sceneUtils);
  
    this.stage.addChild(this.game);
    await this.game.load();
    this.game.start();

    window.addEventListener("resize", this.onResize);

  }

  private onResize = (_ev: UIEvent) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (typeof (this.game as any).onResize === "function") {
      (this.game as any).onResize(width, height);
    }
  };
}