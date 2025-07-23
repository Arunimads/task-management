import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
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
  toggleTaskStatus,
} from "../store/slices/taskSlice";

const API_URL = "https://jsonplaceholder.typicode.com/todos";



const useTasks = () => {
  const dispatch = useDispatch();
  const taskState = useSelector((state) => state.tasks);

  const fetchTasks = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await axios.get(API_URL);
      const tasksWithDates = response.data.map((task) => ({
        ...task,
        dueDate: getRandomDate(),
        isLocal: false,
      }));
      
      dispatch(setTasks(tasksWithDates));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addTask = async (taskData) => {
    try {
      dispatch(clearError());
      
      const response = await axios.post(API_URL, taskData);
      const newTask = {
        ...response.data,
        id: 200 + Date.now() % 100000,
        dueDate: taskData.dueDate,
        isLocal: true,
      };
      
      dispatch(addNewTask(newTask));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const updateTask = async ({ id, ...updates }) => {
    try {
      dispatch(clearError());
      
      const isLocalTask = id >= 200;
      let updatedTask;
      
      if (isLocalTask) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updatedTask = { id, ...updates, isLocal: true };
      } else {
        const response = await axios.put(`${API_URL}/${id}`, updates);
        updatedTask = { ...response.data, dueDate: updates.dueDate, isLocal: false };
      }
      
      dispatch(updateExistingTask(updatedTask));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const deleteTask = async (taskId) => {
    try {
      dispatch(clearError());
      
      const isLocalTask = taskId >= 200;
      
      if (isLocalTask) {
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        await axios.delete(`${API_URL}/${taskId}`);
      }
      
      dispatch(removeTask(taskId));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const toggleStatus = (taskId) => {
    dispatch(toggleTaskStatus(taskId));
  };

  const setTaskFilter = (filter) => {
    dispatch(setFilter(filter));
  };

  const setTaskSortBy = (sortBy) => {
    dispatch(setSortBy(sortBy));
  };

  const setTaskSortOrder = (sortOrder) => {
    dispatch(setSortOrder(sortOrder));
  };

  const clearTaskError = () => {
    dispatch(clearError());
  };

  return {
    ...taskState,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus,
    setTaskFilter,
    setTaskSortBy,
    setTaskSortOrder,
    clearTaskError,
  };
};

export default useTasks;


function getRandomDate() {
  const randomDaysAgo = Math.random() * 10; 
  const randomDate = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
  return randomDate.toISOString().split("T")[0];
}