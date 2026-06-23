import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, X, Check, Clock, Users, ChevronLeft, ChevronRight, Trash2, UserPlus, CalendarDays, Settings, Pencil } from "lucide-react";

// ---------- Constantes ----------

const TURNOS = [
  { id: "manha", label: "Manhã", horario: "07:00 – 15:20", cor: "#D97757" },
  { id: "intermediario", label: "Intermediário", horario: "10:00 – 18:20", cor: "#B08968" },
  { id: "tarde", label: "Tarde", horario: "14:00 – 22:20", cor: "#5B8A72" },
  { id: "noite", label: "Madrugada", horario: "22:00 – 05:20", cor: "#4A5C7A" },
];

const VISAO_TODOS = { id: "todos", label: "Todos", horario: "Todos os turnos", cor: "#2B2620" };

// Tipos de marcação padrão (seed). O usuário pode editar, adicionar ou remover tipos.
// "presente" e "vazio" são fixos no sistema (não podem ser removidos), os demais são
// tipos de folga/ausência totalmente customizáveis.
const STATUS_SEED = [
  { id: "presente", label: "Presente", short: "P", color: "#5B8A72", bg: "#E8F0EA", fixo: true },
  { id: "falta", label: "Falta", short: "F", color: "#C1503E", bg: "#F7E8E5" },
  { id: "folga", label: "Folga (DSR)", short: "D", color: "#8A8478", bg: "#EFEDE8" },
  { id: "ferias", label: "Férias", short: "FF", color: "#B08968", bg: "#F3EAE0" },
  { id: "atestado", label: "Atestado", short: "AT", color: "#7A6B8A", bg: "#ECE8F0" },
];

const STATUS_VAZIO = { id: "vazio", label: "Não marcado", short: "", color: "#C9C3B8", bg: "#FFFFFF", fixo: true };

const PALETA_CORES = [
  "#C1503E", "#D97757", "#B08968", "#A8954D", "#5B8A72",
  "#4A8A8C", "#4A5C7A", "#5C5CA8", "#7A6B8A", "#A85C8C",
  "#8A8478", "#6B6458",
];

const FUNCOES = ["Op. Loja", "Pleno", "Pleno PREV.", "Líder", "Estoque", "Caixa"];

const WEEKDAY_LABELS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

// ---------- Helpers de data ----------

function pad2(n) {
  return String(n).padStart(2, "0");
}

function isoDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function getWeekDays(anchorDate) {
  const start = startOfWeek(anchorDate);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function formatRangeLabel(days) {
  const first = days[0];
  const last = days[6];
  const sameMonth = first.getMonth() === last.getMonth();
  const fmt = (d, withMonth) =>
    `${pad2(d.getDate())}${withMonth ? `/${pad2(d.getMonth() + 1)}` : ""}`;
  if (sameMonth) {
    return `${fmt(first, false)} – ${fmt(last, true)}`;
  }
  return `${fmt(first, true)} – ${fmt(last, true)}`;
}

// ---------- Storage helpers ----------

const SHARED = true; // dados compartilhados entre quem acessa este app

async function storageGet(key, fallback) {
  try {
    const res = await window.storage.get(key, SHARED);
    if (!res) return fallback;
    return JSON.parse(res.value);
  } catch (e) {
    return fallback;
  }
}

async function storageSet(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), SHARED);
    return true;
  } catch (e) {
    console.error("Erro ao salvar:", e);
    return false;
  }
}

// ---------- Dados iniciais (seed a partir da planilha) ----------

