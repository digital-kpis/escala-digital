const { useState, useEffect, useMemo, useCallback, useRef } = React;
const h = React.createElement;

// ====== ÍCONES ======
function Icon({ children, size = 16, strokeWidth = 2, color = "currentColor", style }) {
  return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style }, children);
}
const Plus        = (p) => h(Icon, p, h("path", { d: "M12 5v14M5 12h14" }));
const X           = (p) => h(Icon, p, h("path", { d: "M18 6 6 18M6 6l12 12" }));
const Check       = (p) => h(Icon, p, h("path", { d: "M20 6 9 17l-5-5" }));
const Clock       = (p) => h(Icon, p, h("circle", { cx: 12, cy: 12, r: 10 }), h("path", { d: "M12 6v6l4 2" }));
const Users       = (p) => h(Icon, p, h("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }), h("circle", { cx: 9, cy: 7, r: 4 }), h("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }), h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }));
const ChevronLeft = (p) => h(Icon, p, h("path", { d: "m15 18-6-6 6-6" }));
const ChevronRight= (p) => h(Icon, p, h("path", { d: "m9 18 6-6-6-6" }));
const Trash2      = (p) => h(Icon, p, h("path", { d: "M3 6h18" }), h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }), h("path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }));
const UserPlus    = (p) => h(Icon, p, h("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }), h("circle", { cx: 9, cy: 7, r: 4 }), h("line", { x1: 19, y1: 8, x2: 19, y2: 14 }), h("line", { x1: 22, y1: 11, x2: 16, y2: 11 }));
const CalendarDays= (p) => h(Icon, p, h("rect", { x: 3, y: 4, width: 18, height: 18, rx: 2 }), h("path", { d: "M16 2v4M8 2v4M3 10h18" }));
const Settings    = (p) => h(Icon, p, h("circle", { cx: 12, cy: 12, r: 3 }), h("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" }));
const Pencil      = (p) => h(Icon, p, h("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }));
const Wifi        = (p) => h(Icon, p, h("path", { d: "M5 12.55a11 11 0 0 1 14.08 0" }), h("path", { d: "M1.42 9a16 16 0 0 1 21.16 0" }), h("path", { d: "M8.53 16.11a6 6 0 0 1 6.95 0" }), h("circle", { cx: 12, cy: 20, r: 1, fill: "currentColor" }));
const WifiOff     = (p) => h(Icon, p, h("line", { x1: 1, y1: 1, x2: 23, y2: 23 }), h("path", { d: "M16.72 11.06A10.94 10.94 0 0 1 19 12.55" }), h("path", { d: "M5 12.55a10.94 10.94 0 0 1 5.17-2.39" }), h("path", { d: "M10.71 5.05A16 16 0 0 1 22.56 9" }), h("path", { d: "M1.42 9a15.91 15.91 0 0 1 4.7-2.88" }), h("path", { d: "M8.53 16.11a6 6 0 0 1 6.95 0" }), h("circle", { cx: 12, cy: 20, r: 1, fill: "currentColor" }));

// ====== CONSTANTES ======
const TURNOS = [
  { id: "manha",         label: "Manhã",         horario: "07:00 – 15:20", cor: "#D97757" },
  { id: "intermediario", label: "Intermediário",  horario: "10:00 – 18:20", cor: "#B08968" },
  { id: "tarde",         label: "Tarde",          horario: "14:00 – 22:20", cor: "#5B8A72" },
  { id: "noite",         label: "Madrugada",      horario: "22:00 – 05:20", cor: "#4A5C7A" },
];
const VISAO_TODOS = { id: "todos", label: "Todos", horario: "Todos os turnos", cor: "#2B2620" };

const STATUS_SEED = [
  { id: "presente",  label: "Presente",   short: "P",  color: "#5B8A72", bg: "#E8F0EA", fixo: true },
  { id: "falta",     label: "Falta",      short: "F",  color: "#C1503E", bg: "#F7E8E5" },
  { id: "folga",     label: "Folga (DSR)",short: "D",  color: "#8A8478", bg: "#EFEDE8" },
  { id: "ferias",    label: "Férias",     short: "FF", color: "#B08968", bg: "#F3EAE0" },
  { id: "atestado",  label: "Atestado",   short: "AT", color: "#7A6B8A", bg: "#ECE8F0" },
];
const STATUS_VAZIO = { id: "vazio", label: "Não marcado", short: "", color: "#C9C3B8", bg: "#FFFFFF" };

const PALETA_CORES = [
  "#C1503E","#D97757","#B08968","#A8954D","#5B8A72",
  "#4A8A8C","#4A5C7A","#5C5CA8","#7A6B8A","#A85C8C",
  "#8A8478","#6B6458",
];
const FUNCOES = ["Op. Loja", "Pleno", "Pleno PREV.", "Líder", "Estoque", "Caixa"];
const WEEKDAY_LABELS = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"];

// ====== HELPERS DE DATA ======
function pad2(n) { return String(n).padStart(2, "0"); }
function isoDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function startOfWeek(date) {
  const d = new Date(date); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d;
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate()+n); return d; }
function getWeekDays(anchor) { const s = startOfWeek(anchor); return Array.from({length:7},(_,i)=>addDays(s,i)); }
function formatRangeLabel(days) {
  const [first, last] = [days[0], days[6]];
  const fmt = (d, wm) => `${pad2(d.getDate())}${wm?`/${pad2(d.getMonth()+1)}`:""}`;
  return first.getMonth()===last.getMonth() ? `${fmt(first,false)} – ${fmt(last,true)}` : `${fmt(first,true)} – ${fmt(last,true)}`;
}

// ====== SUPABASE CLIENT ======
// As credenciais são carregadas de window.SUPABASE_URL e window.SUPABASE_KEY
// definidos no index.html antes do carregamento deste arquivo.

function getSupabase() {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_KEY;
  if (!url || !key || url.includes("SEU_PROJETO")) return null;
  return window.supabase.createClient(url, key);
}

// ====== SEED DE COLABORADORES ======
const SEED_COLABORADORES = [
  { id: "c1",  matricula: "7153570", nome: "Anna Caroline",          funcao: "Op. Loja",    turno: "manha" },
  { id: "c2",  matricula: "5624576", nome: "Cláudia Regina",         funcao: "Op. Loja",    turno: "manha" },
  { id: "c3",  matricula: "6427510", nome: "Danillo de Souza",       funcao: "Op. Loja",    turno: "manha" },
  { id: "c4",  matricula: "8005225", nome: "Francicleide dos Santos", funcao: "Op. Loja",   turno: "manha" },
  { id: "c5",  matricula: "5885264", nome: "Joselito Dias Sobreira", funcao: "Op. Loja",    turno: "manha" },
  { id: "c6",  matricula: "5646375", nome: "Lizandra Araujo",        funcao: "Op. Loja",    turno: "manha" },
  { id: "c7",  matricula: "6528910", nome: "Matheus Carlos",         funcao: "Op. Loja",    turno: "manha" },
  { id: "c8",  matricula: "7026595", nome: "Maria Eduarda",          funcao: "Op. Loja",    turno: "manha" },
  { id: "c9",  matricula: "6899153", nome: "Nataniel Sousa",         funcao: "Op. Loja",    turno: "manha" },
  { id: "c10", matricula: "6755461", nome: "Simone do Carmo",        funcao: "Op. Loja",    turno: "manha" },
  { id: "c11", matricula: "7026013", nome: "Victoria Aquino",        funcao: "Op. Loja",    turno: "manha" },
  { id: "c12", matricula: "6465951", nome: "Alfredo Nascimento",     funcao: "Op. Loja",    turno: "intermediario" },
  { id: "c13", matricula: "5361060", nome: "Gabriel Martins",        funcao: "Op. Loja",    turno: "intermediario" },
  { id: "c14", matricula: "4275195", nome: "Gleyce Kelly",           funcao: "Op. Loja",    turno: "intermediario" },
  { id: "c15", matricula: "5568978", nome: "Felipe Mota",            funcao: "Pleno",       turno: "tarde" },
  { id: "c16", matricula: "7237790", nome: "Flavio Ferreira",        funcao: "Pleno PREV.", turno: "tarde" },
  { id: "c17", matricula: "6926177", nome: "Alohan da Costa",        funcao: "Op. Loja",    turno: "tarde" },
  { id: "c18", matricula: "7237316", nome: "Daniele Teixeira",       funcao: "Op. Loja",    turno: "tarde" },
  { id: "c19", matricula: "7216165", nome: "Deivison Vieira",        funcao: "Op. Loja",    turno: "tarde" },
  { id: "c20", matricula: "7237308", nome: "Fernanda Pereira",       funcao: "Op. Loja",    turno: "tarde" },
  { id: "c21", matricula: "7029578", nome: "Jonas Felipe",           funcao: "Op. Loja",    turno: "tarde" },
  { id: "c22", matricula: "7160542", nome: "Kamili Conceição",       funcao: "Op. Loja",    turno: "tarde" },
  { id: "c23", matricula: "7115261", nome: "Leonard Gerard",         funcao: "Op. Loja",    turno: "tarde" },
  { id: "c24", matricula: "7029322", nome: "Marcelo da Silva",       funcao: "Op. Loja",    turno: "tarde" },
  { id: "c25", matricula: "7014252", nome: "Suelen da Silva",        funcao: "Op. Loja",    turno: "tarde" },
  { id: "c26", matricula: "7122659", nome: "Talia Mesquita",         funcao: "Op. Loja",    turno: "tarde" },
  { id: "c27", matricula: "7164289", nome: "Taissa Ferreira",        funcao: "Op. Loja",    turno: "tarde" },
  { id: "c28", matricula: "7231784", nome: "Andrey da Costa",        funcao: "Op. Loja",    turno: "noite" },
  { id: "c29", matricula: "6259731", nome: "Guilherme Veras",        funcao: "Op. Loja",    turno: "noite" },
  { id: "c30", matricula: "6739733", nome: "Lohan Rodrigues",        funcao: "Op. Loja",    turno: "noite" },
];

// ====== TELA DE CONFIGURAÇÃO (quando as credenciais ainda não foram definidas) ======
function TelaConfig() {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const salvar = async () => {
    if (!url.trim().startsWith("https://")) { setErro("URL inválida — deve começar com https://"); return; }
    if (key.trim().length < 20) { setErro("Chave anon inválida — verifique o valor copiado"); return; }
    setSalvando(true);
    setErro("");
    // Testa a conexão antes de salvar
    try {
      const sb = window.supabase.createClient(url.trim(), key.trim());
      const { error } = await sb.from("colaboradores").select("id").limit(1);
      if (error && error.code !== "PGRST116") throw error;
      localStorage.setItem("sb_url", url.trim());
      localStorage.setItem("sb_key", key.trim());
      window.location.reload();
    } catch (e) {
      setErro("Não foi possível conectar. Verifique as credenciais e se as tabelas foram criadas.");
      setSalvando(false);
    }
  };

  return h("div", { style: S.configScreen },
    h("div", { style: S.configCard },
      h("div", { style: S.brandMark }, h(Clock, { size: 22, color: "#FAF8F4", strokeWidth: 2.2 })),
      h("h1", { style: S.configTitle }, "Configurar banco de dados"),
      h("p", { style: S.configSub },
        "Para sincronizar os dados entre aparelhos, o app usa o ",
        h("strong", null, "Supabase"), " — gratuito, sem cartão de crédito."
      ),

      h("div", { style: S.configStep },
        h("span", { style: S.configStepNum }, "1"),
        h("div", null,
          h("p", { style: S.configStepTitle }, "Crie o projeto"),
          h("p", { style: S.configStepText },
            "Acesse ", h("a", { href: "https://supabase.com", target: "_blank", style: S.link }, "supabase.com"),
            ", crie uma conta gratuita e clique em 'New project'. Anote a senha do banco."
          )
        )
      ),

      h("div", { style: S.configStep },
        h("span", { style: S.configStepNum }, "2"),
        h("div", null,
          h("p", { style: S.configStepTitle }, "Crie as tabelas"),
          h("p", { style: S.configStepText }, "No painel do projeto, vá em SQL Editor e rode:"),
          h("pre", { style: S.configCode },
`create table colaboradores (
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
create policy "acesso total" on tipos_status for all using (true) with check (true);`
          )
        )
      ),

      h("div", { style: S.configStep },
        h("span", { style: S.configStepNum }, "3"),
        h("div", { style: { flex: 1 } },
          h("p", { style: S.configStepTitle }, "Cole as credenciais"),
          h("p", { style: S.configStepText }, "Em Settings → API, copie a Project URL e a chave anon/public:"),
          h("div", { style: S.formGroup },
            h("label", { style: S.label }, "Project URL"),
            h("input", {
              style: S.input, value: url, placeholder: "https://xxxxxxxxxxxx.supabase.co",
              onChange: (e) => setUrl(e.target.value)
            })
          ),
          h("div", { style: S.formGroup },
            h("label", { style: S.label }, "Chave anon/public"),
            h("input", {
              style: S.input, value: key, placeholder: "eyJhbGciOiJIUzI1NiIs...",
              onChange: (e) => setKey(e.target.value)
            })
          )
        )
      ),

      erro && h("p", { style: S.errorText }, erro),

      h("button", { style: { ...S.btnPrimary, width: "100%", marginTop: 4 }, onClick: salvar, disabled: salvando },
        salvando ? "Conectando…" : "Conectar e entrar no app"
      )
    )
  );
}

// ====== COMPONENTE PRINCIPAL ======
function ControlePresenca() {
  const sbRef = useRef(null);
  const [pronto, setPronto] = useState(false);          // supabase conectado e dados carregados
  const [online, setOnline] = useState(navigator.onLine);
  const [colaboradores, setColaboradores] = useState([]);
  const [presencas, setPresencas] = useState({});       // { "colabId:isoDate": status }
  const [tiposStatus, setTiposStatus] = useState([]);
  const [turnoAtivo, setTurnoAtivo] = useState("manha");
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [showCadastro, setShowCadastro] = useState(false);
  const [editingColab, setEditingColab] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showTipos, setShowTipos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg); setTimeout(() => setToast(null), 2200);
  }, []);

  // Monitorar conexão
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // ---- CARGA INICIAL + REALTIME ----
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sbRef.current = sb;

    async function carregar() {
      // 1. Colaboradores
      const { data: colabs } = await sb.from("colaboradores").select("*").order("nome");
      if (colabs && colabs.length === 0) {
        // Primeira vez: semear dados da planilha
        await sb.from("colaboradores").insert(SEED_COLABORADORES);
        setColaboradores(SEED_COLABORADORES);
      } else {
        setColaboradores(colabs || []);
      }

      // 2. Tipos de status
      const { data: tipos } = await sb.from("tipos_status").select("*").order("ordem");
      if (tipos && tipos.length === 0) {
        const tiposComOrdem = STATUS_SEED.map((t,i) => ({ ...t, ordem: i }));
        await sb.from("tipos_status").insert(tiposComOrdem);
        setTiposStatus(STATUS_SEED);
      } else {
        setTiposStatus(tipos || STATUS_SEED);
      }

      // 3. Presenças da semana atual ± 4 semanas (janela de 9 semanas)
      const hoje = new Date();
      const inicio = isoDate(addDays(startOfWeek(hoje), -28));
      const fim    = isoDate(addDays(startOfWeek(hoje),  35));
      const { data: presRows } = await sb.from("presencas").select("*").gte("data", inicio).lte("data", fim);
      const map = {};
      (presRows || []).forEach(r => { map[`${r.colab_id}:${r.data}`] = r.status; });
      setPresencas(map);

      setPronto(true);
    }

    carregar();

    // ---- Realtime: recebe mudanças de outros aparelhos em tempo real ----
    const chanColabs = sb.channel("colabs-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "colaboradores" }, async () => {
        const { data } = await sb.from("colaboradores").select("*").order("nome");
        if (data) setColaboradores(data);
      })
      .subscribe();

    const chanPresencas = sb.channel("presencas-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "presencas" }, (payload) => {
        const { eventType, new: row, old } = payload;
        setPresencas(prev => {
          const next = { ...prev };
          if (eventType === "DELETE") {
            delete next[`${old.colab_id}:${old.data}`];
          } else {
            next[`${row.colab_id}:${row.data}`] = row.status;
          }
          return next;
        });
      })
      .subscribe();

    const chanTipos = sb.channel("tipos-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "tipos_status" }, async () => {
        const { data } = await sb.from("tipos_status").select("*").order("ordem");
        if (data) setTiposStatus(data);
      })
      .subscribe();

    return () => {
      sb.removeChannel(chanColabs);
      sb.removeChannel(chanPresencas);
      sb.removeChannel(chanTipos);
    };
  }, []);

  const sb = () => sbRef.current;

  // ---- AÇÕES ----
  const cycleStatus = useCallback(async (colabId, dateIso) => {
    const key = `${colabId}:${dateIso}`;
    const current = presencas[key] || "vazio";
    const orderIds = ["vazio", ...tiposStatus.map(t => t.id)];
    const idx = orderIds.indexOf(current);
    const nextStatus = orderIds[(idx + 1) % orderIds.length];

    // Atualização otimista (imediata na UI)
    setPresencas(prev => {
      const next = { ...prev };
      if (nextStatus === "vazio") delete next[key]; else next[key] = nextStatus;
      return next;
    });

    // Persiste no banco
    if (nextStatus === "vazio") {
      await sb().from("presencas").delete().eq("colab_id", colabId).eq("data", dateIso);
    } else {
      await sb().from("presencas").upsert({ colab_id: colabId, data: dateIso, status: nextStatus });
    }
  }, [presencas, tiposStatus]);

  const handleSaveColab = useCallback(async (colab) => {
    setSaving(true);
    if (colab.id && colaboradores.some(c => c.id === colab.id)) {
      const { nome, matricula, funcao, turno } = colab;
      await sb().from("colaboradores").update({ nome, matricula, funcao, turno }).eq("id", colab.id);
      setColaboradores(prev => prev.map(c => c.id === colab.id ? { ...c, ...colab } : c));
      showToast("Colaborador atualizado");
    } else {
      const newColab = { ...colab, id: `c${Date.now()}` };
      await sb().from("colaboradores").insert(newColab);
      setColaboradores(prev => [...prev, newColab].sort((a,b) => a.nome.localeCompare(b.nome,"pt-BR")));
      showToast("Colaborador cadastrado");
    }
    setSaving(false);
    setShowCadastro(false);
    setEditingColab(null);
  }, [colaboradores, showToast]);

  const handleDeleteColab = useCallback(async (id) => {
    setSaving(true);
    await sb().from("colaboradores").delete().eq("id", id);
    setColaboradores(prev => prev.filter(c => c.id !== id));
    setPresencas(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (k.startsWith(`${id}:`)) delete next[k]; });
      return next;
    });
    setSaving(false);
    setConfirmDelete(null);
    showToast("Colaborador removido");
  }, [showToast]);

  const handleSaveTipo = useCallback(async (tipo) => {
    setSaving(true);
    const isEdit = tipo.id && tiposStatus.some(t => t.id === tipo.id);
    if (isEdit) {
      await sb().from("tipos_status").update(tipo).eq("id", tipo.id);
      setTiposStatus(prev => prev.map(t => t.id === tipo.id ? { ...t, ...tipo } : t));
      showToast("Tipo atualizado");
    } else {
      const newTipo = { ...tipo, id: `t${Date.now()}`, ordem: tiposStatus.length };
      await sb().from("tipos_status").insert(newTipo);
      setTiposStatus(prev => [...prev, newTipo]);
      showToast("Tipo de folga cadastrado");
    }
    setSaving(false);
  }, [tiposStatus, showToast]);

  const handleDeleteTipo = useCallback(async (id) => {
    setSaving(true);
    await sb().from("tipos_status").delete().eq("id", id);
    setTiposStatus(prev => prev.filter(t => t.id !== id));
    // Limpar presenças que usavam esse tipo
    const keysToDelete = Object.keys(presencas).filter(k => presencas[k] === id);
    for (const key of keysToDelete) {
      const [colab_id, data] = key.split(":");
      await sb().from("presencas").delete().eq("colab_id", colab_id).eq("data", data);
    }
    setPresencas(prev => {
      const next = { ...prev };
      keysToDelete.forEach(k => delete next[k]);
      return next;
    });
    setSaving(false);
    showToast("Tipo removido");
  }, [presencas, showToast]);

  const getStatusInfo = useCallback((id) => {
    if (!id || id === "vazio") return STATUS_VAZIO;
    return tiposStatus.find(t => t.id === id) || STATUS_VAZIO;
  }, [tiposStatus]);

  // ---- DADOS DERIVADOS ----
  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate]);

  const colaboradoresDoTurno = useMemo(() =>
    colaboradores.filter(c => c.turno === turnoAtivo).sort((a,b) => a.nome.localeCompare(b.nome,"pt-BR")),
    [colaboradores, turnoAtivo]
  );

  const gruposPorTurno = useMemo(() =>
    TURNOS.map(t => ({
      turno: t,
      items: colaboradores.filter(c => c.turno === t.id).sort((a,b) => a.nome.localeCompare(b.nome,"pt-BR"))
    })).filter(g => g.items.length > 0),
    [colaboradores]
  );

  const isVisaoTodos = turnoAtivo === "todos";

  // ---- LOADING ----
  if (!pronto) {
    return h("div", { style: S.loadingScreen },
      h("div", { style: S.loadingDot }),
      h("p", { style: { color: "#9C9586", fontSize: 13, marginTop: 14 } }, "Conectando ao banco de dados…")
    );
  }

  const turnoInfo = isVisaoTodos ? VISAO_TODOS : TURNOS.find(t => t.id === turnoAtivo);

  // ---- RENDER ----
  return h("div", { style: S.app },

    // Header
    h("header", { style: S.header },
      h("div", { style: S.headerTop },
        h("div", { style: S.brandRow },
          h("div", { style: S.brandMark }, h(Clock, { size: 18, color: "#FAF8F4", strokeWidth: 2.2 })),
          h("div", null,
            h("h1", { style: S.brandTitle }, "Controle de Presença"),
            h("p",  { style: S.brandSub  }, `${colaboradores.length} colaborador${colaboradores.length!==1?"es":""} cadastrado${colaboradores.length!==1?"s":""}`)
          )
        ),
        h("div", { style: { display:"flex", alignItems:"center", gap:8 } },
          // Indicador online/offline
          h("div", { style: { ...S.onlineDot, background: online ? "#5B8A72" : "#C1503E" }, title: online ? "Online — sincronizado" : "Offline — mudanças serão salvas ao reconectar" },
            online ? h(Wifi, { size: 12, color: "#fff" }) : h(WifiOff, { size: 12, color: "#fff" })
          ),
          h("button", { style: S.addBtn, onClick: () => { setEditingColab(null); setShowCadastro(true); } },
            h(UserPlus, { size: 16, strokeWidth: 2.2 }), h("span", null, "Cadastrar")
          )
        )
      ),

      // Abas
      h("div", { style: S.tabsRow },
        h("button", {
          onClick: () => setTurnoAtivo("todos"),
          style: { ...S.tab, ...(isVisaoTodos ? { ...S.tabActive, borderColor: VISAO_TODOS.cor } : {}) }
        },
          h(Users, { size: 12, color: isVisaoTodos ? VISAO_TODOS.cor : "#9C9586", strokeWidth: 2.4 }),
          h("span", { style: { fontWeight: isVisaoTodos?700:500, color: isVisaoTodos?"#2B2620":"#6B6458" } }, "Todos"),
          h("span", { style: S.tabCount }, colaboradores.length)
        ),
        h("span", { style: S.tabDivider }),
        ...TURNOS.map(t => {
          const count = colaboradores.filter(c => c.turno === t.id).length;
          const active = !isVisaoTodos && t.id === turnoAtivo;
          return h("button", { key: t.id, onClick: () => setTurnoAtivo(t.id),
            style: { ...S.tab, ...(active ? { ...S.tabActive, borderColor: t.cor } : {}) }
          },
            h("span", { style: { ...S.tabDot, background: active ? t.cor : "#D8D2C5" } }),
            h("span", { style: { fontWeight: active?700:500, color: active?"#2B2620":"#6B6458" } }, t.label),
            h("span", { style: S.tabCount }, count)
          );
        })
      )
    ),

    // Sub-barra
    h("div", { style: S.subbar },
      h("div", { style: S.turnoChip },
        h("span", { style: { ...S.turnoChipDot, background: turnoInfo.cor } }),
        h(CalendarDays, { size: 14, color: "#8A8478" }),
        h("span", { style: S.turnoChipText },
          isVisaoTodos ? `${gruposPorTurno.length} turnos · ${colaboradores.length} pessoas` : turnoInfo.horario
        )
      ),
      h("div", { style: S.weekNav },
        h("button", { style: S.weekNavBtn, onClick: () => setAnchorDate(d => addDays(d,-7)) }, h(ChevronLeft, { size:16 })),
        h("span", { style: S.weekLabel }, formatRangeLabel(weekDays)),
        h("button", { style: S.weekNavBtn, onClick: () => setAnchorDate(d => addDays(d,7)) }, h(ChevronRight, { size:16 })),
        h("button", { style: S.weekTodayBtn, onClick: () => setAnchorDate(new Date()) }, "Hoje")
      )
    ),

    // Legenda + gerenciar tipos
    h("div", { style: S.legend },
      ...tiposStatus.map(s =>
        h("div", { key: s.id, style: S.legendItem },
          h("span", { style: { ...S.legendSwatch, background: s.bg, borderColor: s.color } },
            h("span", { style: { color: s.color, fontSize: 10, fontWeight: 800 } }, s.short)
          ),
          h("span", { style: S.legendText }, s.label)
        )
      ),
      h("button", { style: S.legendManageBtn, onClick: () => setShowTipos(true) },
        h(Settings, { size: 12, strokeWidth: 2.4 }), h("span", null, "Gerenciar tipos")
      ),
      h("span", { style: S.legendHint }, "Toque numa célula para alternar")
    ),

    // Tabela
    h("main", { style: S.tableWrap },
      (isVisaoTodos ? colaboradores.length === 0 : colaboradoresDoTurno.length === 0) ?
        h("div", { style: S.emptyState },
          h(Users, { size: 28, color: "#C9C3B8" }),
          h("p", { style: S.emptyTitle }, isVisaoTodos ? "Nenhum colaborador cadastrado" : "Nenhum colaborador neste turno"),
          h("button", { style: { ...S.addBtn, marginTop: 14 },
            onClick: () => { setEditingColab({ turno: isVisaoTodos ? "manha" : turnoAtivo }); setShowCadastro(true); }
          }, h(Plus, { size: 16 }), h("span", null, "Cadastrar colaborador"))
        ) :
        h("div", { style: S.scrollArea },
          h("table", { style: S.table },
            h("thead", null,
              h("tr", null,
                h("th", { style: S.thName }, "Colaborador"),
                ...weekDays.map(d => {
                  const isToday = isoDate(d) === isoDate(new Date());
                  const isSun   = d.getDay() === 0;
                  return h("th", { key: d.toISOString(), style: { ...S.thDay, ...(isToday?S.thDayToday:{}), ...(isSun&&!isToday?S.thDaySunday:{}) } },
                    h("div", { style: { fontSize:10, fontWeight:700, letterSpacing:"0.04em" } }, WEEKDAY_LABELS[d.getDay()]),
                    h("div", { style: { fontSize:13, fontWeight:800, marginTop:2 } }, `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}`)
                  );
                })
              )
            ),
            isVisaoTodos ?
              gruposPorTurno.map(grupo =>
                h("tbody", { key: grupo.turno.id },
                  h("tr", null,
                    h("td", { colSpan: 8, style: { ...S.groupHeaderCell, borderLeftColor: grupo.turno.cor } },
                      h("span", { style: { ...S.groupHeaderDot, background: grupo.turno.cor } }),
                      h("span", { style: S.groupHeaderText }, grupo.turno.label),
                      h("span", { style: S.groupHeaderHorario }, grupo.turno.horario),
                      h("span", { style: S.groupHeaderCount }, `${grupo.items.length} pessoa${grupo.items.length!==1?"s":""}`)
                    )
                  ),
                  ...grupo.items.map((colab, i) => rowColaborador(colab, i, weekDays, presencas, cycleStatus,
                    () => { setEditingColab(colab); setShowCadastro(true); },
                    () => setConfirmDelete(colab),
                    getStatusInfo
                  ))
                )
              ) :
              h("tbody", null,
                ...colaboradoresDoTurno.map((colab, i) => rowColaborador(colab, i, weekDays, presencas, cycleStatus,
                  () => { setEditingColab(colab); setShowCadastro(true); },
                  () => setConfirmDelete(colab),
                  getStatusInfo
                ))
              )
          )
        )
    ),

    // Modais
    showCadastro && h(CadastroModal, {
      initial: editingColab,
      onClose: () => { setShowCadastro(false); setEditingColab(null); },
      onSave: handleSaveColab
    }),
    showTipos && h(TiposModal, {
      tipos: tiposStatus, onClose: () => setShowTipos(false),
      onSave: handleSaveTipo, onDelete: handleDeleteTipo
    }),
    confirmDelete && h("div", { style: S.modalOverlay, onClick: () => setConfirmDelete(null) },
      h("div", { style: S.confirmCard, onClick: e => e.stopPropagation() },
        h("p", { style: S.confirmTitle }, "Remover colaborador?"),
        h("p", { style: S.confirmText }, `${confirmDelete.nome} será removido junto com todo o histórico de presença.`),
        h("div", { style: S.confirmActions },
          h("button", { style: S.btnGhost, onClick: () => setConfirmDelete(null) }, "Cancelar"),
          h("button", { style: S.btnDanger, onClick: () => handleDeleteColab(confirmDelete.id) }, "Remover")
        )
      )
    ),
    toast && h("div", { style: S.toast }, toast),
    saving && h("div", { style: S.savingDot })
  );
}

