import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  createSlideContext,
  ensureArtifactToolWorkspace,
  importArtifactTool,
  saveBlobToFile,
} from "/Users/mannz/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/artifact_tool_utils.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THREAD_ID = process.env.CODEX_THREAD_ID || `manual-${Date.now()}`;
const WORKSPACE = path.join(ROOT, "outputs", THREAD_ID, "presentations", "polydegrademl-talk");
const PREVIEW_DIR = path.join(WORKSPACE, "preview");
const QA_DIR = path.join(WORKSPACE, "qa");
const OUTPUT_DIR = path.join(ROOT, "presentation");
const FINAL_PPTX = path.join(OUTPUT_DIR, "PolyDegradeML_academic_ted_talk.pptx");
const NOTES_MD = path.join(OUTPUT_DIR, "PolyDegradeML_academic_ted_talk_speaker_notes.md");
const CONTACT_SHEET = path.join(QA_DIR, "contact_sheet.png");

const COLORS = {
  ink: "#0B1020",
  paper: "#F7F3EA",
  white: "#FFFFFF",
  slate: "#334155",
  muted: "#64748B",
  green: "#2F7D5C",
  gold: "#C58B2B",
  blue: "#2D6CDF",
  red: "#B54747",
  line: "#D6D3CA",
};

const figures = {
  workflow: path.join(ROOT, "figures", "paper", "figure_1_research_workflow.png"),
  importance: path.join(ROOT, "figures", "paper", "figure_2_feature_importance.png"),
  calibration: path.join(ROOT, "figures", "paper", "figure_3_calibration_curve.png"),
  scoreboard: path.join(ROOT, "figures", "paper", "figure_4_reliability_scoreboard.png"),
  crossEnvironment: path.join(ROOT, "figures", "cross_environment", "mean_scores.png"),
};

function addBackground(slide, ctx, fill = COLORS.paper) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill, line: ctx.line(fill, 0) });
}

function addKicker(slide, ctx, text, color = COLORS.green) {
  ctx.addShape(slide, { x: 54, y: 44, w: 12, h: 12, fill: color, line: ctx.line(color, 0) });
  ctx.addText(slide, {
    text,
    x: 76,
    y: 36,
    w: 560,
    h: 28,
    fontSize: 14,
    bold: true,
    color,
    typeface: "Aptos",
    valign: "middle",
  });
}

function addTitle(slide, ctx, title, subtitle = "", dark = false, options = {}) {
  const titleSize = options.titleSize || 42;
  const titleHeight = options.titleHeight || 112;
  const subtitleY = options.subtitleY || 200;
  const subtitleSize = options.subtitleSize || 22;
  ctx.addText(slide, {
    text: title,
    x: 54,
    y: 82,
    w: 760,
    h: titleHeight,
    fontSize: titleSize,
    bold: true,
    color: dark ? COLORS.white : COLORS.ink,
    typeface: "Aptos Display",
  });
  if (subtitle) {
    ctx.addText(slide, {
      text: subtitle,
      x: 56,
      y: subtitleY,
      w: 760,
      h: 72,
      fontSize: subtitleSize,
      color: dark ? "#DCE3EA" : COLORS.slate,
      typeface: "Aptos",
    });
  }
}

function addFooter(slide, ctx, source = "") {
  ctx.addShape(slide, { x: 54, y: 668, w: 1172, h: 1, fill: COLORS.line, line: ctx.line(COLORS.line, 0) });
  ctx.addText(slide, {
    text: source || "PolyDegradeML | Draft presentation | Verify citations and venue requirements before submission",
    x: 56,
    y: 676,
    w: 1100,
    h: 22,
    fontSize: 10,
    color: COLORS.muted,
    typeface: "Aptos",
  });
}

function addBullets(slide, ctx, bullets, x, y, w, fontSize = 22, color = COLORS.ink, gap = 48) {
  bullets.forEach((b, i) => {
    const yy = y + i * gap;
    ctx.addShape(slide, { x, y: yy + 9, w: 8, h: 8, fill: COLORS.gold, line: ctx.line(COLORS.gold, 0) });
    ctx.addText(slide, { text: b, x: x + 22, y: yy, w, h: gap, fontSize, color, typeface: "Aptos" });
  });
}

function addMetric(slide, ctx, label, value, x, y, w, accent = COLORS.green, labelColor = COLORS.slate) {
  ctx.addText(slide, { text: value, x, y, w, h: 58, fontSize: 42, bold: true, color: accent, typeface: "Aptos Display" });
  ctx.addText(slide, { text: label, x, y: y + 58, w, h: 54, fontSize: 15, color: labelColor, typeface: "Aptos" });
}