const SEED_COLABORADORES = [
  { id: "c1", matricula: "7153570", nome: "Anna Caroline", funcao: "Op. Loja", turno: "manha" },
  { id: "c2", matricula: "5624576", nome: "Cláudia Regina", funcao: "Op. Loja", turno: "manha" },
  { id: "c3", matricula: "6427510", nome: "Danillo de Souza", funcao: "Op. Loja", turno: "manha" },
  { id: "c4", matricula: "8005225", nome: "Francicleide dos Santos", funcao: "Op. Loja", turno: "manha" },
  { id: "c5", matricula: "5885264", nome: "Joselito Dias Sobreira", funcao: "Op. Loja", turno: "manha" },
  { id: "c6", matricula: "5646375", nome: "Lizandra Araujo", funcao: "Op. Loja", turno: "manha" },
  { id: "c7", matricula: "6528910", nome: "Matheus Carlos", funcao: "Op. Loja", turno: "manha" },
  { id: "c8", matricula: "7026595", nome: "Maria Eduarda", funcao: "Op. Loja", turno: "manha" },
  { id: "c9", matricula: "6899153", nome: "Nataniel Sousa", funcao: "Op. Loja", turno: "manha" },
  { id: "c10", matricula: "6755461", nome: "Simone do Carmo", funcao: "Op. Loja", turno: "manha" },
  { id: "c11", matricula: "7026013", nome: "Victoria Aquino", funcao: "Op. Loja", turno: "manha" },
  { id: "c12", matricula: "6465951", nome: "Alfredo Nascimento", funcao: "Op. Loja", turno: "intermediario" },
  { id: "c13", matricula: "5361060", nome: "Gabriel Martins", funcao: "Op. Loja", turno: "intermediario" },
  { id: "c14", matricula: "4275195", nome: "Gleyce Kelly", funcao: "Op. Loja", turno: "intermediario" },
  { id: "c15", matricula: "5568978", nome: "Felipe Mota", funcao: "Pleno", turno: "tarde" },
  { id: "c16", matricula: "7237790", nome: "Flavio Ferreira", funcao: "Pleno PREV.", turno: "tarde" },
  { id: "c17", matricula: "6926177", nome: "Alohan da Costa", funcao: "Op. Loja", turno: "tarde" },
  { id: "c18", matricula: "7237316", nome: "Daniele Teixeira", funcao: "Op. Loja", turno: "tarde" },
  { id: "c19", matricula: "7216165", nome: "Deivison Vieira", funcao: "Op. Loja", turno: "tarde" },
  { id: "c20", matricula: "7237308", nome: "Fernanda Pereira", funcao: "Op. Loja", turno: "tarde" },
  { id: "c21", matricula: "7029578", nome: "Jonas Felipe", funcao: "Op. Loja", turno: "tarde" },
  { id: "c22", matricula: "7160542", nome: "Kamili Conceição", funcao: "Op. Loja", turno: "tarde" },
  { id: "c23", matricula: "7115261", nome: "Leonard Gerard", funcao: "Op. Loja", turno: "tarde" },
  { id: "c24", matricula: "7029322", nome: "Marcelo da Silva", funcao: "Op. Loja", turno: "tarde" },
  { id: "c25", matricula: "7014252", nome: "Suelen da Silva", funcao: "Op. Loja", turno: "tarde" },
  { id: "c26", matricula: "7122659", nome: "Talia Mesquita", funcao: "Op. Loja", turno: "tarde" },
  { id: "c27", matricula: "7164289", nome: "Taissa Ferreira", funcao: "Op. Loja", turno: "tarde" },
  { id: "c28", matricula: "7231784", nome: "Andrey da Costa", funcao: "Op. Loja", turno: "noite" },
  { id: "c29", matricula: "6259731", nome: "Guilherme Veras", funcao: "Op. Loja", turno: "noite" },
  { id: "c30", matricula: "6739733", nome: "Lohan Rodrigues", funcao: "Op. Loja", turno: "noite" },
];

// ---------- Componente principal ----------

