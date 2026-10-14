# Google Play: Data safety

> Aviso: isto não é aconselhamento jurídico. A política de privacidade e estas respostas devem ser revisadas por advogado antes de publicar. Conferir o formulário vigente no Play Console no dia do preenchimento (os rótulos mudam).

## Seção 1: visão geral

| Pergunta | Resposta |
|---|---|
| O app coleta ou compartilha algum tipo de dado do usuário exigido? | Sim |
| Todos os dados são criptografados em trânsito? | Sim (HTTPS) |
| Oferece forma de o usuário pedir exclusão dos dados? | Sim. No app (perfil, configurações, excluir conta) e na URL pública `https://app.nutrk.io/excluir-conta` (campo "URL de exclusão de conta" do Play) |
| App segue a política Families? | Não. Público: maiores de 18 |
| Validação independente de segurança (MASA)? | Não |

"Compartilhar" no Google = transferir a terceiros. Provedores que tratam em nosso nome (Supabase, Vercel, Resend) como service providers **não** contam como compartilhamento. Compartilhamento com o profissional vinculado é ação iniciada pelo usuário, dentro do próprio serviço: também não declarar como "compartilhado". Asaas recebe dados do profissional para cobrança como processador de pagamento: tratar como service provider; confirmar com o jurídico.

## Seção 2: tipos de dados

Legenda: C = coletado, S = compartilhado, Obrig. = obrigatório/opcional, Finalidade = funcionalidade do app salvo indicação. Nenhum dado é usado para publicidade, marketing ou análise.

| Categoria / tipo | C | S | Obrigatório? | Finalidade |
|---|---|---|---|---|
| Informações pessoais: Nome | Sim | Não | Obrigatório | Funcionalidade do app, gestão de conta |
| Informações pessoais: Endereço de e-mail | Sim | Não | Obrigatório | Funcionalidade, gestão de conta, comunicações |
| Informações pessoais: ID do usuário | Sim | Não | Obrigatório | Funcionalidade, gestão de conta |
| Informações pessoais: Número de telefone | Sim (só profissional) | Não | Opcional | Funcionalidade |
| Informações pessoais: demais (endereço, raça, orientação...) | Não | Não | | |
| Informações de saúde e condicionamento: Informações de saúde | Sim | Não | Opcional (o usuário escolhe o que registra) | Funcionalidade (humor, sono, água, anamnese, check-in, respiração) |
| Informações de saúde e condicionamento: Informações de condicionamento físico | Sim | Não | Opcional | Funcionalidade (treinos, séries, cargas) |
| Fotos e vídeos: Fotos | Sim | Não | Opcional | Funcionalidade (foto da refeição) |
| Mensagens: Outras mensagens no app | Sim | Não | Opcional | Funcionalidade (chat com profissional, chat da turma) |
| Mensagens: e-mails, SMS | Não | | | |
| Atividade no app: Outro conteúdo gerado pelo usuário | Sim | Não | Opcional | Funcionalidade (observações, pedidos de troca, notas do profissional) |
| IDs de dispositivo ou outros: ID do dispositivo | Sim, quando o push entrar (token FCM) | Não | Obrigatório p/ receber push | Funcionalidade |
| Informações financeiras | Não coletado pelo app | | | Pagamento do profissional ocorre no Asaas, fora do app Android também |
| Localização | Não | | | |
| Contatos | Não | | | |
| Calendário | Não | | | |
| Arquivos e documentos | Não | | | |
| Áudio | Não | | | |
| Histórico de navegação / Pesquisa | Não | | | |
| Informações do app e desempenho (falhas, diagnósticos) | Não hoje (sem SDK). Logs de servidor com IP: decisão aberta, ver app-store-privacy.md | | | |

## Pontos de atenção

- **Dados de saúde:** o formulário e a política ficam sujeitos à política de Dados Sensíveis do usuário. Ver `play-health-declaration.md`.
- **Exclusão:** Play exige que a exclusão no app e na web apague os dados (com exceções legais descritas na política).
- Se o usuário tem a opção de excluir só parte dos dados (ex.: fotos), declarar na seção de exclusão; hoje a exclusão é da conta inteira.
- Rever tudo quando entrar analytics, crash ou anúncios.
