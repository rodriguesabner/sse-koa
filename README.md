# SSE Koa - ServerSide

## Description

Este projeto foi feito usando NodeJS/Koa. E utiliza o evento `message` do SSE para enviar mensagens para os clientes.

## Routes

Há duas rotas disponíveis na API:
#### O EventSource aceita apenas GET. 

    GET - `/sse/:token` - Registra o usuário no SSE e no cache.
    POST - `/sse/:token` - Recupera os dados vindo do JSON e retorna para o cliente usando SSE.

## Running

    yarn install
    yarn dev

## FrontEnd

Para acessar o projeto do FrontEnd, acesse:

https://github.com/rodriguesabner/sse-vue

## Roadmap

* [x]  Cache implementado com Redis.
* [x]  Salvar os dados em cache e local.
* [x]  Recuperar os dados via cache e local.
* [x]  Enviar dados para o cliente via Stream KOA.
* [ ]  Armazenar a **função** do Readstream no Redis.

## Demo
![Peek 2022-01-30 16-28](https://user-images.githubusercontent.com/40338524/151714491-80b22d81-02c3-4326-a092-e7af516a90cb.gif)
