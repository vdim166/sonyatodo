export const findFiles = (str: string) => {
  const regex = /<file>(.*?)<\/file>/g;

  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]); // match[1] contains content inside <file> tag
  }

  return matches;
};
