"use strict";

// Public conceptual descriptions only. No connector or solution implementation.
const nodes = {
  outlook: {
    index: "01A / SOURCE",
    title: "Outlook",
    description:
      "Eligible email is an input to scheduled ingestion, not an always-on stream.",
    path: "Email content → source-grounded interaction context.",
    boundary:
      "Unique contact email and parent account matching avoid guessing the account.",
    limit:
      "Scheduled polling introduces delay. This diagram makes no live connection.",
  },
  teams: {
    index: "01B / SOURCE",
    title: "Teams",
    description:
      "Eligible messages and available transcripts can contribute meeting context.",
    path: "Permitted meeting content → source-bearing interaction evidence.",
    boundary: "Privacy and membership gates apply before content is used.",
    limit:
      "Posted summary processing was historically verified. Newly recorded native transcript ingestion has not been live-verified. Oversize content is rejected; chunking is future work.",
  },
  automation: {
    index: "02 / ORCHESTRATE + SYNTHESISE",
    title: "Power Automate + AI Builder",
    description:
      "Coordinate scheduled ingestion and source-grounded synthesis without separating a summary from its evidence.",
    path: "Eligible source → account matching → stable source deduplication → summary, rationale, and actions.",
    boundary:
      "CRM read/write is explicit: read account/contact context, write interaction insight and a source-bearing timeline note. Rebuilds read interactions and write account briefs.",
    limit:
      "Polling and rebuilding are not instantaneous. AI-generated material needs review. This is a conceptual path, not exported automation or prompt source.",
  },
  dataverse: {
    index: "03 / ACCOUNT MEMORY",
    title: "Dataverse",
    description: "Keep account context and its source trail together in CRM.",
    path: "Logical objects: account, contact, interaction, note, opportunity, brief.",
    boundary:
      "Ingestion and rebuilding use CRM read/write. Agent queries retrieve CRM context and return source-bearing readback; they do not change records.",
    limit:
      "A brief uses accurate aggregate counts alongside a bounded evidence sample. It is not a claim that every source is included in the model context.",
  },
  agent: {
    index: "04 / RETRIEVE",
    title: "DecisionDNA",
    description:
      "An on-demand Copilot Studio experience for asking grounded questions about account context.",
    path: "Account360, PlayFinder, or PortfolioScan → retrieved records → source-cited answer → account team.",
    boundary:
      "Read-only retrieval concept. Handle ambiguous account matches without guessing, cite source records, and preserve open, won, and lost opportunity states.",
    limit:
      "The examples here are canned, not live AI. Historical publication and targeted evaluation do not establish production certification.",
  },
  people: {
    index: "05 / APPLY JUDGEMENT",
    title: "Account team",
    description:
      "The system carries evidence forward. People still own interpretation and decisions.",
    path: "Source-cited context → review → better-informed account conversations and handoffs.",
    boundary:
      "Check the source and unresolved questions before relying on a generated conclusion.",
    limit:
      "Intended benefits are qualitative: less rediscovery, continuity, traceability, safer handoffs, and reusable decision evidence. No measured ROI is claimed.",
  },
};

function selectNode(key) {
  const node = nodes[key];
  document
    .querySelectorAll("[data-node]")
    .forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.node === key)),
    );
  const detail = document.getElementById("node-detail");
  detail.replaceChildren();
  const index = document.createElement("p");
  index.className = "eyebrow";
  index.textContent = node.index;
  const title = document.createElement("h3");
  title.textContent = node.title;
  const description = document.createElement("p");
  description.textContent = node.description;
  const definitions = document.createElement("dl");
  [
    ["Input → output", node.path],
    ["Boundary", node.boundary],
    ["Keep in mind", node.limit],
  ].forEach(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;
    const definition = document.createElement("dd");
    definition.textContent = value;
    definitions.append(term, definition);
  });
  detail.append(index, title, description, definitions);
}

