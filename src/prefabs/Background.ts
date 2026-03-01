import * as PIXI from "pixi.js";
import type AssetLoader from "../core/AssetLoader";

export class Background extends PIXI.Sprite {
    constructor(assetLoader: AssetLoader) {
        super(assetLoader.getTexture("background"));
        this.anchor.set(0.5);
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
    }
}