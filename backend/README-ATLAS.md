Conteúdo removido a pedido — peça para eu regenerar as instruções passo-a-passo do Atlas quando quiser.

O erro "bad auth : Authentication failed." indica que o MongoDB Atlas rejeitou as credenciais. Faça as checagens e ações abaixo na ordem indicada.

1. Verificar / resetar usuário no Atlas

- No Atlas: Security → Database Access → confirme que o usuário existe (ex: tcc-quiz).
- Se não souber a senha, clique em Edit ao lado do usuário e redefina a senha para algo temporário, por exemplo: 1234.
- Anote exatamente o username e a senha (sensível a maiúsc/minúsc).

2. Verificar Network Access

- No Atlas: Network Access → Add IP Address → clique "Add Current IP Address".
- Para desenvolvimento rápido, você pode adicionar 0.0.0.0/0 (menos seguro). Aguarde alguns minutos.

3. Criar .env local com a URI correta

- Abra PowerShell e vá para o backend:
  cd C:\Users\henrique\tcc-quiz\backend

- Se sua senha for simples (ex: 1234), cole e execute:
  Set-Content -Path .env -Value 'MONGO_URI="mongodb+srv://tcc-quiz:1234@tcc-quiz-cluster.6sxiydc.mongodb.net/tcc_quiz_db?retryWrites=true&w=majority"'

- Se sua senha contiver caracteres especiais (ex: @, &, ?), use URL‑encoding automático:
  $pass = Read-Host -AsSecureString "MongoDB password"
  $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass))
  [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)) | Out-Null
  $enc = [uri]::EscapeDataString($plain)
  $uri = "mongodb+srv://tcc-quiz:$enc@tcc-quiz-cluster.6sxiydc.mongodb.net/tcc_quiz_db?retryWrites=true&w=majority"
  Set-Content -Path .env -Value "MONGO_URI=`"$uri`""

4. Testar conexão (script de verificação)

- Rode:
  npm install dotenv
  node check-connection.js

- Saída esperada se ok: "✅ Teste de conexão realizado com sucesso." e detalhes do host mascarado.
- Se erro, cole aqui o texto inteiro produzido por check-connection.js (linhas "Mensagem:" e "Stack:" inclusive).

5. Iniciar servidor (após check OK)

- node server.js
- Verifique no console: "✅ Conectado ao MongoDB ..." ou "Servidor rodando em http://localhost:3000"

6. Testes rápidos (após server rodando)

- Registrar:
  curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d "{\"email\":\"teste@ex.com\",\"senha\":\"minhaSenha\"}"
- Logar:
  curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"email\":\"teste@ex.com\",\"senha\":\"minhaSenha\"}"

Dicas de resolução rápida

- Autenticação falha → reset de senha no Atlas e recriar .env com a nova senha.
- Timeouts / DNS → confirme Network Access (seu IP) e aguarde alguns minutos.
- Senha com '@' → deve aparecer como %40 na URI (use o comando de encoding acima).
- Verifique se o nome do usuário na URI corresponde exatamente ao Database User no Atlas.

Se quiser, eu gero um comando PowerShell pronto (com placeholders removidos) que você só cola e executa para recriar .env e testar; diga se prefere que eu gere já com username "tcc-quiz" e senha "1234" (apenas para testar).
