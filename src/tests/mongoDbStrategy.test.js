const assert = require('assert')
const Mongodb = require('./../database/strategies/mongodb/mongodbStrategy')
const Context = require('./../database/strategies/base/contextStrategy')


let context = {}
describe('Suite de testes do MongoDb Strategy', function () {
    this.timeout(10000)
    this.beforeAll(() => {
        const connection = Mongodb.connect();
        context = new Context(new Mongodb(connection, PessoaSchema));
    })
    it('Verifica conexao do mongodb', async () => {
        const result = await context.isConected();

        assert.deepStrictEqual(result, 'Conectado');
    });
});