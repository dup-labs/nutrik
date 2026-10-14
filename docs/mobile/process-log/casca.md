# process-log: casca (apps/mobile)

## Escolha de estratégia e versões
- O que fiz: confirmei no contrato que o web é SSR (sem export estático), então casca com `server.url`. Versões conferidas com `npm view`: Capacitor core/cli/ios/android 8.5.3; app 8.1.2, browser 8.0.5, push-notifications 8.1.3, haptics 8.0.2, status-bar 8.0.4, splash-screen 8.0.2, keyboard 8.0.6, network 8.0.1, preferences 8.0.1, @capacitor/assets 3.0.5.
- Tempo/esforço (estimado): 10 min.
- Travou em / pegadinha: **Capacitor 8 exige Node >= 22** (`engines` do cli). A máquina tinha Node 20 como padrão; usei o 22 do nvm (`PATH=~/.nvm/versions/node/v22.20.0/bin`). Sem isso o `cap` nem roda. Registrei `engines.node >=22` no package.json.
- Genérico: sim (a regra "servidor dinâmico = server.url, não export" e o requisito de Node).

## package.json, config e tela offline
- O que fiz: `capacitor.config.ts` com `server.url` vindo de `CAP_SERVER_URL` (cleartext só liga se a URL for `http://`), `errorPath: offline.html`, `appendUserAgent` por plataforma, `allowNavigation` com `app.nutrk.io` e `*.supabase.co`, e blocos de SplashScreen/StatusBar/Keyboard/PushNotifications. `www/` tem `offline.html`, `index.html` (só redireciona pro offline; o Capacitor exige o `webDir` existir e ter index) e o logo.
- Tempo/esforço (estimado): 20 min.
- Travou em / pegadinha:
  - O logo da marca (`nutrk-logo.svg`) é **branco** (feito pra fundo escuro): na tela offline branca ficaria invisível. Copiei pro `www/` trocando `fill="white"` por `#1b1c1d`. A pasta `brand/` está fora do git, então a cópia em `www/` é a versão versionada.
  - `errorPath` só dispara quando o webview falha ao carregar a URL remota; não é um "modo offline" geral. Quem está com a página já aberta e perde a rede não vê essa tela (isso é papel do plugin Network no web).
  - Botão "tentar de novo" usa `location.replace` pra URL de produção, não `reload()`: na página de erro, recarregar recarregaria o próprio offline.html. Em dev com `CAP_SERVER_URL` local o botão leva pra produção; aceitável, mas anotar.
  - `ios.scheme` NÃO mexi: mudar o scheme interno do webview quebra cookies/storage. Não precisa quando se usa `server.url`.
  - Não consegui validar a tela no dispositivo (sem Xcode/Android Studio); só inspeção do HTML.
- Genérico: sim, tudo exceto o logo e as cores.

## Plataformas (`cap add`)
- O que fiz: `npx cap add android` e `npx cap add ios --packagemanager SPM`. iOS gerou `Package.swift` em `ios/App/CapApp-SPM` (sem Podfile, sem pod install).
- Tempo/esforço (estimado): 5 min (mais lento é instalar dependência).
- Travou em / pegadinha: a máquina não tem Xcode completo (só Command Line Tools) nem CocoaPods; SPM é o padrão do Capacitor 8 e dispensa pod. `xcodebuild` não roda; não validei compilação, só `cap sync` (ok). Java também não está instalado aqui. O Capacitor gera `.gitignore` próprio em `ios/` e `android/` (ignora build, Pods, `config.xml`, `capacitor.config.json` gerados e `public/`); o do projeto só complementa. **`google-services.json` NÃO vem ignorado no template**: coloquei no `.gitignore` raiz.
- Genérico: sim.

## Configuração nativa
- O que fiz:
  - iOS `Info.plist`: URL scheme `io.nutrk.app`, `NSCameraUsageDescription`/`NSPhotoLibraryUsageDescription` em pt-BR, `UIBackgroundModes: remote-notification`, `ITSAppUsesNonExemptEncryption=false`, retrato (iPhone retrato; iPad retrato + `UIRequiresFullScreen`). `App.entitlements` com `aps-environment` e `applinks:app.nutrk.io`, **fora do target** de propósito.
  - iOS `AppDelegate.swift`: adicionei `didRegisterForRemoteNotificationsWithDeviceToken` / `didFail...` postando nas notificações do Capacitor.
  - Android `AndroidManifest.xml`: intent-filter do scheme, App Links `autoVerify` em `https://app.nutrk.io/auth`, `POST_NOTIFICATIONS`, `CAMERA` (+ `uses-feature camera required=false`), `screenOrientation=portrait`; `styles.xml` com status bar branca e ícones escuros. Gradle: o template já aplica `google-services` condicionalmente quando existe `android/app/google-services.json` e já tem o classpath, então nada a mudar.
