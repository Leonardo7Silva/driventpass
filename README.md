# driventpass

O pass é um Armazenador de senhas e redes que, respeitando a LGPD, não armazena as senhas em si. mas sim um hash cryptografado das senhas em um Banco PostgresSQL

## Rotas da API


<h4>POST: /user</h4>

Esta rota registra um usuário. <br>
Deve ser enviado no corpo da requisição uma chave "email" e uma chave "password" para ser válida. Exemplo:
```bash
{
  "email":"Example@example.com",
  "password":"ExamplePassword"
}
```

<h4>POST: /auth/signin</h4>

Essa rota valida um usuário e devolve um token que deverá ser enviado no header como Autorization em todas as proximas rotas. <br>
Deve ser enviado no corpo da requisição uma chave "email" e uma chave "password" contendo dados de um usuário válido. Exemplo:
```bash
{
  "email":"Example@example.com",
  "password":"ExamplePassword"
}
``` 

<h4>POST: /credential</h4>

Essa rota registra uma credencial contendo um título, o link do site, o username e a password. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>"* e no body as chaves "title", "link", "username" e "password". Exemplo:
```bash
{
  "tilte":"ExampleTitle",
  "link":"http://Example.com.br",
  "username":"Example",
  "password":"ExamplePassword"
}
```
*O token é recebido na rota /auth/signin <br>
**Um mesmo usuário não pode registrar duas credenciais com o mesmo título.


<h4>GET: /credential</h4>

Essa rota retorna todas as credenciais registradas em nome do usuário. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>" (O token é recebido na rota /auth/signin)

<h4>GET: /credential/credentialId</h4>

Essa rota retorna uma única credencial. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>" (O token é recebido na rota /auth/signin)<br>
OBS: Se o credentialId não exitir ou estiver registrada em nome de outro usuário, a API retornará um erro de BAD REQUEST.

<h4>DELETE: /credential/credentialId</h4>

Essa rota deleta uma única creencial. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>" (O token é recebido na rota /auth/signin)<br>
OBS: Se o credentialId não exitir ou estiver registrada em nome de outro usuário, a API retornará um erro de BAD REQUEST.

<h4>POST: /network</h4>

Essa rota registra uma rede wi-fi contendo um título,o nome da rede e a senha. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>"* e no body as chaves "title", "network" e "password". Exemplo:
```bash
{
  "tilte":"ExampleTitle",
  "network":"ExampleName",
  "password":"ExamplePassword"
}
```
*O token é recebido na rota /auth/signin <br>


<h4>GET: /network</h4>

Essa rota retorna todas as rede wi-fi registradas em nome do usuário. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>" (O token é recebido na rota /auth/signin)

<h4>GET: /network/networkId</h4>

Essa rota retorna uma única rede wi-fi. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>" (O token é recebido na rota /auth/signin)<br>
OBS: Se o networkId não exitir ou estiver registrada em nome de outro usuário, a API retornará um erro de BAD REQUEST.

<h4>DELETE: /network/networkId</h4>

Essa rota deleta uma única rede wi-fi. <br>
Deve ser enviado no Header da requisição uma "Authorization" com "Bearer <b>token</b>" (O token é recebido na rota /auth/signin)<br>
OBS: Se o networkId não exitir ou estiver registrada em nome de outro usuário, a API retornará um erro de BAD REQUEST.




## Como rodar em desenvolvimento

1. Clone esse repositório
2. Intale todas as dependências

```bash
npm i
```

3. Crie um Banco de dados PostgresSQL
4. Configure o arquivo `.env.development` usando o arquivo `.env.example`
5. Rode as migrações

```bash
npm run dev:migration:run
```

6. Semeie o banco de dados

```bash
npm run dev:seed
```

6. Rodar a API em desenvolvimento:

```bash
npm run dev
```