function addBarChart(slide, ctx, data, x, y, w, h, max = 1, color = COLORS.green) {
  const barH = h / data.length - 18;
  data.forEach((d, i) => {
    const yy = y + i * (barH + 18);
    ctx.addText(slide, { text: d.label, x, y: yy, w: 235, h: barH, fontSize: 16, color: COLORS.ink, typeface: "Aptos", valign: "middle" });
    ctx.addShape(slide, { x: x + 250, y: yy + 6, w: w - 330, h: barH - 12, fill: "#E7E2D8", line: ctx.line("#E7E2D8", 0) });
    ctx.addShape(slide, { x: x + 250, y: yy + 6, w: (w - 330) * (d.value / max), h: barH - 12, fill: d.color || color, line: ctx.line(d.color || color, 0) });
    ctx.addText(slide, { text: d.value.toFixed(4), x: x + w - 70, y: yy, w: 70, h: barH, fontSize: 15, bold: true, color: COLORS.ink, typeface: "Aptos", valign: "middle", align: "right" });
  });
}

function addStage(slide, ctx, label, x, y, w, h, fill, color = COLORS.ink) {
  ctx.addShape(slide, { x, y, w, h, fill, line: ctx.line("#FFFFFF66", 1) });
  ctx.addText(slide, { text: label, x: x + 16, y: y + 14, w: w - 32, h: h - 28, fontSize: 19, bold: true, color, typeface: "Aptos", valign: "middle", align: "center" });
}

function setNotes(slide, notes) {
  slide.speakerNotes.setText(notes.trim());
}

async function addImageIfExists(slide, ctx, filePath, x, y, w, h, fit = "contain") {
  try {
    await fs.access(filePath);
    await ctx.addImage(slide, { path: filePath, x, y, w, h, fit, alt: path.basename(filePath) });
  } catch {
    ctx.addShape(slide, { x, y, w, h, fill: "#EFEAE0", line: ctx.line(COLORS.line, 1) });
    ctx.addText(slide, { text: `Missing figure:\n${filePath}`, x: x + 20, y: y + 20, w: w - 40, h: h - 40, fontSize: 18, color: COLORS.red, typeface: "Aptos" });
  }
}

