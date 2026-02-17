export function isStrictEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return re.test(value.trim());
}

export function isNonEmpty(value) {
  return value.trim().length >= 1;
}

export function isValidEmbed(url) {
  return Boolean(url && url.includes("youtube.com/embed/") && !url.includes("VIDEO_ID"));
}