// ====== LINHA DA TABELA ======
function rowColaborador(colab, index, weekDays, presencas, onCycle, onEdit, onDelete, getStatusInfo) {
  return h("tr", { key: colab.id, style: index%2===1 ? { background:"#FBFAF7" } : undefined },
    h("td", { style: S.tdName },
      h("div", { style: S.nameCell },
        h("div", null,
          h("div", { style: S.nameText }, colab.nome),
          h("div", { style: S.nameMeta }, `${colab.matricula} · ${colab.funcao}`)
        ),
        h("div", { style: S.nameActions },
          h("button", { style: S.iconBtn, title:"Editar", onClick: onEdit }, h(Pencil, { size:13 })),
          h("button", { style: { ...S.iconBtn, color:"#C1503E" }, title:"Remover", onClick: onDelete }, h(Trash2, { size:13 }))
        )
      )
    ),
    ...weekDays.map(d => {
      const dateIso = isoDate(d);
      const key = `${colab.id}:${dateIso}`;
      const status = presencas[key] || "vazio";
      const s = getStatusInfo(status);
      const isToday = dateIso === isoDate(new Date());
      return h("td", { key, style: S.tdCell },
        h("button", {
          onClick: () => onCycle(colab.id, dateIso),
          style: { ...S.cellBtn, background: s.bg, borderColor: isToday?"#2B2620":status==="vazio"?"#E8E3D8":s.color, borderWidth: isToday?2:1, color: s.color }
        }, s.short)
      );
    })
  );
}

