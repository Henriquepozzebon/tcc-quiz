import { useState, useEffect } from "react";
import Timer from "./components/Timer";

// Troque pelo endereço real do seu backend no Render:
const API_URL = "https://tcc-quiz.onrender.com"; // coloque o endereço correto aqui

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
  const [isLoading, setIsLoading] = useState(false); // Novo estado para controle de loading

  const pastel = {
    fundo: "#e3e9f7",
    botao: "#7ec6f7",
    correto: "#6fdc7a",
    erro: "#ff8c9b",
    destaque: "#e3e9f7", // Substituído: era amarelo, agora igual ao fundo
    branco: "#fff",
    texto: "#1a1a1a",
  };

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.text())
      .then(() => setStatusApi("API conectada!"))
      .catch(() => setStatusApi("Erro ao conectar com a API"));
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
    { id: "inicio", nome: "Início" },
    { id: "perfil", nome: "Perfil" },
    { id: "desempenho", nome: "Desempenho" },
    { id: "questoes", nome: "Questões" },
    { id: "simulados", nome: "Simulados" },
    { id: "ranking", nome: "Ranking" },
    { id: "sair", nome: "Sair" },
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

  // Carregar nome, cor e statsPorArea do backend ao logar
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || "Jogador");
      setAvatarColor(usuario.avatarColor || "#a3a3ff");
      setPontuacao(usuario.pontuacao || 0);
      setAcertos(usuario.acertos || 0);
      setErros(usuario.erros || 0);
      setNivel(usuario.nivel || 1);
      setXpAtual(usuario.xpAtual || 0);
      setXpMax(usuario.xpMax || 100);
      // Corrigido: statsPorArea SEMPRE inicializa, mesmo se vazio
      setStatsPorArea(usuario.statsPorArea && typeof usuario.statsPorArea === "object" ? usuario.statsPorArea : {});
    }
  }, [usuario]);

  // Filtros visuais (checkboxes)
  const [filtros, setFiltros] = useState({
    ano: false,
    materia: false,
  });
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
    if (filtros.ano && filtroAno !== "" && String(q.ano) !== filtroAno) return false;

    // Filtro por matéria/assunto
    const materia = (q.assunto || q.materia || "").toLowerCase().trim();
    const filtroMateriaLower = (filtroMateria || "").toLowerCase().trim();
    if (filtros.materia && filtroMateriaLower !== "" && filtroMateriaLower !== "todas") {
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

      // Estilo dos cards de estatísticas (usado em cima e embaixo)
      const cardEstatisticaStyle = {
        borderRadius: 16,
        padding: "36px 48px",
        minWidth: 0,
        width: "100%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 140,
        transition: "background 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        boxSizing: "border-box",
      };

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
          {/* Card de perfil */}
          <div
            style={{
              width: "80vw",
              maxWidth: 900,
              background: pastel.branco,
              borderRadius: 18,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              padding: "32px 40px 32px 40px",
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 28 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: `3px solid ${pastel.botao}`,
                  background: avatarColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 38,
                  color: "#fff",
                  objectFit: "cover",
                  marginRight: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
              >
                {nome?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 28,
                    color: pastel.texto,
                    marginBottom: 2,
                    letterSpacing: 0.5,
                  }}
                >
                  {nome}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      color: pastel.botao,
                      fontWeight: "bold",
                      marginRight: 4,
                    }}
                  >
                    Nível {nivel}
                  </span>
                  {/* Estrelinha removida daqui */}
                </div>
                {/* Barra de nível maior e estilizada */}
                <div
                  style={{
                    width: "80vw",
                    maxWidth: 600,
                    marginTop: 10,
                    marginBottom: 0,
                    background: pastel.fundo,
                    borderRadius: 16,
                    height: 44,
                    position: "relative",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: `2.5px solid ${pastel.botao}`,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: `${nivelPercent}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${pastel.botao} 60%, ${pastel.correto} 100%)`,
                      borderRadius: 16,
                      transition: "width 0.4s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: nivelPercent > 10 ? "flex-end" : "flex-start",
                      boxShadow: nivelPercent > 0 ? "0 2px 8px rgba(144,238,144,0.12)" : "none",
                    }}
                  >
                    {/* XP atual dentro da barra se houver espaço */}
                    {nivelPercent > 20 && (
                      <span
                        style={{
                          color: pastel.texto,
                          fontWeight: "bold",
                          fontSize: 18,
                          marginRight: 22,
                          textShadow: "0 1px 2px #fff8",
                        }}
                      >
                        {xpAtual}/{xpMax} XP
                      </span>
                    )}
                  </div>
                  {/* XP atual fora da barra se pouco preenchida */}
                  {nivelPercent <= 20 && (
                    <span
                      style={{
                        position: "absolute",
                        left: 22,
                        color: pastel.texto,
                        fontWeight: "bold",
                        fontSize: 18,
                        textShadow: "0 1px 2px #fff8",
                      }}
                    >
                      {xpAtual}/{xpMax} XP
                    </span>
                  )}
                  {/* Nível à direita da barra */}
                  <span
                    style={{
                      position: "absolute",
                      right: 22,
                      color: pastel.botao,
                      fontWeight: "bold",
                      fontSize: 20,
                      textShadow: "0 1px 2px #fff8",
                      letterSpacing: 1,
                    }}
                  >
                    Nível {nivel}
                  </span>
                </div>
              </div>
            </div>
            {/* Frase de destaque com estrelinha, aparece abaixo do card de perfil */}
            {fraseDestaque && (
              <div
                style={{
                  marginTop: 18,
                  fontSize: 20,
                  color: pastel.botao,
                  fontWeight: "bold",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                title={`Você se destaca em ${capitalize(destaqueArea)}!`}
                onMouseEnter={e => e.currentTarget.style.color = pastel.correto}
                onMouseLeave={e => e.currentTarget.style.color = pastel.botao}
              >
                <span>★</span>
                <span>{fraseDestaque}</span>
              </div>
            )}
          </div>

          {/* Mensagem de boas-vindas - quadro branco com borda azul pastel */}
          <div
            style={{
              width: "80vw",
              maxWidth: 900,
              background: pastel.branco,
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: `2.5px solid ${pastel.botao}`,
              padding: "24px 32px",
              marginBottom: 32,
              textAlign: "center",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          >
            <h1 style={{
              color: pastel.botao,
              fontWeight: "bold",
              fontSize: 32,
              margin: 0,
              letterSpacing: 1,
            }}>
              Bem-vindo ao <span style={{ color: pastel.correto }}>QuizENEM</span>!
            </h1>
            <div style={{
              fontSize: 20,
              color: pastel.texto,
              marginTop: 12,
              marginBottom: 0,
              fontWeight: 500,
            }}>
              Seu banco de questões do ENEM.<br />
              {/* Frase "Bons estudos e boa sorte!" em verde igual ao pastel.correto */}
              <span style={{ color: pastel.correto, fontWeight: "bold" }}>Bons estudos e boa sorte!</span>
            </div>
          </div>

          {/* Cards de estatísticas - grid para alinhamento perfeito em 3 colunas e 1 linha */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "1fr",
              gap: 32,
              width: "80vw",
              maxWidth: 900,
              minHeight: 180, // garante altura mínima igual para todas as linhas
              alignItems: "stretch",
              justifyItems: "stretch",
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
                  fontSize: 38,
                  fontWeight: "bold",
                  color: pastel.texto,
                  marginBottom: 8,
                }}
              >
                {pontuacao}
              </div>
              <div style={{ fontSize: 18, color: pastel.texto }}>Pontuação Total</div>
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
                  fontSize: 38,
                  fontWeight: "bold",
                  color: pastel.texto,
                  marginBottom: 8,
                }}
              >
                {probAcerto}%
              </div>
              <div style={{ fontSize: 18, color: pastel.texto }}>Acertos</div>
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
                  fontSize: 38,
                  fontWeight: "bold",
                  color: pastel.texto,
                  marginBottom: 8,
                }}
              >
                {probErro}%
              </div>
              <div style={{ fontSize: 18, color: pastel.texto }}>Erros</div>
            </div>
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

      // Novo estilo dos cards de desempenho
      const cardDesempenhoStyle = {
        borderRadius: 18,
        background: pastel.branco,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        border: `2.5px solid ${pastel.botao}`,
        padding: "28px 36px",
        marginBottom: 32,
        width: "100%",
        maxWidth: 700,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        margin: "0 auto 32px auto",
        transition: "box-shadow 0.2s, border 0.2s",
      };

      // Barra customizada
      function BarraArea({ areaId, nome }) {
        const stats = statsArea(areaId);
        let corBarra = pastel.botao;
        if (areaId === "matematica") corBarra = pastel.correto;
        else if (areaId === "naturezas") corBarra = "#90ee90";
        else if (areaId === "linguagens") corBarra = "#7ec6f7";
        else if (areaId === "humanas") corBarra = "#87ceeb";

        // cor de fundo barra
        let corFundoBarra = pastel.fundo;
        if (areaId === "geral") corFundoBarra = pastel.fundo;

        return (
          <div style={{ ...cardDesempenhoStyle, marginBottom: 28 }}>
            <div style={{
              fontWeight: "bold",
              fontSize: 24,
              color: pastel.botao,
              marginBottom: 10,
              letterSpacing: 0.5,
            }}>
              {nome}
            </div>
            <div style={{
              width: "100%",
              marginBottom: 12,
              fontSize: 16,
              color: pastel.texto,
              fontWeight: 500,
            }}>
              Aproveitamento: <b>{stats.aproveitamento}%</b> &nbsp;|&nbsp; Respondidas: {stats.totalRespondidas}
            </div>
            <div style={{
              width: "100%",
              height: 38,
              background: corFundoBarra,
              borderRadius: 14,
              position: "relative",
              overflow: "hidden",
              border: `2px solid ${pastel.botao}`,
              marginBottom: 0,
              marginTop: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
            }}>
              <div style={{
                width: `${stats.aproveitamento}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${corBarra} 70%, ${pastel.botao} 100%)`,
                borderRadius: 14,
                transition: "width 0.4s",
                display: "flex",
                alignItems: "center",
                justifyContent: stats.aproveitamento > 10 ? "flex-end" : "flex-start",
                boxShadow: stats.aproveitamento > 0 ? "0 2px 8px rgba(144,238,144,0.10)" : "none",
              }}>
                {/* Valor dentro da barra se houver espaço */}
                {stats.aproveitamento > 20 && (
                  <span style={{
                    color: pastel.texto,
                    fontWeight: "bold",
                    fontSize: 18,
                    marginRight: 18,
                    textShadow: "0 1px 2px #fff8",
                  }}>
                    {stats.aproveitamento}%
                  </span>
                )}
              </div>
              {/* Valor fora da barra se pouco preenchida */}
              {stats.aproveitamento <= 20 && (
                <span style={{
                  position: "absolute",
                  left: 18,
                  color: pastel.texto,
                  fontWeight: "bold",
                  fontSize: 18,
                  textShadow: "0 1px 2px #fff8",
                }}>
                  {stats.aproveitamento}%
                </span>
              )}
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
          <div style={{
            width: "100%",
            maxWidth: 900,
            background: pastel.fundo,
            borderRadius: 18,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "32px 40px",
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: `2.5px solid ${pastel.botao}`,
          }}>
            <h2 style={{
              color: pastel.botao,
              marginBottom: 32,
              fontWeight: "bold",
              fontSize: 32,
              letterSpacing: 1,
            }}>
              Desempenho Geral e por Área
            </h2>
            <div style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignItems: "center",
            }}>
              {areas.map(area => (
                <BarraArea key={area.id} areaId={area.id} nome={area.nome} />
              ))}
            </div>
            <div
              style={{
                marginTop: 32,
                background: pastel.fundo,
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                width: "100%",
                maxWidth: 700,
                fontWeight: "bold",
                fontSize: 18,
                color: pastel.texto,
                border: `2px solid ${pastel.botao}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <span>Resumo Geral</span>
              <div style={{ marginTop: 10, fontWeight: 500 }}>
                <b>Acertos:</b> {acertos} &nbsp;|&nbsp; <b>Erros:</b> {erros}{" "}
                &nbsp;|&nbsp; <b>Aproveitamento:</b> {(acertos + erros) > 0 ? Math.round((acertos / (acertos + erros)) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (aba === "questoes") {
      const questaoExemplo = questoesFiltradas[indiceQuestao];
      const corAcerto = pastel.correto;
      const corErro = pastel.erro;
      const corPadrao = pastel.fundo;

      // Descobre o índice correto da alternativa
      const corretaIndex = questaoExemplo
        ? (typeof questaoExemplo.correta === "number"
            ? questaoExemplo.correta
            : questaoExemplo.alternativas.findIndex(
              (alt) => alt.letra === questaoExemplo.correta
            ))
        : -1;

      // Painel de filtros sempre aparece
      const painelFiltros = (
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            marginBottom: 24,
            background: pastel.destaque,
            borderRadius: 10,
            padding: "18px 24px",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 18, marginRight: 12 }}>
            Filtros:
          </span>
          {/* Checkbox para Ano */}
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={filtros.ano}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, ano: e.target.checked }))
              }
            />
            Ano
            {filtros.ano && (
              <select
                value={filtroAno}
                onChange={(e) => setFiltroAno(e.target.value)}
                style={{ marginLeft: 8, padding: 4, borderRadius: 6 }}
              >
                <option value="">Todos</option>
                {anos.map((ano) => (
                  <option key={ano} value={String(ano)}>
                    {ano}
                  </option>
                ))}
              </select>
            )}
          </label>
          {/* Checkbox para Matéria */}
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={filtros.materia}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, materia: e.target.checked }))
              }
            />
            Matéria
            {filtros.materia && (
              <select
                value={filtroMateria}
                onChange={(e) => setFiltroMateria(e.target.value)}
                style={{ marginLeft: 8, padding: 4, borderRadius: 6 }}
              >
                <option value="todas">Todas</option>
                {materias.map((m) => (
                  <option key={m} value={m}>
                    {capitalize(m)}
                  </option>
                ))}
              </select>
            )}
          </label>
        </div>
      );

      return (
        <div
          style={{
            padding: "3vw 0",
            width: "100%",
            minHeight: "100vh",
            background: pastel.fundo,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "96%",
              maxWidth: "1200px",
              minWidth: "320px",
              background: pastel.branco,
              borderRadius: 20,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              border: `3px solid ${pastel.botao}`,
              padding: "2.5vw 3vw",
              margin: "0 auto",
              marginTop: "1vw",
              marginBottom: "2vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              boxSizing: "border-box",
              overflow: "hidden",
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
                  <div>
                    {/* Ajuste aqui: ENEM/ANO/assunto */}
                    <b>
                      ENEM/{questoesFiltradas[indiceQuestao]?.ano}
                      {questoesFiltradas[indiceQuestao]?.materia || questoesFiltradas[indiceQuestao]?.assunto
                        ? `/${capitalize(questoesFiltradas[indiceQuestao]?.materia || questoesFiltradas[indiceQuestao]?.assunto)}`
                        : ""}
                    </b>
                    {/* Se quiser mostrar banca e prova, pode adicionar depois */}
                  </div>
                  {/* Timer só aparece se ainda não respondeu */}
                  {!resposta && (
                    <Timer key={timerKey} duration={180} onTimeUp={handleTimeUp} />
                  )}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    marginBottom: 28,
                    fontWeight: "bold",
                    color: pastel.texto,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>{questoesFiltradas[indiceQuestao]?.enunciado}</span>
                  {resposta && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          questoesFiltradas[indiceQuestao]?.enunciado
                        );
                      }}
                      style={{
                        marginLeft: 18,
                        background: pastel.botao,
                        color: pastel.texto,
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: "bold",
                        fontSize: 16,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "background 0.2s",
                      }}
                      title="Copiar enunciado"
                    >
                      Copiar Enunciado
                    </button>
                  )}
                </div>
                <div style={{ width: "100%" }}>
                  {questoesFiltradas[indiceQuestao]?.alternativas.map((alt, idx) => {
                    let bg = corPadrao;
                    let border = "1.5px solid #ddd";
                    let color = pastel.texto;
                    // Corrige a verificação de resposta correta
                    const corretaLetra = typeof questaoExemplo.correta === "number"
                      ? questaoExemplo.alternativas[questaoExemplo.correta]?.letra
                      : questaoExemplo.correta;

                    if (resposta) {
                      if (
                        alt.letra === resposta &&
                        alt.letra === corretaLetra
                      ) {
                        bg = corAcerto;
                        border = `2.5px solid ${corAcerto}`;
                      } else if (
                        alt.letra === resposta &&
                        alt.letra !== corretaLetra
                      ) {
                        bg = corErro;
                        border = `2.5px solid ${corErro}`;
                      } else if (
                        mostrarGabarito &&
                        alt.letra === corretaLetra
                      ) {
                        bg = corAcerto;
                        border = `2.5px solid ${corAcerto}`;
                      }
                    } else if (mostrarGabarito && alt.letra === corretaLetra) {
                      bg = corAcerto;
                      border = `2.5px solid ${corAcerto}`;
                    }
                    return (
                      <div
                        key={alt.letra}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginBottom: 18,
                          background: bg,
                          borderRadius: 10,
                          padding: "18px 24px",
                          fontSize: 20,
                          cursor: resposta ? "default" : "pointer",
                          border,
                          boxShadow: resposta ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
                          transition: "background 0.2s, border 0.2s",
                          color,
                          width: "100%",
                          minWidth: "320px",
                          maxWidth: "100%",
                          minHeight: 48,
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
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: pastel.botao,
                            color: pastel.texto,
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: 22,
                            border: "2.5px solid #fff",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                            flexShrink: 0,
                            marginRight: 18,
                            // Deixa mais "fofo"
                            boxSizing: "border-box",
                            letterSpacing: 1,
                            transition: "background 0.18s, color 0.18s, border 0.18s",
                            fontFamily: "'Segoe UI', 'Arial Rounded MT Bold', 'Arial', sans-serif",
                          }}
                        >
                          {alt.letra}
                        </span>
                        <span
                          style={{
                            flex: 1,
                            wordBreak: "break-word",
                            whiteSpace: "pre-line",
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
                    }}
                  >
                    <button
                      onClick={() => setMostrarGabarito((v) => !v)}
                      style={{
                        background: pastel.botao,
                        color: pastel.texto,
                        border: "none",
                        borderRadius: 8,
                        padding: "12px 28px",
                        fontWeight: "bold",
                        fontSize: 18,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        marginRight: 16,
                      }}
                    >
                      {mostrarGabarito ? "Ocultar Gabarito" : "Mostrar Gabarito"}
                    </button>
                    <button
                      onClick={() => {
                        proximaQuestao();
                      }}
                      style={{
                        background: pastel.destaque,
                        color: pastel.texto,
                        border: "none",
                        borderRadius: 8,
                        padding: "12px 28px",
                        fontWeight: "bold",
                        fontSize: 18,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        marginLeft: 8,
                      }}
                    >
                      Próxima Questão
                    </button>
                    {/* Corrige mensagem de resposta correta */}
                    {resposta === (typeof questaoExemplo.correta === "number"
                      ? questaoExemplo.alternativas[questaoExemplo.correta]?.letra
                      : questaoExemplo.correta) ? (
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
        <div style={{ padding: 24 }}>
          <h2 style={{ color: pastel.botao }}>Ranking</h2>
          <table
            style={{
              width: "100%",
              background: pastel.branco,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              marginTop: 18,
            }}
          >
            <thead>
              <tr style={{ background: pastel.destaque }}>
                <th style={{ padding: 10, textAlign: "left" }}>#</th>
                <th style={{ padding: 10, textAlign: "left" }}>Usuário</th>
                <th style={{ padding: 10, textAlign: "left" }}>Pontuação</th>
                <th style={{ padding: 10, textAlign: "left" }}>Nível</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((u, i) => (
                <tr
                  key={u.email}
                  style={{
                    background: i % 2 === 0 ? pastel.fundo : pastel.branco,
                  }}
                >
                  <td style={{ padding: 10 }}>{i + 1}</td>
                  <td style={{ padding: 10 }}>
                    {u.email}
                    {u.nome ? ` (${u.nome})` : ""}
                  </td>
                  <td style={{ padding: 10 }}>{u.pontuacao}</td>
                  <td style={{ padding: 10 }}>{u.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (aba === "config") {
      return null;
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
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: pastel.branco,
              borderRadius: 18,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              border: `2.5px solid ${pastel.botao}`,
              padding: "32px 40px",
              marginTop: 48,
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: pastel.botao, fontWeight: "bold", fontSize: 28, marginBottom: 24 }}>
              Perfil
            </h2>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: avatarColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 28,
                  color: "#fff",
                  border: `2px solid ${pastel.botao}`,
                  margin: "0 auto",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
              >
                {nome?.[0]?.toUpperCase() || "?"}
              </div>
            </div>
            <div style={{ width: "100%", marginBottom: 24 }}>
              <label style={{ fontWeight: "bold", fontSize: 18, color: pastel.texto }}>
                Nome:
                <input
                  type="text"
                  value={nome}
                  maxLength={20}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => atualizarPerfilBackend(nome, avatarColor)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      atualizarPerfilBackend(nome, avatarColor);
                      e.target.blur();
                    }
                  }}
                  style={{
                    marginLeft: 10,
                    padding: 6,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    background: pastel.fundo,
                    fontSize: 16,
                  }}
                />
              </label>
            </div>
            <div style={{ width: "100%", marginBottom: 24 }}>
              <label style={{ fontWeight: "bold", fontSize: 18, color: pastel.texto }}>
                Cor do Avatar:
                <input
                  type="color"
                  value={avatarColor}
                  onChange={(e) => {
                    setAvatarColor(e.target.value);
                    atualizarPerfilBackend(nome, e.target.value);
                  }}
                  style={{
                    marginLeft: 10,
                    width: 36,
                    height: 36,
                    border: "none",
                    background: "none",
                    verticalAlign: "middle",
                  }}
                />
              </label>
            </div>
            <div style={{ color: pastel.texto, fontSize: 14, marginTop: 8 }}>
              Personalize seu nome e cor do avatar!
            </div>
          </div>
        </div>
      );
    }
    if (aba === "simulados") {
      // Pegue todos os anos únicos das questões de exemplo
      const anosSimulados = [...new Set(questoesExemplo.map((q) => q.ano))];
      // Cores para os quadrados (pode expandir)
      const cores = [
        "#a3a3ff",
        "#ffd700",
        "#90ee90",
        "#ffb6c1",
        "#87ceeb",
        "#ffa07a",
        "#e0e0e0",
      ];
      return (
        <div style={{
          padding: 32,
          minHeight: "100vh",
          background: pastel.fundo,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Quadro azul e branco igual ao do nível */}
          <div
            style={{
              width: "80vw",
              maxWidth: 600,
              margin: "0 auto",
              marginBottom: 32,
              background: pastel.branco,
              borderRadius: 16,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              border: `2.5px solid ${pastel.botao}`,
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: pastel.botao, fontWeight: "bold", fontSize: 28, marginBottom: 12 }}>
              Simulados ENEM
            </h2>
            <div style={{ color: pastel.texto, fontSize: 18, marginBottom: 8 }}>
              Clique em um ano para ver as questões daquele ENEM.
            </div>
            <div style={{ color: pastel.botao, fontSize: 16 }}>
              (Em breve, cada simulado terá suas próprias questões!)
            </div>
          </div>
          {/* Cards dos anos */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "center",
              width: "80vw",
              maxWidth: 900,
            }}
          >
            {anosSimulados.map((ano, idx) => (
              <div
                key={ano}
                style={{
                  background: idx % 2 === 0 ? pastel.botao : pastel.branco,
                  borderRadius: 16,
                  padding: "32px 48px",
                  fontSize: 28,
                  fontWeight: "bold",
                  color: pastel.texto,
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "background 0.2s",
                  minWidth: 180,
                  textAlign: "center",
                  border: `2px solid ${pastel.botao}`,
                }}
                onClick={() => {
                  setAba("questoes");
                  setFiltros({ ...filtros, ano: true });
                  setFiltroAno(ano);
                }}
                title={`Ver questões do ENEM ${ano}`}
              >
                ENEM {ano}
              </div>
            ))}
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
  async function atualizarPerfilBackend(nome, avatarColor) {
    if (!usuario) return;
    try {
      await fetch(`${API_URL}/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuario.email,
          nome,
          avatarColor,
        }),
      });
      // Opcional: atualizar localmente o usuário
      setUsuario((u) => u ? { ...u, nome, avatarColor } : u);
    } catch (err) {
      // Silencie erro, só log
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
        setPontuacao(userObj.pontuacao || 0);
        setAcertos(userObj.acertos || 0);
        setErros(userObj.erros || 0);
        setNivel(userObj.nivel || 1);
        setXpAtual(userObj.xpAtual || 0);
        setXpMax(userObj.xpMax || 100);
        // Corrigido: statsPorArea SEMPRE inicializa, mesmo se vazio
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
  }, [usuario, nome, avatarColor, pontuacao, acertos, erros, nivel, xpAtual, xpMax, statsPorArea]);

  if (tela === "game") {
    return (
      <>
      {/* Removido: antigo logo flutuante no topo */}
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          background: pastel.fundo,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Menu lateral novo design */}
        <nav
          style={{
            width: 240,
            background: pastel.branco,
            borderRight: `2.5px solid ${pastel.botao}`,
            minHeight: "100vh",
            paddingTop: 36,
            boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            position: "relative",
          }}
        >
          {/* Logo no topo do menu */}
          <div
            style={{
              fontWeight: "bold",
              fontSize: 26,
              color: pastel.texto,
              background: pastel.botao,
              borderRadius: 10,
              padding: "10px 28px",
              marginBottom: 38,
              marginTop: 0,
              boxShadow: "0 2px 10px rgba(126,198,247,0.13)",
              letterSpacing: 1,
              textAlign: "center",
            }}
          >
            QuizENEM
          </div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            {abas.map((item) => (
              <button
                key={item.id}
                onClick={() => setAba(item.id)}
                style={{
                  width: "88%",
                  margin: "0 auto 10px auto",
                  background: aba === item.id ? pastel.botao : "none",
                  color: pastel.texto,
                  border: aba === item.id ? `2.5px solid #2222` : "2.5px solid transparent",
                  borderRadius: 12,
                  padding: "14px 0",
                  fontWeight: aba === item.id ? "bold" : "normal",
                  fontSize: 18,
                  cursor: "pointer",
                  textAlign: "center",
                  boxShadow: aba === item.id ? "0 2px 10px rgba(126,198,247,0.13)" : "none",
                  transition: "background 0.18s, border 0.18s, box-shadow 0.18s",
                  outline: "none",
                }}
              >
                {item.nome}
              </button>
            ))}
          </div>
        </nav>
        {/* Conteúdo da aba */}
        <main
          style={{ flex: 1, background: pastel.fundo, minHeight: "100vh" }}
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
          top: 10,
          left: 10,
          background: "#fff",
          color: "#222",
          borderRadius: 6,
          padding: "6px 14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          fontSize: 14,
          zIndex: 1000,
          opacity: 0.95,
        }}
      >
        {statusApi}
      </div>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: pastel.fundo,
        }}
      >
        <div
          style={{
            padding: 0,
            borderRadius: 12,
            background: pastel.branco,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            minWidth: 320,
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Logo e nome no topo da caixa */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: pastel.botao, // fundo azul pastel
              padding: "18px 0 12px 0",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottom: `1.5px solid ${pastel.fundo}`,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: pastel.texto,
              }}
            >
              QuizENEM
            </span>
          </div>
          <div
            style={{
              padding: 32,
              borderRadius: 12,
              background: pastel.branco,
              minWidth: 320,
              textAlign: "center",
            }}
          >
            <form onSubmit={handleSubmit}>
              <h2
                style={{
                  background: pastel.destaque,
                  borderRadius: 8,
                  padding: 6,
                  marginTop: 0,
                }}
              >
                {isLogin ? "Login" : "Cadastro"}
              </h2>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  marginBottom: 10,
                  width: "90%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: pastel.fundo,
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
                  marginBottom: 10,
                  width: "90%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: pastel.fundo,
                }}
              />
              <br />
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: 200,
                    padding: 10,
                    background: pastel.botao,
                    color: pastel.texto,
                    border: "none",
                    borderRadius: 6,
                    fontWeight: "bold",
                    cursor: isLoading ? "default" : "pointer",
                    transition: "background 0.2s",
                    opacity: isLoading ? 0.7 : 1,
                  }}
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
                    padding: 10,
                    background: "#f0f0f0",
                    color: pastel.texto,
                    border: "1px solid #ddd",

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
                    padding: 10,
                    background: "#ffeedd",
                    color: pastel.texto,
                    border: "1px solid #e0c8b0",
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
                marginTop: 10,
                background: "none",
                border: "none",
                color: pastel.botao,
                               cursor: "pointer",
                textDecoration: "underline",
               
                fontWeight: "bold",
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







