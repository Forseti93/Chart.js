import { clearStringFromLetters } from "./stringValidation";

export const findMargins = (
  // example: findMargins(["top", "bottom"], headerHTMLElement)
  side: string[],
  element: HTMLElement
): number => {
  const values: number[] = side.map((margin: string) => {
    switch (margin) {
      case "top":
        return clearStringFromLetters(
          window.getComputedStyle(element).marginTop
        );
      case "bottom":
        return clearStringFromLetters(
          window.getComputedStyle(element).marginBottom
        );
      case "right":
        return clearStringFromLetters(
          window.getComputedStyle(element).marginRight
        );
      case "left":
        return clearStringFromLetters(
          window.getComputedStyle(element).marginLeft
        );
      default:
        throw console.error("see -> findMagrin(*WRONG STRING*)");
    }
  });

  return values.reduce((acc, val) => acc + val, 0);
};
