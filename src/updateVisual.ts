let upv: Function[] = [];

export default function updateVisual() {
  upv.forEach((f) => f());
}

export function appendUpdateVisual(f: any) {
  upv.push(f);
}

export function removeUpdateVisual(f: any) {
  upv = upv.filter((x) => x !== f);
}
