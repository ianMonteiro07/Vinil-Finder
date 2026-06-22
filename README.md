#Vinil Finder

Projeto web desenvolvido como atividade acadêmica para consumo de APIs públicas e boas práticas de desenvolvimento front-end.

## 🚀 Como executar localmente

1. Clone este repositório:
   cole:
   git clone [https://github.com/ianMonteiro07/Vinil-Finder.git](https://github.com/ianMonteiro07/Vinil-Finder.git)

Documentação da API
O projeto utiliza a iTunes Search API.

O que é: Uma API pública disponibilizada pela Apple para consulta de metadados de mídias (músicas, álbuns, vídeos) disponíveis na iTunes Store.

Autenticação: Nenhuma. A API é de acesso público e não requer chaves de API (API Keys).

Endpoint utilizado: https://itunes.apple.com/search

Parâmetros de interação:

term: O termo de busca (nome do artista ou banda).

entity: Definido como album para restringir os resultados a álbuns/discos.

limit: Definido como 50 para limitar a quantidade de registros retornados.

Interação: O front-end envia uma requisição GET com os parâmetros acima e recebe um objeto JSON contendo um array results com os metadados dos álbuns.

🛠 Tecnologias Utilizadas
HTML5 (Estrutura semântica)

CSS3 (Flexbox, Grid e Dark Mode)

JavaScript (Fetch API, Manipulação de DOM, Arrays e Higher-Order Functions)
