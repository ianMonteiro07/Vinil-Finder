# Vinil Finder

Projeto web desenvolvido como atividade acadêmica para consumo de APIs públicas e boas práticas de desenvolvimento front-end.

##  Como executar localmente

Clone este repositório no seu terminal:
\`\`\`bash
git clone https://github.com/ianMonteiro07/Vinil-Finder.git
\`\`\`
Abra o arquivo `index.html` no seu navegador ou utilize a extensão Live Server no VS Code.

## 📡 Documentação da API

O projeto utiliza a **iTunes Search API**. 
* **O que é:** Uma API pública disponibilizada pela Apple para consulta de metadados de mídias (músicas, álbuns, vídeos) disponíveis na iTunes Store.
* **Autenticação:** Nenhuma. A API é de acesso público e não requer chaves de API (API Keys).

Para otimizar o consumo de dados, a arquitetura do projeto utiliza um encadeamento de dois endpoints distintos:

### 1. Endpoint Principal (Busca de Álbuns)
* **URL:** `https://itunes.apple.com/search`
* **Parâmetros de interação:**
  * `term`: O termo de busca (nome do artista ou banda).
  * `entity`: Definido como `album` para restringir os resultados apenas a álbuns/discos.
  * `limit`: Definido como `50` para limitar a quantidade de registros retornados.
* **Interação:** O front-end envia uma requisição GET com os parâmetros acima e recebe um objeto JSON contendo um array `results` com os metadados das capas, preços e datas de lançamento.

### 2. Endpoint Secundário (Tracklist e Player de Áudio)
* **URL:** `https://itunes.apple.com/lookup`
* **Parâmetros de interação:**
  * `id`: O identificador único do álbum clicado (referenciado internamente como `collectionId`).
  * `entity`: Definido como `song` para trazer as faixas contidas dentro daquele disco.
* **Interação:** Para evitar sobrecarga de rede, esta requisição GET só é disparada quando o usuário clica em um disco específico. A API retorna as faixas do álbum correspondente, fornecendo os dados de tempo da música e a `previewUrl` (trecho de 30 segundos em MP4), que é injetada dinamicamente no player nativo da interface (Modal).

## 🛠 Tecnologias Utilizadas

* **HTML5:** Estrutura semântica do projeto.
* **CSS3:** Estilização com variáveis customizadas, Flexbox, Grid e layout imersivo (Dark Mode).
* **JavaScript Vanilla:** Lógica de negócios e gerenciamento de estado.
  * Consumo de API RESTful com `Fetch API` e funções `async/await`.
  * Manipulação dinâmica de DOM.
  * Persistência de dados locais com `LocalStorage`.
  * Otimização de requisições de rede com técnica de `Debounce`.
  * Manipulação de Arrays utilizando Higher-Order Functions (`forEach`, `filter`, `some`, `sort`).
