import React, {useEffect, useState} from 'react';
import {Col, ListGroup, ListGroupItem, Row} from 'react-bootstrap';
import {get, post} from '../util/api';
import KeyDetails from './KeyDetails';
import classes from '../util/classes';
import CodeEditor from './CodeEditor';
import {FaArrowRight, FaRandom, FaTrash} from 'react-icons/all';
import useLocalStorage from 'react-use-localstorage';

export default function App() {
    let [keys, setKeys] = useState([]);

    let [selected, setSelected] = useState(null);
    let [examples, setExamples] = useState([]);
    let [search, setSearch] = useState('');
    let [code, setCode] = useLocalStorage('code', '');

    useEffect(() => {
        get('/lists')
            .then(setKeys)
            .catch(err => console.error(err.stack || err));
    }, []);

    function handleError(err) {
        console.error(err.stack || err);
    }

    function loadExamples(key) {
        get(`/random/${key}/15`)
            .then(examples => {
                setSelected(key);
                setExamples(examples);
            })
            .catch(handleError);
    }

    function loadSource() {
        get(`/source/${selected}`)
            .then(source => {
                if(!source.endsWith('\n')) {
                    source += '\n';
                }
                setCode(source);
            })
            .catch(handleError);
    }

    function evalCode() {
        if(!code) {
            return;
        }
        post(`/choose/15`, code)
            .then(results => {
                setSelected('_');
                setExamples(results.map(text => ({text})));
            })
            .catch(handleError);
    }

    return (
        <div className="container-fluid pt-4">
            <Row>
                <Col md={4}>
                    <div className="pt-1 pb-2 bg-secondary rounded-top">
                        <div className="input-group">
                            <input className="form-control" autoFocus
                                   value={search}
                                   onChange={e => setSearch(e.target.value)}/>
                        </div>
                    </div>
                    <div style={{overflowY: 'scroll', height: '80vh'}}>
                        <ListGroup>
                            {keys.filter(key => !search || key.includes(search.toLowerCase())).map(key => (
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
                <Col md={4}>
                    {!examples.length && <h1 className="display-4 text-center text-dark">Want, Words!</h1>}
                    {!!examples.length && <>
                        <div style={{overflowY: 'scroll', height: '80vh'}}>
                            <KeyDetails examples={examples}/>
                        </div>
                        <div className="py-2 bg-dark rounded">
                            <div className="d-flex">
                                <input type="text" readOnly className="form-control-plaintext bg-light p-2 rounded"
                                       onFocus={e => e.target.select()}
                                       value={`{${selected}}`}/>
                                <div className="btn btn-dark rounded" onClick={loadSource}>
                                    <FaArrowRight/>
                                </div>
                            </div>
                        </div>
                    </>}
                </Col>
                <Col md={4}>
                    <div className="bg-dark p-1 pr-0 rounded">
                        <div className="mt-1 mb-2">
                            <div {...classes('btn btn-dark rounded float-right', !code && 'disabled')}
                                 onClick={() => setCode('')}>
                                <FaTrash/>
                            </div>
                            <div {...classes('btn btn-dark rounded', !code && 'disabled')}
                                 onClick={() => evalCode()}>
                                <FaRandom style={{transform:'scaleX(-1)'}}/>
                            </div>
                        </div>
                        <div style={{height: '80vh', overflow: 'auto'}}>
                            <CodeEditor code={code}
                                        setCode={setCode}
                                        onEval={() => evalCode()}/>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}