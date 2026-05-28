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
const WORKSPACE = path.join(ROOT, "outputs", THREAD_ID, "presentations", "polydegrademl-comprehensive-defense");
const PREVIEW_DIR = path.join(WORKSPACE, "preview");
const QA_DIR = path.join(WORKSPACE, "qa");
const CONTACT_SHEET = path.join(QA_DIR, "contact_sheet.png");
const OUTPUT_DIR = path.join(ROOT, "presentation");
const FINAL_PPTX = path.join(OUTPUT_DIR, "PolyDegradeML_comprehensive_defense.pptx");
const NOTES_MD = path.join(OUTPUT_DIR, "PolyDegradeML_comprehensive_defense_speaker_notes.md");

const C = {
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
  paleGreen: "#DDE9DF",
  paleGold: "#EFE1C6",
  paleBlue: "#DDE7F7",
  paleGray: "#E7E2D8",
};

const fig = {
  banner: "figures/branding/polydegrademl_banner.png",
  workflow: "figures/paper/figure_1_research_workflow.png",
  featureImportance: "figures/paper/figure_2_feature_importance.png",
  calibration: "figures/paper/figure_3_calibration_curve.png",
  scoreboard: "figures/paper/figure_4_reliability_scoreboard.png",
  featureSet: "figures/feature_engineering/feature_set_comparison.png",
  featureSet2: "figures/feature_importance/feature_set_comparison.png",
  crossMean: "figures/cross_environment/mean_scores.png",
  rbHeatmap: "figures/cross_environment/rb_recall_heatmap.png",
  accCal: "figures/model_selection/accuracy_calibration_tradeoff.png",
  metricHeatmap: "figures/model_selection/metric_heatmap.png",
  selectiveTop: "figures/model_selection/selective_top_candidates.png",
  selective: "figures/uncertainty_calibration/selective_accuracy.png",
  uncertainty: "figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png",
  modelProgress: "presentation/assets/model_progression_comparison.png",
};

function P(rel) {
  return path.join(ROOT, rel);
}

function addBg(slide, ctx, fill = C.paper) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill, line: ctx.line(fill, 0) });
}

function footer(slide, ctx, source = "") {
  ctx.addShape(slide, { x: 46, y: 668, w: 1188, h: 1, fill: C.line, line: ctx.line(C.line, 0) });
  ctx.addText(slide, {
    text: source || "PolyDegradeML comprehensive defense deck | Values should be regenerated before publication submission",
    x: 48,
    y: 676,
    w: 1130,
    h: 22,
    fontSize: 9.5,
    color: C.muted,
    typeface: "Aptos",
  });
}

function kicker(slide, ctx, text, color = C.green) {
  ctx.addShape(slide, { x: 48, y: 43, w: 12, h: 12, fill: color, line: ctx.line(color, 0) });
  ctx.addText(slide, { text, x: 70, y: 35, w: 640, h: 28, fontSize: 13, bold: true, color, typeface: "Aptos", valign: "middle" });
}

function title(slide, ctx, text, sub = "", dark = false, opts = {}) {
  ctx.addText(slide, {
    text,
    x: 48,
    y: opts.y ?? 82,
    w: opts.w ?? 850,
    h: opts.h ?? 118,
    fontSize: opts.size ?? 40,
    bold: true,
    color: dark ? C.white : C.ink,
    typeface: "Aptos Display",
  });
  if (sub) {
    ctx.addText(slide, {
      text: sub,
      x: 50,
      y: opts.subY ?? 205,
      w: opts.subW ?? 920,
      h: opts.subH ?? 72,
      fontSize: opts.subSize ?? 20,
      color: dark ? "#E5E7EB" : C.slate,
      typeface: "Aptos",
    });
  }
}

function bullets(slide, ctx, items, x, y, w, opts = {}) {
  const fontSize = opts.fontSize ?? 20;
  const gap = opts.gap ?? 44;
  const color = opts.color ?? C.ink;
  items.forEach((item, i) => {
    const yy = y + i * gap;
    ctx.addShape(slide, { x, y: yy + 9, w: 8, h: 8, fill: opts.bulletColor ?? C.gold, line: ctx.line(opts.bulletColor ?? C.gold, 0) });
    ctx.addText(slide, { text: item, x: x + 22, y: yy, w, h: gap + 10, fontSize, color, typeface: "Aptos" });
  });
}

function card(slide, ctx, x, y, w, h, head, body, fill = C.paleGreen) {
  ctx.addShape(slide, { x, y, w, h, fill, line: ctx.line("#C8C2B8", 1) });
  ctx.addText(slide, { text: head, x: x + 18, y: y + 14, w: w - 36, h: 34, fontSize: 19, bold: true, color: C.ink, typeface: "Aptos" });
  ctx.addText(slide, { text: body, x: x + 18, y: y + 54, w: w - 36, h: h - 66, fontSize: 14, color: C.slate, typeface: "Aptos" });
}

function metric(slide, ctx, label, value, x, y, w, accent = C.green, labelColor = C.slate) {
  ctx.addText(slide, { text: value, x, y, w, h: 56, fontSize: 38, bold: true, color: accent, typeface: "Aptos Display" });
  ctx.addText(slide, { text: label, x, y: y + 56, w, h: 44, fontSize: 13.5, color: labelColor, typeface: "Aptos" });
}

function bars(slide, ctx, data, x, y, w, h, max = 1) {
  const row = h / data.length;
  data.forEach((d, i) => {
    const yy = y + i * row;
    ctx.addText(slide, { text: d.label, x, y: yy, w: 270, h: row, fontSize: 15, color: C.ink, typeface: "Aptos", valign: "middle" });
    ctx.addShape(slide, { x: x + 285, y: yy + 11, w: w - 380, h: row - 22, fill: "#E5E0D6", line: ctx.line("#E5E0D6", 0) });
    ctx.addShape(slide, { x: x + 285, y: yy + 11, w: Math.max(2, (w - 380) * d.value / max), h: row - 22, fill: d.color || C.green, line: ctx.line(d.color || C.green, 0) });
    ctx.addText(slide, { text: d.value.toFixed(4), x: x + w - 78, y: yy, w: 78, h: row, fontSize: 14, bold: true, color: C.ink, typeface: "Aptos", align: "right", valign: "middle" });
  });
}

async function image(slide, ctx, rel, x, y, w, h, fit = "contain") {
  try {
    await fs.access(P(rel));
    await ctx.addImage(slide, { path: P(rel), x, y, w, h, fit, alt: rel });
  } catch {
    ctx.addShape(slide, { x, y, w, h, fill: "#EFEAE0", line: ctx.line(C.line, 1) });
    ctx.addText(slide, { text: `Missing figure:\n${rel}`, x: x + 18, y: y + 18, w: w - 36, h: h - 36, fontSize: 18, color: C.red, typeface: "Aptos" });
  }
}

