'use strict';

const {CronJob} = require('cron');
const {update} = require('./src/cache');

update(true)
    .catch(err => console.error(err.stack || err))
    .then(() => {
        require('./src/app');

        let job = new CronJob('*/10 * * * *', () => update());
        job.start();
    });

// setTimeout(() => {
//     require('axios').post('http://localhost:8080/api/choose/5', require('fs').readFileSync('./test/example.want').toString())
//         .then(({data}) => console.log(data));
//     // .catch(err => console.error('[Error]', err.response.data));
// }, 1000);