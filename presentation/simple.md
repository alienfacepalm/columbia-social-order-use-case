# Social-Order Adapter

## High‑Reliability Real‑Time System Design

### Client: Columbia Sportswear

### Project: Social‑Order Adapter

#### Brandon Pliska — Principal Engineer Candidate

---

## Slide 2 — Presentation Structure (RADIO + STAR)

**Two main threads:**

- **System design (RADIO)** — Requirements, Architecture, Data model, Interface, Optimizations.
- **Leadership & outcomes** — How I led design, coordinated teams (commerce, SAP, SFCC/SFOMS, Rithum), delivered via pipelines; STAR: impact, risks/trade-offs, reflections.

---

## Slide 3 – Problem Domain & Objectives (RADIO: R)

Columbia needed to support **multiple social networks** for in-app commerce; **TikTok Shop** was first. Orders had to flow reliably into Columbia’s systems.

**Objectives:**

- **Robust pipeline** — Normalize TikTok order data; handle bursty, inconsistent payloads without breaking downstream.
- **Timely data** — Orders, cancellations, and updates in time for fulfillment, inventory, and support.
- **Predictable behavior** — Handle malformed, partial, or delayed payloads while preserving order integrity and provenance.

```mermaid
flowchart LR
    TT["TikTok Shop"] -->|"Purchase"| Goal["Orders flow"]
    Goal -->|"Normalized → backend"| SFCC["Columbia / SFCC"]
```

---

## Slide 4 — Requirements (RADIO: R — Functional & Non-Functional)

**Functional:** Ingest TikTok orders via Rithum → adapter webhooks; map to **our canonical format**; SFCC Cartridge API to create orders. Normalize for SFCC/SFOMS and **EOS (Columbia’s enterprise order service and source of truth for order lifecycle on the Columbia side)**, then SAP. Full **provenance**; **bidirectional** status (webhooks in; EOS → Service Bus → Adapter → Rithum API back). Auth via APIM; Azure Service Bus for upstream sync and audit.

**Non-functional:** Reliable, observable, maintainable; scale under spikes; auditable.

---

## Slide 5 — Key Technology Decision: Why Rithum (RADIO: R → A)

**Direct SFCC → TikTok:** Fragile; per-platform API; no single schema; no retries; tight coupling.

**Rithum middleware:** Single integration for TikTok (and future networks); **we defined our canonical data model**—Rithum’s API is an external contract we map to/from (schema never leaks in). Rithum handles PII/social-account protection at the boundary. Retries + DLQ; future-proof (Instagram, YouTube); versioned contracts; ADR-documented.

```mermaid
flowchart LR
    subgraph direct["Direct SFCC to TikTok"]
        D1[Fragile]
        D2["Per-network API only"]
        D3[Tight coupling]
    end
    subgraph rithum["Rithum Middleware"]
        R1["Single API / versioned contract"]
        R2["Retries + DLQ"]
        R3["We map to our canonical model"]
    end
```

---

## Slide 6 — High‑Level Architecture (RADIO: A)

```mermaid
sequenceDiagram
    participant TT as TikTok Shop
    participant R as Rithum
    participant APIM as APIM
    participant AF as Social-Order Adapter
    participant CART as SFCC Cartridge API
    participant SFCC as SFCC
    participant SFOMS as SFOMS
    participant EOS as EOS
    participant SAP as SAP

    Note over TT,SAP: Inbound: order creation
    TT->>R: 1h remorse → finalized
    R->>APIM: Webhook POST (orders / status)
    APIM->>AF: APIM-secured webhook
    AF->>CART: Order create request
    CART->>SFCC: Order payload
    SFCC->>SFOMS: Order payload
    SFOMS->>EOS: Order lifecycle
    EOS->>SAP: Fulfillment

    Note over SAP,TT: Upstream: status sync
    SAP->>EOS: Fulfillment state
    EOS->>AF: Service Bus (lifecycle events)
    AF->>R: Status update request
    R->>TT: Sync to shop
```

---

## Slide 7 — Backend, Scaling & Deployment (RADIO: A + O)

**Auto-scaling:** Azure Function Apps scale with load; handle spikes without over-provisioning.

**Single adapter (one Function App):** The Social-Order Adapter is the **bridge and boundary** between Rithum and Columbia’s SFCC/SFOMS/EOS systems. **Downstream** — Rithum webhooks → APIM → adapter → SFCC Cartridge → orders in Columbia. **Upstream** — EOS/SAP lifecycle events → Service Bus → adapter → Rithum API. One app for both; scales for webhook and Service Bus traffic.

