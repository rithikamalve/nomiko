# Nomiko - AI-Powered Contract Analysis

**In Greek, "Nomikos" is derived from "nomos," meaning "law," and refers to someone learned in the law or an interpreter and teacher of the law.**

Nomiko is a web application designed to demystify legal documents. It leverages the power of Generative AI to analyze contracts, rental agreements, and other legal texts, translating complex jargon into plain English. With Nomiko, users can upload their documents to flag potential risks, receive negotiation guidance, and get direct answers to their questions about the contract's contents.

## Features

- **Document Upload**: Users can upload documents in PDF (`.pdf`) or Word (`.docx`) format.
- **Contextual Analysis**: Specify the document type (e.g., Rental Agreement), your role (e.g., Tenant), and the jurisdiction to receive tailored analysis.
- **Clause-by-Clause Breakdown**: The app automatically identifies and lists every clause in the document.
- **Risk Flagging**: Each clause is assessed for potential risks, which are categorized as 🟢 Low, 🟡 Medium, or 🔴 High. A clear rationale is provided for every identified risk.
- **Clause Deep Dive**:
  - **Plain-Language Summary**: Get a simple, easy-to-understand summary of any clause.
  - **Industry Standards Comparison**: See how a clause stacks up against regional and industry standards.
  - **Negotiation Suggestions**: Receive actionable advice and talking points to negotiate more favorable terms.
- **Interactive Q&A**: Ask questions about the document in natural language (e.g., "Can my landlord raise the rent?") and get an AI-powered answer based on the document's content.
- **Scenario Simulation**: Explore potential outcomes by asking "what if" questions (e.g., "What happens if I miss a rent payment?").
- **Printable Reports**: Export a summary of the identified risks for your records.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Toolkit**: [Genkit](https://firebase.google.com/docs/genkit)
- **AI Models**: Google's Gemini family of models
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **File Parsing**: `pdf-parse` for PDFs and `mammoth` for DOCX files.
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`)

## Architecture

The application follows a client-server architecture built on Next.js, with server-side AI logic handled by Genkit flows.

### 1. Frontend (`src/app` & `src/components`)

- **`src/app/page.tsx`**: The entry point of the application, which renders the main `NomikoApp` component.
- **`src/components/nomiko-app.tsx`**: This is the core stateful component that orchestrates the entire user experience.
  - It manages the application's primary state, including document details, a list of analyzed clauses, and loading statuses.
  - It conditionally renders either the `DocumentUpload` view or the `AnalysisDashboard` based on whether a document has been analyzed.
- **UI Components**:
  - **`DocumentUpload`**: The initial screen where the user uploads a file and provides context (document type, role, jurisdiction).
  - **`AnalysisDashboard`**: The main interface for interacting with the analyzed document. It features a three-column layout:
    - **Clauses List**: A scrollable list of all clauses extracted from the document, each with a risk indicator.
    - **Clause Details**: A detailed view of the currently selected clause, with tabs for `Summary`, `Risk`, `Standards`, and `Negotiate`.
    - **Interaction Tabs**: A tabbed section for `Ask a Question` and `Simulate Scenarios`.
  - **`AnalysisTab`**: A reusable component that handles the asynchronous loading and display of AI-generated content within the "Clause Details" tabs.

### 2. Backend - Genkit Flows (`src/ai/flows`)

Genkit flows are server-side functions that interact with the Gemini AI models. They are defined in the `src/ai/flows/` directory. Each flow has a specific responsibility.

- **`extract-text-from-document.ts`**:
  - **Purpose**: Takes a file (as a data URI) and extracts its raw text content.
  - **Logic**: It checks the file's MIME type to determine whether to use `pdf-parse` or `mammoth` for text extraction.

- **`flag-risky-clauses.ts`**:
  - **Purpose**: The primary analysis engine. It takes the raw document text and returns a structured list of all clauses.
  - **Logic**: It functions as an OCR/NER (Optical Character Recognition / Named Entity Recognition) system. It first parses the document to identify individual clauses and then analyzes each one to determine if it poses a risk. Risky clauses are annotated with a risk score and a rationale.

- **`summarize-clause.ts`**:
  - **Purpose**: Translates a single legal clause into plain, easy-to-understand language.

- **`compare-to-standards.ts`**:
  - **Purpose**: Compares a clause against typical industry and regional standards for a given document type and jurisdiction.

- **`suggest-negotiations.ts`**:
  - **Purpose**: Provides tailored negotiation advice for a specific clause based on the user's profile and goals.

- **`answer-user-questions.ts`**:
  - **Purpose**: Answers a user's free-form question based on the full context of the document.

- **`simulate-scenarios.ts`**:
  - **Purpose**: Predicts the outcome of a hypothetical "what-if" scenario based on the document's terms.

### Data Flow Example: Document Analysis

1.  **Upload**: The user selects a `.pdf` or `.docx` file in the `DocumentUpload` component.
2.  **Text Extraction**: The file is sent as a data URI to the `extractTextFromDocument` flow. This flow returns the full text of the document.
3.  **Clause Analysis**: The extracted text is then passed to the `flagRiskyClauses` flow.
4.  **NER & Risk Assessment**: This flow processes the text, splits it into a structured JSON array of individual clauses, and assesses each one for risks.
5.  **State Update**: The resulting array of clauses is sent back to the `NomikoApp` component, which updates its state.
6.  **Render Dashboard**: The app switches to the `AnalysisDashboard` view, displaying the list of clauses.
7.  **Deep Dive**: When the user clicks a clause, the `ClauseDetails` component makes further calls to other flows (`summarizeClause`, `compareToStandards`, etc.) to populate its tabs with on-demand analysis.
