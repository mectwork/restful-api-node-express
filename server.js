const Joi = require('joi');
var express = require('express');
var app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const contacts = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@gmail.com',
        phone: '123-456-789'
    },
    {
        id: 2,
        name: 'Sonya Smith',
        email: 'sonya@gmail.com',
        phone: '789-789-789'
    },
    {
        id: 3,
        name: 'Juan Perez',
        email: 'juan@gmail.com',
        phone: '456-456-456'
    }
];

app.get('/', function (req, res) {
    res.send('Hello Server World!!');
});

app.get('/api/contacts', function (req, res) {
    res.send(contacts);
});

app.get('/api/contacts/:id', function (req, res) {
    const contact = contacts.find(contact =>
        contact.id === parseInt(req.params.id));
    if (!contact) res.status(404).send("The requested contact doesn't exist.");
    res.status(200).send(contact);
});

app.post('/api/contacts', function (req, res) {
    const { error } = validateContact(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const contact = {
        id: contacts.length + 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }
    contacts.push(contact);
    res.send(contact);
});

app.put('/api/contacts/:id', function (req, res) {
    const contact = contacts.find(contact =>
        contact.id === parseInt(req.params.id));
    if (!contact) res.status(404).send("The requested contact doesn't exist.");

    const { error } = validateContact(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.phone = req.body.phone;

    res.send(contact);
});

app.delete('/api/contacts/:id', function (req, res) {
    const contact = contacts.find(contact =>
        contact.id === parseInt(req.params.id));
    if (!contact) res.status(404).send("The requested contact doesn't exist.");

    const index = contacts.indexOf(contact);
    contacts.splice(index, 1);   

    res.send(contact);
});

function validateContact(contact) {
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
    }

    return Joi.validate(contact, schema);
}

app.listen(port, () => console.log(`Listening on port ${port}`));