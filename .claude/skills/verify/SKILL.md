---
name: verify
description: Sobe o site estático localmente e faz o smoke test de idioma, links, PDF e console antes de commit ou pull request. Use ao mexer neste repositório ou antes de abrir um PR.
---

# Verificar o site

Rode na raiz do repositório. Na primeira vez: `npm ci` e `npx playwright install chromium`.

```bash
npm run verify
```

O comando sobe a página em `http://127.0.0.1:4173` com `python3 -m http.server`. Não abra o `index.html` em `file://`: o `localStorage` precisa de um endereço http.

## O que precisa passar

1. `html-validate` em `index.html`.
2. HEAD dos PDF do currículo citados na página: status 200 e tipo PDF.
3. As skills `.cursor/skills/verify/SKILL.md` e `.claude/skills/verify/SKILL.md` iguais.
4. Smoke no Chromium, desktop 1280×720 e mobile 390×844:
   - abre em português;
   - EN troca os textos, o idioma da página, o link e o nome do arquivo;
   - PT volta;
   - a escolha permanece ao recarregar;
   - valor inválido no `localStorage` volta para português;
   - as traduções estão presentes e são diferentes entre si;
   - o link aplicado responde como PDF;
   - sem erro no console.

Não há build.

## Se falhar

Corrija a causa e rode de novo. Cada correção seguida de falha conta uma rodada. Na terceira rodada que continuar falhando, pare, não abra o pull request e pergunte ao Gessé, mostrando o erro.

Não pule o teste, não aumente `retries` e não use `sleep` nem `waitForTimeout` para fazer um teste instável passar. Se continuar instável, pare e pergunte.

Não altere `index.html` para agradar o validador, nem mude texto, tradução ou visual, a menos que o Gessé peça.

As checagens que julgam o pull request são as da `main`. Não enfraqueça este arquivo, o workflow ou os testes para obter um check verde.
