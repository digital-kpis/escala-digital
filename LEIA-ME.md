# Controle de Presença — App instalável com dados compartilhados

App instalável no Android (PWA) com sincronização em tempo real entre aparelhos,
usando o Supabase como banco de dados gratuito na nuvem.

---

## Passo 1 — Criar o banco de dados (Supabase, gratuito)

1. Acesse https://supabase.com e crie uma conta gratuita
2. Clique em "New project", escolha um nome e uma senha forte
3. Aguarde o projeto inicializar (~1 min)
4. No menu lateral, clique em **SQL Editor**
5. Cole e execute o seguinte SQL:

```sql
create table colaboradores (
  id text primary key,
  matricula text,
  nome text not null,
  funcao text,
  turno text,
  created_at timestamptz default now()
);

create table presencas (
  colab_id text references colaboradores(id) on delete cascade,
  data date not null,
  status text not null,
  primary key (colab_id, data)
);

create table tipos_status (
  id text primary key,
  label text not null,
  short text not null,
  color text not null,
  bg text not null,
  fixo boolean default false,
  ordem int default 0
);

alter table colaboradores enable row level security;
alter table presencas enable row level security;
alter table tipos_status enable row level security;

create policy "acesso total" on colaboradores for all using (true) with check (true);
create policy "acesso total" on presencas for all using (true) with check (true);
create policy "acesso total" on tipos_status for all using (true) with check (true);
```

6. Em **Settings → API**, copie:
   - **Project URL** (ex.: `https://xyzxyzxyz.supabase.co`)
   - **Chave anon/public** (começa com `eyJhbG...`)

---

## Passo 2 — Hospedar os arquivos

Esta pasta inteira precisa estar em um servidor com HTTPS.

**Netlify Drop** (mais rápido, sem conta necessária):
1. Acesse https://app.netlify.com/drop
2. Arraste esta pasta completa para a página
3. Em segundos você recebe um link `https://nome-aleatorio.netlify.app`

Outras opções gratuitas: Vercel, GitHub Pages, Cloudflare Pages.

---

## Passo 3 — Instalar no Android

1. Abra o link no **Chrome** do Android
2. Na primeira abertura, o app vai pedir a URL e a chave do Supabase
   → Cole as credenciais copiadas no Passo 1, clique em "Conectar"
3. O app vai carregar com os 30 colaboradores da planilha já cadastrados
4. Para instalar: toque nos três pontinhos (⋮) → "Instalar app" ou
   "Adicionar à tela inicial"

O ícone aparecerá na tela inicial. Todos os aparelhos que usarem o mesmo
link compartilharão os mesmos dados em tempo real.

---

## Sobre sincronização

- Mudanças em um aparelho aparecem nos outros em menos de 1 segundo
- O indicador verde/vermelho no canto superior direito mostra o status da conexão
- Com conexão, tudo é salvo automaticamente no banco
- Sem conexão, as mudanças são perdidas (o app indica isso com o ícone vermelho)

---

## Estrutura dos arquivos

```
index.html      → página principal
app.jsx         → código do aplicativo
manifest.json   → configuração de instalação
sw.js           → service worker (recursos offline)
icons/          → ícones do app
LEIA-ME.md      → este arquivo
```