export default function ControlePresenca() {
  const [colaboradores, setColaboradores] = useState(null); // null = carregando
  const [presencas, setPresencas] = useState({}); // { "colabId:isoDate": status }
  const [tiposStatus, setTiposStatus] = useState(null); // null = carregando
  const [turnoAtivo, setTurnoAtivo] = useState("manha");
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [showCadastro, setShowCadastro] = useState(false);
  const [editingColab, setEditingColab] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showTipos, setShowTipos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Carregar dados
  useEffect(() => {
    (async () => {
      const savedColabs = await storageGet("colaboradores", null);
      const savedPresencas = await storageGet("presencas", {});
      const savedTipos = await storageGet("tiposStatus", null);
      if (savedColabs === null) {
        setColaboradores(SEED_COLABORADORES);
        await storageSet("colaboradores", SEED_COLABORADORES);
      } else {
        setColaboradores(savedColabs);
      }
      if (savedTipos === null) {
        setTiposStatus(STATUS_SEED);
        await storageSet("tiposStatus", STATUS_SEED);
      } else {
        setTiposStatus(savedTipos);
      }
      setPresencas(savedPresencas);
    })();
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const persistColaboradores = useCallback(async (next) => {
    setColaboradores(next);
    setSaving(true);
    await storageSet("colaboradores", next);
    setSaving(false);
  }, []);

  const persistPresencas = useCallback(async (next) => {
    setPresencas(next);
    setSaving(true);
    await storageSet("presencas", next);
    setSaving(false);
  }, []);

  const persistTipos = useCallback(async (next) => {
    setTiposStatus(next);
    setSaving(true);
    await storageSet("tiposStatus", next);
    setSaving(false);
  }, []);

  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate]);

  const colaboradoresDoTurno = useMemo(() => {
    if (!colaboradores) return [];
    return colaboradores
      .filter((c) => c.turno === turnoAtivo)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [colaboradores, turnoAtivo]);

  // Agrupamento usado pela visão "Todos": uma lista de grupos { turno, items }
  const gruposPorTurno = useMemo(() => {
    if (!colaboradores) return [];
    return TURNOS.map((t) => ({
      turno: t,
      items: colaboradores
        .filter((c) => c.turno === t.id)
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    })).filter((g) => g.items.length > 0);
  }, [colaboradores]);

  const isVisaoTodos = turnoAtivo === "todos";

  // Ordem de ciclo: vazio -> presente -> demais tipos cadastrados (na ordem definida pelo usuário)
  const statusOrderIds = useMemo(() => {
    if (!tiposStatus) return ["vazio"];
    return ["vazio", ...tiposStatus.map((t) => t.id)];
  }, [tiposStatus]);

  const getStatusInfo = useCallback(
    (id) => {
      if (id === "vazio" || !id) return STATUS_VAZIO;
      const found = tiposStatus && tiposStatus.find((t) => t.id === id);
      return found || STATUS_VAZIO;
    },
    [tiposStatus]
  );

  const cycleStatus = useCallback(
    (colabId, dateIso) => {
      const key = `${colabId}:${dateIso}`;
      const current = presencas[key] || "vazio";
      const idx = statusOrderIds.indexOf(current);
      const safeIdx = idx === -1 ? 0 : idx;
      const nextStatus = statusOrderIds[(safeIdx + 1) % statusOrderIds.length];
      const next = { ...presencas };
      if (nextStatus === "vazio") {
        delete next[key];
      } else {
        next[key] = nextStatus;
      }
      persistPresencas(next);
    },
    [presencas, persistPresencas, statusOrderIds]
  );

  const handleSaveColab = useCallback(
    async (colab) => {
      let next;
      if (colab.id) {
        next = colaboradores.map((c) => (c.id === colab.id ? colab : c));
      } else {
        const newColab = { ...colab, id: `c${Date.now()}` };
        next = [...colaboradores, newColab];
      }
      await persistColaboradores(next);
      setShowCadastro(false);
      setEditingColab(null);
      showToast(colab.id ? "Colaborador atualizado" : "Colaborador cadastrado");
    },
    [colaboradores, persistColaboradores, showToast]
  );

  const handleDeleteColab = useCallback(
    async (id) => {
      const next = colaboradores.filter((c) => c.id !== id);
      await persistColaboradores(next);
      const nextPresencas = { ...presencas };
      Object.keys(nextPresencas).forEach((k) => {
        if (k.startsWith(`${id}:`)) delete nextPresencas[k];
      });
      await persistPresencas(nextPresencas);
      setConfirmDelete(null);
      showToast("Colaborador removido");
    },
    [colaboradores, presencas, persistColaboradores, persistPresencas, showToast]
  );

  const handleSaveTipo = useCallback(
    async (tipo) => {
      let next;
      if (tipo.id && tiposStatus.some((t) => t.id === tipo.id)) {
        next = tiposStatus.map((t) => (t.id === tipo.id ? { ...t, ...tipo } : t));
        showToast("Tipo atualizado");
      } else {
        const newTipo = { ...tipo, id: `t${Date.now()}` };
        next = [...tiposStatus, newTipo];
        showToast("Tipo de folga cadastrado");
      }
      await persistTipos(next);
    },
    [tiposStatus, persistTipos, showToast]
  );

  const handleDeleteTipo = useCallback(
    async (id) => {
      const next = tiposStatus.filter((t) => t.id !== id);
      await persistTipos(next);
      // Limpa marcações que usavam esse tipo (voltam a ficar vazias)
      const nextPresencas = { ...presencas };
      Object.keys(nextPresencas).forEach((k) => {
        if (nextPresencas[k] === id) delete nextPresencas[k];
      });
      await persistPresencas(nextPresencas);
      showToast("Tipo removido");
    },
    [tiposStatus, presencas, persistTipos, persistPresencas, showToast]
  );

  if (colaboradores === null || tiposStatus === null) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingDot} />
        <span style={{ color: "#8A8478", fontSize: 14, marginTop: 12 }}>Carregando…</span>
      </div>
    );
  }

  const turnoInfo = isVisaoTodos ? VISAO_TODOS : TURNOS.find((t) => t.id === turnoAtivo);

  return (
    <div style={styles.app}>
      <style>{globalCss}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.brandRow}>
            <div style={styles.brandMark}>
              <Clock size={18} color="#FAF8F4" strokeWidth={2.2} />
            </div>
            <div>
              <h1 style={styles.brandTitle}>Controle de Presença</h1>
              <p style={styles.brandSub}>
                {colaboradores.length} colaborador{colaboradores.length !== 1 ? "es" : ""} cadastrado
                {colaboradores.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => {
              setEditingColab(null);
              setShowCadastro(true);
            }}
          >
            <UserPlus size={16} strokeWidth={2.2} />
            <span>Cadastrar</span>
          </button>
        </div>

        {/* Abas de turno */}
        <div style={styles.tabsRow}>
          <button
            onClick={() => setTurnoAtivo("todos")}
            style={{
              ...styles.tab,
              ...(isVisaoTodos ? { ...styles.tabActive, borderColor: VISAO_TODOS.cor } : {}),
            }}
          >
            <Users size={12} color={isVisaoTodos ? VISAO_TODOS.cor : "#9C9586"} strokeWidth={2.4} />
            <span style={{ fontWeight: isVisaoTodos ? 700 : 500, color: isVisaoTodos ? "#2B2620" : "#6B6458" }}>
              Todos
            </span>
            <span style={styles.tabCount}>{colaboradores.length}</span>
          </button>
          <span style={styles.tabDivider} />
          {TURNOS.map((t) => {
            const count = colaboradores.filter((c) => c.turno === t.id).length;
            const active = !isVisaoTodos && t.id === turnoAtivo;
            return (
              <button
                key={t.id}
                onClick={() => setTurnoAtivo(t.id)}
                style={{
                  ...styles.tab,
                  ...(active ? { ...styles.tabActive, borderColor: t.cor } : {}),
                }}
              >
                <span
                  style={{
                    ...styles.tabDot,
                    background: active ? t.cor : "#D8D2C5",
                  }}
                />
                <span style={{ fontWeight: active ? 700 : 500, color: active ? "#2B2620" : "#6B6458" }}>
                  {t.label}
                </span>
                <span style={styles.tabCount}>{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Faixa de turno + semana */}
      <div style={styles.subbar}>
        <div style={styles.turnoChip}>
          <span style={{ ...styles.turnoChipDot, background: turnoInfo.cor }} />
          <CalendarDays size={14} color="#8A8478" />
          <span style={styles.turnoChipText}>
            {isVisaoTodos ? `${gruposPorTurno.length} turnos · ${colaboradores.length} pessoas` : turnoInfo.horario}
          </span>
        </div>
        <div style={styles.weekNav}>
          <button style={styles.weekNavBtn} onClick={() => setAnchorDate((d) => addDays(d, -7))}>
            <ChevronLeft size={16} />
          </button>
          <span style={styles.weekLabel}>{formatRangeLabel(weekDays)}</span>
          <button style={styles.weekNavBtn} onClick={() => setAnchorDate((d) => addDays(d, 7))}>
            <ChevronRight size={16} />
          </button>
          <button style={styles.weekTodayBtn} onClick={() => setAnchorDate(new Date())}>
            Hoje
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div style={styles.legend}>
        {tiposStatus.map((s) => (
          <div key={s.id} style={styles.legendItem}>
            <span style={{ ...styles.legendSwatch, background: s.bg, borderColor: s.color }}>
              <span style={{ color: s.color, fontSize: 10, fontWeight: 800 }}>{s.short}</span>
            </span>
            <span style={styles.legendText}>{s.label}</span>
          </div>
        ))}
        <button style={styles.legendManageBtn} onClick={() => setShowTipos(true)}>
          <Settings size={12} strokeWidth={2.4} />
          <span>Gerenciar tipos</span>
        </button>
        <span style={styles.legendHint}>Toque numa célula para alternar o status</span>
      </div>

      {/* Tabela */}
      <main style={styles.tableWrap}>
        {(isVisaoTodos ? colaboradores.length === 0 : colaboradoresDoTurno.length === 0) ? (
          <div style={styles.emptyState}>
            <Users size={28} color="#C9C3B8" />
            <p style={styles.emptyTitle}>
              {isVisaoTodos ? "Nenhum colaborador cadastrado" : "Nenhum colaborador neste turno"}
            </p>
            <p style={styles.emptySub}>Cadastre alguém para começar a marcar presença.</p>
            <button
              style={{ ...styles.addBtn, marginTop: 14 }}
              onClick={() => {
                setEditingColab({ turno: isVisaoTodos ? "manha" : turnoAtivo });
                setShowCadastro(true);
              }}
            >
              <Plus size={16} strokeWidth={2.2} />
              <span>Cadastrar colaborador</span>
            </button>
          </div>
        ) : (
          <div style={styles.scrollArea}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.thName}>Colaborador</th>
                  {weekDays.map((d) => {
                    const isToday = isoDate(d) === isoDate(new Date());
                    const isSunday = d.getDay() === 0;
                    return (
                      <th
                        key={d.toISOString()}
                        style={{
                          ...styles.thDay,
                          ...(isToday ? styles.thDayToday : {}),
                          ...(isSunday && !isToday ? styles.thDaySunday : {}),
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}>
                          {WEEKDAY_LABELS[d.getDay()]}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>
                          {pad2(d.getDate())}/{pad2(d.getMonth() + 1)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              {isVisaoTodos ? (
                gruposPorTurno.map((grupo) => (
                  <tbody key={grupo.turno.id}>
                    <tr>
                      <td colSpan={8} style={{ ...styles.groupHeaderCell, borderLeftColor: grupo.turno.cor }}>
                        <span style={{ ...styles.groupHeaderDot, background: grupo.turno.cor }} />
                        <span style={styles.groupHeaderText}>{grupo.turno.label}</span>
                        <span style={styles.groupHeaderHorario}>{grupo.turno.horario}</span>
                        <span style={styles.groupHeaderCount}>
                          {grupo.items.length} pessoa{grupo.items.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                    </tr>
                    {grupo.items.map((colab, i) => (
                      <RowColaborador
                        key={colab.id}
                        colab={colab}
                        index={i}
                        weekDays={weekDays}
                        presencas={presencas}
                        onCycle={cycleStatus}
                        onEdit={() => {
                          setEditingColab(colab);
                          setShowCadastro(true);
                        }}
                        onDelete={() => setConfirmDelete(colab)}
                        getStatusInfo={getStatusInfo}
                      />
                    ))}
                  </tbody>
                ))
              ) : (
                <tbody>
                  {colaboradoresDoTurno.map((colab, i) => (
                    <RowColaborador
                      key={colab.id}
                      colab={colab}
                      index={i}
                      weekDays={weekDays}
                      presencas={presencas}
                      onCycle={cycleStatus}
                      onEdit={() => {
                        setEditingColab(colab);
                        setShowCadastro(true);
                      }}
                      onDelete={() => setConfirmDelete(colab)}
                      getStatusInfo={getStatusInfo}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}
      </main>

      {/* Modal de cadastro/edição */}
      {showCadastro && (
        <CadastroModal
          initial={editingColab}
          onClose={() => {
            setShowCadastro(false);
            setEditingColab(null);
          }}
          onSave={handleSaveColab}
        />
      )}

      {/* Modal de gerenciamento de tipos de folga/presença */}
      {showTipos && (
        <TiposModal
          tipos={tiposStatus}
          onClose={() => setShowTipos(false)}
          onSave={handleSaveTipo}
          onDelete={handleDeleteTipo}
        />
      )}

      {/* Confirmação de exclusão */}
      {confirmDelete && (
        <div style={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <p style={styles.confirmTitle}>Remover colaborador?</p>
            <p style={styles.confirmText}>
              {confirmDelete.nome} será removido junto com todo o histórico de presença registrado.
            </p>
            <div style={styles.confirmActions}>
              <button style={styles.btnGhost} onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button style={styles.btnDanger} onClick={() => handleDeleteColab(confirmDelete.id)}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}
      {saving && <div style={styles.savingDot} title="Salvando…" />}
    </div>
  );
}

// ---------- Linha de colaborador (usada nas duas visões) ----------

function RowColaborador({ colab, index, weekDays, presencas, onCycle, onEdit, onDelete, getStatusInfo }) {
  return (
    <tr style={index % 2 === 1 ? { background: "#FBFAF7" } : undefined}>
      <td style={styles.tdName}>
        <div style={styles.nameCell}>
          <div>
            <div style={styles.nameText}>{colab.nome}</div>
            <div style={styles.nameMeta}>
              {colab.matricula} · {colab.funcao}
            </div>
          </div>
          <div style={styles.nameActions}>
            <button style={styles.iconBtn} title="Editar" onClick={onEdit}>
              <Users size={13} />
            </button>
            <button style={{ ...styles.iconBtn, color: "#C1503E" }} title="Remover" onClick={onDelete}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </td>
      {weekDays.map((d) => {
        const dateIso = isoDate(d);
        const key = `${colab.id}:${dateIso}`;
        const status = presencas[key] || "vazio";
        const s = getStatusInfo(status);
        const isToday = dateIso === isoDate(new Date());
        return (
          <td key={key} style={styles.tdCell}>
            <button
              onClick={() => onCycle(colab.id, dateIso)}
              style={{
                ...styles.cellBtn,
                background: s.bg,
                borderColor: isToday ? "#2B2620" : status === "vazio" ? "#E8E3D8" : s.color,
                borderWidth: isToday ? 2 : 1,
                color: s.color,
              }}
            >
              {s.short}
            </button>
          </td>
        );
      })}
    </tr>
  );
}

// ---------- Modal de cadastro ----------

function CadastroModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial && initial.id);
  const [nome, setNome] = useState(initial?.nome || "");
  const [matricula, setMatricula] = useState(initial?.matricula || "");
  const [funcao, setFuncao] = useState(initial?.funcao || FUNCOES[0]);
  const [turno, setTurno] = useState(initial?.turno || "manha");
  const [error, setError] = useState("");

  const submit = () => {
    if (!nome.trim()) {
      setError("Informe o nome do colaborador.");
      return;
    }
    if (!matricula.trim()) {
      setError("Informe a matrícula.");
      return;
    }
    onSave({
      id: initial?.id,
      nome: nome.trim(),
      matricula: matricula.trim(),
      funcao,
      turno,
    });
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{isEdit ? "Editar colaborador" : "Novo colaborador"}</h2>
          <button style={styles.modalClose} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nome completo</label>
          <input
            style={styles.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Anna Caroline"
            autoFocus
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Matrícula</label>
          <input
            style={styles.input}
            value={matricula}
            onChange={(e) => setMatricula(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Ex.: 7153570"
            inputMode="numeric"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Função</label>
          <div style={styles.chipRow}>
            {FUNCOES.map((f) => (
              <button
                key={f}
                onClick={() => setFuncao(f)}
                style={{
                  ...styles.chip,
                  ...(funcao === f ? styles.chipActive : {}),
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Turno</label>
          <div style={styles.chipRow}>
            {TURNOS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTurno(t.id)}
                style={{
                  ...styles.chip,
                  ...(turno === t.id ? { ...styles.chipActive, borderColor: t.cor, background: t.cor } : {}),
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p style={styles.hintText}>{TURNOS.find((t) => t.id === turno)?.horario}</p>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <div style={styles.modalActions}>
          <button style={styles.btnGhost} onClick={onClose}>
            Cancelar
          </button>
          <button style={styles.btnPrimary} onClick={submit}>
            <Check size={15} strokeWidth={2.5} />
            {isEdit ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Modal de gerenciamento de tipos de folga ----------

function TiposModal({ tipos, onClose, onSave, onDelete }) {
  const [editing, setEditing] = useState(null); // tipo sendo editado, ou {} para novo
  const [confirmDel, setConfirmDel] = useState(null);

  if (editing !== null) {
    return (
      <TipoForm
        initial={editing.id ? editing : null}
        onClose={() => setEditing(null)}
        onSave={async (tipo) => {
          await onSave(tipo);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Tipos de folga e presença</h2>
          <button style={styles.modalClose} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <p style={styles.hintText}>
          Esses são os status disponíveis ao tocar nas células da escala. "Presente" é fixo no sistema.
        </p>

        <div style={styles.tiposList}>
          {tipos.map((t) => (
            <div key={t.id} style={styles.tipoRow}>
              <span style={{ ...styles.tipoSwatch, background: t.bg, borderColor: t.color, color: t.color }}>
                {t.short}
              </span>
              <span style={styles.tipoNome}>{t.label}</span>
              {t.fixo && <span style={styles.tipoFixoBadge}>fixo</span>}
              <div style={styles.tipoActions}>
                <button style={styles.iconBtn} title="Editar" onClick={() => setEditing(t)}>
                  <Pencil size={13} />
                </button>
                {!t.fixo && (
                  <button
                    style={{ ...styles.iconBtn, color: "#C1503E" }}
                    title="Remover"
                    onClick={() => setConfirmDel(t)}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button style={styles.addTipoBtn} onClick={() => setEditing({})}>
          <Plus size={15} strokeWidth={2.4} />
          Novo tipo de folga
        </button>

        <div style={styles.modalActions}>
          <button style={{ ...styles.btnPrimary, flex: 1 }} onClick={onClose}>
            Concluído
          </button>
        </div>
      </div>

      {confirmDel && (
        <div style={styles.modalOverlay} onClick={(e) => e.stopPropagation()}>
          <div style={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <p style={styles.confirmTitle}>Remover "{confirmDel.label}"?</p>
            <p style={styles.confirmText}>
              As marcações que usam esse tipo voltarão a ficar em branco. Essa ação não pode ser desfeita.
            </p>
            <div style={styles.confirmActions}>
              <button style={styles.btnGhost} onClick={() => setConfirmDel(null)}>
                Cancelar
              </button>
              <button
                style={styles.btnDanger}
                onClick={() => {
                  onDelete(confirmDel.id);
                  setConfirmDel(null);
                }}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TipoForm({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial && initial.id);
  const [label, setLabel] = useState(initial?.label || "");
  const [short, setShort] = useState(initial?.short || "");
  const [color, setColor] = useState(initial?.color || PALETA_CORES[0]);
  const [error, setError] = useState("");

  const bgFromColor = (hex) => `${hex}1A`; // leve transparência para o fundo

  const submit = () => {
    if (!label.trim()) {
      setError("Dê um nome para o tipo (ex.: Licença médica).");
      return;
    }
    if (!short.trim()) {
      setError("Defina uma sigla curta para aparecer na célula (ex.: LM).");
      return;
    }
    onSave({
      id: initial?.id,
      label: label.trim(),
      short: short.trim().toUpperCase().slice(0, 3),
      color,
      bg: bgFromColor(color),
    });
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{isEdit ? "Editar tipo" : "Novo tipo de folga"}</h2>
          <button style={styles.modalClose} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nome</label>
          <input
            style={styles.input}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex.: Licença médica"
            autoFocus
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sigla na célula (até 3 letras)</label>
          <input
            style={{ ...styles.input, maxWidth: 110, textTransform: "uppercase" }}
            value={short}
            onChange={(e) => setShort(e.target.value.slice(0, 3))}
            placeholder="Ex.: LM"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cor</label>
          <div style={styles.colorRow}>
            {PALETA_CORES.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  ...styles.colorSwatch,
                  background: c,
                  ...(color === c ? styles.colorSwatchActive : {}),
                }}
              />
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Pré-visualização</label>
          <span
            style={{
              ...styles.tipoSwatch,
              background: bgFromColor(color),
              borderColor: color,
              color: color,
              width: 40,
              height: 36,
              fontSize: 13,
            }}
          >
            {short || "—"}
          </span>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <div style={styles.modalActions}>
          <button style={styles.btnGhost} onClick={onClose}>
            Cancelar
          </button>
          <button style={styles.btnPrimary} onClick={submit}>
            <Check size={15} strokeWidth={2.5} />
            {isEdit ? "Salvar alterações" : "Cadastrar tipo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Estilos ----------

const globalCss = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  button { font-family: inherit; cursor: pointer; }
  input { font-family: inherit; }
  ::-webkit-scrollbar { height: 8px; width: 8px; }
  ::-webkit-scrollbar-thumb { background: #D8D2C5; border-radius: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
`;

const FONT_DISPLAY = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
const FONT_BODY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const styles = {
  app: {
    minHeight: "100vh",
    background: "#FAF8F4",
    fontFamily: FONT_BODY,
    color: "#2B2620",
    paddingBottom: 40,
  },
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#FAF8F4",
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#D97757",
    animation: "pulse 1.2s ease-in-out infinite",
  },
  header: {
    background: "#FFFFFF",
    borderBottom: "1px solid #EFEBE2",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 16px 12px",
    gap: 12,
  },
  brandRow: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "#2B2620",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brandTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  },
  brandSub: { fontSize: 11.5, color: "#9C9586", margin: "2px 0 0" },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#2B2620",
    color: "#FAF8F4",
    border: "none",
    borderRadius: 9,
    padding: "9px 13px",
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  tabsRow: {
    display: "flex",
    gap: 6,
    padding: "0 12px 12px",
    overflowX: "auto",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#F4F1EA",
    border: "1.5px solid transparent",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 12.5,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  tabActive: {
    background: "#FFFFFF",
    boxShadow: "0 1px 3px rgba(43,38,32,0.08)",
  },
  tabDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  tabCount: {
    background: "#EFEBE2",
    borderRadius: 999,
    padding: "1px 6px",
    fontSize: 10.5,
    fontWeight: 700,
    color: "#8A8478",
  },
  tabDivider: {
    width: 1,
    alignSelf: "stretch",
    background: "#E8E3D8",
    margin: "2px 2px",
    flexShrink: 0,
  },
  subbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    padding: "12px 16px 0",
  },
  turnoChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#FFFFFF",
    border: "1px solid #EFEBE2",
    borderRadius: 8,
    padding: "6px 10px",
  },
  turnoChipDot: { width: 7, height: 7, borderRadius: "50%" },
  turnoChipText: { fontSize: 12.5, fontWeight: 600, color: "#5C5648" },
  weekNav: { display: "flex", alignItems: "center", gap: 4 },
  weekNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    border: "1px solid #EFEBE2",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5C5648",
  },
  weekLabel: { fontSize: 12.5, fontWeight: 700, color: "#2B2620", margin: "0 6px", minWidth: 84, textAlign: "center" },
  weekTodayBtn: {
    border: "1px solid #EFEBE2",
    background: "#FFFFFF",
    borderRadius: 7,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 600,
    color: "#5C5648",
    marginLeft: 4,
  },
  legend: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    padding: "12px 16px 8px",
  },
  legendItem: { display: "flex", alignItems: "center", gap: 5 },
  legendSwatch: {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: "1.5px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  legendText: { fontSize: 11.5, color: "#6B6458" },
  legendHint: { fontSize: 11, color: "#B3AC9D", fontStyle: "italic" },
  legendManageBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid #E8E3D8",
    background: "#FFFFFF",
    borderRadius: 7,
    padding: "5px 10px",
    fontSize: 11.5,
    fontWeight: 600,
    color: "#5C5648",
    marginLeft: "auto",
  },
  tableWrap: { padding: "4px 16px 0" },
  scrollArea: {
    overflowX: "auto",
    borderRadius: 12,
    border: "1px solid #EFEBE2",
    background: "#FFFFFF",
  },
  table: { borderCollapse: "collapse", width: "100%", minWidth: 620 },
  thName: {
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#9C9586",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "10px 12px",
    position: "sticky",
    left: 0,
    background: "#FBFAF7",
    borderBottom: "1px solid #EFEBE2",
    minWidth: 190,
    zIndex: 2,
  },
  thDay: {
    textAlign: "center",
    padding: "8px 4px",
    borderBottom: "1px solid #EFEBE2",
    borderLeft: "1px solid #F4F1EA",
    color: "#6B6458",
    minWidth: 56,
  },
  thDayToday: { background: "#FBF1EC" },
  thDaySunday: { background: "#FBFAF7" },
  tdName: {
    padding: "8px 12px",
    borderBottom: "1px solid #F4F1EA",
    position: "sticky",
    left: 0,
    background: "inherit",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  nameCell: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  groupHeaderCell: {
    padding: "9px 12px",
    background: "#F4F1EA",
    borderTop: "1px solid #EFEBE2",
    borderBottom: "1px solid #EFEBE2",
    borderLeft: "3px solid",
    position: "sticky",
    left: 0,
  },
  groupHeaderDot: { display: "inline-block", width: 7, height: 7, borderRadius: "50%", marginRight: 8 },
  groupHeaderText: { fontSize: 12.5, fontWeight: 800, color: "#2B2620" },
  groupHeaderHorario: { fontSize: 11, color: "#9C9586", marginLeft: 8 },
  groupHeaderCount: { fontSize: 11, color: "#9C9586", marginLeft: 8, float: "right" },
  nameText: { fontSize: 13, fontWeight: 600, color: "#2B2620" },
  nameMeta: { fontSize: 10.5, color: "#9C9586", marginTop: 1 },
  nameActions: { display: "flex", gap: 4, flexShrink: 0 },
  iconBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: "#9C9586",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tdCell: {
    padding: "6px 4px",
    borderBottom: "1px solid #F4F1EA",
    borderLeft: "1px solid #F4F1EA",
    textAlign: "center",
  },
  cellBtn: {
    width: 36,
    height: 32,
    borderRadius: 7,
    border: "1px solid",
    fontSize: 11.5,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 16px",
    background: "#FFFFFF",
    border: "1px dashed #E8E3D8",
    borderRadius: 12,
    textAlign: "center",
  },
  emptyTitle: { fontSize: 14, fontWeight: 700, color: "#2B2620", margin: "12px 0 2px" },
  emptySub: { fontSize: 12.5, color: "#9C9586", margin: 0 },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(43,38,32,0.4)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 50,
    animation: "fadeIn 0.15s ease-out",
  },
  modalCard: {
    background: "#FAF8F4",
    width: "100%",
    maxWidth: 480,
    maxHeight: "88vh",
    overflowY: "auto",
    borderRadius: "18px 18px 0 0",
    padding: "18px 18px 24px",
    animation: "fadeIn 0.2s ease-out",
  },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  modalTitle: { fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, margin: 0 },
  modalClose: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: "none",
    background: "#EFEBE2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5C5648",
  },
  formGroup: { marginBottom: 14 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: "#6B6458", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 9,
    border: "1.5px solid #E8E3D8",
    fontSize: 14,
    background: "#FFFFFF",
    color: "#2B2620",
    outline: "none",
  },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: {
    border: "1.5px solid #E8E3D8",
    background: "#FFFFFF",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#5C5648",
  },
  chipActive: { background: "#2B2620", borderColor: "#2B2620", color: "#FAF8F4" },
  hintText: { fontSize: 11.5, color: "#9C9586", marginTop: 6 },
  errorText: { fontSize: 12.5, color: "#C1503E", marginBottom: 10, fontWeight: 600 },
  tiposList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 },
  tipoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#FFFFFF",
    border: "1px solid #EFEBE2",
    borderRadius: 10,
    padding: "8px 10px",
  },
  tipoSwatch: {
    width: 30,
    height: 28,
    borderRadius: 7,
    border: "1.5px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10.5,
    fontWeight: 800,
    flexShrink: 0,
  },
  tipoNome: { fontSize: 13.5, fontWeight: 600, color: "#2B2620", flex: 1 },
  tipoFixoBadge: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#9C9586",
    background: "#F4F1EA",
    borderRadius: 999,
    padding: "2px 7px",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  tipoActions: { display: "flex", gap: 2, flexShrink: 0 },
  addTipoBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    border: "1.5px dashed #D8D2C5",
    background: "transparent",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 13,
    fontWeight: 700,
    color: "#5C5648",
    marginBottom: 14,
  },
  colorRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "2px solid transparent",
    padding: 0,
  },
  colorSwatchActive: {
    border: "2px solid #2B2620",
    boxShadow: "0 0 0 2px #FAF8F4",
    transform: "scale(1.1)",
  },
  modalActions: { display: "flex", gap: 8, marginTop: 6 },
  btnGhost: {
    flex: 1,
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #E8E3D8",
    background: "#FFFFFF",
    color: "#5C5648",
    fontSize: 13.5,
    fontWeight: 700,
  },
  btnPrimary: {
    flex: 2,
    padding: "11px 14px",
    borderRadius: 10,
    border: "none",
    background: "#2B2620",
    color: "#FAF8F4",
    fontSize: 13.5,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnDanger: {
    flex: 2,
    padding: "11px 14px",
    borderRadius: 10,
    border: "none",
    background: "#C1503E",
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: 700,
  },
  confirmCard: {
    background: "#FFFFFF",
    width: "100%",
    maxWidth: 420,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    animation: "fadeIn 0.2s ease-out",
  },
  confirmTitle: { fontSize: 15, fontWeight: 800, margin: "0 0 6px" },
  confirmText: { fontSize: 13, color: "#6B6458", margin: "0 0 16px", lineHeight: 1.5 },
  confirmActions: { display: "flex", gap: 8 },
  toast: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#2B2620",
    color: "#FAF8F4",
    padding: "10px 18px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    zIndex: 60,
    animation: "fadeIn 0.2s ease-out",
  },
  savingDot: {
    position: "fixed",
    bottom: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#D97757",
    animation: "pulse 1s ease-in-out infinite",
  },
};
