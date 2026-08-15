# AgentPulse UI (AgentMeter Dashboard)

Standalone, independently deployable Next.js dashboard for AI Agent Observability, Fleet Telemetry, Token Metrics, and Cost Intelligence across Claude Code, GitHub Copilot, Gemini/Antigravity, Codex, and Grok.

## Features

- **Fleet Overview**: High-level token volume, spend metrics, active agent distributions, and live telemetry simulation.
- **AI Agents**: Real-time comparison of latency, error rates, prompt vs output tokens, and spend per agent assistant.
- **Session Explorer & Timelines**: Full chronologically indexed session explorer and event timeline tracing.
- **Model Efficiency & Pricing**: Breakdown of cache hit rates, prompt caching cost savings, and token volume per LLM provider.
- **MCP Analytics**: Telemetry, invocation rates, and latency breakdowns for Model Context Protocol (MCP) tool servers.
- **Budgets & Anomaly Alerts**: Live spend cap progress, surge detection rules, and alert logs.
- **Identity & MCP OAuth 2.0**: Enterprise SSO login modal (Google, GitHub, Azure AD, SAML 2.0) and scoped MCP Access Token issuer.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend Endpoints
Create or adjust `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_INGEST_BASE_URL=http://localhost:4001
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
```bash
npm run build
npm start
```

## Docker Deployment

Build and run as a standalone container:

```bash
docker build -t agent-pulse-ui .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://your-backend-api:4000 agent-pulse-ui
```