// ====== MODAL CADASTRO COLABORADOR ======
function CadastroModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial && initial.id);
  const [nome,      setNome]      = useState(initial?.nome      || "");
  const [matricula, setMatricula] = useState(initial?.matricula || "");
  const [funcao,    setFuncao]    = useState(initial?.funcao    || FUNCOES[0]);
  const [turno,     setTurno]     = useState(initial?.turno     || "manha");
  const [error,     setError]     = useState("");

  const submit = () => {
    if (!nome.trim())      { setError("Informe o nome."); return; }
    if (!matricula.trim()) { setError("Informe a matrícula."); return; }
    onSave({ id: initial?.id, nome: nome.trim(), matricula: matricula.trim(), funcao, turno });
  };

  return h("div", { style: S.modalOverlay, onClick: onClose },
    h("div", { style: S.modalCard, onClick: e => e.stopPropagation() },
      h("div", { style: S.modalHeader },
        h("h2", { style: S.modalTitle }, isEdit ? "Editar colaborador" : "Novo colaborador"),
        h("button", { style: S.modalClose, onClick: onClose }, h(X, { size: 18 }))
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Nome completo"),
        h("input", { style: S.input, value: nome, onChange: e => setNome(e.target.value), placeholder: "Ex.: Anna Caroline", autoFocus: true })
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Matrícula"),
        h("input", { style: S.input, value: matricula, onChange: e => setMatricula(e.target.value.replace(/[^0-9]/g,"")), placeholder: "Ex.: 7153570", inputMode: "numeric" })
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Função"),
        h("div", { style: S.chipRow },
          ...FUNCOES.map(f => h("button", { key: f, onClick: () => setFuncao(f), style: { ...S.chip, ...(funcao===f?S.chipActive:{}) } }, f))
        )
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Turno"),
        h("div", { style: S.chipRow },
          ...TURNOS.map(t => h("button", { key: t.id, onClick: () => setTurno(t.id),
            style: { ...S.chip, ...(turno===t.id ? { ...S.chipActive, borderColor: t.cor, background: t.cor } : {}) }
          }, t.label))
        ),
        h("p", { style: S.hintText }, TURNOS.find(t => t.id === turno)?.horario)
      ),
      error && h("p", { style: S.errorText }, error),
      h("div", { style: S.modalActions },
        h("button", { style: S.btnGhost,   onClick: onClose },  "Cancelar"),
        h("button", { style: S.btnPrimary, onClick: submit   }, h(Check, { size:15, strokeWidth:2.5 }), isEdit ? "Salvar" : "Cadastrar")
      )
    )
  );
}

