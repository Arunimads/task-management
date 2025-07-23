import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    filteredTasks: [],
    filter: "all",
    sortBy: "dueDate", 
    sortOrder: "desc",
    isLoading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setTasks: (state, action) => {
      state.tasks = action.payload;
      const filtered = filterTasksByStatus(state.tasks, state.filter);
      state.filteredTasks = sortTasksBy(filtered, state.sortBy, state.sortOrder);
    },
    
    addNewTask: (state, action) => {
      state.tasks.unshift(action.payload);
      const filtered = filterTasksByStatus(state.tasks, state.filter);
      state.filteredTasks = sortTasksBy(filtered, state.sortBy, state.sortOrder);
    },
    
    updateExistingTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        const filtered = filterTasksByStatus(state.tasks, state.filter);
        state.filteredTasks = sortTasksBy(filtered, state.sortBy, state.sortOrder);
      }
    },
    
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      const filtered = filterTasksByStatus(state.tasks, state.filter);
      state.filteredTasks = sortTasksBy(filtered, state.sortBy, state.sortOrder);
    },
    
    setFilter: (state, action) => {
      state.filter = action.payload;
      const filtered = filterTasksByStatus(state.tasks, action.payload);
      state.filteredTasks = sortTasksBy(filtered, state.sortBy, state.sortOrder);
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.filteredTasks = sortTasksBy(state.filteredTasks, action.payload, state.sortOrder);
    },
    
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      state.filteredTasks = sortTasksBy(state.filteredTasks, state.sortBy, action.payload);
    },
    
    toggleTaskStatus: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        const filtered = filterTasksByStatus(state.tasks, state.filter);
        state.filteredTasks = sortTasksBy(filtered, state.sortBy, state.sortOrder);
      }
    },
  },
});

export const { 
  setLoading, 
  setError,
  clearError,
  setTasks, 
  addNewTask, 
  updateExistingTask, 
  removeTask,
  setFilter,
  setSortBy,
  setSortOrder,
  toggleTaskStatus 
} = taskSlice.actions;

function filterTasksByStatus(tasks, filter) {

  if (filter === "completed") {
    return [...tasks].filter((task) => task.completed);
  }
  
  if (filter === "pending") {
    return [...tasks].filter((task) => !task.completed);
  }
  
  return [...tasks];
}

function sortTasksBy(tasks, sortBy, sortOrder) {
  return [...tasks].sort((taskA, taskB) => {
    let valueA, valueB;

    if (sortBy === "dueDate") {
      valueA = new Date(taskA.dueDate);
      valueB = new Date(taskB.dueDate);
    } else {
      return 0; 
    }

    if (valueA < valueB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0; 
  });
}

export default taskSlice.reducer;