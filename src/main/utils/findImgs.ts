export const findImgs = (str: string) => {
  const regex = /<img>(.*?)<\/img>/g;

  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]); // match[1] contains content inside <img> tag
  }

  return matches;
};
