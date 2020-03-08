'use strict';

import {join} from 'path';
import express from 'express';

import api from './api';

let app = express();

app.get('/', (req, res) => res.sendFile(join(__dirname, 'client/build/index.html')));
app.use(express.static(join(__dirname, 'client/build')));

app.use('/api', api);

let port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port', port));

export default app;