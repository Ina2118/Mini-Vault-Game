
export function wait(seconds: number) {
  return new Promise<void>((res) => setTimeout(res, seconds * 1000));
}

export async function after(
  seconds: number,
  callback: (...args: unknown[]) => unknown
) {
  await wait(seconds);
  return callback();
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function getEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Entries<T>;
}