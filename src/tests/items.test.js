const assert = require('assert')
const Mongodb = require('./../database/strategies/mongodb/mongodbStrategy')
const itemSchema = require('./../database/strategies/mongodb/schemas/itemsSchema')

const Context = require('./../database/strategies/base/contextStrategy')

let context = {}

const MOCK_CREATE_ITEM = {
    title: 'Do some',
    owner: 'Emmanuel',
    dateTime: new Date().setDate(30),
    completedAt: '',
};
const MOCK_UPDATE_ITEM = {
    title: 'Do some',
    owner: 'Emmanuel',
    dateTime: new Date(),
    priority: 3,
    completedAt: '',
};
let MOCK_ITEM_ID = '';

describe('Items tests suit', function () {
    this.timeout(Infinity)
    this.beforeAll(async () => {
        const connection = Mongodb.connect();
        context = new Context(new Mongodb(connection, itemSchema));

        const base = await context.create(MOCK_UPDATE_ITEM);
        MOCK_ITEM_ID = base._id;
    })
    it('Create item on mongodb', async () => {
        const { title } = await context.create(MOCK_CREATE_ITEM);

        assert.deepStrictEqual(title, MOCK_CREATE_ITEM.title)
    })
    it('Read items on mongodb', async () => {
        const [{ title }] = await context.read({ title: MOCK_UPDATE_ITEM.title });

        assert.deepStrictEqual(title, MOCK_UPDATE_ITEM.title)
    })
    it('Update an item on mongodb', async () => {
        const result = await context.update(MOCK_ITEM_ID, {
            title: 'Other thing'
        });

        assert.deepStrictEqual(result.nModified, 1);
    });
    it('Delete an item on mongodb', async () => {
        const result = await context.delete(MOCK_ITEM_ID);

        assert.deepStrictEqual(result.n, 1);
    });
});