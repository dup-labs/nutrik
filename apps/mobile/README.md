# nūtrk mobile

Casca Capacitor 8 (iOS + Android) que carrega `https://app.nutrk.io` num webview nativo (`server.url`). O app de verdade é o `apps/web`; aqui mora só o que é nativo. Deploy do web atualiza o app na hora; build nativo só quando mudar algo nativo. Contrato completo em `docs/mobile/ARCHITECTURE.md`.

- appId / bundle id: `io.nutrk.app` · nome: `Nūtrk`
- user-agent anexado: `NutrkApp/1 ios` · `NutrkApp/1 android`
- deep link: `io.nutrk.app://X` abre `/X` no webview
- `www/offline.html` é a tela local de "sem conexão" (`server.errorPath`)

## Pré-requisitos

- Node 22+ (o CLI do Capacitor 8 exige)
- iOS: Xcode (a versão que o Capacitor 8 pedir) — o projeto usa Swift Package Manager, **não precisa de CocoaPods**
- Android: Android Studio + JDK 21 (o que vem com o Android Studio serve)

## Rodar

```bash
npm install
npm run sync            # copia www/ e config pros projetos nativos
npm run open:ios        # abre no Xcode
npm run open:android    # abre no Android Studio
```

Contra o web local (`npm run dev` em `apps/web`, porta 3000):

```bash
npm run dev:ios                                   # simulador: http://localhost:3000
CAP_SERVER_URL=http://192.168.0.10:3000 npm run dev:ios       # aparelho físico: IP da máquina
npm run dev:android                               # emulador: http://10.0.2.2:3000
```

`CAP_SERVER_URL` só vale na hora do `cap sync`. Com `http://` o cleartext é liberado automaticamente. **Antes de gerar build de loja, rode `npm run sync` sem a variável** (senão o app aponta pro IP local).

## Ícones e splash

Fontes em `assets/` (`icon-only.png` 1024, `splash.png` e `splash-dark.png` 2732). Pra regenerar:

```bash
npm run assets
```

O ícone atual veio do `icon.png` de 1000px da marca, ampliado pra 1024. **Falta arte final em 1024+** (e ícone adaptativo do Android com foreground separado).

## Depende de conta

**Apple Developer (paga)**
- Ligar o `ios/App/App/App.entitlements` ao target (Signing & Capabilities: Push Notifications + Associated Domains) — o arquivo já está pronto, mas não está referenciado no projeto
- Chave APNs (.p8) pro envio de push
- Team ID no `apple-app-site-association` (`applinks:app.nutrk.io`, servido pelo web em `/.well-known/`)
- Sign in with Apple (regra da loja)

**Google / Firebase**
- Criar projeto Firebase com o app `io.nutrk.app` e baixar o `google-services.json` pra `android/app/` (está no `.gitignore`; o gradle já aplica o plugin sozinho quando o arquivo existe)
- SHA-256 da chave de assinatura no `assetlinks.json` do web (App Links `https://app.nutrk.io/auth` estão com `autoVerify`, só passam depois disso)
- Conta Play Console pra publicar

## Pegadinhas

- `ios/` e `android/` são versionados; os `.gitignore` gerados pelo Capacitor cuidam do que é build
- `npm audit` acusa vulnerabilidades vindas do `@capacitor/assets` (devDependency, só gera imagem, não vai pro app)
