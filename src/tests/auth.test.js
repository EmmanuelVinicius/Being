const assert = require('assert');

const api = require('../api');
const Context = require('./../database/strategies/base/contextStrategy');
const Postgres = require('../database/strategies/postgres/postgresStrategy');
const UserSchema = require('./../database/strategies/postgres/schemas/userSchema');

const MOCK_DEFAULT_USER = {
    userrole: 'user',
    name: 'Felipe',
    email: 'felipe.update@serafinsdedeus.com.br',
    password: '321123'
};

let app = {}

const MOCK_DB_USER = {
    ...MOCK_DEFAULT_USER,
    password: '$2b$04$SdlyEJsy.o5UgsgVr5csJ.ralZVyPviGH80BOb0zJCTSis30RB8Ba'
}

describe('Auth test suite', function () {
    this.timeout(Infinity);
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await Postgres.connect();
        const model = await Postgres.defineModel(connectionPostgres, UserSchema);
        const postgresModel = new Context(new Postgres(connectionPostgres, model));
        postgresModel.update(null, MOCK_DB_USER, true);
    });
    it('Obtém um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: MOCK_DEFAULT_USER.email,
                password: MOCK_DEFAULT_USER.password
            }
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.deepStrictEqual(statusCode, 200);
        assert.ok(dados.token.length > 10);
    })

    
    it('deve retornar não autorizado ao tentar obter um token com login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'emmanuel@emmanuel.com',
                password: '4321'
            }
        });
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 401)
    })
});