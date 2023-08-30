import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';

    // ! ATTENTION WANDERERS: this is an experimental server code, 
    // ! it's my first full server project, I'm still fighting with the logic. 
    // ! I'm trying to do best practices here, 
    // ! but I'm no parameter if you're trying to replicate or learn anything. 
    // ! You should definetely look for some node and express courses and 
    // ! official documentations online if that's the case.

    // * This is a simple server structure built with express/node to be the backend of my "facedetector" website. It's currently hosted at https://lucasknutr.github.io/face-detector/

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
    res.json(db.select('*').from('usersdb'));
})

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json('Incorrect form submission');
    }
    db.select('*').from('login')
    .where('email', '=', email)
    .then(data => {
        // console.log(data);

        // todo (1) CHECK IF DATA IS VALID WITH BCRYPT, I'LL REPRESENT THAT BY USING A PLACEHOLDER FUNCTION CALLED isValid()
        
        const isValid = bcrypt.compareSync(password, data[0].secret);
        // console.log(bcrypt.compareSync(password, data[0].secret))
        // console.log('password: ', password);
        // console.log('secret: ', data[0].secret);
        if (isValid){
            return db.select('*').from('usersdb').where('email', '=', email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('Unable to get users from server'));
        } else {
            res.status(400).json('Wrong credentials, please check again your user info or contact me through the following email: lucasknutr@proton.me');
   1     }
    })
    .catch(err => {
        res.status(400).json('Wrong credentials, please check again your user info or contact me through the following email: lucasknutr@proton.me');
    })
})

// * REGISTER: using some simple postgreSQL syntax to insert users data into our database

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const hash = bcrypt.hashSync(password, 10);

        db.transaction(trx => {
            trx.insert({
                'email': email,
                'secret': hash
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('usersdb')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
            }).then(user => {
                res.json(user[0]);
            })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register'))
        // db('usersdb')
        //     .catch(err => res.status(400).json('oops, error'))
        // res.json('REGISTERED');
})

// todo: add profiles to each user, till there this specific requisition is useless

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

// * UPDATING DETECTION COUNT EVERY TIME A USER INPUTS A NEW IMAGE

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('usersdb')
    .where('id', '=', id)
    .increment('detections', 1)
    .returning('detections')
    .then(entries => {
        res.json(Number(entries[0].detections));
    })
})

app.listen(3001, () => {
    console.log('GET: Success!');
});