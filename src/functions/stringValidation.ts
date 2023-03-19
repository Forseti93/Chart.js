export const clearStringFromLetters = (string: string): number => {
  return Number(string.replace(/\D/g, ""));
};
