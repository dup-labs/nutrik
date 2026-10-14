# apps/mobile — casca Capacitor

Leia `docs/mobile/ARCHITECTURE.md` (contrato) antes de mexer. Resumo:

- É só a casca nativa: o app é o `apps/web`, carregado via `server.url`. Não duplique lógica de produto aqui.
- Constantes (appId, scheme, user-agent) estão no contrato e em `capacitor.config.ts`. Mudou uma, mude as duas pontas (web + nativo).
- Node 22+ (`~/.nvm/versions/node/v22*`). Não rode build nativo (Xcode/Gradle) na máquina compartilhada; `npx cap sync` pode.
- iOS usa SPM, sem CocoaPods. `ios/` e `android/` são versionados — não ignore.
- `www/` só tem o que roda local (offline.html). Não coloque app web aqui.
- Plugins instalados: app, browser, push-notifications, haptics, status-bar, splash-screen, keyboard, network, preferences. Adicionou plugin? Atualize a lista em `ARCHITECTURE.md` e rode `npm run sync`.
- Segredos (`google-services.json`, `.p8`, keystores) nunca entram no git.
- Pendências de conta Apple/Google: ver `README.md`.
