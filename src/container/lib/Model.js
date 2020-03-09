'use strict';

var mongoose = require('mongoose');

module.exports = function() {

    class Model {
        constructor(name, props) {
            this.name = name;

            this.props = props || {};
            this.methods = {};
        }

        table(tableName) {
            this.tableName = tableName;
        }

        prop(name, type, options) {
            this.current = Object.assign({
                type,
                required: true,
            }, options);
            this.props[name] = this.current;
            if(typeof type === 'string') {
                this.ref(type);
            }
            return this;
        }

        ref(type) {
            this.current.type = mongoose.Schema.Types.ObjectId;
            this.current.ref = type;
            return this;
        }

        opt() {
            this.current.required = false;
            return this;
        }

        lowercase() {
            this.current.lowercase = true;
            return this;
        }

        array() {
            delete this.current.required;
            this.current.type = [this.current.type];
            return this;
        }

        default(provider) {
            this.current.default = provider;
            return this;
        }

        unique() {
            if(!this.current.index) this.current.index = {};
            this.current.index.unique = true;
            return this;
        }

        enum(...options) {
            this.current.type = String;
            this.current.enum = options;
            return this;
        }

        validate(validator, message) {
            this.current.validate = [].concat(this.current.validate || [], arguments.length == 1 ? validator : {
                validator,
                message,
            });
            return this;
        }

        integer() {
            this.current.type = Number;
            return this.validate(Number.isInteger, `{VALUE} must be an integer`);
        }

        min(n) {
            if(this.current.type === Number) {
                this.current.min = n;
            }
            else {
                this.current.minlength = n;
            }
            return this;
        }

        max(n) {
            if(this.current.type === Number) {
                this.current.max = n;
            }
            else {
                this.current.maxlength = n;
            }
            return this;
        }

        method(name, handler) {
            if(!handler) {
                handler = name;
                name = handler.name;
            }

            this.methods[name] = handler;
            return this;
        }

        static(name, handler) {
            if(!handler) {
                handler = name;
                name = handler.name;
            }

            this.statics[name] = handler;
            return this;
        }

        toSchema() {
            return new mongoose.Schema(this.props);
        }

        build(connection) {
            var schema = this.toSchema();

            Object.assign(schema.methods, this.methods);
            Object.assign(schema.statics, this.statics);

            return connection.model(this.name, schema, this.tableName);
        }
    }

    return (...args) => new Model(...args);
};