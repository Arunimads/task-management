import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get(API_URL);
  return response.data.map((task) => ({
    ...task,
    dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  }));
});

export const addTask = createAsyncThunk("tasks/addTask", async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return { ...response.data, dueDate: taskData.dueDate };
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ id, ...taskData }) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData);
  return { ...response.data, dueDate: taskData.dueDate };
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    filteredTasks: [],
    filter: "all",
    sortBy: "dueDate",
    isLoading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.filteredTasks = filterTasks(state.tasks, action.payload);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.filteredTasks = sortTasks(state.filteredTasks, action.payload);
    },
    toggleTaskStatus: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        state.filteredTasks = filterTasks(state.tasks, state.filter);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.filteredTasks = filterTasks(action.payload, state.filter);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.filteredTasks = filterTasks(state.tasks, state.filter);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          state.filteredTasks = filterTasks(state.tasks, state.filter);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.filteredTasks = filterTasks(state.tasks, state.filter);
      });
  },
});

const filterTasks = (tasks, filter) => {
  let filtered = [...tasks];

  switch (filter) {
    case "completed":
      filtered = filtered.filter((task) => task.completed);
      break;
    case "pending":
      filtered = filtered.filter((task) => !task.completed);
      break;
    default:
      break;
  }

  return filtered;
};

const sortTasks = (tasks, sortBy) => {
  if (sortBy === "dueDate") {
    return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
  return tasks;
};

export const { setFilter, setSortBy, toggleTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
