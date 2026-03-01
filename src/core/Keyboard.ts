import { EventEmitter } from "pixi.js";

export default class Keyboard extends EventEmitter {
  private static instance: Keyboard;

  static states = {
    ACTION: "ACTION",
  };

  static actions = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
  } as const;

  static actionKeyMap = {
    [Keyboard.actions.LEFT]: "KeyA",
    [Keyboard.actions.RIGHT]: "KeyD",
  } as const;

  static keyActionMap = Object.entries(Keyboard.actionKeyMap).reduce(
    (acc, [action, key]) => {
      acc[key] = action as keyof typeof Keyboard.actions;
      return acc;
    },
    {} as Record<string, keyof typeof Keyboard.actions>
  );

  private keyMap = new Map<string, boolean>();

  private constructor() {
    super();
    this.listenToKeyEvents();
  }

  private listenToKeyEvents() {
    document.addEventListener("keydown", (e) => this.onKeyPress(e.code));
    document.addEventListener("keyup", (e) => this.onKeyRelease(e.code));
  }

  public static getInstance(): Keyboard {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }
    return Keyboard.instance;
  }

  public isActionDown(action: keyof typeof Keyboard.actions): boolean {
    const key = Keyboard.actionKeyMap[action];
    return this.keyMap.get(key) ?? false;
  }

  public onAction(
    callback: (e: { action: keyof typeof Keyboard.actions; buttonState: "pressed" | "released" }) => void
  ): void {
    this.on(Keyboard.states.ACTION, callback);
  }

  private onKeyPress(key: string): void {
    if (this.keyMap.get(key)) return;
    const action = Keyboard.keyActionMap[key];
    if (!action) return;

    this.keyMap.set(key, true);
    this.emit(Keyboard.states.ACTION, { action, buttonState: "pressed" });
  }

  private onKeyRelease(key: string): void {
    const action = Keyboard.keyActionMap[key];
    if (!action) return;

    this.keyMap.set(key, false);
    this.emit(Keyboard.states.ACTION, { action, buttonState: "released" });
  }
}