// ====== MODAL TIPOS DE STATUS ======
function TiposModal({ tipos, onClose, onSave, onDelete }) {
  const [editing,    setEditing]    = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  if (editing !== null) {
    return h(TipoForm, { initial: editing.id ? editing : null, onClose: () => setEditing(null),
      onSave: (t) => { onSave(t); setEditing(null); }
    });
  }

  return h("div", { style: S.modalOverlay, onClick: onClose },
    h("div", { style: S.modalCard, onClick: e => e.stopPropagation() },
      h("div", { style: S.modalHeader },
        h("h2", { style: S.modalTitle }, "Tipos de folga e presença"),
        h("button", { style: S.modalClose, onClick: onClose }, h(X, { size: 18 }))
      ),
      h("p", { style: S.hintText }, "Status disponíveis ao tocar nas células da escala. 'Presente' é fixo no sistema."),
      h("div", { style: S.tiposList },
        ...tipos.map(t =>
          h("div", { key: t.id, style: S.tipoRow },
            h("span", { style: { ...S.tipoSwatch, background: t.bg, borderColor: t.color, color: t.color } }, t.short),
            h("span", { style: S.tipoNome }, t.label),
            t.fixo && h("span", { style: S.tipoFixoBadge }, "fixo"),
            h("div", { style: S.tipoActions },
              h("button", { style: S.iconBtn, onClick: () => setEditing(t) }, h(Pencil, { size: 13 })),
              !t.fixo && h("button", { style: { ...S.iconBtn, color:"#C1503E" }, onClick: () => setConfirmDel(t) }, h(Trash2, { size: 13 }))
            )
          )
        )
      ),
      h("button", { style: S.addTipoBtn, onClick: () => setEditing({}) },
        h(Plus, { size:15, strokeWidth:2.4 }), " Novo tipo de folga"
      ),
      h("div", { style: S.modalActions },
        h("button", { style: { ...S.btnPrimary, flex:1 }, onClick: onClose }, "Concluído")
      )
    ),
    confirmDel && h("div", { style: S.modalOverlay, onClick: e => e.stopPropagation() },
      h("div", { style: S.confirmCard, onClick: e => e.stopPropagation() },
        h("p", { style: S.confirmTitle }, `Remover "${confirmDel.label}"?`),
        h("p", { style: S.confirmText }, "As marcações com esse tipo voltarão a ficar em branco."),
        h("div", { style: S.confirmActions },
          h("button", { style: S.btnGhost, onClick: () => setConfirmDel(null) }, "Cancelar"),
          h("button", { style: S.btnDanger, onClick: () => { onDelete(confirmDel.id); setConfirmDel(null); } }, "Remover")
        )
      )
    )
  );
}

