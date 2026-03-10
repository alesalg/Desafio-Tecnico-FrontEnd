# Car Rental Frontend - Desafio Tecnico

Sistema de reserva de veiculos desenvolvido em Angular 18 com standalone components e signals.

## Tecnologias

- **Angular 18** com standalone components
- **Signals** (`signal()`, `computed()`, `input()`, `output()`) para gerenciamento de estado
- **Functional Guards** (`CanActivateFn`) para protecao de rotas
- **Lazy Loading** com `loadComponent` em todas as rotas
- **LocalStorage** para persistencia de dados (mock backend)
- **SCSS** para estilizacao
- **Google Fonts** (Inter e Poppins)

## Como rodar

```bash
npm install
ng serve
```

Acesse `http://localhost:4200/`

## Credenciais de acesso

| Nome           | E-mail            | Senha  |
|----------------|-------------------|--------|
| Marcos Silva   | marcos@email.com  | 123456 |
| Ana Oliveira   | ana@email.com     | 123456 |
| Carlos Santos  | carlos@email.com  | 123456 |

Tambem e possivel criar uma nova conta pela tela de cadastro (`/register`).

## Regras de Negocio

- Cada usuario pode ter apenas **1 reserva ativa** por vez
- Um veiculo reservado nao pode ser reservado por outro usuario
- Veiculos reservados nao podem ser removidos
- Usuario logado nao pode remover a si mesmo

## Responsividade

- **Mobile first** com breakpoints em 380px, 768px, 1024px, 1280px e 1440px
- **Bottom nav** no mobile, **top nav** no desktop (768px+)
- Grid de veiculos adaptavel: 1 a 6 colunas conforme largura da tela

## Estrutura do Projeto

```
src/app/
  components/       # Componentes reutilizaveis (vehicle-card, bottom-nav)
  guards/           # Guards de autenticacao (authGuard, publicGuard)
  mocks/            # Dados mock (usuarios, veiculos, reservas)
  models/           # Interfaces TypeScript
  pages/            # Paginas da aplicacao
    login/
    register/
    home/
    filters/
    vehicles/
    reservations/
    users/
  services/         # Servicos (auth, vehicle, reservation, user)
  app.routes.ts     # Configuracao de rotas com lazy loading
```
