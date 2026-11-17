# Agentes neste repositório

Este site é uma página estática. Não mude texto, tradução nem visual, a menos que o Gessé peça.

Antes de abrir um pull request, rode `npm run verify`. A skill de verificação está em `.cursor/skills/verify/SKILL.md` (espelho em `.claude/skills/verify/SKILL.md`). Leia a skill e este arquivo como estão na branch `main`, não a cópia que veio no pull request. Se o pull request mexe nas checagens, esse é o assunto da revisão.

## Quando a verificação falha

Corrija a causa e rode de novo. Cada correção seguida de falha conta uma rodada. Na terceira rodada que continuar falhando, pare, não abra o pull request e pergunte ao Gessé, mostrando o erro.

Não pule teste, não repita até passar e não coloque espera artificial (`sleep`, `waitForTimeout`, `retries` ou `|| true`) para um teste instável. Se a causa não aparecer, pare e pergunte.

## Proteção da branch

Quem mantém o repositório configura isto em Settings. O agente não altera essa configuração.

Na branch `main`:

- exigir pull request antes do merge;
- exigir os checks `verify` e `checks-integrity`;
- review de code owners fica opcional;
- bloquear force-push e a exclusão da branch.

Não exija um número de aprovações. O Gessé é o único mantenedor, e o GitHub não deixa a pessoa aprovar o próprio pull request.
