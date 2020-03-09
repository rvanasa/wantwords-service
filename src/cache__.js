// 'use strict';
//
// import fs from 'fs';
// import {join, relative, resolve} from 'path';
//
// import glob from 'glob-promise';
// import {createOptions} from './parser';
//
// import gitPromise from 'simple-git/promise';
//
// const cacheDir = './cache';
//
// export let absoluteKeys = [];
// let optionsFromKey = {};
// let absoluteKeysFromGlobal = {};
// let sourceFromGlobal = {};
//
// export const _findOptions = function findOptions(key) {
//     let options = optionsFromKey[key];
//     if(!options) {
//         throw new Error('Unknown key: ' + key);
//     }
//     if(!options.length) {
//         throw new Error('No options found for key: ' + key);
//     }
//     return options;
// };
//
// export async function update(initial) {
//     if(initial) {
//         if(!fs.existsSync(cacheDir)) {
//             console.log('Cloning repository...');
//             let git = gitPromise(resolve(cacheDir, '..'));
//             await git.clone('https://github.com/rvanasa/wantwords', 'cache');
//         }
//     }
//     let git = await gitPromise(cacheDir);
//     if(!initial && !(await git.status()).behind) {
//         return;
//     }
//
//     console.log('Updating cache...');
//     await git.fetch('https://github.com/rvanasa/wantwords');
//
//     absoluteKeys.length = 0;
//     optionsFromKey = {};
//     absoluteKeysFromGlobal = {};
//     sourceFromGlobal = {};
//
//     for(let namespace of fs.readdirSync(join(cacheDir, 'words'))) {
//         namespace = namespace.toLowerCase();
//
//         let dir = join(cacheDir, 'words', namespace);
//         if(!fs.lstatSync(dir).isDirectory()) {
//             continue;
//         }
//         glob.sync(`${dir}/**/*.{txt,want}`)
//             .forEach(file => {
//                 let data = fs.readFileSync(file).toString('utf8')
//                     .replace('\r\n', '\n')
//                     .trim();
//
//                 let key = relative(dir, file)
//                     .slice(0, -4)
//                     .replace(/[\\/]/g, '.')
//                     .replace('-', '_')
//                     .toLowerCase();
//
//                 // absoluteKeys.push(`${namespace}:${key}`);
//
//                 // let options = createOptions(key, data);
//                 //
//                 // include(optionsFromKey, `${namespace}:${key}`, options);
//                 // include(optionsFromKey, `:${key}`, options);
//                 // include(absoluteKeysFromGlobal, namespace, `${namespace}:${key}`);
//
//                 let short = key.substring(key.lastIndexOf('.') + 1);
//                 let absShort = `${namespace}:${short}`;
//
//                 let options = createOptions(absShort, data);
//
//                 absoluteKeys.push(absShort);
//                 include(optionsFromKey, absShort, options);
//                 // include(optionsFromKey, `:${short}`, options);
//                 include(absoluteKeysFromGlobal, namespace, absShort);
//                 // TODO collision handling
//                 sourceFromGlobal[absShort] = data;
//             });
//     }
//     absoluteKeys.sort();
//     console.log('Completed.');
// }
//
// export const _findSource = function findSource(key) {
//     return sourceFromGlobal.hasOwnProperty(key) ? sourceFromGlobal[key] : null;
// };
//
// function include(map, key, options) {
//     map[key] = (map[key] || []).concat(options);
// }