function TipoForm({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial && initial.id);
  const [label, setLabel]  = useState(initial?.label || "");
  const [short, setShort]  = useState(initial?.short || "");
  const [color, setColor]  = useState(initial?.color || PALETA_CORES[0]);
  const [error, setError]  = useState("");
  const bg = (hex) => `${hex}1A`;

  const submit = () => {
    if (!label.trim()) { setError("Dê um nome para o tipo."); return; }
    if (!short.trim()) { setError("Defina uma sigla (ex.: LM)."); return; }
    onSave({ id: initial?.id, label: label.trim(), short: short.trim().toUpperCase().slice(0,3), color, bg: bg(color) });
  };

  return h("div", { style: S.modalOverlay, onClick: onClose },
    h("div", { style: S.modalCard, onClick: e => e.stopPropagation() },
      h("div", { style: S.modalHeader },
        h("h2", { style: S.modalTitle }, isEdit ? "Editar tipo" : "Novo tipo de folga"),
        h("button", { style: S.modalClose, onClick: onClose }, h(X, { size: 18 }))
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Nome"),
        h("input", { style: S.input, value: label, onChange: e => setLabel(e.target.value), placeholder: "Ex.: Licença médica", autoFocus: true })
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Sigla na célula (até 3 letras)"),
        h("input", { style: { ...S.input, maxWidth:110, textTransform:"uppercase" }, value: short,
          onChange: e => setShort(e.target.value.slice(0,3)), placeholder: "Ex.: LM" })
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Cor"),
        h("div", { style: S.colorRow },
          ...PALETA_CORES.map(c => h("button", { key:c, onClick: () => setColor(c),
            style: { ...S.colorSwatch, background:c, ...(color===c?S.colorSwatchActive:{}) }
          }))
        )
      ),
      h("div", { style: S.formGroup },
        h("label", { style: S.label }, "Pré-visualização"),
        h("span", { style: { ...S.tipoSwatch, background:bg(color), borderColor:color, color, width:40, height:36, fontSize:13 } }, short||"—")
      ),
      error && h("p", { style: S.errorText }, error),
      h("div", { style: S.modalActions },
        h("button", { style: S.btnGhost,   onClick: onClose },  "Cancelar"),
        h("button", { style: S.btnPrimary, onClick: submit   }, h(Check, { size:15, strokeWidth:2.5 }), isEdit ? "Salvar" : "Cadastrar tipo")
      )
    )
  );
}