```mermaid
flowchart LR
    WH["Webhooks"] -->|"Rithum POST (orders / status)"| FA["Social-Order Adapter"]
    SB["Service Bus"] -->|"EOS lifecycle events"| FA
    FA -->|"Cartridge API, EOS"| Down["Downstream"]
    FA -->|"Status update API"| RAPI["Rithum API"]
```

---

## Slide 8 — Data Model: Provenance & Canonical Mapping (RADIO: D)

- **Canonical model** — Order, line items, status defined once; normalized for SFCC, SFOMS, EOS, SAP. Rithum’s schema is an external contract we map to/from (volatility stays at boundary).
- **Provenance chain** — TikTok → Rithum → Azure → SFCC/SFOMS → EOS → SAP.
- **Structured logging** — e.g. `order.flow.webhook.paymentcleared.received`, `order.flow.sfcc.create.request`, `order.flow.servicebus.eosorderupdate.received`, `order.flow.rithum.updatestatus.request`.

```mermaid
flowchart LR
    TT["TikTok"] -->|"Order source"| R["Rithum"]
    R -->|"Webhook payload"| AZ["Azure"]
    AZ -->|"Canonical order"| SFCC["SFCC"]
    SFCC -->|"Order payload"| SFOMS["SFOMS"]
    SFOMS -->|"Order lifecycle"| EOS["EOS"]
    EOS -->|"Fulfillment"| SAP["SAP"]
```

---

## Slide 9 — Interface: Downstream Order Creation (RADIO: I)

**Flow:** Rithum posts to adapter webhooks (e.g. payment cleared) → APIM auth → Adapter validates, maps to canonical format → SFCC Cartridge API → SFCC/SFOMS → EOS (Columbia’s order-lifecycle source of truth) → SAP. Upstream status sync is Slide 10.

```mermaid
flowchart TB
    R["Rithum"] -->|"Webhook POST (order payload)"| APIM["APIM"]
    APIM -->|"Auth + policy, forward to adapter"| FA["Social-Order Adapter"]
    FA -->|"Order create request (canonical)"| CART["SFCC Cartridge API"]
    CART -->|"Order payload"| SFCC["SFCC"]
    SFCC -->|"Order payload"| SFOMS["SFOMS"]
    SFOMS -->|"Order lifecycle"| EOS["EOS"]
    EOS -->|"Fulfillment"| SAP["SAP"]
```

---

## Slide 10 — Interface: Upstream Status Sync (RADIO: I)

**Flow:** EOS holds lifecycle state; when SAP fulfills or cancels/refunds, EOS publishes to Service Bus → Adapter consumes, maps to Rithum semantics → Rithum API → TikTok updated.

**Interfaces:** EOS/SAP → Service Bus; Service Bus → Adapter; Adapter → Rithum API (status update).

```mermaid
flowchart LR
    SAP["SAP"] -->|"Fulfillment / cancel / refund"| EOS["EOS"]
    EOS -->|"Publish lifecycle events"| SB["Service Bus Upstream"]
    SB -->|"Trigger adapter (status message)"| FA["Social-Order Adapter"]
    FA -->|"Status update request (Rithum semantics)"| RAPI["Rithum API"]
    RAPI -->|"Sync to shop"| TT["TikTok"]
```

---

## Slide 11 — Observability: Grafana + Loki (RADIO: O)

**Why Loki:** KQL was resource-scoped and hard to correlate. Loki unifies logs across Columbia (AWS, GCP, Salesforce, Azure); we follow one order end-to-end. Grafana = single pane; structured logging for provenance queries.

**Flow:** Adapter (and Azure) → Azure Monitor Logs → Loki → Grafana.

```mermaid
flowchart LR
    SFCC["SFCC / Cartridge"] -->|"Order flow logs"| Adapter["Social-Order Adapter"]
    Adapter -->|"Structured logs (order.flow.*)"| AM["Azure Monitor Logs"]
    AM -->|"Unified ingest"| Loki["Loki"]
    Loki -->|"Query / dashboards"| Grafana["Grafana"]
```

---

## Slide 12 — Key Challenges & Mitigations (RADIO: O) (Action)

**Scaling** — Functions auto-scale; Service Bus buffers upstream status; no over-provision or dropped messages.

**Data sync** — Canonical model + mapping layer + idempotent order creation; provenance for reconciliation.

**Security** — APIM at edge; no TikTok credentials in our stack; least-privilege; Rithum holds social/PII at boundary.

**Fault tolerance** — Retry + backoff; DLQ for failures; idempotent creates; health checks and circuit breakers; stateless.

```mermaid
flowchart LR
    Req["Request"] -->|"Attempt"| Retry["Retry / Backoff"]
    Retry -->|"Success"| OK["Success"]
    Retry -->|"Exhausted → dead-letter"| DLQ["DLQ"]
```

