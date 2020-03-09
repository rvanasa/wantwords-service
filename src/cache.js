'use strict';

import {join, relative, resolve} from 'path';
import axios from 'axios';
import normalizeUrl from 'normalize-url';

import {parse} from './parser';

export let absoluteKeys = [];
let localsFromNamespace = {};
let optionsFromKey = {};
let sourceFromKey = {};

function addNamespace(namespace, locals) {
    localsFromNamespace[locals] = namespace;
    Object.entries(locals).forEach(([key, options]) => {
        if(!options.length) {
            return;
        }
        absoluteKeys.push(key);
        optionsFromKey[key] = options;
        sourceFromKey[key] = options.map(({text}) => text).join('\n');//TEMP
    });
}

// let mainUrl = 'https://rvanasa.github.io/wantwords';
let mainUrl = 'https://raw.githubusercontent.com/rvanasa/wantwords/gh-pages';

export async function update(initial) {
    absoluteKeys.length = 0;
    localsFromNamespace = {};
    optionsFromKey = {};
    sourceFromKey = {};

    await Promise.all((await axios.get(`${mainUrl}/_namespaces.txt`)).data.split('\n')
        .map(async namespace => {
            let locals = parse(`${namespace}:_`, (await axios.get(`${mainUrl}/${namespace}.want`)).data);
            addNamespace(namespace, locals);
        }));
}

export const _findOptions = function findOptions(key) {
    let options = optionsFromKey[key];
    if(!options) {
        throw new Error('Unknown key: ' + key);
    }
    if(!options.length) {
        throw new Error('No options found for key: ' + key);
    }
    return options;
};

export const _findSource = function findSource(key) {
    return sourceFromKey.hasOwnProperty(key) ? sourceFromKey[key] : null;
};

// function include(map, key, options) {
//     map[key] = (map[key] || []).concat(options);
// }
