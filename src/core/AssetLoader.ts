import { Assets, Texture } from "pixi.js";
import { Debug } from "../utils/debug";

export const AssetManifest = [
    { alias: 'background', src: '/images/background.png' },
    { alias: 'doorClosed', src: '/images/doorClosed.png' },
    { alias: 'doorOpen', src: '/images/doorOpen.png' },
    { alias: 'doorOpenShadow', src: '/images/doorOpenShadow.png' },
    { alias: 'doorHandle', src: '/images/doorHandle.png' },
    { alias: 'doorHandleShadow', src: '/images/doorHandleShadow.png' },
    { alias: 'shine', src: '/images/shine.png' }
];

export default class AssetLoader {
  constructor() {}

  async loadAssetsGroup(group: string) {
    
    Assets.addBundle(group, AssetManifest);
    
    const resources = await Assets.loadBundle(group);

    Debug.log("✅ Loaded assets group", group, resources);

    return resources;
  }

  getTexture(name: string): Texture {
    const texture = Assets.get(name) as Texture;
    if (!texture) {
      console.error(`Texture not found: ${name}`);
      return Texture.EMPTY;
    }
    return texture;
  }
}