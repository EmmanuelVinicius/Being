const assert = require('assert');
const api = require('./../api');


const MOCK_CREATE_ITEM = {
    title: 'Do some',
    owner: 'Emmanuel',
}
let MOCK_ID = {}
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InByaXNyYWVsIiwiaWQiOjEsImlhdCI6MTU1MDc0OTY0M30.R6RMKeWOmpFd-COAHx7DI0vGXwlkE_L3guDhS_XxOz4'
const headers = {
    authorization: TOKEN
}


describe('Suite de Testes da API', function () {
    this.timeout(Infinity);
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/items',
            headers,
            payload: JSON.stringify(MOCK_CREATE_ITEM)
        })
        const id = JSON.parse(result.payload)
        MOCK_ID = id._id
    })

    it('Lista a partir da /items', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/items?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepStrictEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });
    it('Lista de /items com limit correto', async () => {
        const TAMANHO_LIMITE = 3;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/items?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE)
    });
    it('Lista de /items com paginacao e dá erro de limit', async () => {
        const TAMANHO_LIMITE = 'ASFE';
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/items?skip=0&limit=${TAMANHO_LIMITE}`
        });
        const statusCode = result.statusCode;

        assert.ok(statusCode !== 200);
    })
    it('Filtra de /items', async () => {
        const TAMANHO_LIMITE = 1000;
        const TITLE = MOCK_CREATE_ITEM.title
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/items?skip=0&limit=${TAMANHO_LIMITE}&title=${TITLE}`
        });
        const [{ title }] = JSON.parse(result.payload)
        const statusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(title === TITLE)
    });
    it('Cadastra em /items', async () =>{
        const result = await app.inject({
            method: 'POST',
            headers,
            url: `/items`,
            payload: MOCK_CREATE_ITEM
        });

        const statusCode = result.statusCode;
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200);
        assert.notDeepStrictEqual(_id, undefined)
        assert.deepStrictEqual(message, 'Cadastrado com sucesso')
    })
    it('Atualiza item de /items/:id', async () =>{
        const expected = {
            priority: 2
        }
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/items/${MOCK_ID}`,
            payload: JSON.stringify(expected)

        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepStrictEqual(dados.message, 'Atualizado com sucesso')
    });
    it('Não atualiza item de /items/:id e dá erro de ID', async () => {
        const expected = {
            priority: 3
        }
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/items/5c6b04973c32352ecc6cfd24`,
            payload: JSON.stringify(expected)

        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);
        
        assert.ok(statusCode !== 200);
        assert.deepStrictEqual(dados.message, 'Deu erro, bixo!')
    });
    it('Remove de /items/:id', async () => {
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/items/${MOCK_ID}`
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepStrictEqual(dados.message, 'Removido com sucesso');

    });
    it('Não remove de /items/:id e dá erro de ID', async () => {
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/items/5c6b04973c32352ecc6cfd24`
        });
        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.ok(statusCode !== 200);
        assert.deepStrictEqual(dados.message, 'Deu erro, bixo!');

    })
});