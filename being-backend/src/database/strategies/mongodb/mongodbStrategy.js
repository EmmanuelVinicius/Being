const ICrud = require('./../../../interfaces/ICrud')
const Mongoose = require('mongoose')

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super();
        this._schema = schema;
        this._connection = connection;
    }
    async isConected() {
        const state = this._connection.readyState;
        if (state === 1) return state;

        if (state !== 2) return state;
        await new Promise(resolve => setTimeout(resolve, 1000))

        return this._connection.readyState;
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
        const result = query.id ? this._schema.findById(query.id) :
            this._schema.find(query).skip(skip).limit(limit);
        return result;
    }

    update(_id, item) {
        return this._schema.updateOne({ _id }, { $set: item });
    }

    delete(_id) {
        return this._schema.deleteOne({ _id });
    }
}

module.exports = MongoDB;