document
  .querySelectorAll("[data-node]")
  .forEach((button) =>
    button.addEventListener("click", () => selectNode(button.dataset.node)),
  );

const flows = [
  {
    name: "ACX - Ingest Email",
    short: "Ingest Email",
    kind: "CAPTURE",
    purpose: "Turn eligible email into source-grounded account context.",
    trigger: "Scheduled polling.",
    inputs:
      "Eligible email content, unique contact email matches, and parent account context.",
    outputs:
      "A Dataverse interaction insight plus a source-bearing account timeline note.",
    safeguards:
      "Unique contact email plus parent account matching; stable source deduplication; summary, rationale, and actions grounded in the source.",
    limitations:
      "Not instantaneous. Unclear account matches must not be guessed. Generated material still requires human review.",
    value:
      "Preserve the rationale and next actions behind an account conversation.",
    stages: [
      [
        "Read eligible email",
        "Scheduled polling checks eligible email for new account-relevant evidence. It is not a real-time stream.",
      ],
      [
        "Establish the account",
        "Match a unique contact email and its parent account. Do not infer an account from an ambiguous match.",
      ],
      [
        "Ground the synthesis",
        "Use the source to produce a summary, rationale, and actions. Check stable source identity to avoid repeating the same evidence.",
      ],
      [
        "Retain source-bearing context",
        "Write the interaction insight and a source-bearing timeline note to Dataverse. Historical email deduplication verification is not a new tenant check.",
      ],
    ],
  },
  {
    name: "ACX - Ingest Teams Meetings",
    short: "Ingest Teams Meetings",
    kind: "CAPTURE",
    purpose: "Carry eligible meeting evidence into the account story.",
    trigger:
      "Scheduled processing of eligible messages and available transcripts.",
    inputs:
      "Eligible posted meeting summaries or available transcript content, subject to access and membership.",
    outputs:
      "A source-grounded Dataverse interaction and source-bearing timeline context.",
    safeguards:
      "Privacy and membership gates; account matching; stable source deduplication; source-grounded synthesis.",
    limitations:
      "Posted summary processing was historically verified. Newly recorded native transcript ingestion has not been live-verified. Oversize content is currently rejected; long-transcript chunking is future work.",
    value:
      "Make permitted meeting context reusable without treating access as automatic.",
    stages: [
      [
        "Find eligible content",
        "On a schedule, consider eligible messages and available transcripts. Content availability and permission are prerequisites.",
      ],
      [
        "Respect the boundary",
        "Apply privacy and membership gates before using content. Match the account without guessing. Oversize content is rejected.",
      ],
      [
        "Summarise with provenance",
        "Synthesize grounded context and retain its source identity. Stable source deduplication prevents repeated ingestion of the same evidence.",
      ],
      [
        "Save with the caveat intact",
        "Retain an interaction and source-bearing timeline context. Posted summaries have historical verification; newly recorded native transcript ingestion does not have live verification.",
      ],
    ],
  },
  {
    name: "ACX - Rebuild Account Brief",
    short: "Rebuild Account Brief",
    kind: "CONSOLIDATE",
    purpose: "Bring accumulated account interactions into a coherent brief.",
    trigger: "Scheduled or manual rebuild.",
    inputs:
      "Account interactions and source-bearing evidence already retained in CRM.",
    outputs: "An account summary and a full brief timeline note.",
    safeguards:
      "Accurate aggregate counts are kept distinct from a bounded evidence sample. Missing or null dates are handled without inventing a date.",
    limitations:
      "Rebuilding is not instantaneous. A bounded evidence sample is not the full interaction history, even when counts describe the full aggregate.",
    value: "Provide a shared starting point for continuity and handoffs.",
    stages: [
      [
        "Gather retained interactions",
        "Read the account’s accumulated interactions. A scheduled or manual request starts the rebuild.",
      ],
      [
        "Separate counts from evidence",
        "Keep accurate aggregate counts while selecting a bounded evidence sample. Do not equate sample size with total activity.",
      ],
      [
        "Build a coherent account brief",
        "Synthesize the selected evidence into an account narrative. Handle null dates explicitly rather than creating a false chronology.",
      ],
      [
        "Write a reusable reference",
        "Write the account summary and full brief timeline note. Subsequent queries can retrieve the rebuilt context; updates are not instantaneous.",
      ],
    ],
  },
  {
    name: "ACX - Agent Query",
    short: "Agent Query",
    kind: "RETRIEVE",
    purpose:
      "Answer account questions with source-cited context through DecisionDNA.",
    trigger: "On-demand from Copilot Studio.",
    inputs:
      "A question, account scope, query mode, and accessible CRM records.",
    outputs:
      "A source-cited response in Account360, PlayFinder, or PortfolioScan mode.",
    safeguards:
      "Read-only retrieval concept; ambiguity handled without guessing; source records cited; open, won, and lost opportunity states preserved.",
    limitations:
      "Retrieval reflects available records, not omniscience. AI output needs review. The public selector below uses canned examples, not the agent.",
    value:
      "Support account understanding, evidence-backed plays, and portfolio review without changing CRM records.",
    stages: [
      [
        "Choose a question and mode",
        "Account360 explores an account; PlayFinder retrieves recorded winning-play evidence; PortfolioScan looks across a selected scope.",
      ],
      [
        "Resolve scope safely",
        "Identify the intended account or portfolio. Ask for clarification when account matching is ambiguous; do not choose a record by guesswork.",
      ],
      [
        "Retrieve the evidence",
        "Read relevant CRM context and sources. Keep opportunity states explicit: open is not won, and lost is not open.",
      ],
      [
        "Return a traceable answer",
        "Provide source-cited readback to the account team. This conceptual query path is read-only and does not execute a proposed action.",
      ],
    ],
  },
];
let selectedFlow = 0;
let selectedStage = 0;
const flowExplorer = document.getElementById("flow-explorer");
flowExplorer.innerHTML = `<div class="flow-selector" role="group" aria-label="Select a flow">${flows.map((flow, index) => `<button data-flow="${index}" aria-label="${flow.name}" aria-pressed="${index === 0}" aria-controls="flow-detail"><span class="micro">0${index + 1} / ${flow.kind}</span><strong>${flow.short}</strong><span aria-hidden="true">↗</span></button>`).join("")}</div><div class="flow-content"><div id="flow-detail"></div><div class="stage-walkthrough"><div class="stage-top"><span class="micro">CONCEPTUAL WALKTHROUGH</span><span id="step-count" class="micro"></span></div><div class="stage-progress" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div id="stage-content" aria-live="polite" aria-atomic="true"><p class="stage-kicker">FOLLOW THE EVIDENCE</p><h4 id="stage-title"></h4><p id="stage-description"></p></div><div class="stage-controls"><button class="button secondary" id="previous-stage" aria-label="Previous stage">← <span>Previous</span></button><button class="button secondary" id="next-stage" aria-label="Next stage"><span>Next stage</span> →</button></div><p class="small-copy">Explanation only. No automation runs here.</p></div></div>`;

