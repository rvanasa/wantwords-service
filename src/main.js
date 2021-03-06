'use strict';

import {CronJob} from 'cron';
import {update} from './cache';
import './app';
import app from './app';

update(true)
    .catch(err => console.error(err.stack || err))
    .then(() => {
        let job = new CronJob('*/10 * * * *', () => update());
        job.start();

        let port = process.env.PORT || 8080;
        app.listen(port, () => console.log('Listening on port', port));
    });

// setTimeout(() => {
//     require('axios').post('http://localhost:8080/api/choose/5', require('fs').readFileSync('./test/example.want').toString())
//         .then(({data}) => console.log(data));
//     // .catch(err => console.error('[Error]', err.response.data));
// }, 1000);