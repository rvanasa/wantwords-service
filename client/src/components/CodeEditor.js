import React from 'react';
import Editor from 'react-simple-code-editor';
import {highlight} from 'prismjs/components/prism-core';

const language = {
    'comment': {
        pattern: /(^|[^\\:])#.*/,
        lookbehind: true,
        greedy: true,
    },
    'function': /::/,
    'punctuation': /[{}:]/,
};

export default function CodeEditor(props) {
    let {examples} = props;

    return (
        <Editor
            value={props.code}
            onValueChange={code => props.setCode(code)}
            onKeyDown={e => e.ctrlKey && e.keyCode === 13 && props.onEval(e)}
            highlight={code => highlight(code, language)}
            padding="1em"
            className="bg-light"
            style={{
                ...props.style,
                fontFamily: 'monospace',
                fontSize: 16,
            }}/>
    );
}