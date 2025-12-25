export const findTag = (value: string) => {
  const linkStart = value.indexOf('<a>');
  const imgStart = value.indexOf('<img>');
  const videoStart = value.indexOf('<video>');
  const fileStart = value.indexOf('<file>');

  // Find which tag comes first
  let tagType: 'link' | 'img' | 'video' | 'file' | null = null;
  let start = -1;
  let end = -1;
  let content = '';

  // Determine which tag appears first
  if (
    linkStart !== -1 &&
    (imgStart === -1 || linkStart < imgStart) &&
    (videoStart === -1 || linkStart < videoStart) &&
    (fileStart === -1 || linkStart < fileStart)
  ) {
    // <a> tag comes first
    start = linkStart;
    end = value.indexOf('</a>', start);
    tagType = 'link';
    if (end !== -1) {
      content = value.substring(start + 3, end); // 3 is length of "<a>"
    }
  } else if (
    imgStart !== -1 &&
    (videoStart === -1 || imgStart < videoStart) &&
    (fileStart === -1 || imgStart < fileStart)
  ) {
    // <img> tag comes first
    start = imgStart;
    end = value.indexOf('</img>', start);
    tagType = 'img';
    if (end !== -1) {
      content = value.substring(start + 5, end); // 5 is length of "<img>"
    }
  } else if (
    videoStart !== -1 &&
    (fileStart === -1 || videoStart < fileStart)
  ) {
    // <video> tag comes first
    start = videoStart;
    end = value.indexOf('</video>', start);
    tagType = 'video';
    if (end !== -1) {
      content = value.substring(start + 7, end); // 7 is length of "<video>"
    }
  } else if (fileStart !== -1) {
    // <file> tag comes first
    start = fileStart;
    end = value.indexOf('</file>', start);
    tagType = 'file';
    if (end !== -1) {
      content = value.substring(start + 6, end); // 6 is length of "<file>"
    }
  }

  if (tagType && start !== -1 && end !== -1) {
    const textBefore = value.substring(0, start);

    // Calculate the length of closing tag based on tag type
    let closingTagLength;
    switch (tagType) {
      case 'link':
        closingTagLength = 4; // length of "</a>"
        break;
      case 'img':
        closingTagLength = 6; // length of "</img>"
        break;
      case 'video':
        closingTagLength = 8; // length of "</video>"
        break;
      case 'file':
        closingTagLength = 7; // length of "</file>"
        break;
    }

    const newValue = value.substring(end + closingTagLength);
    return { tagType, content, textBefore, value: newValue };
  }

  return null;
};
