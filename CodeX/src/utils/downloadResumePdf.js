import { resumeData } from "../data/resumeData";
import { siteProfile } from "../data/siteProfile";

const PAGE_MARGIN = 50;
const SECTION_GAP = 18;
const LINE_HEIGHT = 16;
const BULLET_INDENT = 12;
const CONTENT_FONT = 11;

function toLines(doc, text, maxWidth) {
  return doc.splitTextToSize(text, maxWidth);
}

function ensurePage(doc, cursorY, requiredHeight) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (cursorY + requiredHeight <= pageHeight - PAGE_MARGIN) {
    return cursorY;
  }

  doc.addPage();
  return PAGE_MARGIN;
}

function writeParagraph(doc, text, cursorY, maxWidth) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(CONTENT_FONT);
  const lines = toLines(doc, text, maxWidth);
  let y = ensurePage(doc, cursorY, lines.length * LINE_HEIGHT + 6);
  doc.text(lines, PAGE_MARGIN, y);
  y += lines.length * LINE_HEIGHT;
  return y;
}

function writeBulletList(doc, items, cursorY, maxWidth) {
  let y = cursorY;
  items.forEach((item) => {
    const bulletText = `- ${item}`;
    const lines = toLines(doc, bulletText, maxWidth - BULLET_INDENT);
    y = ensurePage(doc, y, lines.length * LINE_HEIGHT + 4);
    doc.text(lines, PAGE_MARGIN + BULLET_INDENT, y);
    y += lines.length * LINE_HEIGHT;
  });
  return y;
}

function writeSectionTitle(doc, title, cursorY) {
  const y = ensurePage(doc, cursorY, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(title, PAGE_MARGIN, y);
  return y + 14;
}

export async function downloadResumePdf() {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;

  let y = PAGE_MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(resumeData.fullName, PAGE_MARGIN, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(resumeData.headline, PAGE_MARGIN, y);
  y += 20;

  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  const contactLine = [resumeData.email, resumeData.instagram, siteProfile.instagramUrl].join("  |  ");
  doc.text(toLines(doc, contactLine, contentWidth), PAGE_MARGIN, y);
  doc.setTextColor(20, 20, 20);
  y += 26;

  y = writeSectionTitle(doc, "Professional Summary", y);
  y = writeParagraph(doc, resumeData.summary, y, contentWidth);
  y += SECTION_GAP;

  y = writeSectionTitle(doc, "Core Strengths", y);
  y = writeBulletList(doc, resumeData.strengths, y, contentWidth);
  y += SECTION_GAP;

  y = writeSectionTitle(doc, "Services", y);
  y = writeBulletList(doc, resumeData.services, y, contentWidth);
  y += SECTION_GAP;

  y = writeSectionTitle(doc, "Tools", y);
  y = writeParagraph(doc, resumeData.tools.join(", "), y, contentWidth);
  y += SECTION_GAP;

  y = writeSectionTitle(doc, "Experience", y);

  resumeData.experience.forEach((entry) => {
    y = ensurePage(doc, y, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${entry.role} | ${entry.company}`, PAGE_MARGIN, y);
    y += 14;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(entry.period, PAGE_MARGIN, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(CONTENT_FONT);
    y = writeBulletList(doc, entry.highlights, y, contentWidth);
    y += 10;
  });

  y += SECTION_GAP;
  y = writeSectionTitle(doc, "Delivery Notes", y);
  y = writeBulletList(doc, resumeData.deliveryNotes, y, contentWidth);

  doc.save(siteProfile.resumeFileName);
}
