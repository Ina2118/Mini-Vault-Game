import { Container } from "pixi.js";
import type { SceneUtils } from "../core/App";

import { Background } from "../prefabs/Background";
// Оправен импорт след поправката на typo в името на файла за класа Door - Doors
import Door from "../prefabs/Door";
import Handle from "../prefabs/Handle";
import Treasure from "../prefabs/Treasure";
import { wait } from "../utils/misc";

export const EVENTS = {
  TURN: "turn",
};

export default class Game extends Container {
  private assetLoader: SceneUtils["assetLoader"];

  private background!: Background;
  private door!: Door;
  private handle!: Handle;
  private treasure!: Treasure;

  private unlocked = false;
  private isAnimating = false;

  private secretCombo: { direction: number; count: number }[] = [];
  private currentPairIndex = 0;
  private currentClickCount = 0;

  constructor(sceneUtils: SceneUtils) {
    super();
    this.assetLoader = sceneUtils.assetLoader;
  }

  async load() {
    await this.assetLoader.loadAssetsGroup("vault");

    this.background = new Background(this.assetLoader);
    this.DESIGN_WIDTH = this.background.width || 1920;
    this.DESIGN_HEIGHT = this.background.height || 1080;
    
    this.addChild(this.background);

    this.door = new Door(
      this.assetLoader,
      "doorClosed",
      "doorOpen",
      "doorOpenShadow",
      1,
    );
    this.addChild(this.door);

    this.treasure = new Treasure(this.assetLoader, "shine", 1);
    this.addChild(this.treasure);

    this.handle = new Handle(
      this.assetLoader,
      "doorHandle",
      "doorHandleShadow",
      1,
    );
    this.handle.on(EVENTS.TURN, (direction: number) =>
      this.onHandleTurn(direction),
    );
    this.addChild(this.handle);

    this.layout();
  }

  private generateCombination() {
    this.secretCombo = [];
    let lastDirection = Math.random() > 0.5 ? 1 : -1;

    for (let i = 0; i < 3; i++) {
      const count = Math.floor(Math.random() * 9) + 1;
      this.secretCombo.push({ direction: lastDirection, count });
      lastDirection *= -1;
    }

    const comboStr = this.secretCombo
      .map((pair) => `${pair.count} ${pair.direction === 1 ? "CW" : "CCW"}`)
      .join(", ");
    console.log("[Vault Game] Secret Combination:", comboStr);

    this.currentPairIndex = 0;
    this.currentClickCount = 0;
  }

  start() {
    this.generateCombination();
  }

  private async onHandleTurn(direction: number) {
    if (this.unlocked || this.isAnimating) return;

    //анимация на дръжката да не блокира
    this.handle.rotate(direction);

    const activePair = this.secretCombo[this.currentPairIndex];

    if (direction === activePair.direction) {
      this.currentClickCount++;

      if (this.currentClickCount === activePair.count) {
        this.currentPairIndex++;
        this.currentClickCount = 0;

        if (this.currentPairIndex >= this.secretCombo.length) {
          await this.onSuccess();
        } else {
          this.isAnimating = false;
        }
      } else {
        this.isAnimating = false;
      }
    } else {
      //За да блокира дръжката при win
      this.isAnimating = true;
      await this.onError();
    }
  }

  private async onSuccess() {
    this.unlocked = true;
    this.treasure.reveal();
    this.handle.visible = false;
    await this.door.open();

    await wait(5);

    this.treasure.hide();
    this.handle.fadeIn();
    await this.door.close();
    this.unlocked = false;
    this.isAnimating = false;

    this.generateCombination();
  }

  private async onError() {
    console.log(
      `%c[Vault Game] ERROR! Combination failed. Resetting...`,
      "color: #ff0000; font-weight: bold;",
    );
    await this.handle.spinCrazy();
    this.generateCombination();
    this.isAnimating = false;
  }

  private DESIGN_WIDTH = 1920;
  private DESIGN_HEIGHT = 1080;

  private layout() {
    const centerX = this.DESIGN_WIDTH / 2;
    const centerY = this.DESIGN_HEIGHT / 2;

    this.background.position.set(centerX, centerY);
    this.door.position.set(centerX, centerY);
    this.treasure.position.set(centerX, centerY);
    this.handle.position.set(centerX, centerY);

    this.pivot.set(centerX, centerY);
  }

  onResize(width: number, height: number) {
    const scale = Math.min(
      width / this.DESIGN_WIDTH,
      height / this.DESIGN_HEIGHT,
    );
    this.scale.set(scale);
    this.position.set(width / 2, height / 2);
  }
}
