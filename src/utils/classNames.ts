export default function names(...args: [any] | (string | undefined | null)[]) {
  if (args.length === 1 && typeof args[0] === "object") {
    const ag0 = args[0] as { [key: string]: boolean | undefined | null };
    return Object.keys(ag0)
      .filter((key) => ag0[key] === true)
      .join(" ");
  }

  return args.filter((arg) => arg).join(" ");
}
