'use strict';

const blockParser = require('block-parser')({pairs: '{}', quotes: '«»'});

function getNamespace(key) {
    return key.substring(0, key.indexOf(':'));
}

function fromNamespace(namespace, key) {
    return key.includes(':') ? key : namespace + ':' + key;
}

function createLocals(key, data) {
    let namespace = getNamespace(key);
    let currentKey = key;
    let current = [];
    let locals = {};
    for(let line of data.split(/\r?\n/)) {
        line = line.trim();
        if(line.length && !line.startsWith('#')) {
            if(line.startsWith('{::') && line.endsWith('}')) {
                locals[currentKey] = current;
                currentKey = fromNamespace(namespace, line.slice(3, -1).trim());
                current = [];
            }
            else {
                current.push({
                    locals,
                    key: currentKey,
                    text: line,
                });
            }
        }
    }
    locals[currentKey] = current;
    return locals;
}

function createOptions(key, data) {
    return createLocals(key, data)[key];
}

function resolveOptions(namespace, key, locals) {
    if(locals && !key.includes(':') && locals.hasOwnProperty(key)) {
        return locals[key];
    }
    let absKey = fromNamespace(namespace, key);
    if(locals && locals.hasOwnProperty(absKey)) {
        return locals[absKey];
    }
    return require('./cache')._findOptions(absKey);
}

function chooseOption(namespace, options) {
    if(typeof options === 'string') {
        options = resolveOptions(namespace, options);
    }

    let option = options[Math.floor(Math.random() * options.length)];
    return instance(option);
}

function instance(option) {
    return {
        ...option,
        text: parseOption(getNamespace(option.key), option.text, option.locals),
    };
}

function parseOption(namespace, text, locals) {
    let result = blockParser.get(...[text]);
    return result.length > 1
        ? result[0].slice(0, -1) + evaluate(namespace, result[1], locals) + parseOption(namespace, result[2].slice(1), locals)
        : text;
}

function evaluate(namespace, expr, locals) {
    let cap = expr.startsWith('^');
    if(cap) {
        expr = expr.substring(1);
    }

    expr = parseOption(namespace, expr, locals);// Nested resolvers
    if(namespace && !expr.includes(':')) {
        expr = `${namespace}:${expr}`;
    }
    let option = chooseOption(namespace, resolveOptions(namespace, expr, locals));
    let result = option ? option.text : `{?${expr}?}`;
    if(cap && result) {
        result = result[0].toUpperCase() + result.substring(1);
    }
    return result;
}

module.exports = {
    createLocals,
    createOptions,
    resolveOptions,
    chooseOption,
    instance,
    evaluate,
};
