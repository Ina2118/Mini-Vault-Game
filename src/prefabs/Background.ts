import { Sprite } from "pixi.js";
import type AssetLoader from "../core/AssetLoader";

export class Background extends Sprite {
  constructor(assetLoader: AssetLoader) {
    super(assetLoader.getTexture("background"));
    this.anchor.set(0.5);
   
  }
}
