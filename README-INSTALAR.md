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

**Campo opcional `"metaCarga"`** (número, em kg): coloca num exercício e o gráfico
de evolução dele ganha a barra de meta. Ex: `"metaCarga": 600` no Leg Press.
Sem esse campo, o app assume 600 kg pro leg press por padrão.

---

## Perfis (JOAQUIM / IGOR)

Duas pessoas usam a mesma rotina com dados totalmente separados: **marcações de série,
diário, peso corporal e o fechamento automático são por perfil**.

- Na primeira vez o app pergunta quem vai usar o aparelho. Escolheu, o perfil **trava** (🔒)
- O nome é fixo — não dá pra renomear
- Pra trocar: **⚙ → Perfil deste aparelho → Trocar de perfil** (nada é apagado)
- Tocar na barra de **peso/altura/meta** abre a edição daquele perfil (peso, altura, meta em texto e meta de peso)

> ⚠ Os perfis vivem **no aparelho**, não na nuvem. Dois celulares = dois conjuntos de dados
> independentes; pra juntar, usa **⚙ → Exportar backup** num e **Restaurar backup** no outro
> (o backup já leva os dois perfis).

## Finalização por perfil

Nos dias de **peito (day1)** e **upper (day4)** o app acrescenta um bloco final diferente
pra cada pessoa, configurado em `rotina.json` → `"extras"`:

- **Joaquim:** Abdominal na Polia (corda) + Elevação de Pernas
- **Igor:** Esteira — exercício de **cardio**, com campos próprios no diário
  (tempo, distância, velocidade e inclinação) em vez de kg × reps

Um exercício vira cardio com `"cardio": true`, e `"metaMin"` define a meta de tempo
(a barra de meta aparece no gráfico de TEMPO).

## Gráficos de evolução (aba DIÁRIO)

O card **EVOLUÇÃO** mostra a progressão de cada exercício:

- Chips pra escolher o exercício · modos **CARGA** / **VOLUME** (musculação),
  **TEMPO** / **DISTÂNCIA** (cardio) e **PESO** (peso corporal, no mesmo card)
- **Toque em qualquer ponto do gráfico** pra abrir aquele dia: séries com peso × reps,
  valor no modo atual, diferença pra sessão anterior, e um atalho **ver no calendário**
- Estatísticas: atual, recorde, evolução desde a 1ª sessão (kg e %), nº de sessões
- Barra de **meta** quando existe (`metaCarga` do leg press, `metaMin` da esteira, meta de peso do perfil)
- Cada exercício do formulário mostra um **mini gráfico + o ganho** ao lado —
  tocar nele abre aquele exercício no gráfico grande

Exercícios com o mesmo **nome** em dias diferentes (Leg Press da quarta e da sexta,
Supino Inclinado da segunda e da quinta) entram numa linha só.

## Peso corporal e meta de peso

No card EVOLUÇÃO, modo **PESO**: registra o peso do dia, vê o gráfico, a diferença desde
o primeiro registro e a barra de progresso até a meta (definida em ⚙/barra de perfil →
*Meta de peso*). Perder peso conta como evolução positiva (verde).

## Sincronizar os dois celulares (Firebase)

Com a sincronização ligada, cada aparelho **envia o próprio perfil e baixa o do outro** —
aí a aba DUPLA mostra os dois de verdade, em qualquer um dos celulares. O app fala com o
Firestore pela **API REST** (não carrega SDK nenhum), então continua funcionando offline:
sem internet, salva local e envia na próxima vez que abrir.

### Como ligar (dia a dia)

As chaves do projeto `treino-dupla` já vêm embutidas no app — o que separa uma dupla da
outra é o **código da dupla**:

1. Num celular: ⚙ → **Configurar sincronização** → **Gerar código novo** → **ATIVAR**
2. **🔗 Copiar link de convite** → manda pro parceiro no WhatsApp
3. Ele abre o link: o código já vem preenchido, é só tocar em **ATIVAR SINCRONIZAÇÃO**

