# SSE Koa - ServerSide

## Description

O projeto SSE Koa é um projeto de NodeJS que utiliza o evento `message` do SSE para enviar mensagens para os clientes.

## Routes

Há duas rotas disponíveis na API:

    POST - `/sse/:token` - Registra o usuário no SSE e no cache.
    POST - `/sse/:token` - Recupera os dados vindo do JSON e retorna para o cliente usando SSE.

## Running

    yarn install
    yarn dev

## FrontEnd

Para acessar o projeto do FrontEnd, acesse:

https://github.com/rodriguesabner/sse-vue

## Roadmap

[x] - Cache implementado com Redis.

[x] - Salvar os dados em cache e local.

[x] - Recuperar os dados via cache e local.

[x] - Enviar dados para o cliente via Stream KOA.

[] - Armazenar a **função** do Readstream no Redis.