// ====== RAIZ: decide entre tela de config e app principal ======
function Root() {
  const url = localStorage.getItem("sb_url") || window.SUPABASE_URL;
  const key = localStorage.getItem("sb_key") || window.SUPABASE_KEY;
  const configured = url && key && !url.includes("SEU_PROJETO");

  if (!configured) return h(TelaConfig, null);
  // Injeta as credenciais no window para getSupabase() usar
  window.SUPABASE_URL = url;
  window.SUPABASE_KEY = key;
  return h(ControlePresenca, null);
}

// ====== ESTILOS ======
const FONT_DISPLAY = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
const S = {
  app:            { minHeight:"100vh", background:"#FAF8F4", color:"#2B2620", paddingBottom:56 },
  loadingScreen:  { minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#FAF8F4" },
  loadingDot:     { width:10, height:10, borderRadius:"50%", background:"#D97757", animation:"pulse 1.2s ease-in-out infinite" },
  configScreen:   { minHeight:"100vh", background:"#FAF8F4", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"16px 0 40px" },
  configCard:     { background:"#FFFFFF", borderRadius:16, padding:"24px 20px", maxWidth:520, width:"100%", margin:"0 12px", boxShadow:"0 2px 16px rgba(43,38,32,0.08)" },
  configTitle:    { fontFamily:FONT_DISPLAY, fontSize:20, fontWeight:700, margin:"14px 0 6px" },
  configSub:      { fontSize:13, color:"#6B6458", margin:"0 0 20px", lineHeight:1.5 },
  configStep:     { display:"flex", gap:12, marginBottom:18 },
  configStepNum:  { width:24, height:24, borderRadius:"50%", background:"#2B2620", color:"#FAF8F4", fontSize:12, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 },
  configStepTitle:{ fontSize:13, fontWeight:700, color:"#2B2620", margin:"0 0 4px" },
  configStepText: { fontSize:12.5, color:"#6B6458", margin:0, lineHeight:1.5 },
  configCode:     { background:"#F4F1EA", borderRadius:10, padding:"12px 14px", fontSize:11, color:"#2B2620", overflowX:"auto", margin:"8px 0 0", lineHeight:1.6, fontFamily:"'SF Mono', 'Fira Code', monospace", whiteSpace:"pre" },
  link:           { color:"#D97757", fontWeight:600 },
  header:         { background:"#FFFFFF", borderBottom:"1px solid #EFEBE2", position:"sticky", top:0, zIndex:10 },
  headerTop:      { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 12px", gap:12 },
  brandRow:       { display:"flex", alignItems:"center", gap:10, minWidth:0 },
  brandMark:      { width:34, height:34, borderRadius:9, background:"#2B2620", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  brandTitle:     { fontFamily:FONT_DISPLAY, fontSize:18, fontWeight:700, margin:0, lineHeight:1.2, whiteSpace:"nowrap" },
  brandSub:       { fontSize:11.5, color:"#9C9586", margin:"2px 0 0" },
  onlineDot:      { width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  addBtn:         { display:"flex", alignItems:"center", gap:6, background:"#2B2620", color:"#FAF8F4", border:"none", borderRadius:9, padding:"9px 13px", fontSize:13, fontWeight:600, flexShrink:0 },
  tabsRow:        { display:"flex", gap:6, padding:"0 12px 12px", overflowX:"auto", alignItems:"center" },
  tab:            { display:"flex", alignItems:"center", gap:6, background:"#F4F1EA", border:"1.5px solid transparent", borderRadius:999, padding:"7px 12px", fontSize:12.5, whiteSpace:"nowrap", flexShrink:0 },
  tabActive:      { background:"#FFFFFF", boxShadow:"0 1px 3px rgba(43,38,32,0.08)" },
  tabDot:         { width:6, height:6, borderRadius:"50%", flexShrink:0 },
  tabCount:       { background:"#EFEBE2", borderRadius:999, padding:"1px 6px", fontSize:10.5, fontWeight:700, color:"#8A8478" },
  tabDivider:     { width:1, alignSelf:"stretch", background:"#E8E3D8", margin:"2px 2px", flexShrink:0 },
  subbar:         { display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, padding:"12px 16px 0" },
  turnoChip:      { display:"flex", alignItems:"center", gap:6, background:"#FFFFFF", border:"1px solid #EFEBE2", borderRadius:8, padding:"6px 10px" },
  turnoChipDot:   { width:7, height:7, borderRadius:"50%" },
  turnoChipText:  { fontSize:12.5, fontWeight:600, color:"#5C5648" },
  weekNav:        { display:"flex", alignItems:"center", gap:4 },
  weekNavBtn:     { width:28, height:28, borderRadius:7, border:"1px solid #EFEBE2", background:"#FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", color:"#5C5648" },
  weekLabel:      { fontSize:12.5, fontWeight:700, color:"#2B2620", margin:"0 6px", minWidth:84, textAlign:"center" },
  weekTodayBtn:   { border:"1px solid #EFEBE2", background:"#FFFFFF", borderRadius:7, padding:"6px 10px", fontSize:12, fontWeight:600, color:"#5C5648", marginLeft:4 },
  legend:         { display:"flex", alignItems:"center", flexWrap:"wrap", gap:12, padding:"12px 16px 8px" },
  legendItem:     { display:"flex", alignItems:"center", gap:5 },
  legendSwatch:   { width:18, height:18, borderRadius:5, border:"1.5px solid", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  legendText:     { fontSize:11.5, color:"#6B6458" },
  legendManageBtn:{ display:"flex", alignItems:"center", gap:5, background:"#F4F1EA", border:"1px solid #E8E3D8", borderRadius:999, padding:"5px 10px", fontSize:11.5, fontWeight:600, color:"#5C5648" },
  legendHint:     { fontSize:11, color:"#B3AC9D", marginLeft:"auto", fontStyle:"italic" },
  tableWrap:      { padding:"4px 16px 0" },
  scrollArea:     { overflowX:"auto", borderRadius:12, border:"1px solid #EFEBE2", background:"#FFFFFF" },
  table:          { borderCollapse:"collapse", width:"100%", minWidth:620 },
  thName:         { textAlign:"left", fontSize:11, fontWeight:700, color:"#9C9586", textTransform:"uppercase", letterSpacing:"0.04em", padding:"10px 12px", position:"sticky", left:0, background:"#FBFAF7", borderBottom:"1px solid #EFEBE2", minWidth:190, zIndex:2 },
  thDay:          { textAlign:"center", padding:"8px 4px", borderBottom:"1px solid #EFEBE2", borderLeft:"1px solid #F4F1EA", color:"#6B6458", minWidth:56 },
  thDayToday:     { background:"#FBF1EC" },
  thDaySunday:    { background:"#FBFAF7" },
  tdName:         { padding:"8px 12px", borderBottom:"1px solid #F4F1EA", position:"sticky", left:0, backgroundColor:"#FFFFFF", zIndex:1 },
  nameCell:       { display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 },
  nameText:       { fontSize:13, fontWeight:600, color:"#2B2620" },
  nameMeta:       { fontSize:10.5, color:"#9C9586", marginTop:1 },
  nameActions:    { display:"flex", gap:4, flexShrink:0 },
  iconBtn:        { width:22, height:22, borderRadius:6, border:"none", background:"transparent", color:"#9C9586", display:"flex", alignItems:"center", justifyContent:"center" },
  tdCell:         { padding:"6px 4px", borderBottom:"1px solid #F4F1EA", borderLeft:"1px solid #F4F1EA", textAlign:"center" },
  cellBtn:        { width:36, height:32, borderRadius:7, border:"1px solid", fontSize:11.5, fontWeight:800, display:"inline-flex", alignItems:"center", justifyContent:"center" },
  groupHeaderCell:{ padding:"9px 12px", background:"#F4F1EA", borderTop:"1px solid #EFEBE2", borderBottom:"1px solid #EFEBE2", borderLeft:"3px solid", position:"sticky", left:0 },
  groupHeaderDot: { display:"inline-block", width:7, height:7, borderRadius:"50%", marginRight:8 },
  groupHeaderText:{ fontSize:12.5, fontWeight:800, color:"#2B2620" },
  groupHeaderHorario:{ fontSize:11, color:"#9C9586", marginLeft:8 },
  groupHeaderCount:  { fontSize:11, color:"#9C9586", marginLeft:8, float:"right" },
  emptyState:     { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 16px", background:"#FFFFFF", border:"1px dashed #E8E3D8", borderRadius:12, textAlign:"center" },
  emptyTitle:     { fontSize:14, fontWeight:700, color:"#2B2620", margin:"12px 0 2px" },
  modalOverlay:   { position:"fixed", inset:0, background:"rgba(43,38,32,0.4)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50, animation:"fadeIn 0.15s ease-out" },
  modalCard:      { background:"#FAF8F4", width:"100%", maxWidth:480, maxHeight:"88vh", overflowY:"auto", borderRadius:"18px 18px 0 0", padding:"18px 18px 24px", animation:"fadeIn 0.2s ease-out" },
  modalHeader:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 },
  modalTitle:     { fontFamily:FONT_DISPLAY, fontSize:18, fontWeight:700, margin:0 },
  modalClose:     { width:28, height:28, borderRadius:8, border:"none", background:"#EFEBE2", display:"flex", alignItems:"center", justifyContent:"center", color:"#5C5648" },
  formGroup:      { marginBottom:14 },
  label:          { display:"block", fontSize:12, fontWeight:700, color:"#6B6458", marginBottom:6 },
  input:          { width:"100%", padding:"11px 12px", borderRadius:9, border:"1.5px solid #E8E3D8", fontSize:14, background:"#FFFFFF", color:"#2B2620", outline:"none" },
  chipRow:        { display:"flex", flexWrap:"wrap", gap:6 },
  chip:           { border:"1.5px solid #E8E3D8", background:"#FFFFFF", borderRadius:999, padding:"7px 12px", fontSize:12.5, fontWeight:600, color:"#5C5648" },
  chipActive:     { background:"#2B2620", borderColor:"#2B2620", color:"#FAF8F4" },
  hintText:       { fontSize:11.5, color:"#9C9586", marginTop:6 },
  errorText:      { fontSize:12.5, color:"#C1503E", marginBottom:10, fontWeight:600 },
  modalActions:   { display:"flex", gap:8, marginTop:6 },
  btnGhost:       { flex:1, padding:"11px 14px", borderRadius:10, border:"1.5px solid #E8E3D8", background:"#FFFFFF", color:"#5C5648", fontSize:13.5, fontWeight:700 },
  btnPrimary:     { flex:2, padding:"11px 14px", borderRadius:10, border:"none", background:"#2B2620", color:"#FAF8F4", fontSize:13.5, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  btnDanger:      { flex:2, padding:"11px 14px", borderRadius:10, border:"none", background:"#C1503E", color:"#FFFFFF", fontSize:13.5, fontWeight:700 },
  confirmCard:    { background:"#FFFFFF", width:"100%", maxWidth:420, margin:16, borderRadius:16, padding:20, animation:"fadeIn 0.2s ease-out" },
  confirmTitle:   { fontSize:15, fontWeight:800, margin:"0 0 6px" },
  confirmText:    { fontSize:13, color:"#6B6458", margin:"0 0 16px", lineHeight:1.5 },
  confirmActions: { display:"flex", gap:8 },
  toast:          { position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", background:"#2B2620", color:"#FAF8F4", padding:"10px 18px", borderRadius:999, fontSize:13, fontWeight:600, boxShadow:"0 4px 16px rgba(0,0,0,0.2)", zIndex:60, animation:"fadeIn 0.2s ease-out" },
  savingDot:      { position:"fixed", bottom:16, right:16, width:8, height:8, borderRadius:"50%", background:"#D97757", animation:"pulse 1s ease-in-out infinite" },
  tiposList:      { display:"flex", flexDirection:"column", gap:6, marginBottom:12 },
  tipoRow:        { display:"flex", alignItems:"center", gap:10, background:"#FFFFFF", border:"1px solid #EFEBE2", borderRadius:10, padding:"8px 10px" },
  tipoSwatch:     { width:32, height:28, borderRadius:7, border:"1.5px solid", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 },
  tipoNome:       { fontSize:13, fontWeight:600, color:"#2B2620", flex:1 },
  tipoFixoBadge:  { fontSize:10, fontWeight:700, color:"#9C9586", background:"#F4F1EA", padding:"2px 7px", borderRadius:999 },
  tipoActions:    { display:"flex", gap:2 },
  addTipoBtn:     { width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6, border:"1.5px dashed #D8D2C5", background:"transparent", borderRadius:10, padding:"11px", fontSize:13, fontWeight:700, color:"#6B6458", marginBottom:6 },
  colorRow:       { display:"flex", flexWrap:"wrap", gap:8 },
  colorSwatch:    { width:30, height:30, borderRadius:"50%", border:"2px solid transparent" },
  colorSwatchActive:{ border:"2px solid #2B2620", boxShadow:"0 0 0 2px #FAF8F4 inset" },
};

const globalCss = `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: #FAF8F4; overscroll-behavior-y: none; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  button { font-family: inherit; cursor: pointer; }
  input  { font-family: inherit; }
  ::-webkit-scrollbar { height: 8px; width: 8px; }
  ::-webkit-scrollbar-thumb { background: #D8D2C5; border-radius: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
`;

// Injeta CSS global
const styleEl = document.createElement("style");
styleEl.textContent = globalCss;
document.head.appendChild(styleEl);

// Monta o app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(Root, null));