function notesText(slide, text) {
  slide.speakerNotes.setText(text.trim());
}

function makeNotes({ titleText, subtitle = "", items, cards, source = "", rel = "", data, notes = "" }) {
  const lines = [];
  lines.push(notes || `Purpose: explain why "${titleText}" matters to the research argument.`);
  if (subtitle) lines.push(`Core message: ${subtitle}`);
  if (items?.length) {
    lines.push("Talk track:");
    items.slice(0, 5).forEach((item) => lines.push(`- ${item}`));
  }
  if (cards?.length) {
    lines.push("Key elements to walk through:");
    cards.slice(0, 6).forEach((c) => lines.push(`- ${c[0]}: ${c[1]}`));
  }
  if (data?.length) {
    lines.push("Quantitative emphasis:");
    data.slice(0, 5).forEach((d) => lines.push(`- ${d.label}: ${d.value.toFixed(4)}`));
  }
  if (rel) lines.push(`Figure to reference: ${rel}`);
  if (source) lines.push(`Evidence source: ${source}`);
  if (/quantum/i.test(`${titleText} ${subtitle} ${items?.join(" ") || ""}`)) {
    lines.push("Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.");
  }
  lines.push("Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.");
  return lines.join("\n\n");
}

function sectionSlide(presentation, ctx, section, titleText, subtitle, notes, records) {
  const slide = presentation.slides.add();
  addBg(slide, ctx, C.ink);
  kicker(slide, ctx, section, C.gold);
  title(slide, ctx, titleText, subtitle, true, { w: 1000, h: 170, size: 44, subY: 285, subW: 980 });
  footer(slide, ctx, "Section divider");
  notesText(slide, makeNotes({ titleText, subtitle, source: "Section divider", notes: notes || `Section transition: ${titleText}. Preview the questions this section will answer and why they matter to the overall argument.` }));
  records.push({ title: titleText, notes: slide.speakerNotes.text });
}

function simpleSlide(presentation, ctx, records, { section, titleText, subtitle, items, source, notes, cards }) {
  const slide = presentation.slides.add();
  addBg(slide, ctx);
  kicker(slide, ctx, section);
  title(slide, ctx, titleText, subtitle);
  if (items) bullets(slide, ctx, items, 90, 285, 1030, { fontSize: 20, gap: 52 });
  if (cards) {
    cards.forEach((c, i) => card(slide, ctx, 76 + (i % 3) * 390, 300 + Math.floor(i / 3) * 135, 330, 98, c[0], c[1], c[2] || (i % 2 ? C.paleGold : C.paleGreen)));
  }
  footer(slide, ctx, source);
  notesText(slide, makeNotes({ titleText, subtitle, items, cards, source, notes }));
  records.push({ title: titleText, notes: slide.speakerNotes.text });
}

async function imageSlide(presentation, ctx, records, { section, titleText, subtitle, rel, source, notes, sideItems }) {
  const slide = presentation.slides.add();
  addBg(slide, ctx);
  kicker(slide, ctx, section);
  title(slide, ctx, titleText, subtitle, false, { size: 34, h: 112, subY: 190 });
  if (sideItems) {
    await image(slide, ctx, rel, 620, 205, 560, 395);
    bullets(slide, ctx, sideItems, 75, 300, 500, { fontSize: 19, gap: 54 });
  } else {
    await image(slide, ctx, rel, 105, 210, 1070, 420);
  }
  footer(slide, ctx, source || rel);
  notesText(slide, makeNotes({ titleText, subtitle, items: sideItems, source: source || rel, rel, notes }));
  records.push({ title: titleText, notes: slide.speakerNotes.text });
}

function compareSlide(presentation, ctx, records, { section, titleText, subtitle, cols, rows, source, notes }) {
  const slide = presentation.slides.add();
  addBg(slide, ctx);
  kicker(slide, ctx, section);
  title(slide, ctx, titleText, subtitle, false, { size: 34, h: 108, subY: 185 });
  const x0 = 76, y0 = 275, colW = 1128 / cols.length, rowH = 54;
  cols.forEach((c, i) => {
    ctx.addShape(slide, { x: x0 + i * colW, y: y0, w: colW - 4, h: rowH, fill: C.paleBlue, line: ctx.line("#C8C2B8", 1) });
    ctx.addText(slide, { text: c, x: x0 + i * colW + 10, y: y0 + 11, w: colW - 24, h: rowH - 18, fontSize: 15, bold: true, color: C.ink, typeface: "Aptos", valign: "middle" });
  });
  rows.forEach((r, ri) => {
    r.forEach((txt, ci) => {
      const fill = ri % 2 ? "#FBF8F0" : "#FFFFFF";
      ctx.addShape(slide, { x: x0 + ci * colW, y: y0 + rowH + ri * rowH, w: colW - 4, h: rowH, fill, line: ctx.line("#DDD7CB", 1) });
      ctx.addText(slide, { text: txt, x: x0 + ci * colW + 10, y: y0 + rowH + ri * rowH + 8, w: colW - 24, h: rowH - 10, fontSize: 13.5, color: C.ink, typeface: "Aptos", valign: "middle" });
    });
  });
  footer(slide, ctx, source);
  notesText(slide, makeNotes({ titleText, subtitle, source, notes: notes || `Walk through the table by comparing columns first, then explaining the scientific implication of each row.` }));
  records.push({ title: titleText, notes: slide.speakerNotes.text });
}

function barSlide(presentation, ctx, records, { section, titleText, subtitle, data, max, source, notes }) {
  const slide = presentation.slides.add();
  addBg(slide, ctx);
  kicker(slide, ctx, section);
  title(slide, ctx, titleText, subtitle);
  bars(slide, ctx, data, 95, 295, 1030, 310, max);
  footer(slide, ctx, source);
  notesText(slide, makeNotes({ titleText, subtitle, data, source, notes }));
  records.push({ title: titleText, notes: slide.speakerNotes.text });
}

