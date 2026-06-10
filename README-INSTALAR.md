# App de Treino — Como instalar no Android

Este é um **PWA** (Progressive Web App): um app que se instala pelo Chrome,
ganha ícone próprio na tela inicial, abre em tela cheia (sem barra do navegador)
e **funciona offline**. O diário fica salvo no próprio aparelho.

## Arquivos

| Arquivo | O que é |
|---------|---------|
| `index.html` | o app inteiro (rotina + diário + timer) |
| `rotina.json` | **o treino em formato de dados — é isso que você edita pra atualizar o treino** |
| `manifest.json` | identidade do app (nome, ícone, cor) |
| `sw.js` | service worker — faz o app funcionar offline |
| `icon-192.png` / `icon-512.png` | ícones |
| `serve-local.js` | servidor de teste local (`node serve-local.js`) |

---

## Passo 1 — Publicar (necessário pra instalar no celular)

Instalar PWA exige um endereço **https**. O jeito grátis e definitivo é o GitHub Pages.

**Pelo site (sem terminal):**
1. Cria um repositório em github.com (ex: `treino-app`, público)
2. **Add file → Upload files** → arrasta todos os arquivos desta pasta
3. **Settings → Pages → Source: Deploy from a branch** → branch `main`, pasta `/ (root)` → Save
4. Em ~1 minuto a URL aparece no topo da página Pages

**Pelo terminal** (se instalar o GitHub CLI: `winget install GitHub.cli`):
```powershell
cd "C:\Users\joaaq\Downloads\produtos\treino-app"
git init
git add .
git commit -m "App de treino"
gh repo create treino-app --public --source . --push
gh api repos/{owner}/treino-app/pages -X POST -f "source[branch]=main" -f "source[path]=/"
```

A URL fica: `https://SEU-USUARIO.github.io/treino-app/`

⚠ O repo público expõe os dados do treino (peso, metas). Se incomodar:
remove os itens de peso/altura do `rotina.json` — o app se adapta.

### Teste rápido sem GitHub (opcional)
- No PC: `node serve-local.js` → abre `http://localhost:8123`
- No celular (https temporário): `ngrok http 8123` e abre a URL https gerada

## Passo 2 — Instalar no celular

1. Abre a URL no **Chrome** do Android
2. Menu **⋮** → **"Instalar aplicativo"** (ou "Adicionar à tela inicial")
3. Pronto — o ícone aparece como app normal, abre em tela cheia e funciona offline

---

## Como ATUALIZAR o treino depois

O app compara o campo `"versao"` do `rotina.json` publicado com o que está
salvo no aparelho. Quando muda, ele troca o treino sozinho (mostra um aviso
"Treino atualizado") — **sem reinstalar nada**.

**Fluxo:**
1. Edita o `rotina.json` (ou pede pra IA gerar um novo no mesmo formato)
2. **Muda o campo `"versao"`** (ex: `"2026-07-15"`) — sem isso o app ignora
3. Commit + push (`git add rotina.json; git commit -m "treino novo"; git push`)
4. No celular, abre o app com internet → atualiza sozinho
   (ou força em **⚙ → Buscar atualização online**)

**Sem hospedagem / na hora:** ⚙ → **"Colar treino novo (JSON)"** → cola o JSON → Aplicar.

### Formato do JSON (resumo)

```json
{
  "versao": "2026-07-15",
  "nome": "ROTINA 5 DIAS",
  "dias": [
    {
      "id": "day1", "num": "01", "label": "Segunda", "nome": "PUSH — ...", "tag": "Push",
      "descanso": false,
      "secoes": [
        { "titulo": "Principal", "exercicios": [
          { "id": "d1-1", "nome": "Supino Inclinado com Halteres", "nota": "...", "series": 4, "reps": "8–10 reps", "destaque": true }
        ]}
      ],
      "dica": { "rotulo": "Nota", "texto": "..." }
    }
  ]
}
```

> 💡 **Mantém os mesmos `id`** (`d1-1`, `d3-1`...) nos exercícios que continuam —
> é por eles que o diário pré-preenche os últimos pesos usados.

---

## Diário e backup

- O diário/progresso fica no `localStorage` **do aparelho** (não vai pra nuvem)
- **⚙ → Exportar backup** baixa um `.json` com tudo (diário + marcações + treino)
- **⚙ → Restaurar backup** importa esse arquivo de volta (serve pra trocar de celular)

## APK de verdade (opcional)

Se um dia quiser um `.apk` instalável fora do Chrome: com o app já publicado,
entra em **pwabuilder.com**, cola a URL e ele gera o pacote Android sozinho.
