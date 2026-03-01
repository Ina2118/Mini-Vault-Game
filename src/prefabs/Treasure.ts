import { Container, Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import type AssetLoader from "../core/AssetLoader";
import Shine from "./Shine";

export default class Treasure extends Container {
  private treasureSprite: Sprite;
  private shine?: Shine;

  constructor(
    assetLoader: AssetLoader,
    textureName: string,
    shineTexture?: string,
    scaleFactor = 1
  ) {
    super();

    this.treasureSprite = new Sprite(
      assetLoader.getTexture(textureName)
    );
    this.treasureSprite.anchor.set(0.5);

    this.addChild(this.treasureSprite);

    if (shineTexture) {
      this.shine = new Shine(assetLoader, shineTexture, scaleFactor);
      this.addChild(this.shine);
    }

    this.scale.set(scaleFactor);
    centerObjects(this);

    this.visible = false;
  }

  resize(_width: number, scaleFactor: number) {
    this.scale.set(scaleFactor);
    centerObjects(this);
  }

  reveal() {
    this.visible = true;

    if (this.shine) {
      this.shine.show(0.4, 6);
    }
  }

  hide() {
    this.visible = false;
  }
}