import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { fetchUser } from "../../store/slices/authSlice";
import useTasks from "../../hooks/useTasks";
import TaskList from "../task/TaskList";
import TaskFilters from "../task/TaskFilters";
import TaskForm from "../task/TaskForm";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filteredTasks, isLoading, error, fetchTasks, addTask } = useTasks();
  const [showAddForm, setShowAddForm] = useState(false);

  console.log(filteredTasks);

  useEffect(() => {
    fetchTasks();
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  const handleAddTask = (data) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dueDate = `${yyyy}-${mm}-${dd}`;
    addTask({ ...data, dueDate: dueDate, userId: user.id });
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
        <h1>Dashboard</h1>
        <Button variant="success" onClick={() => setShowAddForm(true)}>
          Add New Task
        </Button>
      </div>

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
