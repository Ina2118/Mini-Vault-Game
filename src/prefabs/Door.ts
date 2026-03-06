import { Container, Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import type AssetLoader from "../core/AssetLoader";
import gsap from "gsap";

export default class Door extends Container {
  private closedSprite: Sprite;
  private openContainer: Container;

  constructor(
    assetLoader: AssetLoader,
    closedName: string,
    openName: string,
    shadowName: string,
    scaleFactor = 1,
  ) {
    super();

    this.closedSprite = new Sprite(assetLoader.getTexture(closedName));
    this.closedSprite.anchor.set(0.5);

    this.openContainer = new Container();
    this.openContainer.visible = false;

    const openSprite = new Sprite(assetLoader.getTexture(openName));
    openSprite.anchor.set(0.5);

    const shadowSprite = new Sprite(assetLoader.getTexture(shadowName));
    shadowSprite.anchor.set(0.5);
    shadowSprite.x = 50;
    shadowSprite.y = 50;

    this.openContainer.addChild(shadowSprite, openSprite);

    // --- Подравняване на отворената врата спрямо центъра на затворената ---
    this.openContainer.x = this.closedSprite.width * 0.75;

    this.addChild(this.closedSprite, this.openContainer);
    // Паннтите са от дясно, махнала съм '-' scaleFactor за да се отваря в дясно
    this.scale.set(scaleFactor, scaleFactor);

    centerObjects(this);
  }

  resize(_width: number, scaleFactor: number) {
    this.scale.set(scaleFactor, scaleFactor);
    centerObjects(this);
  }

  //За анимацията на вратата fade in/out
  public async open(): Promise<void> {

    this.openContainer.alpha = 0;
    this.openContainer.visible = true;

    gsap.to(this.closedSprite, {
      alpha: 0,
      duration: 1,
    });

     await gsap.to(this.openContainer, {
      alpha: 1,
      duration: 1,
    });

      this.closedSprite.visible = false;
  }

 public async close(): Promise<void> {

    this.closedSprite.alpha = 0;
    this.closedSprite.visible = true;

    gsap.to(this.openContainer, {
      alpha: 0,
      duration: 1,
    });

     await gsap.to(this.closedSprite, {
      alpha: 1,
      duration: 1,
    });

      this.openContainer.visible = false;
  }
}