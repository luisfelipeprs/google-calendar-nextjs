# Agendamento de Reuniões com Google Calendar

Este é um projeto Next.js para agendamento de reuniões integrado ao Google Calendar. Os usuários podem agendar reuniões informando seu nome, e-mail e escolhendo horários disponíveis diretamente no Google Calendar.

## Getting Started

Primeiro, clone o repositório para sua máquina local:

```bash
git clone https://github.com/luisfelipeprs/google-calendar-nextjs.git
cd google-calendar-nextjs
```

Instale as dependências:

```bash
npm install
```

### Configuração do Ambiente

Antes de rodar a aplicação, você precisa configurar algumas variáveis de ambiente. Crie um arquivo `.env.local` na raiz do seu projeto e adicione as seguintes variáveis:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
```

### Configuração do Google Cloud Console

Para usar a API do Google Calendar, você precisa configurar um projeto no [Google Cloud Console](https://console.cloud.google.com/). Siga o tutorial para configurar a API do Google Calendar e gerar suas credenciais (client ID, client secret e refresh token).

- **Documentação oficial do Google Cloud Console**: [Google Calendar API Documentation](https://developers.google.com/calendar)
- **Vídeo tutorial**: [Como configurar a conta do Google Cloud Console no contexto do projeto](https://www.youtube.com/watch?v=c2b2yUNWFzI)

### Rodando a Aplicação

Para rodar o servidor de desenvolvimento, execute um dos seguintes comandos:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra o navegador e acesse [http://localhost:3000](http://localhost:3000) para ver o resultado.
