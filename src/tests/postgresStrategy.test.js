const assert = require('assert');
const Postgres = require('./../database/strategies/postgres/postgresStrategy');
const UserSchema = require('./../database/strategies/postgres/schemas/userSchema');
const Context = require('./../database/strategies/base/contextStrategy');

let context = {};
const MOCK_CREATE_USER = {
    userrole: 'user',
    name: 'Felipe',
    email: 'felipe.geraldo@serafinsdedeus.com.br',
    password: '$2b$04$SdlyEJsy.o5UgsgVr5csJ.ralZVyPviGH80BOb0zJCTSis30RB8Ba'
};
const MOCK_UPDATE_USER = {
    userrole: 'user',
    name: `Felipe${new Date()}`,
    email: `felipe.update@serafinsdedeus.com.br`,
    password: '$2b$04$SdlyEJsy.o5UgsgVr5csJ.ralZVyPviGH80BOb0zJCTSis30RB8Ba'
};

describe('Postgres Strategy tests suit', function tests() {
    this.timeout(Infinity);
    this.beforeAll(async () => {
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, UserSchema)

        context = new Context(new Postgres(connection, model))

        await context.delete();
        await context.create(MOCK_UPDATE_USER)
    })
    it('Conecta no PostgresSql', async () => {
        const result = await context.isConected()

        assert.deepStrictEqual(result, true)
    })
    it('Cadastra alguem no PostgresSql', async () => {
        const result = await context.create(MOCK_CREATE_USER)
        delete result.id

        assert.deepStrictEqual(result, MOCK_CREATE_USER)
    })
    it('Lista os usuarios do PostgresSql', async () => {
        const [result] = await context.read({ name: MOCK_CREATE_USER.name })
        delete result.id

        assert.deepStrictEqual(result.name, MOCK_CREATE_USER.name)
    })
    it('Atualiza alguem no PostgresSql', async () => {
        const [itemAtualizar] = await context.read({ name: MOCK_UPDATE_USER.name })
        const novoItem = {
            ...MOCK_UPDATE_USER,
            name: 'André'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id })

        assert.deepStrictEqual(result, 1)
        assert.deepStrictEqual(itemAtualizado.name, novoItem.name)
    })
    it('Remove alguem por id no PostgresSql', async () => {
        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepStrictEqual(result, 1)
    })
})