---

## Slide 13 — Deployment Model (RADIO: O)

- **Pipelines** — Azure DevOps: build, test, release (Adapter, Service Bus, APIM); config in repo (dev, perf, prod).
- **Stateless functions** — Scale out without session affinity.
- **APIM** — All external traffic through APIM; auth and policy in one place.
- **Canary** — Roll out to subset, then full.
- **Rollback** — Auto-revert to last known good on failure.

---

## Slide 14 — QA and Testing (RADIO: O)

**Unit (MSTest, .NET 8):** Processors (OrderProcessor, ReturnOrderProcessor, ShipmentProcessor) and services (EOS, OrderTransformationService, etc.) with Moq/FluentAssertions; HTTP mocked; JSON testdata. Coverage: coverlet + ReportGenerator.

**Validation:** ValidationService — order, contact, address, items; allowlisted statuses and order types; structured ValidationResult.

**Integration & Service Bus:** Golden payload + Postman for Rithum discovery and SFCC Cartridge development; scripts and EOS payloads; LocalServiceBusTester and servicebus-test-payloads for E2E.

**Outcome:** Unit guards mapping and boundaries; integration + Service Bus validate flows; canary and rollback (Slide 13) reduce risk.

```mermaid
flowchart LR
    subgraph unit["Unit"]
        U1["Processors"]
        U2["Services"]
        U3["Validation"]
    end
    subgraph integration["Integration"]
        I1["EOS payloads"]
        I2["Scripts"]
    end
    subgraph servicebus["Service Bus"]
        SB["LocalServiceBusTester"]
    end
    unit -->|"Coverage"| integration
    integration -->|"E2E validation"| servicebus
```

---

## Slide 15 — Cross-Functional Integration (RADIO: I + O)

- **Auth** — APIM for webhooks; API keys/policies; no customer SSO (TikTok/Columbia handle identity).
- **APIs** — Versioned Rithum and cartridge contracts; clear request/response and errors.
- **Reproducibility** — Git, ADRs, release tags, deployment automation.
- **Consistency** — Canonical model, idempotency, provenance (Slides 8, 12); observability: Loki, Grafana, correlation IDs (Slide 11).
- **Systems** — Rithum, TikTok, SFCC/SFOMS, EOS, SAP; order and status flow only.

---

## Slide 16 — Team Leadership & Delivery (Action)

- **Discovery** — Scoped problem, evaluated direct vs Rithum, shaped technical direction.
- **Rithum adoption** — PoC and evidence so the org could commit to Rithum.
- **Buy-in** — Aligned stakeholders on adapter tech, hosting (Azure), and patterns; built the “Columbia way” to speed approval.
- **Design & delivery** — Drove canonical data model and single adapter; ADRs; coordinated commerce, SAP, SFCC/SFOMS, Rithum on contracts and rollout; Azure DevOps with canary and rollback.

---

## Slide 17 — Risks, Trade‑Offs & Scaling (RADIO: O)

**Risks:** API changes → versioned contracts, adapter abstraction, drift monitoring. Traffic spikes → auto-scale + Service Bus + DLQ. Data inconsistency → idempotency, provenance, structured logs.

**Trade-offs:** Latency vs accuracy (normalize/validate first). Streaming (webhooks + Service Bus; no batch ETL). Coupling (canonical model + one adapter). Observability cost (retention/sampling).

**Scaling:** Horizontal (stateless functions); buffering (Service Bus + retries/DLQ); new channels (same model → minimal adapter change).

```mermaid
flowchart LR
    R1["Risks → Mitigations"]
    T1["Trade-offs"]
    S1["Scaling strategies"]
```

---

## Slide 18 — Impact & Reflections (Result)

**Technical:** Reliable, scalable pipeline; full provenance TikTok → SAP → TikTok; faster debugging (Grafana/LogQL); less operational overhead.

**Organizational:** New channels (e.g. Instagram) with minimal work; clearer ownership (Columbia, Rithum, SFCC/SFOMS, SAP).

**Reflections:** Canonical model + one adapter paid off; Rithum as mapped external contract isolated schema churn; early observability made incidents and contract issues easier to fix.

---

## Slide 19 — Closing

I build high‑reliability, real‑time systems: clear requirements and architecture, a canonical data model that keeps integration volatility at the boundary, and observability that turns incidents into fast fixes. I led that design and delivery across Columbia, Rithum, SFCC, and SAP.

I’d bring the same discipline—requirements‑driven design, maintainable boundaries, and operational clarity—to Columbia’s mission‑critical systems.

---

## Slide 20 — Thank You

Thank you for your time and consideration.  
I look forward to the possibility of contributing to the team.
