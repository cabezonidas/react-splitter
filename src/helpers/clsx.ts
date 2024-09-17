export const clsx = (...args: (string | false | null | undefined)[]) => {
  return args
    .filter((arg) => typeof arg === "string" && arg)
    .map((arg) => (arg as string).trim())
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .join(" ");
};
