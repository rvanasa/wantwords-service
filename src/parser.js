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
    if(!namespace) {
        throw new Error(`Namespace required to parse lines: ${data.slice(0, 10).replace('\n', '\\n')}...`);
    }
    let currentKey = fromNamespace(namespace, key);
    let current = [];
    let locals = {};
    for(let line of data.split(/\r?\n/)) {
        line = line.trim();
        if(line.length && !line.startsWith('#')) {
            if(line.startsWith('{!') && line.endsWith('}')) {
                let listKey = line.slice(2, -1).trim();
                locals[currentKey] = current;
                currentKey = listKey;
            }
            else if(line.startsWith('{>') && line.endsWith('}')) {
                let into = line.startsWith('{>>');
                let nextKey = fromNamespace(namespace, line.slice(into ? 3 : 2, -1).trim());
                let onlyNamespace = nextKey.indexOf(':') === nextKey.length - 1;
                if(onlyNamespace || into) {
                    namespace = getNamespace(nextKey);
                }
                if(!onlyNamespace && currentKey !== nextKey) {
                    locals[currentKey] = current;
                    currentKey = nextKey;
                    current = locals.hasOwnProperty(currentKey) ? locals[currentKey] : [];
                }
            }
            else {
                current.push({
                    namespace,
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
    return _findOptions(absKey).map(opt => ({
        ...opt,
        locals: {...opt.locals, ...locals},
    }));
}

export function chooseOption(namespace, input) {
    let options = typeof input === 'string' ? resolveOptions(namespace, input) : input;
    if(!options.length) {
        throw new Error(`No options were found from ${namespace}:${typeof input === 'string' ? input : '[...]'}`);
    }
    let option = options[Math.floor(Math.random() * options.length)];
    return instance(namespace, option);
}

function instance(namespace, option) {
    return {
        ...option,
        text: generate(option.namespace || namespace, option.text, option.locals),
    };
}

function generate(namespace, text, locals) {
    let result = blockParser.get(...[text]);
    return result.length > 1
        ? result[0].slice(0, -1) + evaluate(namespace, result[1], locals) + generate(namespace, result[2].slice(1), locals)
        : text;
}

function evaluate(namespace, expr, locals) {
    let cap = expr.startsWith('^');
    if(cap) {
        expr = expr.substring(1);
    }

    let key = fromNamespace(namespace, generate(namespace, expr, locals));
    let keyNamespace = getNamespace(key);
    let option = chooseOption(keyNamespace, resolveOptions(keyNamespace, key, locals));
    let result = option ? option.text : `{?${key}?}`;
    if(cap && result) {
        result = result[0].toUpperCase() + result.substring(1);
    }
    return result;
}
