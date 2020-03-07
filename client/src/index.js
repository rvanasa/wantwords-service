import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.scss';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap';

ReactDOM.render(<App/>, document.getElementById('root'));

serviceWorker.register({
    onUpdate() {
        window.location.reload();
    },
});
