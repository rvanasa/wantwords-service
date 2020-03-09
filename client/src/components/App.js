import React, {useEffect, useState} from 'react';
import {Col, ListGroup, ListGroupItem, Row} from 'react-bootstrap';
import {get, post} from '../util/api';
import KeyDetails from './KeyDetails';
import classes from '../util/classes';
import ListEditor from './ListEditor';
import {FaArrowRight, FaRandom, FaTimes, FaTrash} from 'react-icons/all';
import useLocalStorage from 'react-use-localstorage';

export default function App() {
    let [keys, setKeys] = useState([]);

    let [selected, setSelected] = useState(null);
    let [examples, setExamples] = useState([]);
    let [search, setSearch] = useState('');
    let [code, setCode] = useLocalStorage('code', '');
    let [prevCode, setPrevCode] = useLocalStorage('prevCode', '');
    let [hasError, setHasError] = useState(false);

    useEffect(() => {
        get('/lists')
            .then(setKeys)
            .catch(err => console.error(err.stack || err));
    }, []);

    async function handlePromise(promise) {
        try {
            let result = await promise;
            setHasError(false);
            return result;
        }
        catch(err) {
            setHasError(true);
            console.error(err.stack || err);
            return new Promise(() => null);
        }
    }

    async function loadExamples(key) {
        await handlePromise(get(`/random/${key}/15`))
            .then(examples => {
                setSelected(key);
                setExamples(examples);
            });
    }

    async function loadSource() {
        await handlePromise(get(`/source/${selected}`))
            .then(source => {
                // let [namespace, relative] = selected.split(':');
                source = `{! ${selected}}\n\n${source}`.trim() + '\n';
                if(!prevCode) {
                    setPrevCode(code);
                }
                setCode(source);
            });
    }

    async function evalCode() {
        if(!code) {
            return;
        }
        await handlePromise(post(`/choose/15`, code))
            .then(results => {
                setSelected('_');
                setExamples(results.map(text => ({text})));
            });
    }

    function popCode() {
        setCode(prevCode);
        setPrevCode('');
    }

    return (
        <div className="container-fluid pt-4">
            <Row>
                <Col md={3}>
                    <div className="pt-1 pb-2 bg-secondary rounded-top">
                        <div className="input-group">
                            <input className="form-control" autoFocus
                                   value={search}
                                   onChange={e => setSearch(e.target.value)}/>
                        </div>
                    </div>
                    <div style={{overflowX: 'hidden', overflowY: 'scroll', height: '80vh'}}>
                        <ListGroup>
                            {keys.filter(key => !search || key.includes(search.trim().toLowerCase())).map(key => (
                                <ListGroupItem
                                    key={key}
                                    {...classes('clickable pl-3 py-1',
                                        (examples && examples.some(x => x.key === key) ? 'bg-dark text-white' : ''))}
                                    onClick={() => loadExamples(key)}>
                                    {key.includes(':') && (
                                        <span className="text-secondary">{key.substring(0, key.indexOf(':') + 1)}</span>
                                    )}
                                    <span>{key.substring(key.indexOf(':') + 1)}</span>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                </Col>
                <Col md={3}>
                    {!examples.length && <h1 className="display-4 text-center text-dark mt-5">Want, Words!</h1>}
                    {!!examples.length && <>
                        <div style={{overflowY: 'scroll', height: '80vh'}}>
                            <KeyDetails examples={examples}/>
                        </div>
                        <div className="py-2 bg-dark rounded">
                            <div className="d-flex">
                                <input type="text" readOnly
                                       className="form-control-plaintext bg-light p-2 ml-1 rounded text-monospace"
                                       onFocus={e => e.target.select()}
                                       value={`{${selected}}`}/>
                                <div {...classes('btn btn-dark rounded', selected === '_' && 'disabled')}
                                     onClick={() => selected !== '_' && loadSource()}>
                                    <FaArrowRight/>
                                </div>
                            </div>
                        </div>
                    </>}
                </Col>
                <Col md={6}>
                    <div  {...classes('p-1 pr-0 rounded', hasError ? 'bg-danger' : 'bg-dark')}>
                        <div className="mt-1 mb-2">
                            <div {...classes('btn btn-dark rounded', !code && 'disabled')}
                                 onClick={() => evalCode()}>
                                <FaRandom style={{transform: 'scaleX(-1)'}}/>
                            </div>
                            <div {...classes('btn btn-dark rounded float-right', !code && 'disabled')}
                                 onClick={() => setCode('')}>
                                <FaTrash/>
                            </div>
                            {prevCode && (
                                <div className="btn btn-dark rounded text-danger"
                                     onClick={() => popCode()}>
                                    <FaTimes/>
                                </div>
                            )}
                        </div>
                        <div className="bg-light" style={{height: '80vh', overflow: 'auto'}}>
                            <ListEditor style={{minHeight: '100%'}}
                                        code={code}
                                        setCode={setCode}
                                        onEval={() => evalCode()}/>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}