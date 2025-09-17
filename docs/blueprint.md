# **App Name**: Nomiko

## Core Features:

- Document Ingestion: Upload PDFs, Word docs, or scanned images. Google Document AI OCR extracts text reliably from messy scans. Auto-detects document type (rental, loan, service agreement, ToS, etc.). Pre-processing ensures contracts are split into logical clauses.
- Clause-by-Clause Simplification: AI-powered plain-language summaries for every clause. Side-by-side view: Original text (left) vs. Simplified text (right). Clickable clauses for deeper explanations.
- Risk Flagging + Scoring: Identifies “red flag” clauses (hidden fees, unlimited liability, unilateral termination, arbitration). Assigns severity scores: 🟢 Low (Standard), 🟡 Medium (Unfavorable but negotiable), 🔴 High (High risk / predatory). Provides rationale: “Why this is risky.”
- Benchmarking & Standards: Compares clauses to regional + industry norms. Example: “Average deposit = 1 month. This requires 3 months → above standard.” Positions user to negotiate from a place of knowledge.
- Interactive Q&A: Conversational AI answers user-specific queries. Example: User: “Can my landlord raise rent anytime?” AI: “Yes. Clause 14 allows rent increases after 6 months with 30 days’ notice (above average for your state).
- Scenario Simulation: “What if I default on payments?” → Outcome simulation. “Worst vs. Best case scenario?” → Risk vs. protection analysis. Forward-looking advice to prep users for real-world consequences.
- Negotiation & Guidance: Provides practical suggestions: “Request a 60-day termination notice (instead of 30).” “Cap liability to 12 months’ fees.” Tailored to document type and jurisdiction.
- Customization: User profiles: Tenant, Freelancer, Small Business Owner, Consumer. Context-aware output that focuses on relevant risks. Multi-language support for accessibility.
- Privacy Layer: On-device pre-processing where possible. End-to-end encryption for docs in cloud storage. Strict no-resale policy → explicit trust differentiator.
- Report Generation: Exportable Simplified Contract Report (PDF/Doc). Highlights key risks, obligations, and negotiation points. Shareable with family, advisors, or lawyers.

## Style Guidelines:

- Primary: #3399FF (Bright Trustworthy Blue) → Buttons, highlights.
- Background: #F0F8FF (Light Blue Tint) → Calming canvas.
- Accent: #33BDBD (Teal) → Calls-to-action, risk flag emphasis.
- Headlines: Space Grotesk, sans-serif → Modern, bold, tech-forward.
- Body: Inter, sans-serif → Readable, clean, professional.
- Minimalist, flat-style icons.
- Risk Severity: 🟢🟡🔴 icons + tooltip explanations.
- Clause types (Payment, Termination, IP, Liability) → clear icons for scanning.
- Split-screen view: Original clause (left) | Simplified clause (right).
- Modular sections: Document Viewer → Risk Summary → Q&A → Export.
- Whitespace-heavy design: No clutter, focus on readability.
- Sticky navigation bar: Easy access to risk summary, Q&A, and export.