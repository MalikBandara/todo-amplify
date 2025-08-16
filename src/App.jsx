import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listToDos, listToDosByCategory } from "./graphql/queries";
import { createToDo, updateToDo, deleteToDo } from "./graphql/mutations";

const client = generateClient();

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All"); // <-- filter state

  useEffect(() => {
    if (selectedCategory === "All") {
      fetchAllTodos();
    } else {
      fetchTodosByCategory(selectedCategory);
    }
  }, [selectedCategory]); // <-- when category changes, refetch

  const fetchTodosByCategory = async (category) => {
    let allTodos = [];
    let nextToken = null;

    try {
      do {
        const res = await client.graphql({
          query: listToDosByCategory,
          variables: { category, limit: 100, nextToken },
        });
        console.log("Filtered response:", res); // <-- debug
        const items = res?.data?.listToDosByCategory?.items || [];
        nextToken = res?.data?.listToDosByCategory?.nextToken;

        allTodos = allTodos.concat(items);
      } while (nextToken);

      setTodos(allTodos);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllTodos = async () => {
    let allTodos = [];
    let nextToken = null;

    try {
      do {
        const res = await client.graphql({
          query: listToDos,
          variables: { limit: 100, nextToken },
        });

        const items = res?.data?.listToDos?.items || [];
        allTodos = allTodos.concat(items);
        nextToken = res?.data?.listToDos?.nextToken;
      } while (nextToken);

      setTodos(allTodos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name) return alert("Task name is required!");
    try {
      if (editingId) {
        await client.graphql({
          query: updateToDo,
          variables: { input: { id: editingId, ...form } },
        });
        setEditingId(null);
      } else {
        await client.graphql({
          query: createToDo,
          variables: { input: form },
        });
      }
      setForm({ name: "", description: "", category: "" });
      if (selectedCategory === "All") {
        fetchAllTodos();
      } else {
        fetchTodosByCategory(selectedCategory);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (todo) => {
    setForm({
      name: todo.name,
      description: todo.description,
      category: todo.category,
    });
    setEditingId(todo.id);
  };

  const handleDelete = async (id) => {
    try {
      await client.graphql({
        query: deleteToDo,
        variables: { input: { id } },
      });
      if (selectedCategory === "All") {
        fetchAllTodos();
      } else {
        fetchTodosByCategory(selectedCategory);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Add/Edit Todo Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">
            {editingId ? "Update Todo" : "Add New Todo"}
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Task name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border rounded-lg"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border rounded-lg"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border rounded-lg"
          />
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"
          >
            {editingId ? "Update Todo" : "Add Todo"}
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="mr-2 font-medium">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>

        {/* Todos List */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">
            Todos ({todos.length})
          </h2>
          {todos.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            todos.map((todo, idx) => (
              <div
                key={todo.id}
                className="mb-4 p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {idx + 1}. {todo.name}
                  </h3>
                  {todo.description && <p>{todo.description}</p>}
                  {todo.category && (
                    <p className="text-sm text-gray-500">
                      Category: {todo.category}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-red-400 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
