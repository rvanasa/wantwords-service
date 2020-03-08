'use strict';

import block_parser from 'block-parser';

import {_findOptions} from './cache';

const blockParser = block_parser({pairs: '{}', quotes: '«»'});

export function getNamespace(key) {
    return key.substring(0, key.indexOf(':'));
}

export function fromNamespace(namespace, key) {
    return key.includes(':') ? key : namespace + ':' + key;
}

export function parse(key, data) {
    let namespace = getNamespace(key);
    let currentKey = key;
    let current = [];
    let locals = {};
    for(let line of data.split(/\r?\n/)) {
        line = line.trim();
        if(line.length && !line.startsWith('#')) {
            if(line.startsWith('{!') && line.endsWith('}')) {
                let mainKey = line.slice(2, -1).trim();
                locals[currentKey] = current;
                currentKey = mainKey;
            }
            else if(line.startsWith('{>') && line.endsWith('}')) {
                let nextKey = fromNamespace(namespace, line.slice(2, -1).trim());
                if(!nextKey) {
                    namespace = nextKey;
                }
                else if(currentKey !== nextKey) {
                    locals[currentKey] = current;
                    currentKey = nextKey;
                    current = locals.hasOwnProperty(currentKey) ? locals[currentKey] : [];
                }
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

export function createOptions(key, data) {
    return parse(key, data)[key];
}

export function resolveOptions(namespace, key, locals) {
    if(locals && !key.includes(':') && locals.hasOwnProperty(key)) {
        return locals[key];
    }
    let absKey = fromNamespace(namespace, key);
    if(locals && locals.hasOwnProperty(absKey)) {
        return locals[absKey];
    }
    return _findOptions(absKey);
}

export function chooseOption(namespace, input) {
    let options = typeof input === 'string' ? resolveOptions(namespace, input) : input;
    if(!options.length) {
        throw new Error(`No options were found from ${namespace}:${typeof input === 'string' ? input : '[...]'}`);
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
