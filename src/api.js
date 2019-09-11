const Hapi = require('hapi');
const MongoDb = require('./database/strategies/mongodb/mongodbStrategy');
const Context = require('./database/strategies/base/contextStrategy');

const ItemSchema = require('./database/strategies/mongodb/schemas/itemsSchema');
const ItemRoute = require('./routes/itemsRoutes');
const AuthRoute = require('./routes/authRoutes');

const HapiAuthJwt2 = require('hapi-auth-jwt2')


const JWT_DEFAULT_SECRET = 'S&CRÊT';
const app = new Hapi.Server({ port: 5000 })

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, ItemSchema));

    await app.register([HapiAuthJwt2,]);
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_DEFAULT_SECRET,
        options: {
            expiresIn: 1800000
        },
        validate: (dados, request) => {
            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new ItemRoute(context), ItemRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_DEFAULT_SECRET), AuthRoute.methods())
    ]);

    await app.start();
    console.log(`Aí bateu lá, papa. Na ${app.info.port}`);
    return app;
}

module.exports = main();
