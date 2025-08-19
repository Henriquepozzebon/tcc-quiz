# Arquivo removido / desativado pelo pedido do usuário.
# Se quiser um script interativo novamente, peça que eu gere.
  [string]$Cluster = "tcc-quiz-cluster.xxxxx.mongodb.net",
  [string]$Db = "tcc_quiz_db"
)

# Mensagem de uso rápida
function Show-Usage {
  Write-Host ""
  Write-Host "Uso:" -ForegroundColor Cyan
  Write-Host "  Abra PowerShell, vá para a pasta backend e rode:" -ForegroundColor Yellow
  Write-Host "    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass" -ForegroundColor Green
  Write-Host "    .\connect-and-run.ps1" -ForegroundColor Green
  Write-Host ""
  Write-Host "OU (uma linha, não cole a URI diretamente sem aspas):" -ForegroundColor Yellow
  Write-Host "    powershell -ExecutionPolicy Bypass -File .\connect-and-run.ps1" -ForegroundColor Green
  Write-Host ""
}

try {
  # Detecta se foi colado acidentalmente algo parecido com a URI no prompt (caso apareça como primeiro parâmetro)
  if ($args -and ($args[0] -match "^mongodb\+srv://")) {
    Write-Host "Parece que você colou a connection string diretamente no prompt — não cole a URI isolada." -ForegroundColor Red
    Show-Usage
    exit 1
  }

  Write-Host "Criando .env e iniciando server (valores podem ser alterados via parâmetros)." -ForegroundColor Cyan
  Write-Host "Usuário: $User" -ForegroundColor Yellow
  Write-Host "Cluster: $Cluster" -ForegroundColor Yellow
  Write-Host "Database: $Db" -ForegroundColor Yellow

  # Ler senha de forma segura
  $securePass = Read-Host -Prompt "Digite a senha do usuário MongoDB (entrada oculta)" -AsSecureString
  if (-not $securePass) {
    Write-Host "Senha vazia. Abortando." -ForegroundColor Red
    Show-Usage
    exit 1
  }

  # Converter SecureString para texto e URL-encode
  $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
  $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
  [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) | Out-Null
  $enc = [uri]::EscapeDataString($plain)

  # Montar URI e escrever .env
  $uri = "mongodb+srv://$User:$enc@$Cluster/$Db?retryWrites=true&w=majority"
  Set-Content -Path .env -Value "MONGO_URI=`"$uri`""
  Write-Host ".env criado com MONGO_URI" -ForegroundColor Green

  # Instalar dotenv se necessário (silencioso)
  if (Test-Path package.json) {
    Write-Host "Instalando dependências (se necessário)..." -ForegroundColor Cyan
    try {
      npm install dotenv --no-audit --no-fund
    } catch {
      Write-Host "Falha ao executar 'npm install'. Verifique se o Node.js/NPM estão instalados e no PATH." -ForegroundColor Red
      Write-Host "Instale Node.js: https://nodejs.org/ e tente novamente." -ForegroundColor Yellow
      exit 1
    }
  } else {
    Write-Host "package.json não encontrado — pule npm install se não precisar." -ForegroundColor Yellow
  }

  Write-Host "Iniciando servidor (node server.js)..." -ForegroundColor Cyan
  try {
    node server.js
  } catch {
    Write-Host "Falha ao executar 'node server.js'. Verifique se Node está instalado e se você está na pasta correta." -ForegroundColor Red
    Write-Host "Comando sugerido para iniciar (se preferir manual):" -ForegroundColor Yellow
    Write-Host "  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass" -ForegroundColor Green
    Write-Host "  .\connect-and-run.ps1" -ForegroundColor Green
    exit 1
  }

} catch {
  Write-Host "Erro inesperado: $_" -ForegroundColor Red
  Show-Usage
  exit 1
}
