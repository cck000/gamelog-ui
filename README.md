#  GameLog UI (Frontend)

> Interface de usuário moderna e responsiva para o **GameLog**, um aplicativo web para organizar sua coleção de jogos.

Construído com Next.js (App Router), este projeto foca em uma experiência fluida de *Single Page Application* (SPA), oferecendo um design escuro (Dark Mode) inspirado em plataformas modernas de jogos.

##  Funcionalidades Visuais

- **Dashboard Dinâmico:** Visualize todos os seus jogos salvos em formato de "Pôster de Cinema" (aspect-ratio 16:9).
- **Busca em Tempo Real (Local):** Filtre seus jogos rapidamente sem recarregar a página utilizando a Context API.
- **Modal de Adição Inteligente:** Busque novos jogos através da integração com a RAWG API sem perder o contexto da sua biblioteca atual.
- **Design Responsivo:** Layout que se adapta perfeitamente a celulares, tablets e desktops.
- **Proteção de Rotas:** Middleware inteligente que redireciona usuários não autenticados para a tela de login.

##  Tecnologias Utilizadas

- **Next.js 14+** (App Router)
- **React 18**
- **Tailwind CSS** (Estilização)
- **TypeScript** (Tipagem estática)
- **Axios** (Requisições HTTP com interceptadores)
- **Lucide React** (Ícones SVG leves)
- **JS-Cookie** (Gerenciamento de sessão no lado do cliente)

##  Telas da Aplicação
### Tela de Login
<img width="1339" height="900" alt="gamelog_login" src="https://github.com/user-attachments/assets/a90f47c1-abbf-4b02-a7b6-01af3cbe8bf3" />
### Dashboard (Minha Biblioteca)
<img width="1265" height="917" alt="gamelog_dash" src="https://github.com/user-attachments/assets/54862a75-6cc6-4546-8d9c-2344b1b6462e" />
### Busca na API (RAWG)
<img width="1386" height="906" alt="gamelog_busca" src="https://github.com/user-attachments/assets/2bcaa654-275a-45e3-8f04-09d6a4021600" />
### Detalhes e Gerenciamento do Jogo
<img width="1304" height="910" alt="gamelog_detalhes" src="https://github.com/user-attachments/assets/6174dd53-a057-434f-8930-ec5f72f53387" />
