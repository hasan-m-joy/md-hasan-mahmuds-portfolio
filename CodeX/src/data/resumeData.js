import { siteProfile } from "./siteProfile";

export const resumeData = {
  fullName: siteProfile.fullName,
  headline: siteProfile.headline,
  email: siteProfile.contactEmail,
  instagram: `@${siteProfile.handle}`,
  summary:
    "Video editor and content advisor focused on retention, clarity, and conversion. I combine storytelling, pacing, and strategic content structure to help brands and creators publish work that performs across short-form and long-form formats.",
  strengths: [
    "Audience-first hook strategy and watch-time focused pacing.",
    "Narrative restructuring for cleaner message delivery.",
    "Premium finishing: audio balance, captions, transitions, and export consistency.",
  ],
  services: [
    "Short-form content editing (Reels, Shorts, TikTok).",
    "Long-form YouTube episode refinement.",
    "Commercial and brand story edits.",
    "Content advisory for topic framing, flow, and CTA placement.",
  ],
  tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "AI-assisted research and ideation tools"],
  experience: [
    {
      role: "Freelance Video Editor & Content Advisor",
      company: "Independent",
      period: "2023 - Present",
      highlights: [
        "Deliver structured edits with strong opening hooks and retention-focused flow.",
        "Build multiple cut variants for different platforms and audience segments.",
        "Guide clients on content angle, pacing, and publishing-ready narrative structure.",
      ],
    },
    {
      role: "Creative Editor",
      company: "Portfolio and Client Projects",
      period: "2021 - 2023",
      highlights: [
        "Produced social and long-form edits with consistent visual style and clear story beats.",
        "Refined sound, subtitles, and graphics for cleaner and more professional final output.",
      ],
    },
  ],
  deliveryNotes: [
    "Typical first delivery window: 24-72 hours depending on scope.",
    "Supports 16:9 and 9:16 output pipelines.",
  ],
};
