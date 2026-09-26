# Project: ContractGuard
## Goal
Build a web app where a user uploads a contract (PDF/Image). The system must extract text, identify risky clauses, and generate a risk report.

## User Persona
A small business owner who cannot afford a lawyer for every contract.

## Rules for Bob
1. Always explain your reasoning step-by-step before writing code.
2. You must use IBM Bob's Subtask/Subagent feature to create three specialized agents:
   - `ExtractorAgent`: Extracts raw text from uploaded documents.
   - `RiskAnalyzerAgent`: Scans the text for predefined risky terms (e.g., "indemnification," "auto-renew," "liability cap").
   - `ReportGeneratorAgent`: Formats the findings into a clean, readable HTML report.
3. The final output must be a single React component (`App.jsx`) that the user can interact with.
4. If you are unsure about a library or API, ask me for clarification.
5.Also provides information from other sources(Attaches links) regarding the pdf.


regarding How I want my webapp to Look
1.Have a user sign-in option(Sign-in option open by Google,Email and mobile number).
2.After Sign-in,The user lands to a welcome page.(That in brief describes about the webapp and it's functionality).
3.There is a navbar at the top.(Initially when we launch it,we are at the home page),Then in the navbar,there is an option called Guide(That guides the user how to use this app)--Initially a text+image version,if I get enough time I will upload a short video which will direct to youtube(I mean I can watch it on that webpage,but I can also seperately see this on youtube)


Overall,I want my format like this website
https://www.patrickburnslaw.com/blog/2026/01/what-is-a-contract-lawyer-exploring-roles-and-responsibilities/

With the option of specification of business types,And everything


https://www.patrickburnslaw.com/blog/2026/01/what-is-a-contract-lawyer-exploring-roles-and-responsibilities/