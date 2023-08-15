import express from 'express';
import database from '../../my-server/server-express.js'

const app = express();
app.use(express.json());

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
    const { email, password } = req.body;
    let exists = false;
    database.forEach(user => {
        if(req.body.email === user.email && req.body.password === user.password){
            res.json('success!');
            exists = true;
        }
    });
    async function existence (){
        if(exists === false){
        database.push({
            'email': email,
            'password': password,
            'date': new Date(),
            'id': (Number(database[database.length - 1].id) + 1),
            'detections': 0
        })
        res.json('REGISTERED')
    } else {
        res.json('Sorry, it seems like this email is already registered or is not valid')
    }
    }

    existence();
})

app.get('/profile/:id', (req, res) => {
    let check =  false;
    const { id } = req.params;
    database.forEach(user => {
        if(user.id === id){
            check = true;
            res.json(user);
        }
    });
    if(!check){
        res.status(404).json('USER NOT FOUND');
    }
})

app.post('/image', (req, res) => {
    // todo LOGIC BEHIND IMAGE AND COUNTER INCREASE
})

app.listen(3001, () => {
    console.log('successssssss!');
});


// / --> get
// /signin --> push
// /register --> push

