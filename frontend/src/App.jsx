import { useState, useEffect } from "react";

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
    fundo: "rgb(245, 245, 245)",
    botao: "rgb(173, 216, 230)",
    correto: "rgb(144, 238, 144)",
    erro: "rgb(255, 182, 193)",
    destaque: "rgb(255, 255, 204)",
    branco: "#fff",
    texto: "#222",
  };

  useEffect(() => {
    fetch("http://localhost:3000/")
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
      const res = await fetch(`http://localhost:3000${endpoint}`, {
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

  // Abas simuladas para o menu lateral
  const abas = [
    { id: "inicio", nome: "Início" },
    { id: "perfil", nome: "Perfil" },
    { id: "desempenho", nome: "Desempenho" },
    { id: "questoes", nome: "Questões" },
    { id: "ranking", nome: "Ranking" },
    { id: "config", nome: "Configurações" },
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
      ano: 2025,
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
      materia: "Matemática",
      ano: 2025,
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
      ano: 2025,
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
      ano: 2025,
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
    setIndiceQuestao((i) => (i + 1) % questoesExemplo.length);
  }

  // Atualiza gráficos e progresso ao responder
  async function responderQuestao(letra) {
    if (resposta) return;
    setResposta(letra);
    const questao = questoesExemplo[indiceQuestao];
    let novoXp = xpAtual;
    let novaPontuacao = pontuacao;
    let novoAcertos = acertos;
    let novoErros = erros;
    let ganhoXp = 30 * nivel;
    let perdaXp = 10 * nivel;
    let novoNivel = nivel;
    let novoXpMax = xpMax;
    let passouNivel = false;

    if (letra === questao.correta) {
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

    // Atualiza backend
    atualizarStatsBackend({
      pontuacao: novaPontuacao,
      acertos: novoAcertos,
      erros: novoErros,
      nivel: novoNivel,
      xpAtual: novoXp,
      xpMax: novoXpMax,
    });
  }

  // Atualiza backend ao responder questão
  async function atualizarStatsBackend(novo) {
    if (!usuario) return;
    await fetch("http://localhost:3000/update-stats", {
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
      }),
    });
  }

  // Ranking: busca do backend ao abrir aba ranking
  useEffect(() => {
    if (aba === "ranking") {
      fetch("http://localhost:3000/ranking")
        .then((res) => res.json())
        .then((data) => setRanking(data.ranking || []));
    }
  }, [aba]);

  // Carregar nome e cor do backend ao logar
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || "Jogador");
      setAvatarColor(usuario.avatarColor || "#a3a3ff");
    }
  }, [usuario]);

  // Conteúdo das abas
  function renderAba() {
    if (aba === "inicio") {
      const totalQuestoes = acertos + erros;
      const probAcerto =
        totalQuestoes === 0 ? 0 : Math.round((acertos / totalQuestoes) * 100);
      const probErro = 100 - probAcerto;

      return (
        <div style={{ padding: 24 }}>
          {/* Perfil do jogador */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 32,
              background: pastel.branco,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              padding: "18px 24px",
              maxWidth: 480,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: `2px solid ${pastel.botao}`,
                background: avatarColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 28,
                color: "#fff",
                objectFit: "cover",
              }}
            >
              {nome?.[0]?.toUpperCase() || "?"}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: pastel.texto,
                }}
              >
                {nome}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    color: pastel.botao,
                    fontWeight: "bold",
                    marginRight: 4,
                  }}
                >
                  Nível {nivel}
                </span>
                <span
                  style={{
                    color: "#f7c948",
                    fontSize: 20,
                    marginRight: 2,
                    verticalAlign: "middle",
                  }}
                  title="Estrela"
                >
                  ★
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    background: pastel.fundo,
                    borderRadius: 6,
                    marginLeft: 8,
                    marginRight: 8,
                    minWidth: 80,
                    maxWidth: 120,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.round((xpAtual / xpMax) * 100)}%`,
                      height: "100%",
                      background: pastel.botao,
                      borderRadius: 6,
                      transition: "width 0.3s",
                    }}
                  ></div>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 10,
                      color: pastel.texto,
                      fontWeight: "bold",
                    }}
                  >
                    {xpAtual}/{xpMax} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h2 style={{ color: pastel.botao, marginBottom: 24 }}>
            Bem-vindo ao QuizENEM!
          </h2>
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: pastel.destaque,
                borderRadius: 12,
                padding: 24,
                minWidth: 220,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: pastel.botao,
                }}
              >
                {pontuacao}
              </div>
              <div style={{ marginTop: 8 }}>Pontuação Total</div>
            </div>
            <div
              style={{
                background: pastel.correto,
                borderRadius: 12,
                padding: 24,
                minWidth: 220,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: pastel.texto,
                }}
              >
                {probAcerto}%
              </div>
              <div style={{ marginTop: 8 }}>Acertos</div>
            </div>
            <div
              style={{
                background: pastel.erro,
                borderRadius: 12,
                padding: 24,
                minWidth: 220,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: pastel.texto,
                }}
              >
                {probErro}%
              </div>
              <div style={{ marginTop: 8 }}>Erros</div>
            </div>
          </div>
        </div>
      );
    }
    if (aba === "desempenho") {
      // Cálculos
      const totalQuestoes = acertos + erros;
      const acertosPerc =
        totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;
      const errosPerc = 100 - acertosPerc;
      const nota = totalQuestoes
        ? ((acertos / totalQuestoes) * 10).toFixed(2)
        : "0.00";

      // Gráfico de pizza SVG
      const r = 60,
        cx = 80,
        cy = 80;
      const acertosAngle = (acertosPerc / 100) * 360;
      const errosAngle = 360 - acertosAngle;
      const polarToCartesian = (cx, cy, r, angle) => {
        const a = ((angle - 90) * Math.PI) / 180.0;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
      };
      const describeArc = (cx, cy, r, startAngle, endAngle) => {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
          "M",
          start.x,
          start.y,
          "A",
          r,
          r,
          0,
          largeArcFlag,
          0,
          end.x,
          end.y,
        ].join(" ");
      };

      // Gráfico de barras SVG
      const barMax = Math.max(acertos, erros, 1);
      const barHeight = 80;
      const acertosBar = (acertos / barMax) * 120;
      const errosBar = (erros / barMax) * 120;

      return (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: pastel.botao }}>Desempenho</h2>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {/* Gráfico de pizza */}
            <div
              style={{
                background: pastel.branco,
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
                padding: 24,
              }}
            >
              <svg width={160} height={160}>
                {/* Erros (vermelho) */}
                <path
                  d={describeArc(cx, cy, r, acertosAngle, 360)}
                  fill="none"
                  stroke={pastel.erro}
                  strokeWidth={24}
                />
                {/* Acertos (verde) */}
                <path
                  d={describeArc(cx, cy, r, 0, acertosAngle)}
                  fill="none"
                  stroke={pastel.correto}
                  strokeWidth={24}
                />
                {/* Círculo central branco */}
                <circle cx={cx} cy={cy} r={r - 24} fill={pastel.branco} />
                {/* Texto central */}
                <text
                  x={cx}
                  y={cy + 6}
                  textAnchor="middle"
                  fontSize="28"
                  fontWeight="bold"
                  fill={pastel.texto}
                >
                  {nota}
                </text>
              </svg>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  fontWeight: "bold",
                }}
              >
                Nota <span style={{ color: pastel.botao }}>{nota}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 8,
                }}
              >
                <span
                  style={{
                    color: pastel.correto,
                    fontWeight: "bold",
                  }}
                >
                  Acertos
                </span>
                <span
                  style={{
                    color: pastel.erro,
                    fontWeight: "bold",
                  }}
                >
                  Erros
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  fontSize: 14,
                }}
              >
                <span style={{ color: pastel.correto }}>
                  {acertos} ({acertosPerc}%)
                </span>
                <span style={{ color: pastel.erro }}>
                  {erros} ({errosPerc}%)
                </span>
              </div>
            </div>
            {/* Gráfico de barras */}
            <div
              style={{
                background: pastel.branco,
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
                padding: 24,
              }}
            >
              <svg width={180} height={barHeight + 40}>
                {/* Acertos */}
                <rect
                  x={30}
                  y={barHeight - acertosBar + 20}
                  width={40}
                  height={acertosBar}
                  fill={pastel.correto}
                  rx={8}
                />
                <text
                  x={50}
                  y={barHeight + 36}
                  textAnchor="middle"
                  fontSize="14"
                  fill={pastel.texto}
                >
                  Acertos
                </text>
                {/* Erros */}
                <rect
                  x={110}
                  y={barHeight - errosBar + 20}
                  width={40}
                  height={errosBar}
                  fill={pastel.erro}
                  rx={8}
                />
                <text
                  x={130}
                  y={barHeight + 36}
                  textAnchor="middle"
                  fontSize="14"
                  fill={pastel.texto}
                >
                  Erros
                </text>
              </svg>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  fontSize: 14,
                }}
              >
                Total de questões: <b>{totalQuestoes}</b>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 32,
              background: pastel.destaque,
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: "bold" }}>Resumo</span>
            <div style={{ marginTop: 10 }}>
              <b>Acertos:</b> {acertos} &nbsp;|&nbsp; <b>Erros:</b> {erros}{" "}
              &nbsp;|&nbsp; <b>Aproveitamento:</b> {acertosPerc}%
            </div>
          </div>
        </div>
      );
    }
    if (aba === "questoes") {
      const questaoExemplo = questoesExemplo[indiceQuestao];
      const corAcerto = pastel.correto;
      const corErro = pastel.erro;
      const corPadrao = pastel.fundo;

      return (
        <div
          style={{
            padding: 32,
            maxWidth: 900,
            margin: "0 auto",
            marginTop: 32,
            background: pastel.branco,
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: pastel.texto,
              marginBottom: 10,
            }}
          >
            <b>{questaoExemplo.materia}</b> | {questaoExemplo.ano} |{" "}
            {questaoExemplo.banca} | {questaoExemplo.prova}
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
            <span>{questaoExemplo.enunciado}</span>
            {resposta && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(questaoExemplo.enunciado);
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
            {questaoExemplo.alternativas.map((alt) => {
              let bg = corPadrao;
              let border = "1.5px solid #ddd";
              let color = pastel.texto;
              if (resposta) {
                if (
                  alt.letra === resposta &&
                  resposta === questaoExemplo.correta
                ) {
                  bg = corAcerto;
                  border = `2.5px solid ${corAcerto}`;
                } else if (
                  alt.letra === resposta &&
                  resposta !== questaoExemplo.correta
                ) {
                  bg = corErro;
                  border = `2.5px solid ${corErro}`;
                } else if (
                  alt.letra === questaoExemplo.correta &&
                  mostrarGabarito
                ) {
                  bg = corAcerto;
                  border = `2.5px solid ${corAcerto}`;
                }
              }
              return (
                <div
                  key={alt.letra}
                  style={{
                    display: "flex",
                    alignItems: "center",
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
                    maxWidth: "100%",
                    minHeight: 48,
                  }}
                  onClick={() => {
                    if (!resposta) responderQuestao(alt.letra);
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: pastel.botao,
                      color: pastel.texto,
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "38px",
                      marginRight: 18,
                      fontSize: 20,
                      border: "2px solid #fff",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    {alt.letra}
                  </span>
                  <span>{alt.texto}</span>
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
              {resposta === questaoExemplo.correta ? (
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
              Gabarito: {questaoExemplo.correta}
            </div>
          )}
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
      return (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: pastel.botao }}>Configurações</h2>
          <p>Configurações do usuário e preferências.</p>
        </div>
      );
    }
    if (aba === "sair") {
      setTela("auth");
      setAba("inicio");
      setEmail("");
      setSenha("");
      setMensagem("");
      return null;
    }
    if (aba === "perfil") {
      return (
        <div style={{ padding: 24, maxWidth: 400 }}>
          <h2 style={{ color: pastel.botao }}>Perfil</h2>
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <label>
                <b>Nome:</b>
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
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>
                <b>Cor do Avatar:</b>
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
                  }}
                />
              </label>
            </div>
            <div style={{ marginTop: 18 }}>
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
                }}
              >
                {nome?.[0]?.toUpperCase() || "?"}
              </div>
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
    const nova = window.prompt("Digite a nova senha (apenas ambiente de desenvolvimento):", "senhaTeste123");
    if (!nova) {
      setMensagem("Reset cancelado.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/reset-password", {
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
      const res = await fetch("http://localhost:3000/debug-user", {
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
        if (typeof data.compareResult !== "undefined" && data.compareResult !== null) {
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

  if (tela === "game") {
    return (
      <>
        <div
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            background: pastel.botao,
            color: pastel.texto,
            borderRadius: 6,
            padding: "8px 22px 8px 12px",
            fontWeight: "bold",
            fontSize: 20,
            zIndex: 1000,
            opacity: 0.97,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src="https://www.clipartmax.com/png/middle/39-394785_books-livro-clipart.png"
            alt="Logo QuizENEM"
            style={{ height: 32, width: 32, marginRight: 8 }}
          />
          QuizENEM
        </div>
        <div
          style={{
            minHeight: "100vh",
            minWidth: "100vw",
            background: pastel.fundo,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {/* Menu lateral */}
          <nav
            style={{
              width: 220,
              background: pastel.branco,
              borderRight: `2px solid ${pastel.botao}`,
              minHeight: "100vh",
              paddingTop: 80, // <-- aumente o paddingTop para descer o menu
              boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {abas.map((item) => (
              <button
                key={item.id}
                onClick={() => setAba(item.id)}
                style={{
                  background: aba === item.id ? pastel.botao : "none",
                  color: pastel.texto,
                  border: "none",
                  borderRadius: 6,
                  padding: "12px 18px",
                  margin: "0 12px",
                  fontWeight: aba === item.id ? "bold" : "normal",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 16,
                  transition: "background 0.2s",
                }}
              >
                {item.nome}
              </button>
            ))}
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
            <img
              src="https://www.clipartmax.com/png/middle/39-394785_books-livro-clipart.png"
              alt="Logo QuizENEM"
              style={{ height: 44, width: 44, marginRight: 4 }}
            />
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
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
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
                  {isLoading ? (isLogin ? "Entrando..." : "Cadastrando...") : (isLogin ? "Entrar" : "Cadastrar")}
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