function renderStage() {
  const stage = flows[selectedFlow].stages[selectedStage];
  document.getElementById("step-count").textContent =
    `0${selectedStage + 1} / 04`;
  document.getElementById("stage-title").textContent = stage[0];
  document.getElementById("stage-description").textContent = stage[1];
  document
    .querySelectorAll(".stage-progress i")
    .forEach((item, index) =>
      item.classList.toggle("complete", index <= selectedStage),
    );
  document.getElementById("previous-stage").disabled = selectedStage === 0;
  document.getElementById("next-stage").disabled = selectedStage === 3;
}
function selectFlow(index) {
  selectedFlow = index;
  selectedStage = 0;
  const flow = flows[index];
  document
    .querySelectorAll("[data-flow]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(Number(button.dataset.flow) === index),
      ),
    );
  document.getElementById("flow-detail").innerHTML =
    `<p class="eyebrow">${flow.kind} / FLOW 0${index + 1}</p><h3>${flow.name}</h3><dl class="flow-definitions">${["purpose", "trigger", "inputs", "outputs", "safeguards", "limitations", "value"].map((key) => `<div><dt>${key[0].toUpperCase() + key.slice(1)}</dt><dd>${flow[key]}</dd></div>`).join("")}</dl>`;
  renderStage();
}
document
  .querySelectorAll("[data-flow]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      selectFlow(Number(button.dataset.flow)),
    ),
  );
