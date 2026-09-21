# Conceptual flow definitions

These descriptions explain behavior without exposing implementation. They are not Power Automate exports, executable expressions, connector schemas or prompt source.

## 1. ACX – Ingest Email

**Purpose:** retain account-relevant email as source-linked CRM context.

- **Trigger:** scheduled mailbox polling within a bounded lookback window.
- **Inputs:** eligible message content, sender identity, source reference and timestamp.
- **Processing:** identify a unique matching contact with a parent account; detect previously processed sources; run source-grounded extraction; link the account/contact; persist the insight and full source-bearing note.
- **Outputs:** a dated conversation insight and a related timeline note with provenance.
- **Safeguards:** ambiguous or missing identity is not guessed; stable source identity supports replay deduplication; replay can reconcile a missing note.
- **Failure boundary:** unavailable sources, permissions or failed extraction must not be represented as completed ingestion. A bounded lookback cannot recover an arbitrarily long outage without backfill.
- **Business value:** preserve commercial and technical decision context for future preparation and handoff.
- **Recorded validation:** a controlled synthetic email used real transport/ingestion, correct linking and duplicate-free replay. This is historical project evidence, not a fresh tenant test.

## 2. ACX – Ingest Teams Meetings

**Purpose:** retain permitted customer conversation content rather than mistaking invitations for meeting evidence.

- **Trigger:** scheduled collection of eligible Teams content.
- **Inputs:** authorized messages or an available transcript; verified identity/membership and customer association; source reference and timestamp.
- **Processing:** evaluate privacy gates; resolve the customer conservatively; retrieve actual content; check source identity; extract supported summary, rationale and actions; persist a linked insight and note.
- **Outputs:** dated, source-labelled Teams interaction context in CRM.
- **Safeguards:** do not scan arbitrary internal chats; an automated summary requires a narrowly approved sender and location, not a blanket trust in bots or customer tags. Preserve the distinction between a chat summary and a transcript.
- **Failure boundary:** missing transcript permissions or availability must be surfaced. Oversize source content is rejected rather than silently truncated; long-source chunking needs separate implementation and testing.
- **Business value:** make discussion context discoverable after a meeting while retaining its origin.
- **Recorded validation:** actual posted-summary ingestion and replay were tested with labelled synthetic content. A newly recorded meeting's native transcript ingestion was **not live-verified**.

## 3. ACX – Rebuild Account Brief

**Purpose:** turn separate interactions into a useful account-level narrative.

- **Trigger:** scheduled rebuild or manual invocation.
- **Inputs:** qualifying interaction records, dates, supported extracted signals, account context and evidence references.
- **Processing:** count qualifying interactions independently of the selected evidence sample; handle missing dates/values; select bounded evidence; generate a grounded brief; preserve fuller content separately when the short summary field is insufficient.
- **Outputs:** a concise account summary plus a full account-brief timeline note and evidence-coverage information.
- **Safeguards:** disclose bounded evidence; distinguish all-interaction counts from sampled content; respect field capacity; do not silently claim complete history.
- **Failure boundary:** a brief reflects the latest successful rebuild, not necessarily the newest ingested interaction. AI conclusions require source review.
- **Business value:** reduce repeated discovery and preserve continuity when account ownership changes.
- **Recorded validation:** briefs and full notes were verified for the labelled synthetic demonstration accounts.

## 4. ACX – Agent Query

**Purpose:** provide Decision DNA with structured, source-aware retrieval from CRM.

- **Trigger:** on-demand request from a Copilot Studio tool.
- **Inputs:** query mode plus relevant account/search context; truly optional inputs should not create unnecessary questions.
- **Processing:** select the retrieval mode; resolve account identity conservatively; retrieve relevant evidence and opportunity state; return structured results, source links, limitations and clear errors.
- **Outputs:** account context, recorded winning-play evidence or portfolio risks/actions, suitable for a grounded conversational response.
- **Safeguards:** clarify ambiguous accounts; do not reinterpret arbitrary message references as account identifiers; distinguish open/won/lost; retain synthetic labels; cite records; acknowledge missing evidence.
- **Failure boundary:** retrieval is bounded and not exhaustive proof. A single successful evaluation does not establish universal answer accuracy. Generated interpretations require human review.
- **Business value:** make accumulated account context usable during preparation, handoff and portfolio review.
- **Recorded validation:** Account360, PlayFinder and PortfolioScan were exercised; agent publication and a targeted evaluation were recorded in the private project evidence.

### Query modes

| Mode | Typical question | Intended response |
|---|---|---|
| Account360 | What should a new owner know about this account? | Dated interaction context, current opportunity state, recorded rationale and actions with sources |
| PlayFinder | Which approaches are recorded in won opportunities? | Relevant winning-play evidence without inventing causality |
| PortfolioScan | Which accounts need attention? | Supported risks and open actions within the retrieved evidence scope |

The website uses authored fictional examples to illustrate these modes. It does not call the actual agent or execute any flow.
