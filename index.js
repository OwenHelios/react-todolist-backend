const express = require('express')
const cors = require('cors')
const pool = require('./db')
const app = express()

//middleware
app.use(cors())
app.use(express.json()) //req.body

// Routes
//create a todo
app.post('/todos', async (req, res) => {
  try {
    const { todo_id, description } = req.body
    if (todo_id === undefined) {
      const newTodo = await pool.query(
        'INSERT INTO todo(description) VALUES($1) RETURNING *',
        [description]
      )
      res.json(newTodo.rows[0])
    } else {
      const newTodo = await pool.query(
        'INSERT INTO todo(todo_id, description) VALUES($1,$2) RETURNING *',
        [todo_id, description]
      )
      res.json(newTodo.rows[0])
    }
  } catch (err) {
    console.error(err.message)
  }
})

//get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo')
    res.json(allTodos.rows)
  } catch (err) {
    console.error(err.message)
  }
})

//get one todo
app.get('/todos/:id', async (req, res) => {
  try {
    //req.params = { id: 'what you put in the url after /todos/' }
    const { id } = req.params
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id])
    res.json(todo.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { description } = req.body
    const updateTodo = await pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2',
      [description, id]
    )
    res.json('Todo Updated')
  } catch (err) {
    console.error(err.message)
  }
})

//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1', [
      id,
    ])
    res.json('Todo Deleted')
  } catch (err) {
    console.error(err.message)
  }
})

app.listen(5000, () => {
  console.log('Testing')
})
