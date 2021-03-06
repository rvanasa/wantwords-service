'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {chooseOption, createOptions, fromNamespace, getNamespace} from './parser';
import {_findSource, absoluteKeys} from './cache';

function sample(n, f) {
    return Array.from({length: n}).map((_, i) => f(i));
}

function chooseSample(n, input) {
    return sample(n, () => {
        let option = chooseOption('_', Array.isArray(input)
            ? input.map(text => ({key: '_', text: text}))
            : createOptions('_:_', input));
        return option.text;
    });
}

function handleChoose(requestKey) {
    let {key, text} = chooseOption('_', requestKey);
    return {key, text};
}

let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.text({type: '*/*'}));
router.use(cors());

router.get('/lists', (req, res) => {
    res.json(absoluteKeys);
});

router.get('/random/:key', (req, res) => {
    res.json(handleChoose(req.params.key));
});
router.get('/random/:key/:amount', (req, res) => {
    res.json(sample(req.params.amount, () => handleChoose(req.params.key)));
});

router.get('/source/:key', (req, res) => {
    let source = _findSource(req.params.key);
    if(!source) {
        return res.status(400).send(`Could not find source for "${req.params.key}"`);
    }
    res.json(source);
});

router.post('/choose', (req, res) => {
    let input = req.body.text || req.body;
    if(typeof input !== 'string' && !Array.isArray(input)) {
        return res.status(400).send('Invalid request body');
    }
    res.send(chooseSample(1, input)[0]);
});
router.post('/choose/:amount', (req, res) => {
    let input = req.body.text || req.body;
    if(typeof input !== 'string' && !Array.isArray(input)) {
        return res.status(400).send('Invalid request body');
    }
    res.send(chooseSample(req.params.amount, input));
});

export default router;

