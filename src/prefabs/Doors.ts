import { Container, Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import type AssetLoader from "../core/AssetLoader";

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
    const shadowSprite = new Sprite(assetLoader.getTexture(shadowName));

    shadowSprite.anchor.set(0.5);
    shadowSprite.x = 50;
    shadowSprite.y = 50;

    openSprite.anchor.set(0.5);

    this.openContainer.addChild(shadowSprite, openSprite);
    this.openContainer.x = -350;

    this.addChild(this.closedSprite, this.openContainer);

    this.scale.set(-scaleFactor, scaleFactor); 
    centerObjects(this);
  }

  resize(_width: number, scaleFactor: number) {
    this.scale.set(-scaleFactor, scaleFactor);
    centerObjects(this);
  }

  open() {
    this.closedSprite.visible = false;
    this.openContainer.visible = true;
  }

  close() {
    this.closedSprite.visible = true;
    this.openContainer.visible = false;
  }
}
