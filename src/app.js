'use strict';

import path from 'path';
import express from 'express';

import api from './api';

let app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', api);

let port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port', port));

export default app;