- Tempo/esforço (estimado): 40 min.
- Travou em / pegadinha:
  - **O template iOS do Capacitor não repassa o token APNs.** Sem os dois métodos no AppDelegate, `PushNotifications.register()` não resolve nunca no iOS e não dá erro. Pegadinha clássica.
  - Ligar `App.entitlements` no projeto com conta gratuita quebra a assinatura (Push e Associated Domains exigem conta paga). Por isso o arquivo está pronto mas não referenciado em `CODE_SIGN_ENTITLEMENTS`.
  - `<input capture>` no webview iOS exige as strings de câmera/fotos no Info.plist ou o app crasha ao tocar. No Android 13+ o `CAMERA` precisa estar no manifest pro `capture` funcionar.
  - `POST_NOTIFICATIONS` (Android 13+) também exige pedir permissão em runtime (feito no web, não aqui).
  - App Links `autoVerify` sem `assetlinks.json` válido não quebra nada, só não verifica (abre no navegador com seletor).
  - `appendUserAgent` é append: o web detecta por substring `NutrkApp/`.
  - O arquivo `Info.plist` tem indentação mista; editei por script em Python pra não bagunçar e validei com `plutil -lint`.
- Genérico: sim, exceto strings e domínios.

## Ícones e splash
- O que fiz: melhor fonte disponível foi `/1-products/nutrk/assets/icon.png` (1000x1000, cantos levemente arredondados com alpha). Cortei 4px de cada lado pra eliminar os cantos, ampliei pra 1024 e achatei o alfa (`assets/icon-only.png`). Splash 2732x2732: ícone arredondado de 480px centralizado em fundo branco (`splash.png`) e `#1b1c1d` (`splash-dark.png`). `capacitor-assets generate` gerou 38 arquivos Android e 7 iOS.
- Tempo/esforço (estimado): 25 min.
- Travou em / pegadinha:
  - **iOS rejeita ícone com canal alfa** — por isso o achatamento (a nova ferramenta já achata, mas a fonte precisa estar limpa).
  - O `capacitor-assets` também cria `icons/` e `www/manifest.json` (saída PWA) por padrão; apaguei, o web tem manifest próprio.
  - Android: sem `icon-foreground`/`icon-background` ele usa o mesmo ícone no adaptativo, que pode cortar nas máscaras circulares. Precisa de arte final.
  - Ampliar 1000 -> 1024 é um upscale pequeno, visualmente ok, mas **não é arte final**. Pedir exportação do vetor em 1024+.
  - `npm audit` aponta 7 vulnerabilidades (1 crítica) todas na cadeia `@capacitor/assets` -> `@trapezedev/project` -> `xcode`/`uuid`; é ferramenta de build, não entra no app.
- Genérico: sim (o processo); o ícone é específico.

## Scripts e docs
- O que fiz: scripts `sync`, `open:ios`, `open:android`, `assets`, `dev:ios`, `dev:android`; README e CLAUDE.md curtos.
- Tempo/esforço (estimado): 15 min.
- Travou em / pegadinha: o `dev:*` roda `cap sync` com `CAP_SERVER_URL` local, o que **grava a URL de dev no projeto nativo**. Se esquecer e gerar build de loja logo depois, o app vai apontar pra IP local. Documentado: rodar `npm run sync` sem variável antes de build de loja. Android emulador acessa a máquina em `10.0.2.2`, não `localhost`. Aparelho físico precisa do IP da máquina.
- Genérico: sim.

## Pedidos ao integrador
- Rodar `npx cap sync` limpo (sem `CAP_SERVER_URL`) antes do build de loja.
- O web precisa servir `/.well-known/apple-app-site-association` e `/.well-known/assetlinks.json` com `TEAM_ID` / `SHA256_FINGERPRINT` reais quando houver as contas.
- Dependência cruzada: o handler de deep link (`App.addListener("appUrlOpen")`) e o fechamento do `Browser` ficam no web (`lib/native.ts`), não na casca.

## Pendências que dependem de conta Apple/Google
- Apple Developer paga: ligar `App.entitlements` (Push + Associated Domains) no target; chave APNs `.p8`; Team ID no AASA; Sign in with Apple; assinatura/TestFlight.
- Firebase: criar app `io.nutrk.app`, colocar `google-services.json` em `android/app/`.
- Google Play: chave de assinatura (SHA-256 pro `assetlinks.json`), conta Play Console.
- Não rodei nenhum build nativo (sem Xcode/Android Studio/JDK aqui): primeiro build de cada plataforma ainda é validação pendente. Comandos: `npm run open:ios` e Run no Xcode; `npm run open:android` e Run no Android Studio (ou `cd android && ./gradlew assembleDebug`).
- Arte final do ícone (1024+, com versão adaptativa Android).
