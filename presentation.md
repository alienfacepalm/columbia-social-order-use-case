<!--
HYBRID FORMAT NOTES
- Slides are clean for Cursor slide generation
- STAR + RADIO cues included in HTML comments
- Speaker Notes placeholders included for Cursor to auto-fill
- Pacing target: ~40 minutes
-->

# Social-Order Adapter

## High‑Reliability Real‑Time System Design

### Columbia: Social‑Order Adapter — Commerce Pipeline

### Brandon Pliska — Senior Full Stack Engineer Candidate

---

## Slide 1 — Welcome

**High‑Reliability Real‑Time System Design**  
Columbia: Social‑Order Adapter — Commerce Pipeline  
Brandon Pliska — Senior Full Stack Engineer Candidate

<!-- STAR: S — Introduce the situation -->
<!-- RADIO: R — Problem framing -->
<!-- Pacing: 2 minutes -->

---

## Slide 2 – Problem Framing

Columbia’s directive was to support **multiple social networks** for in-app commerce; [TikTok](copilot-action://composer-send?text=What%20is%20TikTok%20Shop) Shop was the **first**. Customers would purchase inside each platform (e.g. TikTok) using their existing accounts, and those orders had to flow reliably into Columbia’s [SFCC backend](copilot-action://composer-send?text=Explain%20Salesforce%20Commerce%20Cloud%20order%20flows).

### Objectives

- **[Build a robust ingestion + processing pipeline](copilot-action://composer-send?text=How%20do%20you%20design%20a%20robust%20ingestion%20pipeline%3F)**  
  Normalize TikTok Shop order data and handle bursty, inconsistent payloads without breaking downstream systems.

- **[Deliver timely, actionable order data](copilot-action://composer-send?text=What%20counts%20as%20timely%20order%20data%20for%20commerce)**  
  Ensure orders, cancellations, and updates arrive quickly enough to support fulfillment, inventory, and customer service.

- **[Maintain predictable behavior under inconsistent inputs](copilot-action://composer-send?text=How%20to%20design%20predictable%20behavior%20with%20inconsistent%20inputs)**  
  Gracefully handle malformed, partial, or delayed TikTok payloads while preserving order integrity and provenance.

```mermaid
flowchart LR
    TT["TikTok Shop"] -->|"Purchase"| Goal["Orders flow"]
    Goal --> SFCC["Columbia / SFCC"]
```

<!-- STAR: S -->
<!-- RADIO: R -->
<!-- Pacing: 2 minutes -->

---

## Slide 3 — Requirements (Social‑Order Adapter)

**Functional Requirements**

- Ingest TikTok Shop orders via **Rithum posting to Social-Order Adapter webhook endpoints**
- Normalize into **canonical formats** for SFCC / SFOMS (EOS) / SAP
- Maintain **order provenance** end‑to‑end
- Support **bidirectional** status updates
- Authenticate via **APIM**
- Use **Azure Service Bus** for downstream + upstream flows
- Integrate via **custom SFCC cartridge**

**Non‑Functional Requirements**

- Reliability, observability, maintainability
- Scalability under TikTok traffic spikes
- Auditability across all systems

<!-- STAR: S -->
<!-- RADIO: R -->
<!-- Pacing: 2 minutes -->

---

## Slide 4 — Why Rithum Won (Decision Architecture)

We evaluated two options:

**Direct SFCC → TikTok API**

- Fragile
- High maintenance
- TikTok has a **specific API format** — we’d support it (and each future network) directly; no single canonical schema across social platforms
- No retries/backoff
- Tight coupling

**Rithum Middleware**

- Better pricing
- **Canonical order schema** — one model for TikTok and future networks (Instagram, YouTube, etc.)
- Built‑in retries + DLQs
- Future‑proof (Instagram, YouTube, etc.)
- Versioned API contracts
- ADR‑documented decision

```mermaid
flowchart LR
    subgraph direct["Direct SFCC to TikTok"]
        D1[Fragile]
        D2["Per-network API only"]
        D3[Tight coupling]
    end
    subgraph rithum["Rithum Middleware"]
        R1["Canonical schema"]
        R2["Retries + DLQ"]
        R3["Versioned API"]
    end
```

<!-- STAR: T/A -->
<!-- RADIO: I -->
<!-- Pacing: 3 minutes -->

---

## Slide 5 — Social‑Order Adapter Architecture Diagram

```mermaid
flowchart LR
    subgraph inbound["Inbound: TikTok → Columbia"]
        TT["TikTok Shop"] --> R["Rithum Middleware"]
        R --> APIM["Azure API Management"]
        APIM --> AF["Social-Order Adapter"]
        AF --> SB1["Azure Service Bus"]
        SB1 --> CM["Canonical Mapping"]
        CM --> CART["SFCC Cartridge"]
        CART --> SFCC["Commerce Cloud"]
        SFCC --> SFOMS["SFOMS (EOS)"]
        SFOMS --> SAP["SAP"]
    end

    subgraph upstream["Upstream: Columbia → TikTok"]
        SAP --> SB2["Service Bus Upstream"]
        SB2 --> AF2["Social-Order Adapter"]
        AF2 --> RAPI["Rithum API"]
        RAPI --> TTAPI["TikTok API"]
        TTAPI --> TTV["User sees updates in TikTok"]
    end

    subgraph observability["Observability"]
        AM["Azure Monitor Logs"]
        Loki["Loki"]
        KQL["KQL"]
        Grafana["Grafana"]
        AF --> AM
        AF --> KQL
        APIM --> KQL
        SB1 --> AM
        SB2 --> AM
        AM --> Loki
        Loki --> Grafana
        KQL --> Grafana
    end
```

<!-- STAR: A -->
<!-- RADIO: A/I -->
<!-- Pacing: 3 minutes -->

---

## Slide 6 — Azure Function App: Auto-Scaling & Social-Order Adapter

**Auto-Scaling**

- Azure Function Apps **scale automatically** with incoming load, so the pipeline handles TikTok traffic spikes without over-provisioning.

**Social-Order Adapter (single Function App)**

The adapter controls **downstream** (Rithum → Columbia) and **upstream** (Columbia → Rithum) flows between Rithum and Columbia.

- **APIM-secured webhook endpoints** — Rithum posts order and update payloads here; APIM handles auth and policy.
- **Service Bus triggers** — Downstream (e.g. SAP/SFOMS) events are published to Service Bus; the same Function App consumes them and calls back to the **Rithum API** so Rithum stays in sync with Columbia’s fulfillment state.

Result: one adapter that ingests from Rithum and pushes status back to Rithum, with automatic scale for both webhook and Service Bus traffic.

```mermaid
flowchart LR
    WH["Webhooks"] --> FA["Social-Order Adapter"]
    SB["Service Bus"] --> FA
    FA --> Down["Downstream"]
    FA --> RAPI["Rithum API"]
```

<!-- STAR: A -->
<!-- RADIO: I -->
<!-- Pacing: 2–3 minutes -->

---

## Slide 7 — Downstream Order Creation

**Flow**

- Rithum posts to **Social-Order Adapter** webhook endpoints
- APIM authenticates + applies policies
- Adapter validates + normalizes → **Azure Service Bus**
- **Canonical mapping** → SFCC Cartridge creates orders
- SFOMS orchestrates lifecycle → SAP fulfills

```mermaid
flowchart TB
    R["Rithum"] --> APIM["APIM"]
    APIM --> FA["Social-Order Adapter"]
    FA --> SB["Service Bus"]
    SB --> CM["Canonical Mapping"]
    CM --> CART["SFCC Cartridge"]
    CART --> SFCC["SFCC"]
    SFCC --> SFOMS["SFOMS (EOS)"]
    SFOMS --> SAP["SAP"]
```

<!-- STAR: A -->
<!-- RADIO: I -->
<!-- Pacing: 3 minutes -->

---

## Slide 8 — Upstream Status Sync

**Flow**

- SAP emits fulfillment events
- SFOMS (EOS) updates lifecycle
- Events published to **Service Bus (Upstream)**
- **Social-Order Adapter** transforms + updates Rithum API

```mermaid
flowchart LR
    SAP["SAP"] --> SFOMS["SFOMS (EOS)"]
    SFOMS --> SB["Service Bus Upstream"]
    SB --> FA["Social-Order Adapter"]
    FA --> RAPI["Rithum API"]
    RAPI --> TT["TikTok"]
```

<!-- STAR: A -->
<!-- RADIO: I -->
<!-- Pacing: 3 minutes -->

---

## Slide 9 — Data: Provenance & Canonical Mapping

- Canonical schema isolates upstream volatility
- Provenance chain:
  - TikTok → Rithum → Azure → SFCC → SFOMS (EOS) → SAP
- Structured logging with dot‑chaining (e.g. `order.flow.*`):
  - `order.flow.rithum.webhook.received`
  - `order.flow.sfcc.create.request`
  - `order.flow.sap.fulfillment.status`

```mermaid
flowchart LR
    TT["TikTok"] --> R["Rithum"]
    R --> AZ["Azure"]
    AZ --> SFCC["SFCC"]
    SFCC --> SFOMS["SFOMS (EOS)"]
    SFOMS --> SAP["SAP"]
```

<!-- STAR: A -->
<!-- RADIO: D -->
<!-- Pacing: 3 minutes -->

---

## Slide 10 — Observability: Grafana + Loki / KQL

**Why Loki > KQL**

- KQL was resource‑scoped, fragmented
- Hard to correlate cross‑system events
- Loki unifies logs across all of Columbia (AWS, GCP, Salesforce, Azure, etc.) so we can piece together timelines and visualize an order's provenance or journey
- Grafana dashboards gave a single pane of glass
- Structured logging enabled provenance queries

**Log flow:** SFCC and downstream systems are observed via the **Social-Order Adapter**; the adapter (and Azure) emit to **Azure Monitor Logs**, which feed **Loki** for unified querying.

```mermaid
flowchart LR
    SFCC["SFCC / Cartridge"] --> Adapter["Social-Order Adapter"]
    Adapter --> AM["Azure Monitor Logs"]
    AM --> Loki["Loki"]
    Loki --> Grafana["Grafana"]
```

<!-- STAR: A -->
<!-- RADIO: O -->
<!-- Pacing: 3 minutes -->

---

## Slide 11 — Fault Tolerance & Reliability

- Retry + backoff
- Dead‑letter queues
- Idempotent order creation
- Health checks + circuit breakers
- Autoscaling

```mermaid
flowchart LR
    Req["Request"] --> Retry["Retry / Backoff"]
    Retry --> OK["Success"]
    Retry --> DLQ["DLQ"]
```

<!-- STAR: A -->
<!-- RADIO: O -->
<!-- Pacing: 2 minutes -->

---

## Slide 12 — Deployment Model (Commerce)

- Stateless Azure Functions
- APIM as secure boundary
- Canary deployments
- Automated rollback

<!-- STAR: A -->
<!-- RADIO: O -->
<!-- Pacing: 2 minutes -->

---

## Slide 13 — Cross‑Functional Integration

- Worked with commerce, SAP, SFCC, and Rithum teams
- Managed API contracts
- Ensured version control + reproducibility

<!-- STAR: A -->
<!-- RADIO: I -->
<!-- Pacing: 1 minute -->

---

## Slide 14 — Key Trade‑Offs

- Latency vs accuracy
- Batch vs streaming
- Coupling vs maintainability
- Observability cost vs depth

```mermaid
flowchart LR
    T1["Latency vs accuracy"]
    T2["Batch vs streaming"]
    T3["Coupling vs maintainability"]
    T4["Observability vs depth"]
```

<!-- STAR: A -->
<!-- RADIO: Summary -->
<!-- Pacing: 2 minutes -->

---

## Slide 15 — Impact

- Reliable, scalable, future‑proof adapter pipeline
- Full provenance from TikTok → SAP → TikTok
- Faster debugging via Loki
- Reduced operational overhead
- Enabled new social channels with minimal work

<!-- STAR: R -->
<!-- RADIO: O -->
<!-- Pacing: 3 minutes -->

---

## Slide 16 — Closing

I build systems that perform under real‑world constraints.  
I'd bring the same rigor, clarity, and reliability to Echodyne's radar software platform.

<!-- STAR: R -->
<!-- Pacing: 1 minute -->

---

## Slide 17 — Thank You

Thank you for your time and consideration.  
I look forward to the possibility of contributing to Echodyne.