Ativar **não apaga nada**: o que já estava no aparelho é enviado como cópia pra nuvem e o
perfil do outro é baixado.

> Trocar de projeto Firebase (se um dia quiser outro): ⚙ → Configurar sincronização →
> *Avançado: usar outro projeto Firebase* → cola o `firebaseConfig` novo.

### Criando o projeto do zero (já feito uma vez)

1. **console.firebase.google.com** → *Adicionar projeto* → nome (ex: `treino-dupla`) → pode desmarcar o Analytics
2. **Build → Firestore Database → Criar banco de dados** → modo produção → região `southamerica-east1`
3. Aba **Regras** → cola isto e publica:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /duplas/{sala}/perfis/{perfilId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Build → Authentication → Começar** → método **Anônimo** → ativar
5. **⚙ Configurações do projeto → Seus aplicativos → `</>` (Web)** → registra um app (apelido `treino`)
   → copia o bloco `const firebaseConfig = { ... }`
6. No app, no **seu** celular: ⚙ → **Configurar sincronização** → cola o bloco →
   **Gerar código novo** → **ATIVAR SINCRONIZAÇÃO**
7. No celular do **Igor**: mesma coisa, colando **o mesmo bloco** e **o mesmo código da dupla**

Pronto. A partir daí o envio é automático (2,5 s depois de cada alteração) e a leitura
acontece ao abrir o app e ao entrar na aba DUPLA. **⟳ Sincronizar agora** força na hora.

### O que fica salvo na nuvem

Só o que a dupla precisa ver: diário, peso corporal, marcações e os campos do perfil
(peso/altura/meta) — um documento por pessoa em `duplas/<código>/perfis/<perfil>`.
Ninguém escreve no documento do outro, então não existe conflito.

> 🔐 A chave do Firebase (`apiKey`) é pública por natureza — quem protege é a regra acima,
> que exige usuário autenticado. Combinada com o código aleatório da dupla, dá o nível de
> privacidade adequado pra um diário de treino. Não guarde nada sensível além disso.
> Custo: o plano gratuito (Spark) cobre folgado dois usuários.

## Aba DUPLA

Comparativo lado a lado dos dois perfis **do mesmo aparelho**: treinos no mês, último treino,
total de sessões, recorde de leg press, recorde de esteira, peso atual, diferença de peso
desde o 1º registro e um mini gráfico de frequência das últimas 6 semanas — mais o placar
de quem treinou mais no mês.

## Fechamento automático da sessão

Pra quando você começa marcando certinho e esquece o resto:

1. Ao marcar a **primeira série do dia**, começa uma contagem (padrão **4h**)
2. Aparece um aviso no topo da aba ROTINA: *"sessão em andamento — fecha sozinha em Xh"*,
   com **Concluir agora** e **Cancelar**
3. Passado o tempo, o app marca todos os exercícios do dia, conclui o dia e registra
   a sessão no diário repetindo as cargas da última vez (data = a do treino, não a da virada)

Ajuste em **⚙ → Fechamento automático do treino**: OFF · 3h · 4h · 5h.

> A contagem roda com o app aberto e também é conferida **ao reabrir o app** —
> como é um PWA sem servidor, se o celular ficar com o app fechado o fechamento
> é aplicado na próxima vez que você abrir.
> Concluir o dia à mão, resetar o dia ou salvar a sessão cancelam a contagem.

---

## Diário e backup

- O diário/progresso fica no `localStorage` **do aparelho** (não vai pra nuvem)
- **⚙ → Exportar backup** baixa um `.json` com tudo (diário + marcações + treino)
- **⚙ → Restaurar backup** importa esse arquivo de volta (serve pra trocar de celular)

## APK de verdade (opcional)

Se um dia quiser um `.apk` instalável fora do Chrome: com o app já publicado,
entra em **pwabuilder.com**, cola a URL e ele gera o pacote Android sozinho.
