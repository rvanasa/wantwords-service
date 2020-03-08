import React from 'react';
import Editor from 'react-simple-code-editor';
import {highlight} from 'prismjs/components/prism-core';
import 'prismjs/themes/prism-solarizedlight.css';

import './ListEditor.scss';

const language = {
    'comment': {
        pattern: /(^|[^\\:])#.*/,
        lookbehind: true,
        greedy: true,
    },
    'variable': {
        pattern: /\{>.*}/,
        inside: {
            'selector': /[a-zA-Z_.]*:/,
        },
    },
    'number': {
        pattern: /\{.+}/,
        inside: {
            'selector': /[a-zA-Z_.]*:/,
        },
    },
};

export default function ListEditor(props) {

    return (
        <Editor
            value={props.code}
            onValueChange={code => props.setCode(code)}
            onKeyDown={e => e.ctrlKey && e.keyCode === 13 && props.onEval(e)}
            highlight={code => highlight(code, language)}
            padding="1em"
            className="bg-light text-monospace"
            style={{
                ...props.style,
                fontSize: 16,
            }}/>
    );
}