async function buildDeck() {
  await ensureArtifactToolWorkspace(WORKSPACE);
  const artifact = await importArtifactTool(WORKSPACE);
  const { Presentation, PresentationFile } = artifact;
  const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  const ctx = createSlideContext(artifact, { slideSize: { width: 1280, height: 720 }, workspaceDir: WORKSPACE, outputDir: OUTPUT_DIR });
  const notes = [];

  function slideRecord(title, speakerNotes) {
    notes.push({ n: notes.length + 1, title, speakerNotes: speakerNotes.trim() });
  }

  let slide;

  slide = presentation.slides.add();
  addBackground(slide, ctx, COLORS.ink);
  ctx.addShape(slide, { x: 742, y: 0, w: 538, h: 720, fill: "#173B2E", line: ctx.line("#173B2E", 0) });
  addKicker(slide, ctx, "RELIABILITY-AWARE BIODEGRADATION ML", COLORS.gold);
  addTitle(slide, ctx, "PolyDegradeML", "A research case study in teaching models when not to trust themselves", true);
  ctx.addShape(slide, { x: 800, y: 132, w: 360, h: 370, fill: "#173B2E", line: ctx.line("#173B2E", 0) });
  addMetric(slide, ctx, "QSAR biodegradation samples", "1,055", 820, 145, 290, COLORS.gold, "#C9D4DD");
  addMetric(slide, ctx, "descriptor features", "41", 820, 275, 290, COLORS.gold, "#C9D4DD");
  addMetric(slide, ctx, "final reliability score", "0.8860", 820, 405, 330, COLORS.gold, "#C9D4DD");
  addFooter(slide, ctx, "Sources: datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json; reports/model_reliability_report.md");
  setNotes(slide, "Open by framing the talk as a story about trust. The project is not claiming to solve all plastic degradation, and it is not claiming quantum advantage. It asks a more scientific question: when we build a model for biodegradation prediction, how do we know when to trust it? PolyDegradeML started as a course-style ML project and matured into a reliability-aware research case study.");
  slideRecord("PolyDegradeML", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "THE REAL-WORLD PROBLEM");
  addTitle(slide, ctx, "Plastic degradation is not one problem.", "It is chemistry, biology, time, and environment interacting.");
  addStage(slide, ctx, "Hydrolysis\nwater-mediated cleavage", 78, 330, 310, 145, "#DDE9DF");
  addStage(slide, ctx, "Photo-oxidation\nUV + oxygen chemistry", 485, 330, 310, 145, "#EFE1C6");
  addStage(slide, ctx, "Biodegradation\nmicrobial transformation", 892, 330, 310, 145, "#DDE7F7");
  addBullets(slide, ctx, ["The current model predicts a descriptor-based ready-biodegradability label.", "It does not simulate every degradation mechanism.", "That boundary makes the science stronger, not weaker."], 86, 515, 1080, 20, COLORS.slate, 38);
  addFooter(slide, ctx, "Sources: source_materials/reports/Week_01_Applied_Work.docx; manuscript Section 6.1");
  setNotes(slide, "For a broad audience, make this concrete. A plastic object can crack in sunlight, weaken in water, fragment under abrasion, and be transformed by microbes. These are related but not identical processes. The paper is careful because the dataset supports descriptor-based ready biodegradability classification, not a full mechanistic simulation of the environment.");
  slideRecord("Plastic degradation is not one problem.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "CENTRAL QUESTION");
  addTitle(slide, ctx, "The scientific question changed.", "From: Which model is most accurate? To: Which model is most trustworthy?");
  ctx.addText(slide, { text: "Can chemistry-informed feature engineering and reliability-focused evaluation improve the trustworthiness of machine learning models for biodegradation prediction?", x: 116, y: 322, w: 1030, h: 160, fontSize: 32, bold: true, color: COLORS.ink, typeface: "Aptos Display", align: "center", valign: "middle" });
  addFooter(slide, ctx, "Source: paper/manuscript_draft.md");
  setNotes(slide, "This is the thesis sentence. The early project could have ended with an accuracy table. The stronger research version asks whether the model remains calibrated, whether it knows when it is uncertain, and whether it behaves sensibly outside its comfort zone.");
  slideRecord("The scientific question changed.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "FROM CHEMISTRY TO DATA");
  addTitle(slide, ctx, "QSAR turns chemical structure into numbers.", "Descriptor-based models use numerical chemical features to predict biological or environmental outcomes.");
  addStage(slide, ctx, "Chemical\ncompound", 78, 340, 220, 104, "#E7E2D8");
  addStage(slide, ctx, "41 molecular\ndescriptors", 386, 340, 220, 104, "#DDE7F7");
  addStage(slide, ctx, "ML model", 694, 340, 220, 104, "#EFE1C6");
  addStage(slide, ctx, "RB / NRB\nprediction", 1002, 340, 220, 104, "#DDE9DF");
  ctx.addText(slide, { text: "The current dataset is descriptor-only: no polymer names, no SMILES, no BigSMILES, no measured degradation rates.", x: 112, y: 510, w: 1040, h: 70, fontSize: 24, bold: true, color: COLORS.red, typeface: "Aptos", align: "center" });
  addFooter(slide, ctx, "Sources: datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json; reports/dataset_curation.md");
  setNotes(slide, "Explain QSAR without assuming prior knowledge. Instead of giving the model a full molecular movie, we give it numerical descriptors. That is useful, but it also imposes limits. This slide is a guardrail against overclaiming.");
  slideRecord("QSAR turns chemical structure into numbers.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "DATASET REALITY");
  addTitle(slide, ctx, "A reusable framework begins with honest metadata.", "The dataset is useful for classification, but not complete for polymer degradation science.");
  addMetric(slide, ctx, "samples", "1,055", 90, 310, 250);
  addMetric(slide, ctx, "features", "41", 375, 310, 250);
  addMetric(slide, ctx, "target classes", "2", 660, 310, 250);
  addMetric(slide, ctx, "missing values", "0", 945, 310, 250);
  addBullets(slide, ctx, ["Target labels: readily biodegradable and not readily biodegradable.", "Limitations: no structures, no continuous rates, limited environmental metadata.", "This is why reliability and uncertainty matter."], 110, 500, 1040, 21, COLORS.slate, 38);
  addFooter(slide, ctx, "Source: datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json");
  setNotes(slide, "This slide should reassure professors and peers: the work is not hiding limitations. It names them. For younger students, emphasize that good science starts by saying exactly what the data can and cannot answer.");
  slideRecord("A reusable framework begins with honest metadata.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "MODEL BASELINES");
  addTitle(slide, ctx, "The first models learned real signal.", "But initial accuracy was only the beginning of the story.");
  addBarChart(slide, ctx, [
    { label: "Random Forest", value: 0.8768, color: COLORS.green },
    { label: "Logistic Regression", value: 0.8626, color: COLORS.blue },
    { label: "Feedforward NN", value: 0.8246, color: COLORS.gold },
    { label: "Descriptor graph", value: 0.6967, color: COLORS.red },
  ], 110, 300, 1000, 260, 1);
  addFooter(slide, ctx, "Sources: reports/baseline_modeling.md; reports/neural_network_baseline_summary.txt; reports/descriptor_graph_prototype_summary.txt");
  setNotes(slide, "Walk through this as the first major evidence step. Random Forest and Logistic Regression performed well, the neural network was useful but not dominant, and the descriptor-graph prototype underperformed. The important point is not to shame any model. The point is that model complexity alone did not solve the scientific problem.");
  slideRecord("The first models learned real signal.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx, "#FBFAF6");
  addKicker(slide, ctx, "THE TURNING POINT");
  addTitle(slide, ctx, "Accuracy can be the wrong kind of confidence.", "A model can score well on familiar data and still fail under shift.");
  ctx.addText(slide, { text: "High accuracy alone was insufficient for trustworthy degradation prediction.", x: 104, y: 310, w: 1072, h: 92, fontSize: 38, bold: true, color: COLORS.ink, typeface: "Aptos Display", align: "center" });
  addBullets(slide, ctx, ["Calibration asks: are probabilities meaningful?", "Uncertainty asks: does the model know when it may be wrong?", "Cross-environment testing asks: what happens outside the training distribution?"], 170, 465, 900, 22, COLORS.slate, 42);
  addFooter(slide, ctx, "Source: reports/main_findings.md");
  setNotes(slide, "This is the TED-style pivot. A student can understand this through daily life: being confident is only useful if confidence tracks reality. The same is true for machine learning. A confident wrong answer is more dangerous than an uncertain wrong answer.");
  slideRecord("Accuracy can be the wrong kind of confidence.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "RELIABILITY TOOLKIT");
  addTitle(slide, ctx, "The project evaluated trust as a measurable property.", "Reliability was operationalized through multiple stress tests.");
  const tools = [
    ["Calibration", "Brier score, log loss, ECE"],
    ["Uncertainty", "entropy and uncertainty gap"],
    ["Selective prediction", "accuracy when retaining confident cases"],
    ["Cross-environment validation", "proxy distribution-shift behavior"],
    ["Overconfidence checks", "confidence on incorrect predictions"],
  ];
  tools.forEach((t, i) => {
    const x = 90 + (i % 3) * 380;
    const y = 305 + Math.floor(i / 3) * 135;
    ctx.addShape(slide, { x, y, w: 320, h: 95, fill: i % 2 ? "#EFE1C6" : "#DDE9DF", line: ctx.line("#D0C7B5", 1) });
    ctx.addText(slide, { text: t[0], x: x + 18, y: y + 12, w: 284, h: 42, fontSize: 19, bold: true, color: COLORS.ink, typeface: "Aptos" });
    ctx.addText(slide, { text: t[1], x: x + 18, y: y + 58, w: 284, h: 30, fontSize: 13, color: COLORS.slate, typeface: "Aptos" });
  });
  addFooter(slide, ctx, "Sources: reports/uncertainty_reliability_summary.txt; reports/model_reliability_report.md");
  setNotes(slide, "This slide is for academic rigor. Say that trust was not treated as a vibe. It was translated into metrics. Each metric catches a different failure mode, so the final decision does not depend on one fragile number.");
  slideRecord("The project evaluated trust as a measurable property.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "CHEMISTRY-INFORMED FEATURES");
  addTitle(slide, ctx, "Chemistry-aware proxies helped, but did not magically solve the problem.", "The FNN improved under engineered features, while reliability still required full evaluation.");
  await addImageIfExists(slide, ctx, figures.importance, 660, 190, 520, 360);
  addBullets(slide, ctx, ["Proxy features summarized heteroatom, halogen, polarity, donor/acceptor, and topology signals.", "FNN recall improved from 0.8145 to 0.8399 in the reported feature-engineering comparison.", "Proxy features are not true quantum descriptors."], 70, 275, 540, 21, COLORS.ink, 58);
  addFooter(slide, ctx, "Sources: reports/feature_engineering_summary.txt; results/tables/feature_engineering_model_results.csv");
  setNotes(slide, "This is where the chemistry enters the ML story. The engineered features were useful, especially for the neural baseline, but the paper stays cautious. Proxy chemistry is not the same as measured or computed quantum chemistry.");
  slideRecord("Chemistry-aware proxies helped, but did not magically solve the problem.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "GENERALIZATION STRESS TEST");
  addTitle(slide, ctx, "Cross-environment validation revealed fragility.", "Models that looked strong in ordinary validation dropped under proxy descriptor-space shift.");
  addBarChart(slide, ctx, [
    { label: "Random Forest", value: 0.4210, color: COLORS.green },
    { label: "Logistic Regression", value: 0.3727, color: COLORS.blue },
    { label: "Descriptor graph", value: 0.3688, color: COLORS.gold },
    { label: "Feedforward NN", value: 0.3532, color: COLORS.red },
  ], 110, 315, 1000, 260, 0.5);
  addFooter(slide, ctx, "Source: reports/cross_environment_validation.md");
  setNotes(slide, "This is one of the strongest scientific findings. Ordinary validation told one story. Proxy cross-environment validation told a more cautious story. Random Forest remained strongest in that test, but the absolute performance drop showed that generalization is the hard part.");
  slideRecord("Cross-environment validation revealed fragility.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "CALIBRATION AND UNCERTAINTY");
  addTitle(slide, ctx, "The question became: can the model know when it may be wrong?", "Uncertainty matters most when predictions enter scientific or environmental decisions.");
  await addImageIfExists(slide, ctx, figures.calibration, 650, 175, 530, 380);
  addMetric(slide, ctx, "RF full-enhanced Brier", "0.0950", 92, 315, 250);
  addMetric(slide, ctx, "RF top-ranked ECE", "0.0297", 370, 315, 250, COLORS.blue);
  addBullets(slide, ctx, ["Overconfidence under shift became a key risk.", "Selective prediction tested whether confidence filtering improved accuracy."], 95, 505, 520, 21, COLORS.slate, 44);
  addFooter(slide, ctx, "Source: reports/uncertainty_reliability_summary.txt");
  setNotes(slide, "Make the calibration idea intuitive: if a model says 80 percent confidence, it should be right about 80 percent of the time across similar predictions. The project found that uncertainty behavior helped distinguish candidates that accuracy alone could not separate.");
  slideRecord("The question became: can the model know when it may be wrong?", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "QUANTUM PRIMER");
  addTitle(slide, ctx, "Start with the simplest distinction: states versus amplitudes.", "Classical computation can represent probabilities, but quantum computation physically evolves probability amplitudes.");
  addStage(slide, ctx, "Classical bit\n0 or 1", 105, 310, 265, 130, "#E7E2D8");
  addStage(slide, ctx, "Classical probability\np(0), p(1)", 405, 310, 265, 130, "#DDE7F7");
  addStage(slide, ctx, "Quantum state\namplitudes alpha, beta", 705, 310, 265, 130, "#EFE1C6");
  addStage(slide, ctx, "Measurement\nprobable outcome", 1005, 310, 180, 130, "#DDE9DF");
  addBullets(slide, ctx, [
    "A probability is nonnegative and directly describes likelihood.",
    "A quantum amplitude can carry sign or phase before measurement.",
    "Interference is what lets amplitudes reinforce or cancel."
  ], 150, 510, 940, 21, COLORS.slate, 40);
  addFooter(slide, ctx, "Conceptual primer. Add quantum information citation before external submission.");
  setNotes(slide, "This is the small intro for people who are new to the idea. A classical digital state is explicit: a bit is zero or one. A classical probability distribution can say how likely each state is, but the probabilities themselves do not interfere. A quantum state is described by amplitudes. Those amplitudes can combine with phase, so the computation can change the geometry of likelihood before measurement.");
  slideRecord("Start with the simplest distinction: states versus amplitudes.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "PROBABILITY AND STATISTICAL MECHANICS INTUITION");
  addTitle(slide, ctx, "Many scientific systems are understood through distributions.", "Statistical mechanics gives an intuition: we often cannot track every microscopic path, so we reason over ensembles and likely states.");
  ctx.addText(slide, { text: "Microscopic possibilities", x: 90, y: 300, w: 300, h: 40, fontSize: 22, bold: true, color: COLORS.ink, typeface: "Aptos", align: "center" });
  [0.14, 0.31, 0.48, 0.69, 0.88].forEach((v, i) => {
    ctx.addShape(slide, { x: 115 + i * 48, y: 395 - v * 120, w: 30, h: v * 120, fill: COLORS.gold, line: ctx.line(COLORS.gold, 0) });
  });
  ctx.addText(slide, { text: "probability distribution", x: 85, y: 430, w: 310, h: 28, fontSize: 16, color: COLORS.slate, typeface: "Aptos", align: "center" });
  ctx.addShape(slide, { x: 455, y: 352, w: 155, h: 3, fill: COLORS.line, line: ctx.line(COLORS.line, 0) });
  ctx.addText(slide, { text: "sampling / measurement", x: 420, y: 385, w: 225, h: 32, fontSize: 16, color: COLORS.slate, typeface: "Aptos", align: "center" });
  ctx.addText(slide, { text: "Observed behavior", x: 690, y: 300, w: 350, h: 40, fontSize: 22, bold: true, color: COLORS.ink, typeface: "Aptos", align: "center" });
  ctx.addShape(slide, { x: 760, y: 365, w: 210, h: 80, fill: "#DDE9DF", line: ctx.line("#AFC8B5", 1) });
  ctx.addText(slide, { text: "most likely states\nbecome visible", x: 790, y: 382, w: 150, h: 52, fontSize: 19, bold: true, color: COLORS.ink, typeface: "Aptos", align: "center", valign: "middle" });
  addBullets(slide, ctx, [
    "In ML, predicted probabilities are a classical distribution over labels.",
    "In quantum computing, amplitudes evolve before becoming probabilities.",
    "This project used classical probabilities, but the mindset reinforced why uncertainty had to be measured."
  ], 130, 520, 1000, 21, COLORS.slate, 38);
  addFooter(slide, ctx, "Conceptual analogy only. This project did not implement statistical mechanics simulation or quantum ML.");
  setNotes(slide, "Use statistical mechanics as an intuition, not as a claim that the project simulated thermodynamics. In many scientific problems, we cannot follow every microscopic event, so we reason about distributions and likely macroscopic outcomes. Machine learning probabilities are classical distributions over labels. Quantum computing goes one level deeper by manipulating amplitudes before probabilities appear through measurement.");
  slideRecord("Many scientific systems are understood through distributions.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx, COLORS.ink);
  addKicker(slide, ctx, "A QUANTUM DETOUR, CAREFULLY BOUNDED", COLORS.gold);
  addTitle(slide, ctx, "Classical computing manipulates states. Quantum computing manipulates amplitudes.", "That distinction matters conceptually, but it is not a result of this project.", true, { titleSize: 36, titleHeight: 150, subtitleY: 245, subtitleSize: 20 });
  addStage(slide, ctx, "Classical\nexplicit states\n0 or 1", 110, 385, 300, 130, "#FFFFFF", COLORS.ink);
  addStage(slide, ctx, "Quantum\nprobability amplitudes\nsuperposition", 490, 385, 300, 130, "#EFE1C6", COLORS.ink);
  addStage(slide, ctx, "Interference\namplify / suppress\ncandidate outcomes", 870, 385, 300, 130, "#DDE9DF", COLORS.ink);
  addFooter(slide, ctx, "Conceptual rationale only. Citation needed before submission. No quantum ML implemented in this repository.");
  setNotes(slide, "This is the bridge into the quantum idea. Be explicit: this is not a claim that the current project used quantum computing. It is a conceptual reason quantum methods were considered. Classical systems manipulate explicit states. Quantum systems manipulate probability amplitudes. Interference can reshape which outcomes become likely when measured.");
  slideRecord("Classical computing manipulates states. Quantum computing manipulates amplitudes.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "WHY NOT STOP AT CLASSICAL DESCRIPTORS?");
  addTitle(slide, ctx, "Quantum was considered alongside classical descriptors, not chosen over them.", "Classical descriptors powered the current results; quantum thinking clarified what richer future representations could add.", false, { titleSize: 35, titleHeight: 150, subtitleY: 248, subtitleSize: 19 });
  addStage(slide, ctx, "Current project\nclassical QSAR descriptors", 86, 335, 310, 118, "#DDE7F7");
  addStage(slide, ctx, "Proxy chemistry\nengineered summaries", 485, 335, 310, 118, "#EFE1C6");
  addStage(slide, ctx, "Future direction\ncomputed quantum descriptors", 884, 335, 310, 118, "#DDE9DF");
  addBullets(slide, ctx, [
    "Classical descriptors are practical, reproducible, and already supported by the dataset.",
    "They may not fully represent electronic structure, conformational behavior, or interaction-driven chemistry.",
    "Quantum descriptors could eventually add HOMO-LUMO gap, dipole moment, polarizability, and charge-distribution information."
  ], 105, 510, 1050, 20, COLORS.slate, 38);
  addFooter(slide, ctx, "Sources: reports/feature_engineering_summary.txt; paper/manuscript_draft.md. Future-work rationale only.");
  setNotes(slide, "This slide directly answers the user's requested framing while protecting rigor. We did not choose quantum over classical descriptors in the implemented model. We used classical descriptors. Quantum was considered because classical descriptors are fixed summaries, while true quantum chemical descriptors may capture electronic properties that matter for chemical reactivity and degradation mechanisms.");
  slideRecord("Quantum was considered alongside classical descriptors, not chosen over them.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "HOW DID IT BENEFIT THE PROJECT?");
  addTitle(slide, ctx, "The benefit was conceptual and methodological.", "Quantum framing did not improve metrics yet, but it sharpened the scientific roadmap.");
  addBullets(slide, ctx, [
    "It separated proxy chemistry features from true computed quantum descriptors.",
    "It reinforced that biodegradation prediction is probabilistic, not merely deterministic label lookup.",
    "It supported the decision to evaluate calibration, uncertainty, and overconfidence.",
    "It created a future benchmark question: do richer representations improve reliability, not just accuracy?"
  ], 120, 285, 980, 24, COLORS.ink, 64);
  ctx.addText(slide, { text: "No implemented quantum model. No claimed quantum advantage. No metric improvement attributed to quantum methods.", x: 160, y: 590, w: 960, h: 54, fontSize: 22, bold: true, color: COLORS.red, typeface: "Aptos", align: "center" });
  addFooter(slide, ctx, "Evidence boundary: current results come from classical ML models and reliability analysis.");
  setNotes(slide, "This is the benefit section. The benefit was not empirical performance, because the project did not implement a quantum model. The benefit was intellectual discipline: it helped clarify the difference between proxy descriptors and future computed quantum descriptors, and it strengthened the probability-centered reliability story.");
  slideRecord("The benefit was conceptual and methodological.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "WHY QUANTUM METHODS WERE CONSIDERED");
  addTitle(slide, ctx, "The motivation was representation, not hype.", "For chemical prediction, the interesting question is whether alternative probabilistic representations help.");
  addBullets(slide, ctx, ["High-dimensional chemical relationships can be nonlinear and uncertain.", "Quantum algorithms can be understood as engineering probability-amplitude evolution.", "Future work would need a defined encoding, simulator or hardware constraints, and direct comparison against classical reliability metrics.", "No claim of quantum speedup or quantum advantage is made here."], 116, 280, 1000, 24, COLORS.ink, 66);
  addFooter(slide, ctx, "Source: paper/manuscript_draft.md, Section 4.7. Quantum information citation still needed.");
  setNotes(slide, "This slide protects rigor. It says why the idea is intellectually interesting without turning into quantum hype. The right research question is not 'is quantum faster?' It is 'does a quantum or quantum-inspired representation produce measurable, reproducible improvements under the same reliability tests?'");
  slideRecord("The motivation was representation, not hype.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "FINAL MODEL SELECTION");
  addTitle(slide, ctx, "The final choice was balanced, not one-metric-best.", "The top-ranked Random Forest was selected by the composite reliability scoreboard.", false, { subtitleSize: 20 });
  await addImageIfExists(slide, ctx, figures.scoreboard, 650, 228, 520, 345);
  addMetric(slide, ctx, "reliability score", "0.8860", 82, 315, 250);
  addMetric(slide, ctx, "CV accuracy", "0.8626", 360, 315, 210, COLORS.blue);
  addMetric(slide, ctx, "cross-env accuracy", "0.5848", 82, 465, 250, COLORS.gold);
  addMetric(slide, ctx, "Brier score", "0.1003", 360, 465, 210, COLORS.green);
  addFooter(slide, ctx, "Source: reports/model_reliability_report.md; results/tables/model_reliability_scoreboard.csv");
  setNotes(slide, "Make clear that the selected model did not win every individual metric. That is the point. It was chosen because it was the best balance across accuracy, calibration, selective prediction, uncertainty behavior, and cross-environment behavior.");
  slideRecord("The final choice was balanced, not one-metric-best.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "WHAT WE LEARNED");
  addTitle(slide, ctx, "The strongest finding is methodological.", "Trustworthy biodegradation prediction needs evaluation beyond accuracy.");
  addBullets(slide, ctx, ["Random Forest gave the strongest overall reliability profile.", "Chemistry-aware features helped selected models, especially the neural baseline.", "Neural complexity alone did not dominate classical baselines.", "Cross-environment testing exposed generalization risk.", "Overconfidence under shift is a scientific reliability problem."], 120, 285, 1000, 25, COLORS.ink, 60);
  addFooter(slide, ctx, "Source: reports/main_findings.md");
  setNotes(slide, "This is the clean summary slide. The contribution is not 'we got high accuracy.' The contribution is that reliability metrics changed how model quality was interpreted.");
  slideRecord("The strongest finding is methodological.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "FOR YOUNG SCIENTISTS");
  addTitle(slide, ctx, "The exciting part is not that the model was perfect.", "The exciting part is learning how to ask a better question.");
  ctx.addText(slide, { text: "Good science is not being certain. Good science is knowing what would make you less certain.", x: 100, y: 300, w: 1080, h: 130, fontSize: 42, bold: true, color: COLORS.ink, typeface: "Aptos Display", align: "center" });
  addBullets(slide, ctx, ["Chemistry explains what might matter.", "Machine learning tests patterns at scale.", "Reliability tells us when the pattern may break."], 210, 500, 840, 23, COLORS.slate, 44);
  addFooter(slide, ctx, "Educational framing based on PolyDegradeML manuscript and generated reports.");
  setNotes(slide, "This is the TED-talk moment. Invite young students in. The point is not to make science look easy. The point is to show that science is a disciplined way of being curious. The model's limits are not embarrassing; they are the doorway to the next experiment.");
  slideRecord("The exciting part is learning how to ask a better question.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx);
  addKicker(slide, ctx, "NEXT RESEARCH STEPS");
  addTitle(slide, ctx, "The path forward is clearer now.", "Stronger data, better representation, and experimental validation come next.");
  const future = [
    "Polymer-specific structures: SMILES, BigSMILES, repeat units",
    "True quantum chemical descriptors, not proxy features",
    "Graph neural networks with chemically meaningful atom/bond inputs",
    "External datasets and measured environmental metadata",
    "Continuous degradation-rate modeling",
    "Active learning and experimental validation",
  ];
  addBullets(slide, ctx, future, 90, 255, 1050, 22, COLORS.ink, 56);
  addFooter(slide, ctx, "Source: paper/manuscript_draft.md, Future Work");
  setNotes(slide, "End by showing that the project creates a launchpad. The present work is a reliable classical baseline and a reproducible evaluation template. Future work should improve representation and validation rather than making broader claims too early.");
  slideRecord("The path forward is clearer now.", slide.speakerNotes.text);

  slide = presentation.slides.add();
  addBackground(slide, ctx, COLORS.ink);
  addKicker(slide, ctx, "CLOSING", COLORS.gold);
  addTitle(slide, ctx, "A model is useful only when we understand its uncertainty.", "PolyDegradeML is a case study in turning prediction into scientific judgment.", true);
  ctx.addText(slide, { text: "From biodegradation chemistry to descriptor-based ML to reliability-centered evaluation, the project shows how computational tools can become more honest, reusable, and scientifically useful.", x: 130, y: 360, w: 1020, h: 132, fontSize: 28, color: "#E5E7EB", typeface: "Aptos", align: "center" });
  addFooter(slide, ctx, "PolyDegradeML | Draft academic and TED-style conference presentation");
  setNotes(slide, "Close with humility and confidence together. The project does not claim to predict all environmental degradation. It does show how a model can be evaluated more responsibly. That is the contribution.");
  slideRecord("A model is useful only when we understand its uncertainty.", slide.speakerNotes.text);

  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const previewPaths = [];
  for (let i = 0; i < presentation.slides.count; i += 1) {
    const slideObj = presentation.slides.getItem(i);
    const previewPath = path.join(PREVIEW_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    const png = await presentation.export({ slide: slideObj, format: "png", scale: 1 });
    await saveBlobToFile(png, previewPath);
    previewPaths.push(previewPath);
  }

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);

  const notesMd = [
    "# PolyDegradeML Academic / TED-Style Talk Speaker Notes",
    "",
    "These notes are also embedded in the PowerPoint speaker notes.",
    "",
    ...notes.flatMap((entry) => [`## Slide ${entry.n}. ${entry.title}`, "", entry.speakerNotes, ""]),
  ].join("\n");
  await fs.writeFile(NOTES_MD, notesMd, "utf8");

  const makeSheet = spawnSync(
    "/Users/mannz/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
    [
      "/Users/mannz/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/make_contact_sheet.py",
      "--output",
      CONTACT_SHEET,
      ...previewPaths,
    ],
    { encoding: "utf8" },
  );
  if (makeSheet.status !== 0) {
    throw new Error(`Contact sheet failed:\n${makeSheet.stdout}\n${makeSheet.stderr}`);
  }

  console.log(JSON.stringify({ pptx: FINAL_PPTX, notes: NOTES_MD, contactSheet: CONTACT_SHEET, slideCount: presentation.slides.count }, null, 2));
}

buildDeck().catch((err) => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});
