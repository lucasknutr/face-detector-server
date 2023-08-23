import express from 'express';
import database from '../../my-server/server-express.js';
import cors from 'cors';
import knex from 'knex';



const app = express();
app.use(express.json());
app.use(cors());
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'lugaro26',
      database : 'face-detector'
    }
  });

app.get('/', (req, res) => {
    res.json(database);
})

app.post('/signin', (req, res) => {
    let response = false;
    database.forEach(user => {
        if(req.body.email === user.email && req.body.password === user.password){
            res.json(user);
            response = true;
        }
    });
    if(response === false){
        res.json('error!');
    }

})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;

        db('usersdb')
            .returning('*')
            .insert({
                name: name,
                email: email,
                joined: new Date()
        }).then(user => {
            res.json(user[0]);
        }).catch(err => res.status(400).json('oops, error'))
        res.json('REGISTERED');
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('usersdb').where({
        id: id
    })
    .then(user => {
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('NOT FOUND');
        }
    })
    .catch(err => res.status(400).json('Error getting user'));
})

app.put('/image', (req, res) => {
    let check =  false;
    const { id } = req.body;
    database.forEach(user => {
        if(user.id === id){
            check = true;
            user.detections++;
        }
    });
    if(!check){
        res.status(404).json('USER NOT FOUND');
    }
})

app.listen(3001, () => {
    console.log('successssssss!');
});



