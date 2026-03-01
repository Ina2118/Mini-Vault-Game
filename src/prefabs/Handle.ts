import { Container, Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import gsap from "gsap";

import type AssetLoader from "../core/AssetLoader";

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

        this.handleSprite.x = 35;
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
            this.emit('turn', direction);
        });
    }

    resize(_width: number, scaleFactor: number) {
        this.scale.set(scaleFactor);
        centerObjects(this);
    }

    public rotate(direction: number) : Promise<void> {
        this.rotationAngle += direction * 60;
        const targetRadians = this.rotationAngle * (Math.PI / 180);

        gsap.to(this.handleSprite, {
            rotation: targetRadians,
            duration: 1,
            ease: this.easeIn,
        });

        return new Promise((resolve) => {
        gsap.to(this.shadowSprite, {
            rotation: targetRadians,
            duration: 1,
            ease: this.easeIn,
            onComplete: () => resolve(),
        });
    });

    }

    public async reset() {
        const timeline = gsap.timeline();
        const targetRadians = (this.rotationAngle + 960) * (Math.PI / 180);

        timeline.to(this.handleSprite, {
            rotation: targetRadians,
            duration: 1,
            ease: this.easeIn,
        });

        timeline.to(this.shadowSprite, {
           rotation: targetRadians,
            duration: 1,
            ease: this.easeIn,
        }, 0); 

        await timeline;

        this.rotationAngle = 0;
        this.handleSprite.rotation = 0;
        this.shadowSprite.rotation = 0;
    }

    public async spinCrazy(): Promise<void> {
        const timeline = gsap.timeline();
        
        const wobble1 = (this.rotationAngle + 30) * (Math.PI / 180);
        const wobble2 = (this.rotationAngle - 45) * (Math.PI / 180);
        const wobble3 = (this.rotationAngle + 10) * (Math.PI / 180);
        const finalTarget = 0;

        timeline.to(this.handleSprite, { rotation: wobble1, duration: 0.1, ease: "power1.inOut" })
                .to(this.handleSprite, { rotation: wobble2, duration: 0.1, ease: "power1.inOut" })
                .to(this.handleSprite, { rotation: wobble3, duration: 0.1, ease: "power1.inOut" })
                .to(this.handleSprite, { rotation: finalTarget, duration: 0.2, ease: "power2.out" });

        timeline.to(this.shadowSprite, { rotation: wobble1, duration: 0.1, ease: "power1.inOut" }, 0)
                .to(this.shadowSprite, { rotation: wobble2, duration: 0.1, ease: "power1.inOut" }, 0.1)
                .to(this.shadowSprite, { rotation: wobble3, duration: 0.1, ease: "power1.inOut" }, 0.2)
                .to(this.shadowSprite, { rotation: finalTarget, duration: 0.2, ease: "power2.out" }, 0.3);

        await timeline;
        
        this.rotationAngle = 0;
    }
}