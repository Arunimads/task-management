// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { fetchTasks, addTask } from "../store/slices/taskSlice";
import { fetchUser } from "../store/slices/authSlice";
import TaskList from "./tasks/TaskList";
import TaskFilters from "./tasks/TaskFilters";
import TaskForm from "./tasks/TaskForm";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filteredTasks, isLoading, error } = useSelector(
    (state) => state.tasks
  );
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  const handleAddTask = (data) => {
    dispatch(addTask({ ...data, userId: 1 }));
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Task Management Dashboard</h1>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          Add New Task
        </Button>
      </div>

      {user && (
        <Alert variant="info">
          Welcome, {user.first_name} {user.last_name}!
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <TaskFilters />

      {filteredTasks.length === 0 ? (
        <Alert variant="warning">No tasks found.</Alert>
      ) : (
        <TaskList tasks={filteredTasks} />
      )}

      <TaskForm
        show={showAddForm}
        onHide={() => setShowAddForm(false)}
        onSubmit={handleAddTask}
      />
    </Container>
  );
};

export default Dashboard;
