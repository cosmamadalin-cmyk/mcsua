# MC SUA - Todo List

## Completed Tasks
- [x] Fix IAAI button to open IAAI homepage and copy lot number to clipboard
- [x] Update IAAI button text to show lot number
- [x] Add Indiana (IN) to STATE_TRANSPORT map with cost 1675 and port "New York"
- [x] Rewrite /calculator page with standalone calculator matching vehicle detail page
  - [x] Platform toggle (Copart/IAAI) with correct fees (12%/10%)
  - [x] Dropdown with all 47 US states and transport costs
  - [x] Rotterdam port (not Bremerhaven)
  - [x] TVA 21%, customs duty 10%
  - [x] Vehicle type selector (Sedan/SUV/Pickup) for Romania transport
  - [x] Total recalculates live on any change
  - [x] Committed and pushed to GitHub
  - [x] Deployed to https://mcsua.ro

## Chatbot /api/chat — 401 REZOLVAT (commit 860a851)

**Cauza reală:** platforma (Netlify runtime) injecta `ANTHROPIC_BASE_URL` și
`ANTHROPIC_AUTH_TOKEN` în environment. SDK-ul Anthropic prioritiza acele
variabile, deci cererile plecau către un proxy care respingea cheia → 401.
Cheia `MCSUA_AI_KEY` era corectă tot timpul (de aceea curl-ul local mergea).

**Fix aplicat în `src/app/api/chat/route.ts`:**
- [x] Captură debug `dbgBaseUrl` / `dbgHasAuthToken` în POST
- [x] `delete process.env.ANTHROPIC_BASE_URL` + `delete process.env.ANTHROPIC_AUTH_TOKEN`
- [x] `new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" })`
- [x] `_debug` extins cu `envBaseUrl` + `hasAuthToken`
- [x] `bunx tsc --noEmit` — curat
- [x] Push `860a851` pe origin/main
- [x] Deploy live pe https://mcsua.ro

**Verificat live:**
- [x] Mesaj simplu → HTTP 200 + răspuns AI
- [x] Tool call `search_cars` (BMW X5 licitație) → HTTP 200, 8 rezultate,
      link-uri catalog corecte + deep-link filtrat

### De curățat ulterior
- [ ] Scoate instrumentarea `_debug` din blocul catch (keyLen, keyPrefix,
      keyStart, keyEnd, envBaseUrl, hasAuthToken) — expune date despre cheie
      în răspunsul public dacă apare vreo eroare

## Pending Tasks
- None

## Notes
- Project uses Next.js 16.1.1 with app router
- Deployed dynamically on Netlify at https://mcsua.ro
- Git repository: https://github.com/cosmamadalin-cmyk/mcsua