document.getElementById("previous-stage").addEventListener("click", () => {
  if (selectedStage > 0) selectedStage--;
  renderStage();
});
document.getElementById("next-stage").addEventListener("click", () => {
  if (selectedStage < 3) selectedStage++;
  renderStage();
});
selectFlow(0);

const queryModes = {
  Account360: {
    label: "Understand the account",
    question: "What should I know before the next account conversation?",
    title: "Account snapshot",
    body: "Example Manufacturing is discussing a phased rollout. The meeting summary leaves the decision owner unresolved. Confirm ownership before treating the rollout as agreed.",
    evidence: "E1 · M1",
    next: "The expansion opportunity is Open, not committed revenue. Historical Won and Lost records remain separate context.",
    sources: "O1 · O2 · O3",
  },
  PlayFinder: {
    label: "Explore recorded winning plays",
    question: "What winning play is recorded, and what might be reusable?",
    title: "An evidence-backed next conversation",
    body: "Recorded winning play: the fictional baseline rollout used agreed acceptance criteria and a phased pilot (O2). That recorded approach can inform a new discussion, but does not prove why the deal was won. The current expansion still needs its decision owner confirmed (M1).",
    evidence: "O2 · M1",
    next: "This is a possible play for human review, not a predicted outcome or an automatic action. The Open expansion is not reclassified based on a previous Won record or a Lost proposal.",
    sources: "O1 · O2 · O3",
  },
  PortfolioScan: {
    label: "Review a selected scope",
    question: "Where does the selected scope need attention?",
    title: "Review the selected scope",
    body: "This miniature portfolio view contains only Example Manufacturing. Its Open expansion has an unresolved ownership question. That question is a review cue, not a portfolio score or a revenue forecast.",
    evidence: "M1 · O1",
    next: "Keep the baseline rollout (Won) and the earlier proposal (Lost) distinct from the Open expansion. This example does not stand in for an entire live portfolio.",
    sources: "O1 · O2 · O3",
  },
};
let selectedMode = "Account360";
const queryExplorer = document.getElementById("query-explorer");
queryExplorer.innerHTML = `<div class="query-shell"><div class="query-toolbar"><span class="query-brand">DecisionDNA <span>EXPLORER</span></span><span class="offline-label"><span class="status-dot"></span>OFFLINE ILLUSTRATION</span></div><div class="query-selector" role="group" aria-label="Query mode">${Object.entries(
  queryModes,
)
  .map(
    ([name, mode]) =>
      `<button data-mode="${name}" aria-label="${name}" aria-pressed="${name === selectedMode}" aria-controls="query-response"><strong>${name}</strong><span>${mode.label}</span></button>`,
  )
  .join(
    "",
  )}</div><div class="query-layout"><div class="query-main"><p class="micro">SCOPE / EXAMPLE MANUFACTURING · FICTIONAL</p><div class="query-question"><span class="micro">EXAMPLE QUESTION</span><p id="query-question"></p></div><div id="query-response" aria-live="polite" aria-atomic="true"></div></div><aside id="query-evidence" aria-label="Illustrative source evidence"><p class="eyebrow">THE EVIDENCE TRAIL</p><h3>Sources, not certainty.</h3><p class="small-copy">Invented records for learning only.<br>These are not links to a CRM.</p><div class="source-record"><span class="evidence-code">E1</span><div><h4>Email · rollout discussion</h4><p>A phased approach is requested because of operational constraints.</p></div></div><div class="source-record"><span class="evidence-code">M1</span><div><h4>Posted meeting summary</h4><p>Confirm the decision owner before the next review.</p></div></div><div class="source-record"><span class="evidence-code">O1</span><div><h4>Expansion <span class="state-tag">Open</span></h4><p>Under discussion. Not yet won.</p></div></div><div class="source-record"><span class="evidence-code">O2</span><div><h4>Baseline rollout <span class="state-tag">Won</span></h4><p>Fictional decision note: agreed acceptance criteria and a phased pilot supported the baseline rollout. Not a guarantee for the expansion.</p></div></div><div class="source-record"><span class="evidence-code">O3</span><div><h4>Earlier proposal <span class="state-tag">Lost</span></h4><p>Retained as history, not reopened by a query.</p></div></div></aside></div><p class="query-footer">Read-only retrieval concept. Every response here is prewritten. No question or account data leaves your browser.</p></div>`;

