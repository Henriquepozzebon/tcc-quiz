import { useState, useEffect } from "react";
import Timer from "./components/Timer";


// Certifique-se de que o API_URL está correto
const API_URL = "https://tcc-quiz.onrender.com"; // Backend publicado

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tela, setTela] = useState("auth"); // "auth" ou "game"
  const [aba, setAba] = useState("inicio"); // abas do menu lateral
  const [statusApi, setStatusApi] = useState("Verificando API...");
  const [usuario, setUsuario] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [showParabens, setShowParabens] = useState(false);
  const [nome, setNome] = useState("Jogador");
  const [avatarColor, setAvatarColor] = useState("#a3a3ff");
  const [descricao, setDescricao] = useState(""); // Troque bio por descricao
  const [tema, setTema] = useState("claro"); // Novo estado para tema
  const [isLoading, setIsLoading] = useState(false); // Novo estado para controle de loading
  const [notas, setNotas] = useState([]);
  const [buscaNota, setBuscaNota] = useState("");
  const [tagAtiva, setTagAtiva] = useState("Todas");
  const [showFormNota, setShowFormNota] = useState(false);
  const [notaEmEdicao, setNotaEmEdicao] = useState(null);
  const [formNotaTitulo, setFormNotaTitulo] = useState("");
  const [formNotaConteudo, setFormNotaConteudo] = useState("");
  const [formNotaTags, setFormNotaTags] = useState("");

  // Definição dinâmica das cores do tema
  const pastel = tema === "escuro"
    ? {
        fundo: "#23272f",
        botao: "#3a8fd6",
        correto: "#6fdc7a",
        erro: "#ff8c9b",
        destaque: "#23272f",
        branco: "#2d323c", // <-- card mais claro no escuro
        texto: "#fff",
        textoTabela: "#fff",
        textoSecundario: "#e3e9f7",
        inputBg: "#23272f", // novo: fundo input escuro
        inputBorder: "#555", // novo: borda input escuro
        inputText: "#fff",   // novo: texto input escuro
        botaoText: "#fff",   // novo: texto botão escuro
        botaoBgHover: "#4fa3ff", // novo: hover botão escuro
        cardShadow: "0 2px 12px rgba(0,0,0,0.25)", // novo: sombra mais forte
      }
    : {
        fundo: "#f4f5fb", // fundo geral mais claro, próximo ao layout de referência
        botao: "#4f9cff", // azul mais forte para botões e destaques
        correto: "#30c985", // verde mais vivo para acertos
        erro: "#ff5b7d", // vermelho/rosa mais intenso para erros
        destaque: "#eef2ff", // faixas e destaques sutis
        branco: "#ffffff",
        texto: "#1a1a1a",
        textoTabela: "#1a1a1a",
        textoSecundario: "#888888",
        inputBg: "#f9fbff",
        inputBorder: "#d0d7f2",
        inputText: "#222222",
        botaoText: "#ffffff",
        botaoBgHover: "#6fb2ff",
        cardShadow: "0 18px 45px rgba(15,23,42,0.10)",
      };

  useEffect(() => {
    // Verifique se a conexão com o backend está funcionando
    fetch(`${API_URL}/`)
      .then((res) => res.text())
      .then((data) => {
        console.log("Conexão com o backend:", data); // Deve exibir "API do Quiz funcionando!"
        setStatusApi("API conectada!");
      })
      .catch((err) => {
        console.error("Erro ao conectar ao backend:", err);
        setStatusApi("Erro ao conectar com a API");
      });
  }, []);

  // Decide cor da mensagem
  let mensagemColor = pastel.texto;
  if (mensagem) {
    if (mensagem.toLowerCase().includes("erro")) mensagemColor = pastel.erro;
    else if (
      mensagem.toLowerCase().includes("cadastro") ||
      mensagem.toLowerCase().includes("login")
    )
      mensagemColor = pastel.correto;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setIsLoading(true);

    const endpoint = isLogin ? "/login" : "/register";
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email?.trim(), senha }),
      });

      // debug: log do status
      console.log("Resposta fetch", res.status, res.statusText);

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Erro ao parsear JSON:", jsonErr);
        setMensagem(`Erro: resposta inválida do servidor (status ${res.status})`);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        // mostra mensagem do backend se houver
        const msg = data?.mensagem || `Erro ${res.status}: ${res.statusText}`;
        setMensagem(msg);
        console.warn("Login/register falhou:", msg);
        setIsLoading(false);
        return;
      }

      // sucesso
      setMensagem(data.mensagem || "Operação realizada com sucesso");
      console.log("Resposta do backend:", data);
      if (isLogin && data.sucesso) {
        setUsuario(data.usuario);
        // inicializar estados do game se fornecer
        setPontuacao?.(data.usuario?.pontuacao || 0);
        setAcertos?.(data.usuario?.acertos || 0);
        setErros?.(data.usuario?.erros || 0);
        setNivel?.(data.usuario?.nivel || 1);
        setXpAtual?.(data.usuario?.xpAtual || 0);
        setXpMax?.(data.usuario?.xpMax || 100);
        setTimeout(() => setTela("game"), 600);
      } else if (!isLogin && data.sucesso) {
        // após cadastro bem-sucedido, ir para login ou game conforme sua lógica
        setTimeout(() => setIsLogin(true), 600);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setMensagem("Erro ao conectar com o backend. Verifique se o servidor está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  // Abas simuladas para o menu lateral (removido Configurações)
  const abas = [
    { id: "inicio", nome: "Início", icone: "🏠" },
    { id: "perfil", nome: "Perfil", icone: "👤" },
    { id: "desempenho", nome: "Desempenho", icone: "📊" },
    { id: "questoes", nome: "Questões", icone: "❓" },
    { id: "simulados", nome: "Simulados", icone: "📝" },
    { id: "anotacoes", nome: "Anotações", icone: "🗒️" },
    { id: "ranking", nome: "Ranking", icone: "🏆" },
    { id: "sair", nome: "Sair", icone: "↩" },
  ];

  // Questões de exemplo
  const questoesExemplo = [
    {
      _id: "1",
      enunciado: "Qual é o resultado de 2 + 2?",
      alternativas: [
        { letra: "A", texto: "3" },
        { letra: "B", texto: "4" },
        { letra: "C", texto: "5" },
        { letra: "D", texto: "6" },
        { letra: "E", texto: "2" },
      ],
      correta: "B",
      materia: "Matemática",
      ano: 2026,
      banca: "Exemplo",
      prova: "Simulado ENEM",
    },
    {
      _id: "2",
      enunciado: "Quanto é 5 x 6?",
      alternativas: [
        { letra: "A", texto: "30" },
        { letra: "B", texto: "35" },
        { letra: "C", texto: "25" },
        { letra: "D", texto: "11" },
        { letra: "E", texto: "56" },
      ],
      correta: "A",
      materia: "Matemática",
      ano: 2025,
      banca: "Exemplo",
      prova: "Simulado ENEM",
    },
    {
      _id: "3",
      enunciado: "Qual é a raiz quadrada de 81?",
      alternativas: [
        { letra: "A", texto: "7" },
        { letra: "B", texto: "8" },
        { letra: "C", texto: "9" },
        { letra: "D", texto: "10" },
        { letra: "E", texto: "6" },
      ],
      correta: "C",
      materia: "Linguagens", // <-- Troque para Linguagens
      ano: 2024,
      banca: "Exemplo",
      prova: "Simulado ENEM",
    },
    {
      _id: "4",
      enunciado: "Se x = 3, quanto vale 2x + 4?",
      alternativas: [
        { letra: "A", texto: "10" },
        { letra: "B", texto: "9" },
        { letra: "C", texto: "8" },
        { letra: "D", texto: "7" },
        { letra: "E", texto: "6" },
      ],
      correta: "A",
      materia: "Matemática",
      ano: 2023,
      banca: "Exemplo",
      prova: "Simulado ENEM",
    },
    {
      _id: "5",
      enunciado: "Qual é o valor de 12 ÷ 4?",
      alternativas: [
        { letra: "A", texto: "2" },
        { letra: "B", texto: "3" },
        { letra: "C", texto: "4" },
        { letra: "D", texto: "6" },
        { letra: "E", texto: "8" },
      ],
      correta: "B",
      materia: "Matemática",
      ano: 2021,
      banca: "Exemplo",
      prova: "Simulado ENEM",
    },
  ];

  // Estado global para progresso do usuário
  const [resposta, setResposta] = useState(null);
  const [mostrarGabarito, setMostrarGabarito] = useState(false);
  const [indiceQuestao, setIndiceQuestao] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [xpAtual, setXpAtual] = useState(0);
  const [xpMax, setXpMax] = useState(100);
  const [copiadoEnunciado, setCopiadoEnunciado] = useState(false);

  // Timer: reinicia a cada nova questão
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    if (aba === "questoes") setTimerKey((k) => k + 1);
  }, [indiceQuestao, aba]);

  // Função chamada quando o tempo acaba
  function handleTimeUp() {
    if (!resposta) {
      setErros((e) => e + 1);
      setResposta("__TIMEOUT__");
      // Removido o setTimeout(proximaQuestao, 800);
      // Agora só avança ao clicar em "Próxima Questão"
    }
  }

  // Resetar seleção ao trocar para aba "questoes"
  useEffect(() => {
    if (aba !== "questoes") {
      setResposta(null);
      setMostrarGabarito(false);
      setIndiceQuestao(0);
    }
  }, [aba]);

  // Função para passar para próxima questão
  function proximaQuestao() {
    setResposta(null);
    setMostrarGabarito(false);
    setIndiceQuestao((i) => (i + 1) % questoesFiltradas.length);
  }

  // Estado para acertos/erros por área (agora inicializa do backend se existir)
  const [statsPorArea, setStatsPorArea] = useState({});

  // Atualiza gráficos e progresso ao responder
  async function responderQuestao(letra) {
    if (resposta) return;
    setResposta(letra);
    const questao = questoesFiltradas[indiceQuestao];
    let novoXp = xpAtual;
    let novaPontuacao = pontuacao;
    let novoAcertos = acertos;
    let novoErros = erros;
    let ganhoXp = 30 * nivel;
    let perdaXp = 10 * nivel;
    let novoNivel = nivel;
    let novoXpMax = xpMax;
    let passouNivel = false;

    // Descobre área/matéria
    const area = (questao.assunto || questao.materia || "").toLowerCase().trim();

    // Atualiza stats por área
    let novoStatsPorArea;
    setStatsPorArea((prev) => {
      const atual = prev[area] || { acertos: 0, erros: 0 };
      let novo;
      if (
        letra ===
        (typeof questao.correta === "number"
          ? questao.alternativas[questao.correta]?.letra
          : questao.correta)
      ) {
        novo = { ...prev, [area]: { acertos: atual.acertos + 1, erros: atual.erros } };
      } else {
        novo = { ...prev, [area]: { acertos: atual.acertos, erros: atual.erros + 1 } };
      }
      novoStatsPorArea = novo;
      return novo;
    });

    // Atualiza stats globais
    if (letra === (typeof questao.correta === "number"
      ? questao.alternativas[questao.correta]?.letra
      : questao.correta)) {
      novoAcertos += 1;
      novaPontuacao += 30;
      novoXp += ganhoXp;
    } else {
      novoErros += 1;
      novaPontuacao = Math.max(0, novaPontuacao - 10);
      novoXp = Math.max(0, novoXp - perdaXp);
    }

    while (novoXp >= novoXpMax) {
      novoNivel += 1;
      novoXp -= novoXpMax;
      novoXpMax = Math.round(novoXpMax * 1.5);
      passouNivel = true;
    }

    setPontuacao(novaPontuacao);
    setAcertos(novoAcertos);
    setErros(novoErros);
    setNivel(novoNivel);
    setXpAtual(novoXp);
    setXpMax(novoXpMax);

    if (passouNivel) {
      setShowParabens(true);
      setTimeout(() => setShowParabens(false), 2500);
    }

    // Atualiza backend (agora envia statsPorArea também)
    atualizarStatsBackend({
      pontuacao: novaPontuacao,
      acertos: novoAcertos,
      erros: novoErros,
      nivel: novoNivel,
      xpAtual: novoXp,
      xpMax: novoXpMax,
      statsPorArea: novoStatsPorArea ?? statsPorArea,
    });
  }

  // Atualiza backend ao responder questão
  async function atualizarStatsBackend(novo) {
    if (!usuario) return;
    await fetch(`${API_URL}/update-stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: usuario.email,
        pontuacao: novo.pontuacao,
        acertos: novo.acertos,
        erros: novo.erros,
        nivel: novo.nivel,
        xpAtual: novo.xpAtual,
        xpMax: novo.xpMax,
        statsPorArea: novo.statsPorArea, // envia statsPorArea
      }),
    });
  }

  // Ranking: busca do backend ao abrir aba ranking
  useEffect(() => {
    if (aba === "ranking") {
      fetch(`${API_URL}/ranking`)
        .then((res) => res.json())
        .then((data) => setRanking(data.ranking || []));
    }
  }, [aba]);

  // Carregar anotações separadas por usuário (localStorage)
  useEffect(() => {
    if (!usuario?.email) {
      setNotas([]);
      return;
    }
    try {
      const bruto = localStorage.getItem("quiz_anotacoes_by_user");
      if (!bruto) {
        setNotas([]);
        return;
      }
      const mapa = JSON.parse(bruto) || {};
      const doUsuario = Array.isArray(mapa[usuario.email]) ? mapa[usuario.email] : [];
      setNotas(doUsuario);
    } catch (e) {
      console.error("Erro ao carregar anotações do localStorage", e);
      setNotas([]);
    }
  }, [usuario]);

  const atualizarNotas = (novasNotas) => {
    setNotas(novasNotas);
    if (!usuario?.email) return;
    try {
      const chave = "quiz_anotacoes_by_user";
      const bruto = localStorage.getItem(chave);
      const mapa = bruto ? JSON.parse(bruto) || {} : {};
      mapa[usuario.email] = novasNotas;
      localStorage.setItem(chave, JSON.stringify(mapa));
    } catch (e) {
      console.error("Erro ao salvar anotações no localStorage", e);
    }
  };

  // Carregar nome, cor, bio, tema e statsPorArea do backend ao logar
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || "Jogador");
      setAvatarColor(usuario.avatarColor || "#a3a3ff");
      setDescricao(usuario.descricao || "");
      setTema(usuario.tema || "claro");
      setPontuacao(usuario.pontuacao || 0);
      setAcertos(usuario.acertos || 0);
      setErros(usuario.erros || 0);
      setNivel(usuario.nivel || 1);
      setXpAtual(usuario.xpAtual || 0);
      setXpMax(usuario.xpMax || 100);
      setStatsPorArea(usuario.statsPorArea && typeof usuario.statsPorArea === "object" ? usuario.statsPorArea : {});
    }
  }, [usuario]);

  // Carrega questões do backend ao abrir aba "questoes" ou "simulados"
  const [questoesBanco, setQuestoesBanco] = useState([]);

  useEffect(() => {
    if (aba === "questoes" || aba === "simulados") {
      fetch(`${API_URL}/questions?limit=100`)
        .then((res) => res.json())
        .then((data) => setQuestoesBanco(data.questions || []));
    }
  }, [aba]);

  // Lista de opções únicas para cada filtro (agora do banco)
  // Normaliza para minúsculo e remove duplicados
  const materias = [
    ...new Set(
      (questoesBanco || [])
        .map((q) => (q.assunto || q.materia || "").toLowerCase().trim())
        .filter((m) => m)
    ),
  ];

  // DEBUG: log matérias únicas do banco
  console.log("Materias únicas:", materias);

  // Função para exibir matéria com primeira letra maiúscula
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Estado para seleção dos valores dos filtros
  const [filtroAno, setFiltroAno] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");

  // Gere lista de anos únicos das questões do banco ou exemplo
  const anos = [
    ...new Set(
      ((questoesBanco && questoesBanco.length > 0) ? questoesBanco : questoesExemplo)
        .map(q => q.ano)
        .filter(ano => ano)
    )
  ].sort((a, b) => b - a); // ordena decrescente

  // Filtra as questões do banco conforme filtros ativos
  const questoesFiltradas = ((questoesBanco && questoesBanco.length > 0) ? questoesBanco : questoesExemplo).filter((q) => {
    // Filtro por ano
    if (filtroAno !== "" && String(q.ano) !== filtroAno) return false;

    // Filtro por matéria/assunto
    const materia = (q.assunto || q.materia || "").toLowerCase().trim();
    const filtroMateriaLower = (filtroMateria || "").toLowerCase().trim();
    if (filtroMateriaLower !== "" && filtroMateriaLower !== "todas") {
      if (materia !== filtroMateriaLower) return false;
    }
    return true;
  });

  // Atualiza índice da questão se filtro mudar (mantém dentro do array filtrado)
  useEffect(() => {
    if (indiceQuestao >= questoesFiltradas.length) {
      setIndiceQuestao(0);
    }
  }, [questoesFiltradas.length]);

  // Conteúdo das abas
  function renderAba() {
    if (aba === "inicio") {
      const totalQuestoes = acertos + erros;
      // Corrige: só mostra % se total > 0, senão mostra 0%
      const probAcerto =
        totalQuestoes === 0 ? 0 : Math.round((acertos / totalQuestoes) * 100);
      const probErro =
        totalQuestoes === 0 ? 0 : 100 - probAcerto;
      const nivelPercent = Math.round((xpAtual / xpMax) * 100);

      // Descobre a área/matéria com mais acertos
      let destaqueArea = null;
      let destaqueAcertos = 0;
      Object.entries(statsPorArea).forEach(([area, stat]) => {
        if (stat.acertos > destaqueAcertos) {
          destaqueArea = area;
          destaqueAcertos = stat.acertos;
        }
      });

      // Frase de destaque
      let fraseDestaque = "";
      if (destaqueArea && destaqueAcertos > 0) {
        fraseDestaque = `Gênio de ${capitalize(destaqueArea)} `;
      }

      // Estilo dos cards de estatísticas (linha inferior, estilo dashboard)
      const cardEstatisticaStyle = {
        borderRadius: 16,
        padding: "28px 32px",
        minWidth: 0,
        width: "100%",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 130,
        transition: "background 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        boxSizing: "border-box",
      };

      return (
        <div
          style={{
            padding: "40px 0 32px 0",
            minHeight: "100vh",
            background: pastel.fundo,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Card de perfil */}
          <div
            style={{
              width: "92vw",
              maxWidth: 1280,
              background: pastel.branco,
              borderRadius: 24,
              boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
              padding: "28px 32px 26px 32px",
              marginBottom: 40, // aumente o espaçamento entre os quadros
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 28 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background: avatarColor || "linear-gradient(140deg, #4b2be8 0%, #8b5cf6 40%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 36,
                  color: "#ffffff",
                  marginRight: 24,
                  boxShadow: "0 8px 22px rgba(15,23,42,0.35)",
                }}
              >
                {nome?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                {/* Nome editável */}
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 28,
                    color: pastel.texto,
                    marginBottom: 2,
                    letterSpacing: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <input
                    type="text"
                    value={nome}
                    maxLength={20}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={() => atualizarPerfilBackend(nome, avatarColor, descricao, tema)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        atualizarPerfilBackend(nome, avatarColor, descricao, tema);
                        e.target.blur();
                      }
                    }}
                    style={{
                      fontWeight: "bold",
                      fontSize: 28,
                      color: pastel.texto,
                      background: "transparent",
                      border: "none",
                      borderRadius: 4,
                      padding: 0,
                      outline: "none",
                      width: "auto",
                      minWidth: 60,
                      maxWidth: 220,
                      marginRight: 6,
                      transition: "border 0.2s",
                    }}
                  />
                </div>
                {/* Adiciona a descrição abaixo do nome */}
                {descricao && (
                  <div
                    style={{
                      fontSize: 16,
                      color: pastel.texto,
                      marginBottom: 8,
                      wordBreak: "break-word",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {descricao}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: "#8c8fa5",
                      fontWeight: 500,
                    }}
                  >
                    Nível {nivel}
                  </span>
                </div>
                {/* Barra de nível mais fina, ocupando toda largura do card */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    marginTop: 4,
                    marginBottom: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* Barra de progresso do nível */}
                  <div
                    style={{
                      flex: 1,
                      background: "#eef1ff",
                      borderRadius: 999,
                      height: 10,
                      position: "relative",
                      boxShadow: "none",
                      border: "none",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: `${nivelPercent}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, #4b2be8 0%, #44c2ff 45%, #25e0c1 100%)",
                        borderRadius: 999,
                        transition: "width 0.35s ease-out",
                        boxShadow:
                          nivelPercent > 0
                            ? "0 2px 8px rgba(144,238,144,0.12)"
                            : "none",
                      }}
                    />
                  </div>
                  {/* XP numérico ao lado direito da barra, como no layout de referência */}
                  <span
                    style={{
                      minWidth: 90,
                      textAlign: "right",
                      color: "#8c8fa5",
                      fontWeight: 500,
                      fontSize: 13,
                    }}
                  >
                    {xpAtual}/{xpMax} XP
                  </span>
                </div>
              </div>
            </div>
            {/* Frase de destaque com estrelinha, abaixo do nome, alinhada à esquerda */}
            {fraseDestaque && (
              <div
                style={{
                  marginTop: 16,
                  fontSize: 14,
                  color: "#f2a63a",
                  fontWeight: 500,
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "default",
                }}
                title={`Você se destaca em ${capitalize(destaqueArea)}!`}
              >
                <span>★</span>
                <span>{fraseDestaque}</span>
              </div>
            )}
          </div>
          {/* Mensagem de boas-vindas - quadro branco com borda azul pastel */}
          <div
            style={{
              width: "92vw",
              maxWidth: 1280,
              background: pastel.branco,
              borderRadius: 16,
              boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
              border: "none",
              padding: "24px 32px 26px 32px",
              marginBottom: 40, // aumente o espaçamento entre os quadros
              textAlign: "center",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          >
            {/* Barra gradiente dentro do card, como no layout de referência */}
            <div
              style={{
                width: "100%",
                height: 18,
                borderRadius: 999,
                marginBottom: 18,
                background:
                  "linear-gradient(90deg, #4b2be8 0%, #44c2ff 45%, #25e0c1 100%)",
              }}
            />
            <h1
              style={{
                fontWeight: "bold",
                fontSize: 26,
                margin: 0,
                letterSpacing: 0.5,
                background:
                  "linear-gradient(90deg, #4b2be8 0%, #22c55e 50%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Bem-vindo ao QuizENEM!
            </h1>
            <div style={{
              fontSize: 20,
              color: pastel.texto,
              marginTop: 12,
              marginBottom: 0,
              fontWeight: 500,
            }}>
              Seu banco de questões do ENEM.
            </div>
            <div
              style={{
                fontSize: 18,
                marginTop: 4,
                color: pastel.correto,
                fontWeight: 600,
              }}
            >
              Bons estudos e boa sorte!
            </div>
          </div>
          {/* Cards de estatísticas em um card branco alinhado com os demais */}
          <div
            style={{
              width: "92vw",
              maxWidth: 1280,
              background: pastel.branco,
              borderRadius: 16,
              boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
              padding: "24px 32px 26px 32px",
              marginBottom: 32,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gridTemplateRows: "1fr",
                gap: 28,
                minHeight: 160,
                alignItems: "stretch",
                justifyItems: "stretch",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
            {/* Pontuação Total */}
            <div
              style={{
                ...cardEstatisticaStyle,
                background: pastel.botao,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#a3d8fa";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = pastel.botao;
                e.currentTarget.style.boxShadow = cardEstatisticaStyle.boxShadow;
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e5f6ff",
                  marginBottom: 6,
                }}
              >
                Pontuação Total
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: 6,
                }}
              >
                {pontuacao}
              </div>
              <div
                style={{
                  marginTop: 4,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 18,
                }}
              >
                ⚡
              </div>
            </div>
            {/* Acertos */}
            <div
              style={{
                ...cardEstatisticaStyle,
                background: pastel.correto,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#5fcf6a";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = pastel.correto;
                e.currentTarget.style.boxShadow = cardEstatisticaStyle.boxShadow;
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e5ffe9",
                  marginBottom: 6,
                }}
              >
                Acertos
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: 6,
                }}
              >
                {probAcerto}%
              </div>
              <div
                style={{
                  marginTop: 4,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 18,
                }}
              >
                🎯
              </div>
            </div>
            {/* Erros */}
            <div
              style={{
                ...cardEstatisticaStyle,
                background: pastel.erro,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#ffb6c1";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = pastel.erro;
                e.currentTarget.style.boxShadow = cardEstatisticaStyle.boxShadow;
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ffe5ea",
                  marginBottom: 6,
                }}
              >
                Erros
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: 6,
                }}
              >
                {probErro}%
              </div>
              <div
                style={{
                  marginTop: 4,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 18,
                }}
              >
                ✖
              </div>
            </div>
              </div>
          </div>
        </div>
      );
    }
    if (aba === "anotacoes") {
      const coresNotas = [
        "#eef2ff",
        "#fef9c3",
        "#dcfce7",
        "#e0f2fe",
        "#fee2e2",
      ];

      const todasTags = Array.from(
        new Set(
          notas.flatMap((n) => (Array.isArray(n.tags) ? n.tags : [])).filter(
            (t) => t && typeof t === "string"
          )
        )
      );

      const notasOrdenadas = [...notas].sort((a, b) => {
        if (a.fixada && !b.fixada) return -1;
        if (!a.fixada && b.fixada) return 1;
        return (b.criadaEm || 0) - (a.criadaEm || 0);
      });

      const notasFiltradas = notasOrdenadas.filter((n) => {
        const texto = `${n.titulo || ""} ${n.conteudo || ""}`.toLowerCase();
        const buscaOk = !buscaNota
          ? true
          : texto.includes(buscaNota.toLowerCase());
        const tagOk =
          tagAtiva === "Todas" ||
          (Array.isArray(n.tags) && n.tags.includes(tagAtiva));
        return buscaOk && tagOk;
      });

      const abrirFormNovaNota = () => {
        setNotaEmEdicao(null);
        setFormNotaTitulo("");
        setFormNotaConteudo("");
        setFormNotaTags("");
        setShowFormNota(true);
      };

      const abrirFormEditarNota = (nota) => {
        setNotaEmEdicao(nota);
        setFormNotaTitulo(nota.titulo || "");
        setFormNotaConteudo(nota.conteudo || "");
        setFormNotaTags((nota.tags || []).join(", "));
        setShowFormNota(true);
      };

      const salvarNotaFormulario = () => {
        if (!formNotaTitulo.trim()) return;
        const tags = formNotaTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        if (notaEmEdicao) {
          const atualizadas = notas.map((n) =>
            n.id === notaEmEdicao.id
              ? { ...n, titulo: formNotaTitulo, conteudo: formNotaConteudo, tags }
              : n
          );
          atualizarNotas(atualizadas);
        } else {
          const nova = {
            id: Date.now(),
            titulo: formNotaTitulo,
            conteudo: formNotaConteudo,
            tags,
            fixada: false,
            cor: coresNotas[Math.floor(Math.random() * coresNotas.length)],
            criadaEm: Date.now(),
          };
          atualizarNotas([...notas, nova]);
        }

        setShowFormNota(false);
        setNotaEmEdicao(null);
        setFormNotaTitulo("");
        setFormNotaConteudo("");
        setFormNotaTags("");
      };

      const excluirNota = (id) => {
        if (!window.confirm("Excluir esta anotação?")) return;
        atualizarNotas(notas.filter((n) => n.id !== id));
      };

      const alternarFixada = (nota) => {
        const atualizadas = notas.map((n) =>
          n.id === nota.id ? { ...n, fixada: !n.fixada } : n
        );
        atualizarNotas(atualizadas);
      };

      const formatarData = (ts) => {
        if (!ts) return "";
        const d = new Date(ts);
        return d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      };

      return (
        <div
          style={{
            padding: "24px 40px 32px 40px",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  color: pastel.texto,
                }}
              >
                Anotações
              </h1>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 15,
                  color: pastel.textoSecundario,
                }}
              >
                Organize seus resumos e fórmulas.
              </div>
            </div>
            <button
              onClick={abrirFormNovaNota}
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5, #6366f1)",
                color: "#ffffff",
                border: "none",
                borderRadius: 999,
                padding: "10px 20px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(15,23,42,0.35)",
              }}
            >
              + Nova Anotação
            </button>
          </div>

          {/* Formulário de nova/edição de anotação */}
          {showFormNota && (
            <div
              style={{
                marginBottom: 18,
                maxWidth: 900,
                background: pastel.branco,
                borderRadius: 16,
                boxShadow: "0 10px 24px rgba(15,23,42,0.12)",
                padding: "18px 20px 16px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: pastel.texto,
                  }}
                >
                  {notaEmEdicao ? "Editar anotação" : "Nova anotação"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Título"
                  value={formNotaTitulo}
                  onChange={(e) => setFormNotaTitulo(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${pastel.inputBorder}`,
                    background: pastel.inputBg,
                    color: pastel.inputText,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <textarea
                  rows={3}
                  placeholder="Conteúdo da anotação"
                  value={formNotaConteudo}
                  onChange={(e) => setFormNotaConteudo(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${pastel.inputBorder}`,
                    background: pastel.inputBg,
                    color: pastel.inputText,
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
                <input
                  type="text"
                  placeholder="Tags separadas por vírgula (ex: Matemática,Física)"
                  value={formNotaTags}
                  onChange={(e) => setFormNotaTags(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${pastel.inputBorder}`,
                    background: pastel.inputBg,
                    color: pastel.inputText,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <button
                  onClick={() => {
                    setShowFormNota(false);
                    setNotaEmEdicao(null);
                  }}
                  style={{
                    borderRadius: 999,
                    padding: "6px 14px",
                    border: `1px solid ${pastel.inputBorder}`,
                    background: pastel.branco,
                    color: pastel.texto,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarNotaFormulario}
                  style={{
                    borderRadius: 999,
                    padding: "6px 18px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #4f46e5, #6366f1)",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Salvar
                </button>
              </div>
            </div>
          )}

          {/* Busca */}
          <div
            style={{
              marginBottom: 18,
              maxWidth: 520,
            }}
          >
            <input
              type="text"
              placeholder="Buscar anotações..."
              value={buscaNota}
              onChange={(e) => setBuscaNota(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 999,
                border: `1px solid ${pastel.inputBorder}`,
                background: pastel.inputBg,
                color: pastel.inputText,
                outline: "none",
                fontSize: 14,
              }}
            />
          </div>

          {/* Filtros por tag */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 22,
            }}
          >
            <button
              onClick={() => setTagAtiva("Todas")}
              style={{
                borderRadius: 999,
                padding: "6px 14px",
                border:
                  tagAtiva === "Todas"
                    ? "none"
                    : `1px solid ${pastel.inputBorder}`,
                backgroundColor:
                  tagAtiva === "Todas" ? pastel.botao : pastel.branco,
                color: tagAtiva === "Todas" ? "#fff" : pastel.texto,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Todas
            </button>
            {todasTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagAtiva(tag)}
                style={{
                  borderRadius: 999,
                  padding: "6px 14px",
                  border:
                    tagAtiva === tag
                      ? "none"
                      : `1px solid ${pastel.inputBorder}`,
                  backgroundColor:
                    tagAtiva === tag ? pastel.botao : pastel.branco,
                  color: tagAtiva === tag ? "#fff" : pastel.texto,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Grid de anotações */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            {notasFiltradas.map((nota) => (
              <div
                key={nota.id}
                style={{
                  background: nota.cor || "#ffffff",
                  borderRadius: 16,
                  padding: "18px 18px 14px 18px",
                  boxShadow: "0 8px 18px rgba(15,23,42,0.10)",
                  border: nota.fixada
                    ? `2px solid ${pastel.botao}`
                    : "1px solid rgba(148,163,184,0.35)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 170,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      color: pastel.texto,
                    }}
                  >
                    {nota.titulo}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 14,
                      color: "#6b7280",
                      cursor: "pointer",
                    }}
                  >
                    <span onClick={() => alternarFixada(nota)}>
                      {nota.fixada ? "📌" : "📍"}
                    </span>
                    <span onClick={() => abrirFormEditarNota(nota)}>✏️</span>
                    <span onClick={() => excluirNota(nota.id)}>🗑️</span>
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: pastel.texto,
                    whiteSpace: "pre-line",
                    marginBottom: 10,
                  }}
                >
                  {nota.conteudo}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 4,
                    fontSize: 12,
                    color: pastel.textoSecundario,
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(nota.tags || []).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: "rgba(15,23,42,0.04)",
                          fontSize: 11,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span>{formatarData(nota.criadaEm)}</span>
                </div>
              </div>
            ))}
            {notasFiltradas.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  color: pastel.textoSecundario,
                  fontSize: 14,
                  paddingTop: 40,
                }}
              >
                Nenhuma anotação ainda. Clique em "Nova Anotação" para começar.
              </div>
            )}
          </div>
        </div>
      );
    }
    if (aba === "desempenho") {
      // Função para calcular stats de uma área
      function statsArea(area) {
        if (area === "geral") {
          return {
            totalRespondidas: acertos + erros,
            acertos,
            erros,
            aproveitamento: (acertos + erros) > 0 ? Math.round((acertos / (acertos + erros)) * 100) : 0
          };
        }
        const stat = statsPorArea[area] || { acertos: 0, erros: 0 };
        const totalRespondidas = stat.acertos + stat.erros;
        return {
          totalRespondidas,
          acertos: stat.acertos,
          erros: stat.erros,
          aproveitamento: totalRespondidas > 0 ? Math.round((stat.acertos / totalRespondidas) * 100) : 0
        };
      }

      // Áreas
      const areas = [
        { id: "geral", nome: "Geral" },
        ...materias.map(m => ({ id: m, nome: capitalize(m) }))
      ];

      // Estilo dos cards de desempenho (igual ao layout de referência)
      const cardDesempenhoStyle = {
        borderRadius: 18,
        background: pastel.branco,
        boxShadow: "0 14px 30px rgba(15,23,42,0.10)",
        padding: "18px 26px 22px 26px",
        marginBottom: 18,
        width: "100%",
        maxWidth: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        boxSizing: "border-box",
      };

      // Barra customizada
      function BarraArea({ areaId, nome }) {
        const stats = statsArea(areaId);
        let corBarra = pastel.botao;
        if (areaId === "matematica") corBarra = pastel.correto;
        else if (areaId === "naturezas") corBarra = "#90ee90";
        else if (areaId === "linguagens") corBarra = "#7ec6f7";
        else if (areaId === "humanas") corBarra = "#87ceeb";

        return (
          <div style={cardDesempenhoStyle}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: pastel.texto,
                    marginBottom: 2,
                  }}
                >
                  {nome}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                  }}
                >
                  Aproveitamento: <b>{stats.aproveitamento}%</b>
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              >
                Respondidas: {stats.totalRespondidas}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: 10,
                borderRadius: 999,
                background: "#e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${stats.aproveitamento}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: corBarra,
                  transition: "width 0.35s ease-out",
                }}
              />
            </div>
          </div>
        );
      }

      return (
        <div
          style={{
            padding: "32px 0",
            minHeight: "100vh",
            background: pastel.fundo,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Barra gradiente no topo, como na tela de referência */}
          <div
            style={{
              width: "92vw",
              maxWidth: 1100,
              height: 18,
              borderRadius: 999,
              marginBottom: 28,
              background:
                "linear-gradient(90deg, #4b2be8 0%, #44c2ff 45%, #25e0c1 100%)",
            }}
          />

          {/* Lista de cards de desempenho */}
          <div
            style={{
              width: "92vw",
              maxWidth: 1100,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            {areas.map((area) => (
              <BarraArea key={area.id} areaId={area.id} nome={area.nome} />
            ))}
          </div>
        </div>
      );
    }
    if (aba === "questoes") {
      const questaoExemplo = questoesFiltradas[indiceQuestao];
      // Paleta principal usada na tela de questões
      const corAcerto = pastel.correto; // verde vivo
      const corErro = "#f472b6"; // rosa mais suave para bordas de erro
      const corPadrao = pastel.fundo;

      // Descobre o índice correto da alternativa
      const corretaIndex = questaoExemplo
        ? (typeof questaoExemplo.correta === "number"
            ? questaoExemplo.correta
            : questaoExemplo.alternativas.findIndex(
              (alt) => alt.letra === questaoExemplo.correta
            ))
        : -1;

      // Painel de filtros com visual parecido com o layout de referência
      const painelFiltros = (
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            marginBottom: 24,
            background: "#f9fafb",
            borderRadius: 999,
            padding: "10px 18px",
            boxSizing: "border-box",
            boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 16, marginRight: 8 }}>
            Filtros:
          </span>
          {/* Filtro Ano */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              borderRadius: 999,
              background: "#ffffff",
              border: "1.5px solid #c4b5fd",
            }}
          >
            <span style={{ fontSize: 14, color: "#4b5563", fontWeight: 500 }}>
              Ano
            </span>
            <select
              value={filtroAno}
              onChange={(e) => setFiltroAno(e.target.value)}
              disabled={!!resposta}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                fontWeight: 600,
                color: "#4f46e5",
                cursor: resposta ? "not-allowed" : "pointer",
                opacity: resposta ? 0.6 : 1,
              }}
            >
              <option value="">Todos</option>
              {anos.map((ano) => (
                <option key={ano} value={String(ano)}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
          {/* Filtro Matéria */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              borderRadius: 999,
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
            }}
          >
            <span style={{ fontSize: 14, color: "#4b5563", fontWeight: 500 }}>
              Matéria
            </span>
            <select
              value={filtroMateria}
              onChange={(e) => setFiltroMateria(e.target.value)}
              disabled={!!resposta}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                fontWeight: 600,
                color: "#4b5563",
                cursor: resposta ? "not-allowed" : "pointer",
                opacity: resposta ? 0.6 : 1,
              }}
            >
              <option value="todas">Todas</option>
              {materias.map((m) => (
                <option key={m} value={m}>
                  {capitalize(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
      );

      return (
        <div
          style={{
            padding: "32px 0",
            width: "100%",
            minHeight: "100vh",
            background: pastel.fundo,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: pastel.texto,
          }}
        >
          {/* Barra gradiente no topo, como no layout de referência */}
          <div
            style={{
              width: "96vw",
              maxWidth: 1180,
              height: 18,
              borderRadius: 999,
              marginBottom: 24,
              background:
                "linear-gradient(90deg, #4b2be8 0%, #44c2ff 45%, #25e0c1 100%)",
            }}
          />

          <div
            style={{
              width: "100%",
              maxWidth: 1180,
              minWidth: 320,
              padding: "24px 30px 28px 30px",
              marginBottom: 24,
              background: pastel.branco,
              borderRadius: 24,
              boxShadow: pastel.cardShadow,
              display: "flex",
              flexDirection: "column",
              // Garante que o conteúdo interno use toda a largura disponível
              alignItems: "stretch",
              boxSizing: "border-box",
            }}
          >
            {painelFiltros}
            {!questaoExemplo ? (
              <div style={{ padding: 48, textAlign: "center", color: pastel.texto }}>
                <h2>Nenhuma questão encontrada para esse filtro.</h2>
                <p>Selecione outro ano ou matéria, ou adicione questões no banco.</p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 16,
                    color: pastel.texto,
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Tag ENEM/Ano no estilo do layout de referência */}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "#eef2ff",
                        color: "#3730a3",
                        border: "1px solid #c4b5fd",
                      }}
                    >
                      ENEM/{questoesFiltradas[indiceQuestao]?.ano}
                    </span>
                    {/* Tag de matéria/assunto */}
                    {(questoesFiltradas[indiceQuestao]?.materia ||
                      questoesFiltradas[indiceQuestao]?.assunto) && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: "#f3f4f6",
                          color: "#374151",
                        }}
                      >
                        {capitalize(
                          (questoesFiltradas[indiceQuestao]?.materia ||
                            questoesFiltradas[indiceQuestao]?.assunto ||
                            ""
                          ).toLowerCase()
                        )}
                      </span>
                    )}
                  </div>
                  {/* Timer só aparece se ainda não respondeu */}
                  {!resposta && (
                    <Timer key={timerKey} duration={180} onTimeUp={handleTimeUp} />
                  )}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    marginBottom: 24,
                    fontWeight: 500,
                    lineHeight: 1.7,
                    color: pastel.texto,
                    width: "100%",
                    // Usa toda a largura disponível, sem quebrar em linhas curtas
                    whiteSpace: "normal",
                    // Disposição semelhante ao layout de referência
                    textAlign: "left",
                  }}
                >
                  {questoesFiltradas[indiceQuestao]?.enunciado}
                </div>
                <div style={{ width: "100%" }}>
                  {questoesFiltradas[indiceQuestao]?.alternativas.map((alt, idx) => {
                    let bg = pastel.branco;
                    let border = "1.5px solid #e5e7eb";
                    let color = pastel.texto;
                    let shadow = "0 2px 6px rgba(0,0,0,0.04)";
                    // Corrige a verificação de resposta correta
                    const corretaLetra = typeof questaoExemplo.correta === "number"
                      ? questaoExemplo.alternativas[questaoExemplo.correta]?.letra
                      : questaoExemplo.correta;

                    const isSelecionada = resposta && alt.letra === resposta;
                    const isCorreta = alt.letra === corretaLetra;

                    if (resposta) {
                      if (isSelecionada && isCorreta) {
                        // Correta selecionada: só borda verde forte
                        border = `2.5px solid ${corAcerto}`;
                        shadow = "0 3px 10px rgba(34,197,94,0.35)";
                      } else if (isSelecionada && !isCorreta) {
                        // Errada selecionada: só borda rosa/vermelha
                        border = `2.5px solid ${corErro}`;
                        shadow = "0 3px 10px rgba(248,113,113,0.35)";
                      } else if (mostrarGabarito && isCorreta) {
                        border = `2.5px solid ${corAcerto}`;
                        shadow = "0 3px 10px rgba(34,197,94,0.30)";
                      }
                    } else if (mostrarGabarito && isCorreta) {
                      border = `2.5px solid ${corAcerto}`;
                      shadow = "0 3px 10px rgba(34,197,94,0.30)";
                    }

                    const coresLetra = {
                      A: "#6366f1",
                      B: "#06b6d4",
                      C: "#22c55e",
                      D: "#f97316",
                      E: "#ef4444",
                    };
                    const corBadge = coresLetra[alt.letra] || pastel.botao;
                    return (
                      <div
                        key={alt.letra}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginBottom: 14,
                          background: bg,
                          borderRadius: 999,
                          padding: "12px 18px",
                          fontSize: 16,
                          cursor: resposta ? "default" : "pointer",
                          border,
                          boxShadow: shadow,
                          transition: "border 0.2s, box-shadow 0.2s",
                          color,
                          width: "100%",
                          minWidth: 320,
                          maxWidth: "100%",
                          boxSizing: "border-box",
                          wordBreak: "break-word",
                        }}
                        onClick={() => {
                          if (!resposta) responderQuestao(alt.letra);
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 34,
                            height: 34,
                            borderRadius: 12,
                            background: corBadge,
                            color: "#ffffff",
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: 18,
                            border: "2px solid #ffffff",
                            boxShadow: "0 2px 6px rgba(15,23,42,0.25)",
                            flexShrink: 0,
                            marginRight: 16,
                            boxSizing: "border-box",
                            letterSpacing: 1,
                          }}
                        >
                          {alt.letra}
                        </span>
                        <span
                          style={{
                            flex: 1,
                            wordBreak: "break-word",
                            whiteSpace: "pre-line",
                            color,
                          }}
                        >
                          {alt.texto}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {resposta && (
                  <div
                    style={{
                      marginTop: 24,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => setMostrarGabarito((v) => !v)}
                      style={{
                        // Botão primário roxo, combinando com a sidebar
                        background: "#4f46e5",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 8,
                        padding: "12px 28px",
                        fontWeight: "bold",
                        fontSize: 18,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(79,70,229,0.45)",
                        marginRight: 12,
                        marginBottom: 10,
                      }}
                    >
                      {mostrarGabarito ? "Ocultar Gabarito" : "Mostrar Gabarito"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const texto = questoesFiltradas[indiceQuestao]?.enunciado || "";
                        if (!texto) return;
                        try {
                          if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(texto);
                          } else {
                            const temp = document.createElement("textarea");
                            temp.value = texto;
                            document.body.appendChild(temp);
                            temp.select();
                            document.execCommand("copy");
                            document.body.removeChild(temp);
                          }
                          setCopiadoEnunciado(true);
                          setTimeout(() => setCopiadoEnunciado(false), 2000);
                        } catch (err) {
                          console.error("Falha ao copiar enunciado:", err);
                        }
                      }}
                      style={{
                        background: pastel.branco,
                        color: "#4b5563",
                        border: "1.5px solid #d1d5db",
                        borderRadius: 8,
                        padding: "10px 18px",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                        marginRight: 12,
                        marginBottom: 10,
                      }}
                      title="Copiar enunciado para a área de transferência"
                    >
                      Copiar enunciado
                    </button>
                    <button
                      onClick={() => {
                        proximaQuestao();
                      }}
                      style={{
                        // Botão secundário com contorno roxo
                        background: pastel.branco,
                        color: "#4f46e5",
                        border: "1.5px solid #4f46e5",
                        borderRadius: 8,
                        padding: "12px 28px",
                        fontWeight: "bold",
                        fontSize: 18,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        marginLeft: 0,
                        marginBottom: 10,
                      }}
                    >
                      Próxima Questão
                    </button>
                    {/* Corrige mensagem de resposta correta */}
                    {resposta === (typeof questaoExemplo.correta === "number"
                      ? questaoExemplo.alternativas[questaoExemplo.correta]?.letra
                      : questao.correta) ? (
                      <span
                        style={{
                          color: corAcerto,
                          fontWeight: "bold",
                          fontSize: 18,
                          marginLeft: 12,
                        }}
                      >
                        ✔ Resposta correta!
                      </span>
                    ) : (
                      <span
                        style={{
                          color: corErro,
                          fontWeight: "bold",
                          fontSize: 18,
                          marginLeft: 12,
                        }}
                      >
                        ✖ Resposta incorreta.
                      </span>
                    )}
                    {copiadoEnunciado && (
                      <span
                        style={{
                          marginLeft: 12,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#16a34a",
                        }}
                      >
                        Enunciado copiado!
                      </span>
                    )}
                  </div>
                )}
                {mostrarGabarito && (
                  <div
                    style={{
                      marginTop: 18,
                      fontSize: 18,
                      color: pastel.correto,
                      background: pastel.destaque,
                      borderRadius: 8,
                      padding: "10px 22px",
                      fontWeight: "bold",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    Gabarito: {typeof questaoExemplo.correta === "number"
                      ? questaoExemplo.alternativas[questaoExemplo.correta]?.letra
                      : questaoExemplo.correta}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
    if (aba === "ranking") {
      return (
        <div
          style={{
            padding: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1100,
            }}
          >
            {/* Ícone de troféu centralizado */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background:
                    tema === "escuro"
                      ? "linear-gradient(135deg, #facc15, #eab308)"
                      : "linear-gradient(135deg, #fde68a, #fbbf24)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.25)",
                }}
              >
                <span style={{ fontSize: 34 }}>🏆</span>
              </div>
            </div>

            {/* Card de ranking */}
            <div
              style={{
                background: pastel.branco,
                borderRadius: 16,
                boxShadow: pastel.cardShadow,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background:
                    tema === "escuro"
                      ? "linear-gradient(90deg, #1f2937, #111827)"
                      : "linear-gradient(90deg, #4f46e5, #6366f1)",
                  color: "#fff",
                  padding: "14px 28px",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 140px 100px",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <span style={{ textAlign: "center" }}>#</span>
                <span style={{ textAlign: "left" }}>Usuário</span>
                <span style={{ textAlign: "center" }}>Pontuação</span>
                <span style={{ textAlign: "center" }}>Nível</span>
              </div>

              <div>
                {ranking.map((u, i) => {
                  const pos = i + 1;
                  let rowBg = i % 2 === 0 ? pastel.fundo : pastel.branco;
                  let medalBg = "transparent";
                  let medalColor = pastel.textoTabela;

                  if (pos === 1) {
                    rowBg =
                      tema === "escuro"
                        ? "rgba(250, 204, 21, 0.15)"
                        : "rgba(250, 204, 21, 0.18)";
                    medalBg = "#facc15";
                    medalColor = "#1f2937";
                  } else if (pos === 2) {
                    rowBg =
                      tema === "escuro"
                        ? "rgba(148, 163, 184, 0.16)"
                        : "rgba(148, 163, 184, 0.16)";
                    medalBg = "#e5e7eb";
                    medalColor = "#111827";
                  } else if (pos === 3) {
                    rowBg =
                      tema === "escuro"
                        ? "rgba(248, 113, 113, 0.12)"
                        : "rgba(248, 113, 113, 0.14)";
                    medalBg = "#f97316";
                    medalColor = "#111827";
                  }

                  return (
                    <div
                      key={u.email}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr 140px 100px",
                        alignItems: "center",
                        padding: "12px 28px",
                        background: rowBg,
                        color: pastel.textoTabela,
                        borderBottom:
                          tema === "escuro"
                            ? "1px solid rgba(148, 163, 184, 0.12)"
                            : "1px solid rgba(148, 163, 184, 0.20)",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 999,
                            background: medalBg,
                            color: medalColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 13,
                            border:
                              medalBg === "transparent"
                                ? `1px solid ${tema === "escuro" ? "#4b5563" : "#d1d5db"}`
                                : "none",
                          }}
                        >
                          {pos}
                        </div>
                      </div>

                      <div
                        style={{
                          paddingRight: 12,
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={u.nome ? `${u.email} (${u.nome})` : u.email}
                      >
                        <span style={{ fontWeight: 500 }}>
                          {u.nome ? u.nome : "Jogador"}
                        </span>
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: 12,
                            color: pastel.textoSecundario,
                          }}
                        >
                          {u.email}
                        </span>
                      </div>

                      <div style={{ textAlign: "center", fontWeight: 600 }}>
                        {u.pontuacao ?? 0}
                      </div>

                      <div style={{ textAlign: "center" }}>{u.nivel ?? 1}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (aba === "sair") {
      setTela("auth");
      setAba("inicio");
      setEmail("");
      setSenha("");
      setMensagem("");
      setUsuario(null); // Limpa usuário ao sair
      localStorage.removeItem("quiz_usuario"); // Limpa localStorage ao sair
      return null;
    }
    if (aba === "perfil") {
      const coresAvatar = [
        "#8b5cf6",
        "#06b6d4",
        "#22c55e",
        "#facc15",
        "#f97316",
        "#ef4444",
        "#ec4899",
      ];

      return (
        <div
          style={{
            padding: "32px 0",
            minHeight: "100vh",
            background: pastel.fundo,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            color: pastel.texto,
          }}
        >
          <div
            style={{
              width: "92vw",
              maxWidth: 900,
              background: pastel.branco,
              borderRadius: 24,
              boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
              padding: "26px 40px 32px 40px",
              marginTop: 40,
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            {/* Barra gradiente no topo, como no layout de referência */}
            <div
              style={{
                width: "100%",
                height: 18,
                borderRadius: 999,
                marginBottom: 28,
                background:
                  "linear-gradient(90deg, #4b2be8 0%, #44c2ff 45%, #25e0c1 100%)",
              }}
            />
            {/* Avatar central */}
            <div style={{ marginBottom: 26 }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 26,
                  background: avatarColor || "linear-gradient(135deg, #4b2be8 0%, #8b5cf6 40%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 32,
                  color: "#ffffff",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.35)",
                }}
              >
                {nome?.[0]?.toUpperCase() || "?"}
              </div>
            </div>

            {/* Campo Nome */}
            <div style={{ width: "100%", marginBottom: 18 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#6b7280",
                  marginBottom: 6,
                }}
              >
                Nome
              </div>
              <input
                type="text"
                value={nome}
                maxLength={20}
                onChange={(e) => setNome(e.target.value)}
                onBlur={() => atualizarPerfilBackend(nome, avatarColor, descricao, tema)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    atualizarPerfilBackend(nome, avatarColor, descricao, tema);
                    e.target.blur();
                  }
                }}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  background: "#f3f4f6",
                  fontSize: 15,
                  color: pastel.texto,
                  outline: "none",
                }}
              />
            </div>

            {/* Cor do Avatar - bolinhas coloridas */}
            <div style={{ width: "100%", marginBottom: 18 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#6b7280",
                  marginBottom: 6,
                }}
              >
                Cor do Avatar
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {coresAvatar.map((cor) => {
                  const selecionada = avatarColor === cor;
                  return (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => {
                        setAvatarColor(cor);
                        atualizarPerfilBackend(nome, cor, descricao, tema);
                      }}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        border: selecionada
                          ? "3px solid #ffffff"
                          : "2px solid rgba(255,255,255,0.0)",
                        outline: selecionada
                          ? "2px solid #4f46e5"
                          : "2px solid transparent",
                        padding: 0,
                        background: cor,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Campo Descrição */}
            <div style={{ width: "100%", marginBottom: 22 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#6b7280",
                  marginBottom: 6,
                }}
              >
                Descrição
              </div>
              <textarea
                value={descricao}
                maxLength={200}
                onChange={(e) => setDescricao(e.target.value)}
                onBlur={() => atualizarPerfilBackend(nome, avatarColor, descricao, tema)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  background: "#f3f4f6",
                  fontSize: 15,
                  color: pastel.texto,
                  resize: "vertical",
                  outline: "none",
                }}
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            {/* Botão de salvar alterações, ocupando toda a largura */}
            <button
              type="button"
              onClick={() => atualizarPerfilBackend(nome, avatarColor, descricao, tema)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "12px 16px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(90deg, #4b2be8 0%, #6d28d9 50%, #4f46e5 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(79,70,229,0.45)",
              }}
            >
              Salvar Alterações
            </button>

            <div
              style={{
                color: "#6b7280",
                fontSize: 13,
                marginTop: 14,
                textAlign: "center",
              }}
            >
              Personalize seu nome, cor do avatar e descrição.
            </div>
          </div>
        </div>
      );
    }
    if (aba === "simulados") {
      return (
        <div
          style={{
            padding: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          <div
            style={{
              width: "92vw",
              maxWidth: 1100,
              background: pastel.branco,
              borderRadius: 18,
              boxShadow: pastel.cardShadow,
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Ícone em cartão */}
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 24,
                background:
                  tema === "escuro"
                    ? "linear-gradient(135deg, #4f46e5, #6366f1)"
                    : "linear-gradient(135deg, #4f46e5, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 30px rgba(15,23,42,0.35)",
                marginBottom: 28,
              }}
            >
              <span style={{ fontSize: 36, color: "#ffffff" }}>🎓</span>
            </div>

            {/* Barra em gradiente abaixo do ícone */}
            <div
              style={{
                width: 180,
                height: 14,
                borderRadius: 999,
                background:
                  tema === "escuro"
                    ? "linear-gradient(90deg, #4f46e5, #22d3ee)"
                    : "linear-gradient(90deg, #4f46e5, #22d3ee)",
                marginBottom: 26,
              }}
            />

            {/* Texto informativo */}
            <div
              style={{
                fontSize: 18,
                color: pastel.texto,
                textAlign: "center",
                maxWidth: 520,
              }}
            >
              Em breve você poderá realizar simulados completos do ENEM aqui.
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // Reset de senha (dev): pede nova senha via prompt e chama /reset-password
  const handleResetPassword = async () => {
    if (!email) {
      setMensagem("Preencha o e-mail para resetar a senha.");
      return;
    }
    const nova = window.prompt(
      "Digite a nova senha (apenas ambiente de desenvolvimento):",
      "senhaTeste123"
    );
    if (!nova) {
      setMensagem("Reset cancelado.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email?.trim(), newSenha: nova }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensagem(data?.mensagem || `Erro reset ${res.status}`);
      } else {
        setMensagem("Senha resetada com sucesso. Tente logar com a nova senha.");
        console.log("reset-password:", data);
      }
    } catch (err) {
      console.error("Erro handleResetPassword:", err);
      setMensagem("Erro ao conectar com o backend para reset.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebug = async () => {
    if (!email) {
      setMensagem("Preencha o e-mail para debug.");
      return;
    }
    setIsLoading(true);
    setMensagem("");
    try {
      const res = await fetch(`${API_URL}/debug-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email?.trim(), senha }), // senha opcional
      });
      const data = await res.json();
      console.log("debug-user:", data);
      if (!res.ok) {
        setMensagem(data?.mensagem || `Erro debug ${res.status}`);
      } else {
        const parts = [
          `exists: ${data.exists}`,
          `isHashed: ${data.isHashed}`,
          `hashLength: ${data.hashLength}`,
        ];
        if (
          typeof data.compareResult !== "undefined" &&
          data.compareResult !== null
        ) {
          parts.push(`compare: ${data.compareResult}`);
        }
        setMensagem(parts.join(" | "));
      }
    } catch (err) {
      console.error("Erro handleDebug:", err);
      setMensagem("Erro ao conectar com o backend para debug.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar perfil no backend
  async function atualizarPerfilBackend(nome, avatarColor, descricao, tema) {
    if (!usuario) return;
    try {
      await fetch(`${API_URL}/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuario.email,
          nome,
          avatarColor,
          descricao,
          tema,
        }),
      });
      setUsuario((u) => u ? { ...u, nome, avatarColor, descricao, tema } : u);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    }
  }

  // Carregar dados do usuário do localStorage ao iniciar (persistência)
  useEffect(() => {
    const savedUser = localStorage.getItem("quiz_usuario");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setUsuario(userObj);
        setNome(userObj.nome || "Jogador");
        setAvatarColor(userObj.avatarColor || "#a3a3ff");
        setDescricao(userObj.descricao || "");
        setTema(userObj.tema || "claro");
        setPontuacao(userObj.pontuacao || 0);
        setAcertos(userObj.acertos || 0);
        setErros(userObj.erros || 0);
        setNivel(userObj.nivel || 1);
        setXpAtual(userObj.xpAtual || 0);
        setXpMax(userObj.xpMax || 100);
        setStatsPorArea(userObj.statsPorArea && typeof userObj.statsPorArea === "object" ? userObj.statsPorArea : {});
        setTela("game");
      } catch {}
    }
  }, []);
  // Salvar dados do usuário no localStorage sempre que mudar
  useEffect(() => {
    if (usuario) {
      const userToSave = {
        ...usuario,
        nome,
        avatarColor,
        descricao,
        tema,
        pontuacao,
        acertos,
        erros,
        nivel,
        xpAtual,
        xpMax,
        statsPorArea,
      };
      localStorage.setItem("quiz_usuario", JSON.stringify(userToSave));
    } else {
      localStorage.removeItem("quiz_usuario");
    }
  }, [usuario, nome, avatarColor, descricao, tema, pontuacao, acertos, erros, nivel, xpAtual, xpMax, statsPorArea]);

  if (tela === "game") {
    return (
      <>
      {/* Removido: antigo logo flutuante no topo */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh", // garante altura exata da tela
          background: pastel.fundo,
          display: "flex",
          flexDirection: "row",
          overflowX: "hidden",
          // Sidebar fica fixa; só o conteúdo das questões rola
          overflowY: "hidden",
        }}
      >
        {/* Menu lateral estilo dashboard da tela de exemplo */}
        <nav
          style={{
            width: 260,
            background:
              "linear-gradient(180deg, #3b31e5 0%, #4f46e5 40%, #6d28d9 100%)",
            height: "100vh", // exatamente a altura da tela, sem passar
            boxSizing: "border-box", // inclui padding dentro da altura total
            paddingTop: 24,
            paddingBottom: 16,
            boxShadow: "2px 0 16px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 0,
            position: "relative",
            overflowX: "hidden",
            overflowY: "hidden", // a barra inteira nunca passa da altura da tela
          }}
        >
          {/* Logo no topo do menu */}
          <div
            style={{
              fontWeight: "bold",
              fontSize: 24,
              color: "#ffffff",
              background: "rgba(15,23,42,0.18)",
              borderRadius: 16,
              padding: "8px 18px",
              margin: "0 24px 26px 24px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
              letterSpacing: 1,
            }}
          >
            QuizENEM
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingInline: 16,
              flex: 1,
              minHeight: 0, // permite o scroll interno funcionar no flex
              overflowY: "auto", // apenas a lista de abas rola, mantendo o botão Sair fixo
            }}
          >
            {abas
              .filter((item) => item.id !== "sair")
              .map((item) => {
                const ativo = aba === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAba(item.id)}
                    style={{
                      width: "84%",
                      margin: "0 auto 4px auto",
                      background: ativo
                        ? "rgba(255,255,255,0.18)"
                        : "transparent",
                      color: "#e5e7ff",
                      border: "none",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontWeight: ativo ? 600 : 500,
                      fontSize: 14,
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: ativo
                        ? "0 3px 10px rgba(0,0,0,0.25)"
                        : "none",
                      transition:
                        "background 0.18s, box-shadow 0.18s, transform 0.12s",
                      outline: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          backgroundColor: ativo
                            ? "rgba(255,255,255,0.32)"
                            : "rgba(15,23,42,0.22)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                        }}
                      >
                        {item.icone}
                      </span>
                      <span>{item.nome}</span>
                    </div>
                  </button>
                );
              })}
          </div>
          {/* Botão Sair fixado na parte inferior do menu */}
          <div
            style={{
              width: "100%",
              paddingInline: 16,
              marginTop: 8,
            }}
          >
            {abas
              .filter((item) => item.id === "sair")
              .map((item) => {
                const ativo = aba === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAba(item.id)}
                    style={{
                      width: "84%",
                      margin: "0 auto 4px auto",
                      background: ativo
                        ? "rgba(255,255,255,0.18)"
                        : "transparent",
                      color: "#e5e7ff",
                      border: "none",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontWeight: ativo ? 600 : 500,
                      fontSize: 14,
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: ativo
                        ? "0 3px 10px rgba(0,0,0,0.25)"
                        : "none",
                      transition:
                        "background 0.18s, box-shadow 0.18s, transform 0.12s",
                      outline: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          backgroundColor: ativo
                            ? "rgba(255,255,255,0.32)"
                            : "rgba(15,23,42,0.22)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                        }}
                      >
                        {item.icone}
                      </span>
                      <span>{item.nome}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </nav>
        {/* Conteúdo da aba */}
        <main
          style={{
            flex: 1,
            background: pastel.fundo,
            minHeight: "100vh",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {renderAba()}
        </main>
      </div>
      {showParabens && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: pastel.correto,
              color: pastel.texto,
              borderRadius: 16,
              padding: "40px 60px",
              fontSize: 28,
              fontWeight: "bold",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              textAlign: "center",
              border: `3px solid ${pastel.botao}`,
              animation: "pop 0.4s",
            }}
          >
            🎉 Parabéns, {nome}! Você subiu para o nível {nivel}! 🎉
          </div>
        </div>
      )}
    </>
  );
  }

  return (
    <>
      {/* Logo e nome integrados ao topo da caixa de login/cadastro */}
      {/* Mensagem de status da API no canto */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          background: pastel.branco,
          color: pastel.texto,
          borderRadius: 999,
          padding: "6px 14px",
          boxShadow: "0 6px 18px rgba(15,23,42,0.16)",
          fontSize: 13,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background:
              statusApi === "API conectada!" ? "#22c55e" : "#f97316",
          }}
        />
        <span>{statusApi}</span>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          minWidth: "100vw",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at top left, #eef2ff 0%, #fdf2ff 45%, #f4f5fb 100%)",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 0,
            borderRadius: 24,
            background: pastel.branco,
            boxShadow: pastel.cardShadow,
            width: "100%",
            maxWidth: 460,
            minWidth: 0,
            textAlign: "left",
            overflow: "hidden",
          }}
        >
          {/* Topo com logo e barra gradiente, seguindo o restante do app */}
          <div
            style={{
              padding: "24px 40px 18px 40px",
              background: pastel.branco,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #4b2be8 0%, #8b5cf6 45%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 22,
                  boxShadow: "0 8px 18px rgba(15,23,42,0.35)",
                }}
              >
                Q
              </div>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: "bold",
                  color: pastel.texto,
                  letterSpacing: 0.5,
                }}
              >
                QuizENEM
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 14,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #4b2be8 0%, #44c2ff 45%, #25e0c1 100%)",
              }}
            />
          </div>
          <div
            style={{
              padding: "26px 40px 32px 40px",
              borderRadius: 24,
              background: pastel.branco,
              textAlign: "left",
            }}
          >
            <form onSubmit={handleSubmit}>
              <h2
                style={{
                  background: "transparent",
                  borderRadius: 0,
                  padding: 0,
                  marginTop: 4,
                  color: pastel.texto,
                  fontSize: 24,
                }}
              >
                {isLogin ? "Login" : "Cadastro"}
              </h2>
              <div
                style={{
                  marginTop: 4,
                  marginBottom: 18,
                  fontSize: 13,
                  color: pastel.textoSecundario,
                }}
              >
                Acesse sua conta para continuar estudando.
              </div>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  marginBottom: 10,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1.5px solid ${pastel.inputBorder}`,
                  background: pastel.inputBg,
                  color: pastel.inputText,
                  outline: "none",
                }}
              />
              <br />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={{
                  marginBottom: 4,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1.5px solid ${pastel.inputBorder}`,
                  background: pastel.inputBg,
                  color: pastel.inputText,
                  outline: "none",
                }}
              />
              <br />
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-start",
                  marginTop: 18,
                }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    minWidth: 0,
                    padding: "11px 26px",
                    background:
                      "linear-gradient(135deg, #4b2be8 0%, #44c2ff 45%, #25e0c1 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 999,
                    fontWeight: "bold",
                    cursor: isLoading ? "default" : "pointer",
                    transition: "background 0.2s",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  onMouseOver={e => { if (tema === "escuro") e.currentTarget.style.background = pastel.botaoBgHover; }}
                  onMouseOut={e => { if (tema === "escuro") e.currentTarget.style.background = pastel.botao; }}
                >
                  {isLoading
                    ? isLogin
                      ? "Entrando..."
                      : "Cadastrando..."
                    : isLogin
                    ? "Entrar"
                    : "Cadastrar"}
                </button>

                <button
                  type="button"
                  onClick={handleDebug}
                  disabled={isLoading}
                  style={{
                    padding: "9px 14px",
                    background: pastel.destaque,
                    color: pastel.inputText,
                    border: `1.5px solid ${pastel.inputBorder}`,
                    borderRadius: 6,
                    cursor: isLoading ? "default" : "pointer",
                  }}
                  title="Chamar /debug-user para diagnosticar"
                >
                  Debug login
                </button>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  style={{
                    padding: "9px 14px",
                    background: tema === "escuro" ? "#4b5563" : "#fee2e2",
                    color: pastel.inputText,
                    border: `1.5px solid ${pastel.inputBorder}`,
                    borderRadius: 6,
                    cursor: isLoading ? "default" : "pointer",
                  }}
                  title="Resetar senha do usuário (desenvolvimento)"
                >
                  Resetar senha (dev)
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                marginTop: 14,
                background: "none",
                border: "none",
                color: pastel.botao,
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              {isLogin
                ? "Não tem conta? Cadastre-se"
                : "Já tem conta? Faça login"}
            </button>
            {mensagem && (
             
              <div
                style={{
                  marginTop: 10,
                  background: mensagemColor,
                  borderRadius: 6,
                  padding: 8,
                  color: pastel.texto,
                }}
              >
                {mensagem}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;







