import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const addTodo = async () => {
    try {
      const res = await axios.post('http://localhost:3000/todos/add', { todo: newTodoText });
      if (res.data.success) {
        setNewTodoText(""); // Clear the input field after adding todo
        fetchTodos(); // Fetch updated todos
      } else {
        console.error('Error adding todo:', res.data.message);
      }
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleInputChange = (e) => {
    setNewTodoText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodoText.trim() !== "") {
      addTodo();
    }
  };

  return (
    <>
      <h1>To-Do App sample</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new todo"
          value={newTodoText}
          onChange={handleInputChange}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

export default App;