const scenarioControl = document.createElement("div");
scenarioControl.className = "scenario-control";
scenarioControl.innerHTML =
  '<label for="evidence-scenario">Evidence scenario</label><select id="evidence-scenario"><option value="grounded">Matched account + evidence</option><option value="ambiguous">Ambiguous account match</option><option value="empty">No supporting evidence</option></select><p>Explore a boundary, not just the happy path.</p>';
document.querySelector(".query-selector").after(scenarioControl);
document
  .getElementById("evidence-scenario")
  .addEventListener("change", renderQuery);

function renderQuery() {
  const mode = queryModes[selectedMode];
  const scenario = document.getElementById("evidence-scenario").value;
  document.getElementById("query-evidence").hidden = scenario !== "grounded";
  document
    .querySelector(".query-layout")
    .classList.toggle("boundary-scenario", scenario !== "grounded");
  document
    .querySelectorAll("[data-mode]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.mode === selectedMode),
      ),
    );
  document.getElementById("query-question").textContent = mode.question;
  if (scenario !== "grounded") {
    const ambiguous = scenario === "ambiguous";
    document.getElementById("query-response").innerHTML =
      `<p class="response-label"><span class="status-dot"></span>Illustrative canned response</p><h3>${ambiguous ? "Please clarify the account" : "No supporting evidence"}</h3><p>${ambiguous ? "More than one account could fit this illustrative request. Confirm the intended account before retrieving or presenting a story. No account has been selected by guesswork." : "There is no supporting evidence for this illustrative request. A grounded answer should say what is missing, not manufacture a summary, a play, or an opportunity state."}</p><div class="response-note"><p class="micro">${selectedMode.toUpperCase()} / RETRIEVAL BOUNDARY</p><p>${ambiguous ? "In a connected experience, a person would resolve the account scope. Here, choose “Matched account + evidence” to return to the fictional example." : "In a connected experience, check the scope and whether eligible records are available. This demo cannot search or request additional records."}</p></div>`;
    return;
  }
  document.getElementById("query-response").innerHTML =
    `<p class="response-label"><span class="status-dot"></span>Illustrative canned response</p><h3>${mode.title}</h3><p>${mode.body}</p><p class="citation">SOURCE RECORDS / ${mode.evidence}</p><div class="response-note"><p class="micro">KEEP THE DISTINCTION</p><p>${mode.next}</p><p class="citation">SOURCE RECORDS / ${mode.sources}</p></div>`;
}
document.querySelectorAll("[data-mode]").forEach((button) =>
  button.addEventListener("click", () => {
    selectedMode = button.dataset.mode;
    renderQuery();
  }),
);
renderQuery();
