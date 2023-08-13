import fs from 'fs';
import express from 'express';
import database from '../../my-server/server-express.js'

const app = express();
app.use(express.json());

console.log(database[0])

app.get('/', (req, res) => {
    res.send('THIS IS WORKING');
})

app.post('/signin', (req, res) => {
    if(req.body.email === database[0].email){
        res.send('OH YEAH YOU SUCEEDED YOUR MFFFFFFFFFF I LOVE YOU B DA S')
    } else (
        res.send('error')
    )
})

app.listen(3001, () => {
    console.log('successsssssss');
});
// / --> get
// /signin --> push
// /register --> push

