# Entre na pasta do projeto
cd "c:\Users\Acer\tcc-quiz"

# 1) Inicializa git se necessário
git init

# 2) Ignorar node_modules e .env (crie .gitignore conforme acima se ainda não existir)
# 3) Adiciona e comita tudo
git add .
git commit -m "Initial commit"

# 4) Crie repositório no GitHub:
# - Pela web: crie manualmente e copie a URL (HTTPS ou SSH)
# - Ou com GitHub CLI (se tiver): gh repo create NOME_DO_REPO --public --source=. --remote=origin --push

# 5) Adiciona remote e configura branch principal (main)
git branch -M main
git remote add origin <URL_DO_REPO>

# 6) Envia o código e configura upstream
git push -u origin main

# 7) (Opcional) enviar todas as branches
# git push --all origin

# 8) Se o remote já existir e quiser trocar a URL:
# git remote set-url origin <URL_DO_REPO>
# git push -u origin main
