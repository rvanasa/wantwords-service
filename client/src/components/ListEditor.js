import React from 'react';
import Editor from 'react-simple-code-editor';
import {highlight} from 'prismjs/components/prism-core';
import 'prismjs/themes/prism-solarizedlight.css';

import './ListEditor.scss';

const language = {
    'comment': {
        pattern: /(^|\n)\s*#.*/,
        // lookbehind: true,
        // greedy: true,
    },
    'variable': {
        pattern: /\{>.*}/,
        inside: {
            'selector': /[a-zA-Z_.]*:/,
        },
    },
    'prolog': {
        pattern: /\{!.*}/,
    },
    'number': {
        pattern: /\{[^}]+}/,
        inside: {
            'selector': /[a-zA-Z_.]*:/,
        },
    },
};

export default function ListEditor(props) {

    function onKeyDown(e) {
        if(e.ctrlKey && e.keyCode === 13) {
            e.preventDefault();
            props.onEval(e);
        }
    }

    return (
        <Editor
            value={props.code}
            onValueChange={code => props.setCode(code)}
            onKeyDown={onKeyDown}
            highlight={code => highlight(code, language)}
            padding="1em"
            className="bg-light text-monospace"
            style={{
                ...props.style,
                fontSize: 16,
            }}/>
    );
}