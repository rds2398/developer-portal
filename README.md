# Developer Portal

**Live demo:** [https://6a0ee2477ccce9009a0ea26f--developer-p.netlify.app/login](https://6a0ee2477ccce9009a0ea26f--developer-p.netlify.app/login)

## Quick start (under 2 minutes)

```bash
git clone https://github.com/rds2398/developer-portal.git
cd developer-portal
npm ci
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see below)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run type-check` | TypeScript only (`tsc -b`) |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. **Authentication → Providers → Email**: enable Email provider.
3. For local testing, you may disable **Confirm email** under Email settings so sign-up works immediately.
4. Copy **Project URL** and **anon public** key into `.env`.


## Create a test user

1. Run `npm run dev` and open the app.
2. Go to **Sign up** (`/signup`).
3. Enter email and password (min. 6 characters per Supabase defaults).
4. After sign-up, sign in at **Login** (`/login`).
5. You are redirected to the dashboard. Protected routes require an active session.

**Sign out:** use **Logout** in the sidebar.

## Portal sections

| Section | Route | Notes |
|---------|-------|--------|
| Dashboard | `/` | Usage analytics from sandbox history (7 / 30 day) |
| Sandbox | `/sandbox` | Live HTTP requests to registered `baseUrl`s |
| API Keys | `/api-keys` | Create, list (masked), revoke keys |
| Change Log | `/changelog` | Filter by API and type |
| API Status | `/status` | Per-API health and incidents (mocked) |
| API Docs | `/api/:apiId` | OpenAPI-driven docs per registry entry |

**Global search:** `Cmd/Ctrl + K` — searches endpoints from all registered specs.

## Architecture (extensibility)

The portal is driven by a single registry. UI modules read from `API_REGISTRY` — not hardcoded endpoint lists in JSX.

```
src/
├── api/
│   ├── api-registry.ts      # Single source of truth
│   ├── pokeapi/
│   │   └── openapi.json
│   ├── dummy/
│   │   └── openapi.json
│   └── typeicode/
│       └── opeapi.json
├── features/docs/           # TanStack Query + spec parser
├── pages/                   # Route-level views
├── components/              # Shared UI (shadcn)
├── lib/
│   ├── spec-parser.ts
│   ├── endpoint-utils.ts
│   └── snippet-generator.ts
└── services/send-request.ts # Real fetch() to API baseUrl
```

**Registry-driven today (no component edits):** sidebar API list, documentation pages, sandbox endpoint list, Cmd/Ctrl+K search, SDK links, parameter tables, request/response schemas.

**Optional manual updates for full parity:** changelog entries (`src/lib/change-log.ts`), status page entries (`src/lib/api-status.ts`), and changelog filter dropdown labels in `src/pages/change-log.tsx` if you add a new display name.

---

## How to add a new API (detailed)

Goal: a reviewer can add a second (or third) API in **under 5 minutes** with **zero component changes**. Only config and spec files.

### Step 1 — Create the OpenAPI spec folder

Create a folder under `src/api/` using a **URL-safe slug** (e.g. `payments`):

```text
src/api/payments/
└── openapi.json
```

`openapi.json` must be valid **OpenAPI 3.x**. Minimal example:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Payments API",
    "version": "1.0.0"
  },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/v1/transfers": {
      "get": {
        "summary": "List transfers",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    }
  }
}
```


### Step 2 — Import the spec in `api-registry.ts`

Open `src/api/api-registry.ts`:

```ts
import paymentsSpec from "./payments/openapi.json";
```

Ensure TypeScript resolves JSON imports (already configured in this project).

### Step 3 — Add one registry entry

Append to `API_REGISTRY`:

```ts
{
  id: "payments",                  
  name: "Payments API",               
  version: "1.0.0",
  baseUrl: "https://api.example.com", 
  spec: paymentsSpec,
  docsFile: "/src/api/payments/docs.md",  
  sdkLinks: [                          
    { name: "Node SDK", url: "https://github.com/example/sdk" },
  ],
},
```

| Field | Required | Purpose |
|-------|----------|---------|
| `id` | Yes | Unique slug; route is `/api/{id}` |
| `name` | Yes | Display name in sidebar and headers |
| `version` | Yes | Shown on docs page |
| `baseUrl` | Yes | Prepended to paths for sandbox `fetch` |
| `spec` | Yes | Imported OpenAPI JSON |
| `docsFile` | No | Path to markdown quickstart (fetched at runtime) |
| `sdkLinks` | No | SDK / library links on docs page |


### Step 4 — Verify (reviewer checklist)

1. Restart dev server if it was running: `npm run dev`.
2. **Sidebar** — new API name appears under **APIs**.
3. **`/api/payments`** (your `id`) — endpoints, parameters, and schemas render from the spec.
4. **`/sandbox`** — select the API; endpoints list updates; **Send Request** hits `baseUrl` (real network, not mocked).
5. **`Cmd/Ctrl + K`** — search includes new endpoints.

No edits to `ApiDocs`, `Sandbox`, `Sidebar` (beyond registry), or `search-command` are required.


---
## Repository

- **Live site:** https://6a0ee2477ccce9009a0ea26f--developer-p.netlify.app/login
- **GitHub:** https://github.com/rds2398/developer-portal

