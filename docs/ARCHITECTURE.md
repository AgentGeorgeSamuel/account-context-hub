# Architecture and information lifecycle

## Design intent

Create a persistent, source-linked account memory from interactions that would otherwise remain spread across email, chats and CRM. DecisionDNA is the conversational access layer, not a replacement for the underlying evidence or the CRM opportunity state.

## Layers

| Layer | Responsibility | Boundary |
|---|---|---|
| Sources | Account-relevant email; eligible Teams messages or available meeting content | Availability, customer association and permissions must be established |
| Orchestration | Power Automate ingests sources, rebuilds briefs and answers agent tool requests | Scheduled ingestion is not instantaneous |
| Extraction | AI Builder prompts derive summary, rationale, actions and supported signals | Source text is evidence, not instructions; inference needs review |
| Context store | Dataverse relationships and source-bearing timeline notes | Correct account/contact linkage precedes persistence |
| Experience | Dynamics CRM account views and Copilot Studio DecisionDNA | Answers should disclose uncertainty and cite evidence |

## Logical data model

This is a conceptual model, not a schema export. Names and relationships describe responsibilities, not deployable entity definitions.

- **Account:** the customer context anchor.
- **Contact:** an identity associated with an account; exact email matching supports ingestion.
- **Conversation insight:** a dated summary of one eligible interaction, linked to account/contact and source provenance.
- **Timeline note:** preserves fuller evidence and source references, including full account briefs when a short summary field is insufficient.
- **Opportunity:** records business deal state. Positive conversation sentiment does not make an open deal won.
- **Account brief:** a derived account-level narrative built from a bounded evidence sample, with coverage disclosed.

## Write path

1. Discover eligible source content within the configured polling window.
2. Establish privacy eligibility and unambiguous contact/account association.
3. Check a stable source identity before AI work; avoid replay duplicates.
4. Extract only supported facts and actions from the source.
5. Persist a linked insight and source-bearing note; reconcile a missing note on replay.
6. Rebuild account-level briefs separately on schedule or by explicit invocation.

## Read path

1. An account team asks DecisionDNA for an account view, recorded winning plays or portfolio risks.
2. The agent selects the query capability and supplies relevant inputs.
3. Query logic resolves the account conservatively; ambiguous matches require clarification.
4. Relevant CRM context and opportunity state are returned with evidence references.
5. The answer distinguishes facts, interpretation, missing evidence and open/won/lost status.

## Governance posture

Customer matching and source eligibility are intentionally conservative. Missing parents, ambiguous contacts and unsupported memberships should be skipped or surfaced rather than guessed. Source links improve traceability but do not grant access to records the viewer is not authorized to see. Production deployment still requires permission, retention, data residency, privacy, DLP and capacity review.

## Not shown publicly

No tenant topology, environment addresses, identities, connector references, internal field names, API contracts, model prompts or executable flow definitions are published. The website's architecture inspector teaches component responsibilities, not installation.
