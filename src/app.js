'use strict';

import express from 'express';

import api from './api';

let app = express();

let buildDir = './client/build';

app.use(express.static(buildDir));
app.get('/', (req, res) => res.sendFile(`${buildDir}/index.html`));

app.use('/api', api);

let port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port', port));

export default app;