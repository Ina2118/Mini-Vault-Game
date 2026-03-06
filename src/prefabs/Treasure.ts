import { Container} from "pixi.js";
import { centerObjects } from "../utils/misc";
import type AssetLoader from "../core/AssetLoader";
import Shine  from "./Shine";

export default class Treasure extends Container {
  private shines: Shine[] = [];

  constructor(
    assetLoader: AssetLoader,
    textureName: string,
    scaleFactor = 1
  ) {
    super();

    // Добавяне glitter ефекти на съкровището
    const positions = [
      { x: -140, y: -40, scale: 0.8 }, 
      { x: -10, y: 90, scale: 1.2 },  
      { x: 120, y: -20, scale: 0.9 } 
    ];

    positions.forEach(pos => {
      const shine = new Shine(assetLoader, textureName, pos.scale);
      shine.x = pos.x;
      shine.y = pos.y;
      this.addChild(shine);
      this.shines.push(shine);
    });

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
    this.shines.forEach(shine => shine.show(Math.random() * 0.5 + 0.5, -1));
  }

  hide() {
    this.visible = false;
  }
}