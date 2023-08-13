import fs from 'fs';
import express from 'express';
import database from '../../my-server/server-express.js'

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('THIS IS WORKING');
})

app.post('/signin', (req, res) => {
    let response = false;
    database.forEach(user => {

        // todo ADD: && req.body.password === user.password

        if(req.body.email === user.email){
            res.send('success!');
            response = true;
        }
    });
    if(response === false){
        res.send('error!');
    }

})

app.listen(3001, () => {
    console.log('successsssssss!');
});
// / --> get
// /signin --> push
// /register --> push

