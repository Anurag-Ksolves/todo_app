const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(cors());

let connection;

function handleDisconnect() {
    connection = mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_ROOT_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'todo_app'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database: ', err);
            setTimeout(handleDisconnect, 2000); 
        } else {
            console.log('Connected to MySQL database');
            createTable();
        }
    });

    connection.on('error', (err) => {
        console.error('MySQL database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); 
        } else {
            throw err;
        }
    });
}

handleDisconnect();

function createTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS todos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            text VARCHAR(255) NOT NULL
        )
    `;
    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating todos table: ', err);
            return;
        }
        console.log('Todos table created or already exists');
    });
}

function getTodos(callback) {
    const query = 'SELECT * FROM todos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching todos from MySQL database: ', err);
            return callback([]);
        }
        callback(results);
    });
}

function addTodo(todoText, callback) {
    const query = 'INSERT INTO todos (text) VALUES (?)';
    connection.query(query, [todoText], (err, result) => {
        if (err) {
            console.error('Error adding todo to MySQL database: ', err);
            return callback(false);
        }
        callback(true);
    });
}


// GET all todos
router.get('/todos', (req, res) => {
    getTodos((todos) => {
        res.json(todos);
    });
});

// Add a new todo
router.post('/todos/add', (req, res) => {
    const newTodo = req.body.todo;
    addTodo(newTodo, (success) => {
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, message: 'Error adding todo' });
        }
    });
});


app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
