import React, { useState, useEffect } from 'react';
import './App.css';


 

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setInputValue('');
    }
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    if (editId === id) {
      setEditId(null);
      setEditValue('');
    }
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editId ? { ...todo, text: editValue } : todo
      )
    );
    setEditId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editId) {
        saveEdit();
      } else {
        addTodo();
      }
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const remainingTasks = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>

        <div className="input-section">
          {editId ? (
            <div className="edit-mode">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                className="edit-input"
              />
              <button onClick={saveEdit} className="save-btn">
                Save
              </button>
              <button onClick={cancelEdit} className="cancel-btn">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                className="todo-input"
              />
              <button onClick={addTodo} className="add-btn">
                Add
              </button>
            </>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          {todos.some((todo) => todo.completed) && (
            <button onClick={clearCompleted} className="clear-completed">
              Clear completed
            </button>
          )}
        </div>

        <div className="todos">
          {filteredTodos.length === 0 ? (
            <p className="no-todos">
              {filter === 'all'
                ? "You don't have any todos yet!"
                : filter === 'active'
                ? "You don't have any active tasks!"
                : "You don't have any completed tasks!"}
            </p>
          ) : (
            <ul>
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={todo.completed ? 'completed' : ''}
                >
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      className="checkbox"
                    />
                    <span
                      className="todo-text"
                      onDoubleClick={() => startEdit(todo.id, todo.text)}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => startEdit(todo.id, todo.text)}
                      className="edit-btn"
                      aria-label="Edit todo"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-btn"
                      aria-label="Delete todo"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="footer">
          <p>{remainingTasks} {remainingTasks === 1 ? 'task' : 'tasks'} remaining</p>
        </div>
      </div>
    </div>
  );
}


export default App;

