const express = require('express');
const Redis = require('redis');
const redisClient = Redis.createClient();

(async () => {
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
})();

const axios = require('axios');
const port = 3000;



const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/photo', async (req, res) => {
    redisClient.get('photo', async (err, val) => {
        if (err) {
            console.error(err);
            throw err;
        }
        if (val) {
            res.status(200).send(JSON.parse(val));
        } else {
            const { photos } = await axios.get('https://jsonplaceholder.typicode.com/photos');
            redisClient.set('photo', JSON.stringify(photos));
            res.status(200).send(photos);
        }
    });
});

app.get('/photo/:id', async (req, res) => {
    const queryLink = 'https://jsonplaceholder.typicode.com/photos/' + req.params.id;
    const { data } = await axios.get(queryLink);
    res.json(data);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});