async function build() {
  await ensureArtifactToolWorkspace(WORKSPACE);
  const artifact = await importArtifactTool(WORKSPACE);
  const { Presentation, PresentationFile } = artifact;
  const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  const ctx = createSlideContext(artifact, { slideSize: { width: 1280, height: 720 }, workspaceDir: WORKSPACE, outputDir: OUTPUT_DIR });
  const records = [];

  // 1-6 Title and executive summary.
  let s = presentation.slides.add();
  addBg(s, ctx, C.ink);
  await image(s, ctx, fig.banner, 635, 42, 560, 185, "cover");
  kicker(s, ctx, "PUBLICATION-QUALITY SCIENTIFIC PRESENTATION", C.gold);
  title(s, ctx, "PolyDegradeML", "Reliability-aware machine learning for descriptor-based biodegradation prediction", true, { w: 760, h: 122, size: 48, subY: 230, subW: 760 });
  metric(s, ctx, "samples", "1,055", 92, 410, 180, C.gold, "#DDE7E4");
  metric(s, ctx, "descriptors", "41", 310, 410, 180, C.gold, "#DDE7E4");
  metric(s, ctx, "final reliability score", "0.8860", 528, 410, 240, C.gold, "#DDE7E4");
  footer(s, ctx, "Author: Z. Manna | Project: PolyDegradeML | Dataset citation and license require final verification");
  notesText(s, "Opening slide. State the thesis clearly: the project is not merely about achieving a high classification score; it is about deciding which biodegradation model is trustworthy under calibration, uncertainty, feature, and distribution-shift checks.");
  records.push({ title: "PolyDegradeML", notes: s.speakerNotes.text });

  simpleSlide(presentation, ctx, records, {
    section: "RESEARCH IDENTITY",
    titleText: "The thesis in one sentence",
    subtitle: "High accuracy alone was insufficient; reliability-aware evaluation changed how model quality was interpreted.",
    items: [
      "A descriptor-based QSAR/QSPR biodegradation workflow was built and reorganized into a reusable research framework.",
      "Classical models, a neural baseline, chemistry-aware features, and reliability metrics were compared.",
      "The strongest final model was selected by balance across accuracy, calibration, uncertainty, selective prediction, and cross-environment robustness.",
    ],
    source: "reports/main_findings.md; reports/model_reliability_report.md",
    notes: "This slide establishes the narrative logic. The project moves from prediction to scientific trustworthiness.",
  });

  simpleSlide(presentation, ctx, records, {
    section: "EXECUTIVE SUMMARY",
    titleText: "What the audience should remember",
    subtitle: "The project’s contribution is an evaluation framework, not a new universal degradation simulator.",
    cards: [
      ["Problem", "Biodegradation prediction is scientifically useful but representation- and environment-dependent.", C.paleGold],
      ["Method", "Classical descriptor models, neural baseline, feature engineering, cross-validation, calibration, and shift testing."],
      ["Finding", "The final candidate was top_ranked | random_forest_classifier with reliability score 0.8860.", C.paleBlue],
      ["Boundary", "No polymer structures, SMILES, BigSMILES, quantum ML, or continuous degradation rates are currently implemented.", C.paleGray],
      ["Value", "The workflow shows how reliability criteria can change model selection.", C.paleGreen],
      ["Next", "Stronger molecular representations, external validation, and experimentally grounded environmental metadata.", C.paleGold],
    ],
    source: "paper/manuscript_draft.md; reports/main_findings.md",
  });

  simpleSlide(presentation, ctx, records, {
    section: "EXECUTIVE SUMMARY",
    titleText: "Main conclusions",
    subtitle: "Each conclusion is tied to a generated report or results table.",
    items: [
      "Random Forest gave the strongest initial train/test baseline and the strongest final reliability profile.",
      "The highest single metric did not determine the final recommendation.",
      "Chemistry-aware proxy features helped selected cases but required reliability validation.",
      "Neural complexity alone did not dominate strong classical baselines.",
      "Cross-environment validation exposed generalization risk hidden by ordinary validation.",
    ],
    source: "reports/main_findings.md; reports/model_reliability_report.md",
  });

  await imageSlide(presentation, ctx, records, {
    section: "EXECUTIVE SUMMARY",
    titleText: "Final model selection at a glance",
    subtitle: "The selected candidate won by balanced reliability, not by winning every individual metric.",
    rel: fig.scoreboard,
    sideItems: [
      "Final candidate: top_ranked | random_forest_classifier.",
      "Reliability score: 0.8860.",
      "Best standard accuracy and best cross-environment accuracy belonged to other candidates.",
    ],
    source: "reports/model_reliability_report.md; results/tables/model_reliability_scoreboard.csv",
  });

  simpleSlide(presentation, ctx, records, {
    section: "MAP OF THE PRESENTATION",
    titleText: "How the argument unfolds",
    subtitle: "The deck is structured as a complete scientific defense.",
    items: [
      "Background: biodegradation, QSAR, environmental chemistry, and reliability in scientific ML.",
      "Computational motivation: classical descriptors, probabilistic reasoning, and bounded quantum rationale.",
      "Methods: dataset, preprocessing, models, feature engineering, validation, calibration, and reliability scoring.",
      "Results: baseline, neural, descriptor-graph, SMOTE, features, cross-environment, uncertainty, and final scoreboard.",
      "Interpretation: why the results behaved as they did, what failed, and what must come next.",
    ],
    source: "Presentation structure requested by author",
  });

  sectionSlide(presentation, ctx, "SECTION 1", "Background and scientific context", "Why biodegradation prediction is a hard scientific ML problem.", "Transition into scientific background.", records);

  const backgroundSlides = [
    ["Plastic degradation is not a single mechanism", "Hydrolysis, photo-oxidation, biodegradation, fragmentation, and weathering can interact but are not equivalent.", ["The current target is ready biodegradability, not a mechanistic simulation.", "Mechanistic clarity prevents overstating the model.", "The early Applied Work reports separated chemical mechanism from ML labels."], "source_materials/reports/Week_01_Applied_Work.docx"],
    ["Environmental context changes degradation outcomes", "Temperature, UV, oxygen, salinity, pH, water activity, microbial load, and abrasion can change outcomes.", ["The dataset lacks most environmental metadata.", "Cross-environment testing is therefore a proxy stress test, not true external environmental validation.", "Future data must record exposure conditions and outcome definitions."], "source_materials/reports/Week_02_Applied_Work.docx"],
    ["Why experimental degradation data are difficult", "Measurements depend on material, exposure, time, and outcome metric.", ["A mass-loss experiment is not the same as mineralization.", "A binary ready-biodegradation label is not a degradation-rate constant.", "The paper flags this because the current dataset supports classification only."], "reports/dataset_curation.md; paper/manuscript_draft.md"],
    ["QSAR/QSPR gives the first computational bridge", "Chemical descriptors become numerical inputs for biological or environmental prediction.", ["This is appropriate for a descriptor-only dataset.", "It is not equivalent to full molecular structure learning.", "The project treats QSAR as the current scope and future structure learning as a next step."], "reports/dataset_curation.md"],
    ["Why machine learning is useful here", "ML can screen descriptor patterns that would be slow to inspect manually.", ["The goal is not replacing experiments.", "The goal is prioritization, hypothesis generation, and reliability-aware screening.", "Trust depends on calibration and generalization, not accuracy alone."], "reports/main_findings.md"],
    ["Why scientific ML needs reliability", "Scientific models should communicate uncertainty and failure risk.", ["A confident wrong answer can be more harmful than an uncertain wrong answer.", "Calibration asks whether predicted probabilities mean what they claim.", "Cross-environment testing asks whether the model survives shifted descriptor regions."], "reports/uncertainty_reliability_summary.txt"],
    ["Why class imbalance matters", "The dataset contains more NRB than RB samples.", ["Accuracy can hide minority-class errors.", "RB recall is important because the minority class matters scientifically.", "SMOTE was tested to improve class-level behavior."], "reports/stratified_cross_validation_summary.txt"],
    ["Why distribution shift matters", "A model trained in one descriptor region may fail in another.", ["Ordinary stratified validation tests familiar data.", "Proxy environment validation tests held-out descriptor clusters.", "This became one of the central reliability stress tests."], "reports/cross_environment_validation.md"],
    ["Why model complexity is not enough", "More flexible models can still fail if representation is weak.", ["The FNN was useful as a nonlinear dense baseline.", "The descriptor-graph prototype was limited by descriptor-only input.", "Representation quality mattered as much as algorithm class."], "reports/neural_network_baseline_summary.txt; reports/descriptor_graph_prototype_summary.txt"],
    ["The research case evolved over time", "The work moved from weekly experiments to a coherent reliability-centered narrative.", ["Weeks 1-4 established chemistry and dataset schema.", "Weeks 5-7 established baseline and model-complexity checks.", "Weeks 8-13 moved into distribution shift, feature design, calibration, and final reliability selection."], "paper/evidence_mapped_outline.md"],
  ];
  backgroundSlides.forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "BACKGROUND", titleText: t, subtitle: sub, items, source }));

  sectionSlide(presentation, ctx, "SECTION 2", "Classical and quantum motivation", "A comparative conceptual framework with strict evidence boundaries.", "Introduce computational framing and quantum limitations.", records);

  const quantumSlides = [
    ["Classical computing manipulates explicit states", "The current models are classical: they operate on descriptor vectors and learned parameters.", ["Classical bits encode explicit values.", "Classical ML searches parameter spaces and decision boundaries.", "The project's implemented results are entirely classical."], "paper/manuscript_draft.md"],
    ["Quantum computing manipulates amplitudes", "Quantum states are described by probability amplitudes before measurement.", ["Amplitudes can carry sign or phase.", "Interference can amplify or suppress outcome pathways.", "This is conceptual motivation, not a current implemented result."], "paper/manuscript_draft.md [NEEDS CITATION]"],
    ["Probability is the bridge concept", "Reliability analysis and quantum motivation both require careful probabilistic reasoning.", ["Classical ML outputs probabilities that need calibration.", "Statistical mechanics uses distributions to reason about many microscopic possibilities.", "Quantum computation evolves amplitudes before measurement produces probabilities."], "paper/manuscript_draft.md"],
    ["Bits versus qubits", "The distinction is representational, not merely a slogan about speed.", ["Bit: one explicit binary state at a time.", "Qubit: a quantum state described by amplitudes over basis states.", "Measurement converts the state into an observed outcome probabilistically."], "Quantum primer slide; citation needed"],
    ["Superposition is not parallel brute force", "Superposition is useful only when an algorithm creates meaningful interference.", ["Incorrect pathways can be suppressed only if the algorithm is structured to do so.", "Quantum computing is not automatic exponential speedup.", "Hardware, noise, encoding, and measurement constraints matter."], "Quantum primer slide; citation needed"],
    ["Why high-dimensional chemistry raises the question", "Chemical behavior often depends on interacting variables and nonlinear relationships.", ["Classical descriptors summarize chemistry but may omit electronic structure.", "Future quantum descriptors may capture energy, dipole, polarizability, orbital gaps, and charge distribution.", "Those descriptors are future work, not current inputs."], "reports/feature_engineering_summary.txt"],
    ["Why quantum was not chosen over classical descriptors", "Classical descriptors were the only valid implemented representation for the available dataset.", ["No SMILES, BigSMILES, or structures were available.", "No quantum ML model was implemented.", "Quantum was considered as a future representation direction."], "reports/dataset_curation.md; paper/manuscript_draft.md"],
    ["How quantum thinking benefited the project", "The benefit was conceptual and methodological, not empirical performance.", ["It clarified the difference between proxy chemistry and true computed descriptors.", "It reinforced that probabilities and uncertainty are central to trust.", "It created a future benchmark question: do richer representations improve reliability?"], "paper/manuscript_draft.md"],
    ["What a future quantum extension would need", "A publishable extension requires much more than naming a quantum algorithm.", ["Molecular encoding strategy.", "Hardware or simulator constraints.", "Direct comparison against classical baselines.", "Same reliability metrics: calibration, uncertainty, selective prediction, and shift behavior."], "paper/manuscript_draft.md"],
    ["Evidence boundary for quantum claims", "No quantum advantage, quantum speedup, or quantum-derived metric improvement is claimed.", ["The current results come from classical models.", "The quantum section is a future-work rationale.", "Citations are still required for quantum information framing."], "paper/publication_readiness_checklist.md"],
  ];
  quantumSlides.forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "CLASSICAL VS QUANTUM", titleText: t, subtitle: sub, items, source }));

  sectionSlide(presentation, ctx, "SECTION 3", "Research questions and objectives", "The study asks what makes a biodegradation model trustworthy.", "Move from motivation into hypotheses and objectives.", records);
  [
    ["Primary research question", "Can chemistry-informed feature engineering and reliability-focused evaluation improve the trustworthiness of ML models for biodegradation prediction?", ["Trustworthiness is treated as measurable.", "Accuracy is necessary but not sufficient.", "The final decision integrates multiple reliability criteria."], "paper/manuscript_draft.md"],
    ["Primary hypothesis", "Reliability-focused evaluation will reveal meaningful differences hidden by accuracy alone.", ["Calibration and uncertainty metrics should alter model interpretation.", "Cross-environment validation should expose generalization risk.", "Final selection should not be determined by one metric."], "reports/model_reliability_report.md"],
    ["Secondary hypothesis: feature engineering", "Chemistry-aware proxy features may improve selected model-feature combinations.", ["Proxy features summarize heteroatom, polarity, topology, and donor/acceptor signals.", "They are not true quantum descriptors.", "Their value must be judged by reliability, not only accuracy."], "reports/feature_engineering_summary.txt"],
    ["Secondary hypothesis: model complexity", "Neural or graph-style complexity may not outperform classical baselines without stronger representation.", ["FNN tests nonlinear dense learning.", "Descriptor graph tests an exploratory graph-inspired representation.", "Neither should be overinterpreted as true molecular structure learning."], "reports/neural_network_baseline_summary.txt; reports/descriptor_graph_prototype_summary.txt"],
    ["Evaluation objectives", "The project intentionally evaluates more than standard classification accuracy.", ["Stratified CV.", "SMOTE comparison.", "ROC-AUC, F1, RB recall.", "Brier score, log loss, ECE.", "Uncertainty gap, selective accuracy, cross-environment behavior."], "reports/model_reliability_report.md"],
  ].forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "OBJECTIVES", titleText: t, subtitle: sub, items, source }));

  sectionSlide(presentation, ctx, "SECTION 4", "Dataset and data engineering", "What the data can answer, what it cannot answer, and why that matters.", "Dataset section.", records);
  simpleSlide(presentation, ctx, records, {
    section: "DATASET",
    titleText: "Dataset summary",
    subtitle: "The current data support binary descriptor-based classification.",
    cards: [
      ["Rows", "1,055 samples", C.paleGreen],
      ["Features", "41 descriptor columns", C.paleBlue],
      ["Target", "Binary RB / NRB label", C.paleGold],
      ["Missing values", "0 after curation", C.paleGray],
      ["Representation", "Flat tabular descriptors", C.paleGreen],
      ["Source", "Kaggle QSAR biodegradation dataset; license/citation still needs verification", C.paleGold],
    ],
    source: "datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json; reports/dataset_curation.md",
  });
  [
    ["Curation decisions", "The workflow maps anonymous columns to descriptor names and preserves readable labels.", ["Raw file: datasets/qsar_biodegradation_descriptor_benchmark/raw/qsar_biodegradation.csv.", "Curated file: datasets/qsar_biodegradation_descriptor_benchmark/processed/qsar_biodegradation_curated.csv.", "Stable sample IDs and readable target labels were added."], "reports/dataset_curation.md"],
    ["What is not in the dataset", "Several scientifically important fields are unavailable.", ["No polymer names.", "No repeat units.", "No SMILES or BigSMILES.", "No atom/bond graphs.", "No measured degradation rates or half-lives.", "Limited environmental metadata."], "reports/dataset_curation.md"],
    ["Morgan fingerprints status", "Morgan fingerprints were not generated because structures are unavailable.", ["Morgan fingerprints require molecular structure strings such as SMILES.", "This dataset provides descriptors only.", "A future structure-enabled dataset could add fingerprints as an additional classical representation."], "reports/dataset_curation.md; future-work limitation"],
    ["BigSMILES status", "BigSMILES standardization is blocked for the current dataset.", ["No polymer repeat units or structure strings exist in the source file.", "The project explicitly records this limitation.", "This prevents polymer-specific structure claims."], "reports/dataset_curation.md"],
    ["Chemical space discussion", "Proxy environments approximate descriptor-space regions rather than real environments.", ["Stratified k-means created three proxy environments.", "This tests descriptor distribution shift.", "It does not replace external environmental validation."], "reports/cross_environment_validation.md"],
    ["Class imbalance", "Class imbalance motivated stratified splits, class-level metrics, and SMOTE tests.", ["NRB is the majority class.", "RB recall is tracked directly.", "SMOTE is applied only inside training folds."], "reports/stratified_cross_validation_summary.txt"],
    ["Feature engineering tiers", "The project separates current descriptors, proxy features, and future quantum-style descriptors.", ["Tier 1: 41 original descriptors.", "Tier 2: 12 chemistry-aware proxy features.", "Tier 3: planned quantum-style descriptors, not implemented."], "reports/feature_engineering_summary.txt"],
  ].forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "DATA ENGINEERING", titleText: t, subtitle: sub, items, source }));
  await imageSlide(presentation, ctx, records, { section: "DATA ENGINEERING", titleText: "Project workflow", subtitle: "The repository now separates data, source code, experiments, reports, figures, and paper outputs.", rel: fig.workflow, source: "figures/paper/figure_1_research_workflow.png" });

  sectionSlide(presentation, ctx, "SECTION 5", "Methodology and experimental design", "Every model is interpreted in terms of representation, expected behavior, and reliability risk.", "Methods section.", records);
  const methods = [
    ["Logistic Regression", "A linear probabilistic baseline for descriptor-based classification.", ["Strength: interpretable and calibrated relative to complex models.", "Limitation: linear boundary may underfit nonlinear descriptor interactions.", "Expected behavior: competitive baseline if descriptors are informative."], "scripts and reports/baseline_modeling.md"],
    ["Random Forest", "A tree ensemble baseline for nonlinear descriptor interactions.", ["Strength: robust tabular performance and nonlinear feature handling.", "Limitation: probabilities may still need calibration checks.", "Expected behavior: strong in-distribution performance."], "reports/baseline_modeling.md"],
    ["Feedforward Neural Network", "A nonlinear dense baseline for tabular descriptors.", ["Strength: can model descriptor interactions.", "Limitation: needs enough data and good representation.", "Finding: useful but did not dominate the strongest classical baseline."], "reports/neural_network_baseline_summary.txt"],
    ["Descriptor-graph prototype", "A graph-inspired prototype built from descriptor vectors, not molecular graphs.", ["Strength: tests whether descriptor relationships can be structured.", "Limitation: not atom/bond message passing.", "Finding: underperformed and should remain exploratory."], "reports/descriptor_graph_prototype_summary.txt"],
    ["Quantum / quantum-inspired methods", "Conceptual future-work direction, not an implemented experimental model.", ["No quantum model or quantum simulator results are in the repository.", "Future work must define encoding, algorithm, and hardware/simulator constraints.", "Any future results must be compared to this classical reliability baseline."], "paper/manuscript_draft.md"],
    ["Feature selection pipeline", "Feature sets were compared to test whether fewer ranked features could improve reliability.", ["Full enhanced: original plus proxy features.", "Top-ranked: 15 selected features.", "Proxy-only and reduced-hybrid variants tested boundaries."], "reports/feature_importance_selection_summary.txt"],
    ["SMOTE strategy", "SMOTE was used to test class-level behavior under imbalance.", ["Applied within training folds.", "Evaluated with RB recall, accuracy, F1, and ROC-AUC.", "Helped recall but did not alone solve reliability."], "reports/stratified_cross_validation_summary.txt"],
    ["Cross-validation strategy", "5-fold stratified cross-validation provides more stable model comparison than one split.", ["Preserves class ratios.", "Reports fold diagnostics.", "Used for baseline and feature-set comparisons."], "results/tables/stratified_cv_fold_diagnostics.csv"],
    ["Calibration metrics", "Calibration was evaluated with Brier score, log loss, and expected calibration error.", ["Brier score penalizes probability error.", "Log loss penalizes confident wrong probabilities.", "ECE estimates calibration gap across confidence bins."], "reports/uncertainty_reliability_summary.txt"],
    ["Uncertainty estimation", "Uncertainty was evaluated through confidence, entropy, and correct-vs-incorrect gaps.", ["Useful models should be less confident when wrong.", "Incorrect high-confidence predictions are a deployment risk.", "Cross-environment uncertainty was especially important."], "reports/uncertainty_reliability_summary.txt"],
    ["Selective prediction", "Selective prediction asks what happens if only confident predictions are retained.", ["Higher selective accuracy can support screened deployment.", "Coverage matters because abstaining reduces usable predictions.", "Selective performance was one component of final reliability."], "results/predictions/final_selective_prediction_results.csv"],
    ["Reliability scoring", "Final scoring integrates performance, calibration, uncertainty, selective prediction, and shift behavior.", ["It avoids one-metric selection.", "It ranks model-feature-set candidates.", "It selected top_ranked | random_forest_classifier."], "reports/model_reliability_report.md"],
  ];
  methods.forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "METHODOLOGY", titleText: t, subtitle: sub, items, source }));
  compareSlide(presentation, ctx, records, {
    section: "METHOD COMPARISON",
    titleText: "What each model was expected to test",
    subtitle: "The models are not interchangeable; each answers a different methodological question.",
    cols: ["Model", "Question", "Interpretation risk"],
    rows: [
      ["Logistic Regression", "Can linear descriptor signal classify RB/NRB?", "May underfit nonlinear chemistry"],
      ["Random Forest", "Can nonlinear tabular interactions improve prediction?", "May look accurate but miscalibrated"],
      ["FNN", "Does dense nonlinear learning add value?", "Can overfit or fail without strong representation"],
      ["Descriptor graph", "Can descriptor relationships be graph-structured?", "Not true molecular graph learning"],
      ["Quantum future work", "Could richer probabilistic representation help?", "No implemented result yet"],
    ],
    source: "reports/baseline_modeling.md; reports/neural_network_baseline_summary.txt; paper/manuscript_draft.md",
  });

  sectionSlide(presentation, ctx, "SECTION 6", "Results", "Metrics are interpreted as scientific evidence, not just scoreboard values.", "Results section.", records);
  barSlide(presentation, ctx, records, {
    section: "RESULTS",
    titleText: "Initial model comparison",
    subtitle: "The first split showed real descriptor signal, but did not answer reliability questions.",
    data: [
      { label: "Random Forest", value: 0.8768, color: C.green },
      { label: "Logistic Regression", value: 0.8626, color: C.blue },
      { label: "Feedforward NN", value: 0.8246, color: C.gold },
      { label: "Descriptor graph", value: 0.6967, color: C.red },
    ],
    max: 1,
    source: "reports/baseline_modeling.md; reports/neural_network_baseline_summary.txt; reports/descriptor_graph_prototype_summary.txt",
    notes: "Accuracy only. This slide intentionally sets up why deeper reliability analysis was needed.",
  });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Model progression visualization", subtitle: "The progression from classical baselines to neural and descriptor-graph tests clarified the role of model complexity.", rel: fig.modelProgress, source: "presentation/assets/model_progression_comparison.png" });
  barSlide(presentation, ctx, records, {
    section: "RESULTS",
    titleText: "5-fold stratified CV: baseline sampling",
    subtitle: "Classical models remained strong under cross-validation.",
    data: [
      { label: "Random Forest accuracy", value: 0.8711, color: C.green },
      { label: "Logistic Regression accuracy", value: 0.8701, color: C.blue },
      { label: "FNN accuracy", value: 0.8588, color: C.gold },
      { label: "Random Forest ROC-AUC", value: 0.9364, color: C.green },
    ],
    max: 1,
    source: "reports/stratified_cross_validation_summary.txt",
  });
  barSlide(presentation, ctx, records, {
    section: "RESULTS",
    titleText: "SMOTE changed class-level behavior",
    subtitle: "SMOTE improved selected RB recall values, especially for Logistic Regression and FNN.",
    data: [
      { label: "LR RB recall with SMOTE", value: 0.8568, color: C.blue },
      { label: "FNN RB recall with SMOTE", value: 0.8145, color: C.gold },
      { label: "RF RB recall with SMOTE", value: 0.7837, color: C.green },
      { label: "RF accuracy with SMOTE", value: 0.8739, color: C.green },
    ],
    max: 1,
    source: "reports/stratified_cross_validation_summary.txt",
  });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Feature engineering comparison", subtitle: "Chemistry-aware proxy features improved some model-feature combinations but did not guarantee best reliability.", rel: fig.featureSet, source: "figures/feature_engineering/feature_set_comparison.png" });
  simpleSlide(presentation, ctx, records, {
    section: "RESULTS",
    titleText: "Feature engineering interpretation",
    subtitle: "Proxy chemistry was useful, but not sufficient by itself.",
    items: [
      "Tier 1 plus Tier 2 improved FNN recall from 0.8145 to 0.8399 under SMOTE.",
      "Logistic Regression and Random Forest changed less substantially.",
      "Proxy-only feature sets later showed overconfidence under cross-environment shift.",
    ],
    source: "reports/feature_engineering_summary.txt; reports/model_reliability_report.md",
  });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Top feature importance", subtitle: "Feature selection showed that a ranked subset could remain competitive and support the final reliability choice.", rel: fig.featureImportance, source: "figures/paper/figure_2_feature_importance.png" });
  simpleSlide(presentation, ctx, records, {
    section: "RESULTS",
    titleText: "Feature selection findings",
    subtitle: "The top-ranked feature set was important because of final reliability, not because it maximized every metric.",
    items: [
      "Top-ranked feature set contained 15 features.",
      "Full enhanced feature set performed strongly in standard validation.",
      "Top-ranked features produced the strongest final model when paired with Random Forest.",
    ],
    source: "reports/feature_importance_selection_summary.txt; results/metadata/feature_selection_sets.json",
  });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Cross-environment mean scores", subtitle: "Distribution-shift testing produced the clearest warning about deployment robustness.", rel: fig.crossMean, source: "figures/cross_environment/mean_scores.png" });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "RB recall under proxy environments", subtitle: "Minority-class recall was unstable across held-out descriptor regions.", rel: fig.rbHeatmap, source: "figures/cross_environment/rb_recall_heatmap.png" });
  barSlide(presentation, ctx, records, {
    section: "RESULTS",
    titleText: "Mean proxy cross-environment accuracy",
    subtitle: "All models degraded under held-out descriptor clusters.",
    data: [
      { label: "Random Forest", value: 0.4210, color: C.green },
      { label: "Logistic Regression", value: 0.3727, color: C.blue },
      { label: "Descriptor graph", value: 0.3688, color: C.gold },
      { label: "FNN", value: 0.3532, color: C.red },
    ],
    max: 0.5,
    source: "reports/cross_environment_validation.md",
  });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Calibration curves", subtitle: "Calibration made probability quality visible rather than assuming that confidence was meaningful.", rel: fig.calibration, source: "figures/paper/figure_3_calibration_curve.png" });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Selective accuracy", subtitle: "Confidence-filtered prediction tested whether more certain predictions were more reliable.", rel: fig.selective, source: "figures/uncertainty_calibration/selective_accuracy.png" });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Uncertainty correct versus incorrect", subtitle: "A useful model should generally show higher uncertainty for wrong predictions.", rel: fig.uncertainty, source: "figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png" });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Accuracy-calibration tradeoff", subtitle: "The strongest single metric did not define the strongest overall candidate.", rel: fig.accCal, source: "figures/model_selection/accuracy_calibration_tradeoff.png" });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Reliability component heatmap", subtitle: "Final ranking integrates multiple reliability components rather than optimizing one metric.", rel: fig.metricHeatmap, source: "figures/model_selection/metric_heatmap.png" });
  await imageSlide(presentation, ctx, records, { section: "RESULTS", titleText: "Final reliability scoreboard", subtitle: "The selected model was best balanced across performance, calibration, uncertainty, selective prediction, and shift behavior.", rel: fig.scoreboard, source: "figures/paper/figure_4_reliability_scoreboard.png" });
  simpleSlide(presentation, ctx, records, {
    section: "RESULTS",
    titleText: "Reliability scoreboard headline findings",
    subtitle: "The final model was not the winner on every individual metric.",
    items: [
      "Best overall: top_ranked | random_forest_classifier, reliability score 0.8860.",
      "Strongest standard accuracy: full_enhanced | logistic_regression, accuracy 0.8730.",
      "Best cross-environment accuracy: top_ranked | logistic_regression, 0.6455.",
      "Most overconfident under shift: proxy_only | logistic_regression, incorrect confidence 0.9044.",
    ],
    source: "reports/model_reliability_report.md",
  });

  sectionSlide(presentation, ctx, "SECTION 7", "Deep interpretation and discussion", "Why the results behaved the way they did.", "Discussion section.", records);
  [
    ["Why Random Forest performed strongly", "Random Forest can capture nonlinear tabular interactions without requiring structure strings.", ["The descriptors were informative.", "Tree ensembles handle feature interactions naturally.", "However, calibration and shift behavior still had to be evaluated."], "reports/baseline_modeling.md; reports/model_reliability_report.md"],
    ["Why calibration altered interpretation", "High accuracy does not guarantee meaningful probabilities.", ["Calibration metrics exposed probability quality.", "A model can be accurate but overconfident.", "Scientific screening requires knowing when confidence is warranted."], "reports/uncertainty_reliability_summary.txt"],
    ["Why neural complexity did not dominate", "The FNN was constrained by the same descriptor-only representation.", ["More flexibility did not automatically create better chemistry.", "The FNN remained useful as a complexity check.", "Selected feature sets later made it competitive in parts of the reliability analysis."], "reports/neural_network_baseline_summary.txt; reports/model_reliability_report.md"],
    ["Why the descriptor graph underperformed", "The prototype used descriptor vectors, not atom/bond graphs.", ["Graph neural networks require meaningful nodes and edges.", "Descriptor-graph structure is not equivalent to molecular message passing.", "The result is a representation limitation, not a verdict against GNNs."], "reports/descriptor_graph_prototype_summary.txt"],
    ["Why robustness degraded under shift", "Held-out descriptor clusters exposed distribution mismatch.", ["Model behavior changed when tested outside familiar descriptor regions.", "Cross-environment performance was lower than standard CV.", "This supports cautious deployment framing."], "reports/cross_environment_validation.md"],
    ["What the final model means scientifically", "The selected candidate is a screening framework result, not an environmental oracle.", ["It is defensible because it balances multiple reliability indicators.", "It remains limited by descriptor-only data.", "It should be extended with richer representation and external validation."], "reports/model_reliability_report.md; paper/manuscript_draft.md"],
  ].forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "DISCUSSION", titleText: t, subtitle: sub, items, source }));

  sectionSlide(presentation, ctx, "SECTION 8", "Failure analysis and limitations", "Strong research names its boundaries explicitly.", "Limitations section.", records);
  [
    ["Dataset limitations", "The dataset is not polymer-specific and lacks structure strings.", ["No polymer identity.", "No SMILES or BigSMILES.", "No molecular graphs.", "Binary target rather than continuous degradation rate."], "reports/dataset_curation.md"],
    ["Feature limitations", "Proxy chemistry features are not true computed chemistry.", ["They are derived from existing descriptors.", "They should not be described as quantum descriptors.", "True descriptors require molecular structures and computation."], "reports/feature_engineering_summary.txt"],
    ["Ecological realism limitations", "Proxy environments are not measured environmental conditions.", ["No UV exposure metadata.", "No pH/salinity/oxygen/microbial metadata.", "No direct external environmental validation."], "reports/cross_environment_validation.md"],
    ["Quantum limitations", "Quantum methods were not implemented.", ["No quantum circuit, simulator, or hardware results.", "No quantum advantage claim.", "Future work requires citations, encoding, and comparison."], "paper/manuscript_draft.md; paper/publication_readiness_checklist.md"],
    ["Statistical limitations", "The composite reliability score is useful but should be reviewed before publication.", ["Weighting choices require explanation.", "Confidence intervals or statistical significance tests could strengthen claims.", "Metrics should be regenerated before submission."], "paper/publication_readiness_checklist.md"],
    ["Computational constraints", "Model scope was constrained by available representation and project maturity.", ["No hyperparameter sweep narrative is finalized.", "No external dataset benchmark yet.", "No production deployment validation."], "paper/publication_readiness_checklist.md"],
  ].forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "LIMITATIONS", titleText: t, subtitle: sub, items, source }));

  sectionSlide(presentation, ctx, "SECTION 9", "Future work and conclusions", "The project is now a reproducible platform for stronger scientific modeling.", "Future and conclusion.", records);
  [
    ["Future data priorities", "The next dataset should be polymer-specific and experimentally traceable.", ["Polymer identity and repeat units.", "SMILES/BigSMILES or graph inputs.", "Environmental metadata.", "Continuous degradation-rate outcomes."], "paper/manuscript_draft.md"],
    ["Future model priorities", "Representation should improve before more complex models are overclaimed.", ["Molecular fingerprints when structures exist.", "Graph neural networks with true molecular graphs.", "Quantum chemical descriptors.", "External benchmark datasets."], "paper/manuscript_draft.md"],
    ["Future reliability priorities", "Reliability should remain the central evaluation lens.", ["Calibrated probabilities.", "Selective prediction / abstention.", "Uncertainty-aware deployment.", "External validation under measured conditions."], "reports/model_reliability_report.md"],
    ["Future quantum priorities", "Quantum extensions should be benchmarked against the classical reliability framework.", ["Define encoding.", "Use simulator or hardware transparently.", "Compare against Random Forest, Logistic Regression, and FNN.", "Report reliability, not only accuracy."], "paper/manuscript_draft.md"],
    ["Final conclusion", "PolyDegradeML demonstrates that reliable biodegradation prediction requires more than raw accuracy.", ["The central contribution is reliability-aware evaluation.", "The final model is selected by balanced trustworthiness.", "The framework is reusable for future QSAR/QSPR biodegradation studies."], "reports/main_findings.md; paper/manuscript_draft.md"],
    ["Closing statement", "The project’s strongest result is a scientific habit: measure uncertainty before trusting prediction.", ["Prediction is useful.", "Calibrated prediction is more useful.", "Reliability-aware prediction is what environmental ML needs before deployment."], "reports/main_findings.md"],
  ].forEach(([t, sub, items, source]) => simpleSlide(presentation, ctx, records, { section: "CONCLUSION", titleText: t, subtitle: sub, items, source }));

  sectionSlide(presentation, ctx, "APPENDIX", "Supplementary evidence and reproducibility", "Supporting figures, source files, and implementation boundaries.", "Appendix starts here.", records);
  const appendixImages = [
    ["A1. Research workflow", fig.workflow, "figures/paper/figure_1_research_workflow.png"],
    ["A2. Feature importance", fig.featureImportance, "figures/paper/figure_2_feature_importance.png"],
    ["A3. Feature engineering comparison", fig.featureSet, "figures/feature_engineering/feature_set_comparison.png"],
    ["A4. Feature set comparison", fig.featureSet2, "figures/feature_importance/feature_set_comparison.png"],
    ["A5. Cross-environment mean scores", fig.crossMean, "figures/cross_environment/mean_scores.png"],
    ["A6. RB recall heatmap", fig.rbHeatmap, "figures/cross_environment/rb_recall_heatmap.png"],
    ["A7. Calibration curve", fig.calibration, "figures/paper/figure_3_calibration_curve.png"],
    ["A8. Selective accuracy", fig.selective, "figures/uncertainty_calibration/selective_accuracy.png"],
    ["A9. Uncertainty correct vs incorrect", fig.uncertainty, "figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png"],
    ["A10. Accuracy-calibration tradeoff", fig.accCal, "figures/model_selection/accuracy_calibration_tradeoff.png"],
    ["A11. Metric heatmap", fig.metricHeatmap, "figures/model_selection/metric_heatmap.png"],
    ["A12. Selective top candidates", fig.selectiveTop, "figures/model_selection/selective_top_candidates.png"],
    ["A13. Reliability scoreboard", fig.scoreboard, "figures/paper/figure_4_reliability_scoreboard.png"],
    ["A14. Model progression", fig.modelProgress, "presentation/assets/model_progression_comparison.png"],
  ];
  for (const [t, rel, source] of appendixImages) {
    await imageSlide(presentation, ctx, records, { section: "APPENDIX FIGURES", titleText: t, subtitle: "Supplementary figure retained for reference and discussion.", rel, source });
  }
  compareSlide(presentation, ctx, records, {
    section: "APPENDIX TABLE",
    titleText: "Final reliability scoreboard top candidates",
    subtitle: "Condensed from the generated model reliability report.",
    cols: ["Rank", "Candidate", "Reliability", "Key interpretation"],
    rows: [
      ["1", "top_ranked | random_forest_classifier", "0.8860", "Best balanced final candidate"],
      ["2", "top_ranked | feedforward_neural_network", "0.8447", "Competitive under selected features"],
      ["3", "top_ranked | logistic_regression", "0.7971", "Best cross-environment accuracy"],
      ["4", "full_enhanced | random_forest_classifier", "0.7421", "Strong accuracy and uncertainty gap"],
      ["5", "full_enhanced | logistic_regression", "0.7288", "Strong standard accuracy and calibration"],
    ],
    source: "reports/model_reliability_report.md",
  });
  simpleSlide(presentation, ctx, records, {
    section: "APPENDIX",
    titleText: "Repository files that support this presentation",
    subtitle: "The deck is evidence-mapped to project artifacts.",
    items: [
      "Main manuscript: paper/manuscript_draft.md and paper/PolyDegradeML_consolidated_manuscript.docx.",
      "Reports: reports/main_findings.md and reports/model_reliability_report.md.",
      "Tables: results/tables/model_reliability_scoreboard.csv and supporting CSV files.",
      "Figures: figures/paper, figures/model_selection, figures/feature_engineering, figures/cross_environment, figures/uncertainty_calibration.",
      "Source reports: source_materials/reports/Week_01 through Week_13 Applied Work and Outside Reading reports.",
    ],
    source: "Repository structure",
  });
  simpleSlide(presentation, ctx, records, {
    section: "APPENDIX",
    titleText: "Open items before publication",
    subtitle: "These are intentionally visible so unsupported claims do not enter the final paper.",
    items: [
      "Verify dataset citation, license, and original authorship.",
      "Add authoritative citations for quantum information theory framing.",
      "Regenerate all results before final submission.",
      "Review composite reliability score formula with Dr. Johnson.",
      "Confirm author list, venue, and whether source reports should remain public.",
    ],
    source: "paper/publication_readiness_checklist.md; paper/missing_information_to_ask_author.md",
  });

  // Export.
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const previewPaths = [];
  for (let i = 0; i < presentation.slides.count; i += 1) {
    const slide = presentation.slides.getItem(i);
    const out = path.join(PREVIEW_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await saveBlobToFile(png, out);
    previewPaths.push(out);
  }
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  const notesMd = [
    "# PolyDegradeML Comprehensive Defense Speaker Notes",
    "",
    `Slide count: ${presentation.slides.count}`,
    "",
    ...records.flatMap((r, i) => [`## Slide ${i + 1}. ${r.title}`, "", r.notes, ""]),
  ].join("\n");
  await fs.writeFile(NOTES_MD, notesMd, "utf8");
  const sheet = spawnSync("/Users/mannz/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3", [
    "/Users/mannz/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/make_contact_sheet.py",
    "--output",
    CONTACT_SHEET,
    ...previewPaths,
  ], { encoding: "utf8" });
  if (sheet.status !== 0) throw new Error(`Contact sheet failed:\n${sheet.stdout}\n${sheet.stderr}`);
  console.log(JSON.stringify({ pptx: FINAL_PPTX, notes: NOTES_MD, contactSheet: CONTACT_SHEET, slideCount: presentation.slides.count }, null, 2));
}

build().catch((err) => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});
