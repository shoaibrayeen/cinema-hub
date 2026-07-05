export const parseYear = (yearRange: string): number => {
  const match = yearRange.match(/^\d{4}/);
  return match ? parseInt(match[0]) : 0;
};
