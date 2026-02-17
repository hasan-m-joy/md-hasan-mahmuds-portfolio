// Update this single ID when you replace your main showreel video.
const SHOWREEL_YOUTUBE_ID = "JEngJg2S7mA";
const WORK_THUMB_BASE = `${import.meta.env.BASE_URL}work`;

const makeYouTubeEmbed = (videoId, startSeconds) =>
  `https://www.youtube.com/embed/${videoId}${startSeconds ? `?start=${startSeconds}` : ""}`;

export const editingTools = [
  { name: "After Effects", detail: "Motion systems | transitions | clean graphics", iconText: "AE" },
  { name: "Premiere Pro", detail: "Edit pacing | narrative flow | final export", iconText: "PR" },
  {
    name: "DaVinci Resolve",
    detail: "Color consistency | finishing passes",
    iconImage: "https://cdn.simpleicons.org/davinciresolve/ffffff",
    iconAlt: "DaVinci Resolve logo",
  },
  { name: "Sound Design", detail: "Dialogue cleanup | levels | impact", iconText: "SFX" },
];

export const aiTools = [
  {
    name: "Gemini",
    detail: "Topic ideation | outline options",
    iconImage: "https://cdn.simpleicons.org/googlegemini/ffffff",
    iconAlt: "Google Gemini logo",
  },
  { name: "GPT", detail: "Hook variants | script tightening", iconText: "GPT" },
  {
    name: "Perplexity",
    detail: "Audience research | reference sourcing",
    iconImage: "https://cdn.simpleicons.org/perplexity/ffffff",
    iconAlt: "Perplexity logo",
  },
  { name: "QC Pass", detail: "Delivery checklist | quality control", iconText: "QC" },
];

export const workItems = [
  {
    title: "Brand Story Ad Cut",
    type: "Commercial + Advisory",
    description:
      "Story-first commercial pacing with clear messaging and premium finishing built for conversion.",
    embed: makeYouTubeEmbed(SHOWREEL_YOUTUBE_ID, 12),
    previewMode: "image",
    thumbnail: `${WORK_THUMB_BASE}/brand-story-ad-cut.svg`,
  },
  {
    title: "Creator Retention Pack",
    type: "Short-form + Strategy",
    description:
      "Hook-first edits, subtitle rhythm, and pacing strategy that keeps viewers watching longer.",
    embed: makeYouTubeEmbed(SHOWREEL_YOUTUBE_ID, 44),
    previewMode: "image",
    thumbnail: `${WORK_THUMB_BASE}/creator-retention-pack.svg`,
  },
  {
    title: "Mini Documentary",
    type: "Long-form + Narrative",
    description: "Structured storytelling, intentional b-roll sequencing, and natural premium color.",
    embed: makeYouTubeEmbed(SHOWREEL_YOUTUBE_ID),
    previewMode: "video",
  },
];

export const showreel = {
  title: "Showreel",
  embed: makeYouTubeEmbed(SHOWREEL_YOUTUBE_ID),
  meta: "Official showreel preview.",
};
