const Hapi = require('hapi');
const MongoDb = require('./database/strategies/mongodb/mongodbStrategy');
const Context = require('./database/strategies/base/contextStrategy');

const ItemSchema = require('./database/strategies/mongodb/schemas/itemsSchema');
const ItemRoute = require('./routes/itemsRoutes');

const PostgresDB = require('./database/strategies/postgres/postgresStrategy');
const AuthRoute = require('./routes/authRoutes');
const UserSchema = require('./database/strategies/postgres/schemas/userSchema');

const HapiAuthJwt2 = require('hapi-auth-jwt2');
const JWT_DEFAULT_SECRET = 'S&CRÊT';

const app = new Hapi.Server({ 
    port: 5000,
    routes: {
        cors: true
    }
 });

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
}

async function main() {
    const connectionPostgres = await PostgresDB.connect();
    const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
    const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

    const connection = MongoDb.connect();
    const mongodb = new Context(new MongoDb(connection, ItemSchema));

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
        ...mapRoutes(new ItemRoute(mongodb), ItemRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_DEFAULT_SECRET, postgresModel), AuthRoute.methods())
    ]);

    await app.start();
    console.log(`Aí bateu lá, papa. Na ${app.info.port}`);
    return app;
}

module.exports = main();
