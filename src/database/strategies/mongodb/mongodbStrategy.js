const ICrud = require('./../../../interfaces/ICrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando',
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super();
        this._schema = schema;
        this._connection = connection;
    }
    async isConected() {
        const state = STATUS[this._connection.readyState];
        if (state === 'Conectado') return state;

        if (state !== 'Conectando') return state;
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]
    }

    static connect() {
        Mongoose.connect(`mongodb+srv://emmanuel:emmanuel@pessoas-e2ext.mongodb.net/TodoList`,
            { useNewUrlParser: true }, function (error) {
                if (!error) return;
                console.log("Não liguei lá não, pai", error);
            })

        const connection = Mongoose.connection;

        connection.once('open', async () => console.log('Liga noix, pai'));
        return connection;
    }

    create(item) {
        return this._schema.create(item);
    }
    read(query, skip = 0, limit = 10) {
        return this._schema.find(query).skip(skip).limit(limit);
    }
    update(_id, item) {
        return this._schema.updateOne({ _id }, { $set: item });
    }
    delete(_id) {
        return this._schema.deleteOne({ _id });
    }
}

module.exports = MongoDB;