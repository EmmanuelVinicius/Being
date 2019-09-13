const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');

const PasswordHelper = require('./../helpers/passwordHelper');
const BaseRoute = require('./base/baseRoute');

const failAction = (request, headers, erro) => { console.error('Caiu no failAction, papa', erro); }


class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super();
        this._secret = secret;
        this._db = db;
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const {
                    username,
                    password
                } = await request.payload;

                const [user] = await this._db.read({
                    email: username.toLowerCase()
                })
                console.log()
                if (!user) return Boom.unauthorized('Email error');

                const match = await PasswordHelper.comparePassword(password, user.password);
                if (!match) return Boom.unauthorized('Password error');
                const token = Jwt.sign({
                    username: username,
                }, this._secret);

                return { token, user:user.id }
            }
        }
    }
}

module.exports = AuthRoutes;