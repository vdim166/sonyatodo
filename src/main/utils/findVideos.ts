export const findVideos = (str: string) => {
  const regex = /<video>(.*?)<\/video>/g;

  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]); // match[1] contains content inside <video> tag
  }

  return matches;
};
