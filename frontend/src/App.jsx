import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => setMessage("Erro ao buscar API"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Quiz TCC</h1>
      <p>Mensagem do backend: {message}</p>
    </div>
  );
}

export default App;
