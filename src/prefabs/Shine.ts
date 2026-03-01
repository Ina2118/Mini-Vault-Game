import { Container, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { centerObjects } from "../utils/misc";
import type AssetLoader from "../core/AssetLoader";

export default class Shine extends Container {
  private shineSprite: Sprite;

  constructor(assetLoader: AssetLoader, textureName: string, scaleFactor = 1) {
    super();

    this.shineSprite = new Sprite(assetLoader.getTexture(textureName));
    this.shineSprite.anchor.set(0.5);
    this.shineSprite.alpha = 0; 

    this.addChild(this.shineSprite);

    this.scale.set(scaleFactor);
    centerObjects(this);
  }

  resize(_width: number, scaleFactor: number) {
    this.scale.set(scaleFactor);
    centerObjects(this);
  }


  show(duration = 0.5, repeat = 5) {
    this.shineSprite.alpha = 1;
    gsap.fromTo(
      this.shineSprite,
      { alpha: 0 },
      {
        alpha: 1,
        duration,
        repeat,
        yoyo: true,
        onComplete: () => {
          this.shineSprite.alpha = 0; 
        },
      }
    );
  }
}