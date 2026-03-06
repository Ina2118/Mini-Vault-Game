import { Container, Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import gsap from "gsap";

import type AssetLoader from "../core/AssetLoader";

export const EVENTS = {
    TURN: "turn",
};

export default class Handle extends Container {
    name = "Handle";

    private readonly easeIn = "power2.inOut";

    private handleSprite: Sprite;
    private shadowSprite: Sprite;

    private rotationAngle = 0;

    constructor(
        assetLoader: AssetLoader,
        handleTexture: string,
        shadowTexture: string,
        scaleFactor: number
    ) {
        super();

        this.handleSprite = new Sprite(assetLoader.getTexture(handleTexture));
        this.shadowSprite = new Sprite(assetLoader.getTexture(shadowTexture));

        // Позиционираме дръжката и сенката така, че да са в центъра на контейнера
        this.handleSprite.x = -30;
        this.handleSprite.y = 0;

        this.shadowSprite.x = this.handleSprite.x + 5;
        this.shadowSprite.y = this.handleSprite.y + 10;

        this.scale.set(scaleFactor);
        this.handleSprite.anchor.set(0.5);
        this.shadowSprite.anchor.set(0.5);

        this.addChild(this.shadowSprite, this.handleSprite);

        centerObjects(this);

        this.handleSprite.eventMode = "static";
        this.handleSprite.cursor = "pointer";

        this.handleSprite.on("pointerdown", (e) => {
            const localPos = e.data.getLocalPosition(this);
            const direction = localPos.x > 0 ? 1 : -1;
            this.emit(EVENTS.TURN, direction);
        });
    }

    resize(_width: number, scaleFactor: number) {
        this.scale.set(scaleFactor);
        centerObjects(this);
    }

    public rotate(direction: number) : Promise<void> {
        this.rotationAngle += direction * 60;

        return new Promise((resolve) => {
            gsap.to([this.handleSprite, this.shadowSprite],{
                angle: this.rotationAngle,
                //анимацията на сянката също да не блокира, но да е синхронизирана с дръжката
                duration: 0.5,
                ease: this.easeIn,
                overwrite: "auto",
                onComplete: () => resolve(),
        });
    });

    }

    public async reset() {
        
        const targetAngle = this.rotationAngle + 960;

       await gsap.to([this.handleSprite, this.shadowSprite], {
            angle: targetAngle,
            duration: 1,
            ease: this.easeIn,
        });

        this.rotationAngle = 0;
        this.handleSprite.angle = 0;
        this.shadowSprite.angle = 0;
    }

    public async spinCrazy(): Promise<void> {
        const timeline = gsap.timeline();
        
        const crazySpin = this.rotationAngle + 1080;
        const backToZero = 0;

        timeline.to([this.handleSprite, this.shadowSprite], {
            angle: crazySpin,
            duration: 0.3,
            ease: "power2.in",
        })

        .to([this.handleSprite, this.shadowSprite], {
            angle: backToZero,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
        });

        await timeline;
        
        this.rotationAngle = 0;
    }

    public async fadeIn(): Promise<void> {
        this.visible = true;
        this.alpha = 0;
        await gsap.to(this, {
            alpha: 1,
            duration: 1,
        });
    }
}