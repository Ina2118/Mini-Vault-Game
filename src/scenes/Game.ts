import { Container } from "pixi.js";
import type { SceneUtils } from "../core/App";

import { Background } from "../prefabs/Background";
import Door from "../prefabs/Doors";
import Handle from "../prefabs/Handle";
import Treasure from "../prefabs/Treasure";

import gsap from "gsap";

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
    this.addChild(this.background);

    
    this.door = new Door(
      this.assetLoader,
      "doorClosed",
      "doorOpen",
      "doorOpenShadow",
      1
    );
    this.addChild(this.door);

    
    this.treasure = new Treasure(
      this.assetLoader,
      "shine",
      undefined,
      1
    );
    this.addChild(this.treasure);

    
    this.handle = new Handle(this.assetLoader, "doorHandle", "doorHandleShadow", 1);
    this.handle.on("turn", (direction: number) => this.onHandleTurn(direction));
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

    const comboStr = this.secretCombo.map(pair => `${pair.count} ${pair.direction === 1 ? 'CW' : 'CCW'}`).join(', ');
    console.log('[Vault Game] Secret Combination:', comboStr);
   
    this.currentPairIndex = 0;
    this.currentClickCount = 0;
  }

  start() {
    this.generateCombination();
  }

  update(_delta: number) {
    
  }

  private async onHandleTurn(direction: number) {
    if (this.unlocked || this.isAnimating) return;

    this.isAnimating = true;

    
    await this.handle.rotate(direction);

    
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
       
        await this.onError();
    }
  }

  private async onSuccess() {
      this.unlocked = true;
      this.door.open();
      this.handle.visible = false;
      this.treasure.reveal();

      
      await new Promise<void>(resolve => {
        gsap.delayedCall(5, () => resolve());
      });

     
      this.door.close();
      this.handle.visible = true;
      this.treasure.hide();
      this.unlocked = false;
      this.isAnimating = false;
      
      this.generateCombination(); 
  }

  private async onError() {
      console.log(`%c[Vault Game] ERROR! Combination failed. Resetting...`, 'color: #ff0000; font-weight: bold;');
      await this.handle.spinCrazy();
      this.generateCombination(); 
      this.isAnimating = false;
  }

  private layout() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.background.position.set(centerX, centerY);
    this.door.position.set(centerX, centerY);
    this.treasure.position.set(centerX, centerY);
    this.handle.position.set(centerX, centerY);
  }

  onResize(width: number, _height: number) {
    this.layout();
    this.door.resize(width, 1);
    this.treasure.resize(width, 1);
    this.handle.resize(width, 1);
  }
}