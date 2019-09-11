const assert = require('assert');
const Postgres = require('./../database/strategies/postgres/postgresStrategy');
const UserSchema = require('./../database/strategies/postgres/schemas/userSchema');
const Context = require('./../database/strategies/base/contextStrategy');

let context = {};
const MOCK_USUARIO_CADASTRAR = {
    userrole: 'user',
    nome: 'Felipe',
    sobrenome: 'Geraldo',
    email: 'felipe.geraldo@serafinsdedeus.com.br',
    senha: '1234'
};
const MOCK_USUARIO_ATUALIZAR = {
    userrole: 'user',
    nome: 'Aline',
    sobrenome: 'Cristina',
    email: 'aline.cristina@serafinsdedeus.com.br',
    senha: '1234'
};

describe('Suite de testes do Postgres Strategy', function tests() {
    this.timeout(Infinity);
    this.beforeAll(async () => {
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, UserSchema)

        context = new Context(new Postgres(connection, model))

        await context.delete();
        await context.create(MOCK_USUARIO_ATUALIZAR)
    })
    it('Conecta no PostgresSql', async () => {
        const result = await context.isConected()

        assert.deepStrictEqual(result, true)
    })
    it('Cadastra alguem no PostgresSql', async () => {
        const result = await context.create(MOCK_USUARIO_CADASTRAR)
        delete result.id

        assert.deepStrictEqual(result, MOCK_USUARIO_CADASTRAR)
    })
    it('Lista os usuarios do PostgresSql', async () => {
        const [result] = await context.read({ nome: MOCK_USUARIO_CADASTRAR.nome })
        delete result.id

        assert.deepStrictEqual(result, MOCK_USUARIO_CADASTRAR)
    })
    it('Atualiza alguem no PostgresSql', async () => {
        const [itemAtualizar] = await context.read({ nome: MOCK_USUARIO_ATUALIZAR.nome })
        const novoItem = {
            ...MOCK_USUARIO_ATUALIZAR,
            nome: 'André'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id })

        assert.deepStrictEqual(result, 1)
        assert.deepStrictEqual(itemAtualizado.nome, novoItem.nome)
    })
    it('Remove alguem por id no PostgresSql', async () => {
        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepStrictEqual(result, 1)
    })
})