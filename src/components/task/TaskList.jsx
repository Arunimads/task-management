import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Table, Button, Badge, Form } from "react-bootstrap";
import {
  deleteTask,
  toggleTaskStatus,
  updateTask,
} from "../../store/slices/taskSlice";
import Dialog from "../ui/Dialog";

const TaskList = ({ tasks }) => {
  const dispatch = useDispatch();
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const handleToggleStatus = (taskId) => {
    dispatch(toggleTaskStatus(taskId));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = (data) => {
    dispatch(
      updateTask({ id: editingTask.id, ...data, userId: editingTask.userId })
    );
    setEditingTask(null);
  };

  const handleDelete = () => {
    dispatch(deleteTask(deletingTaskId));
    setDeletingTaskId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (completed) => {
    return completed ? (
      <Badge bg="success">Completed</Badge>
    ) : (
      <Badge bg="warning">Pending</Badge>
    );
  };

  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Status</th>
            <th>Title</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleStatus(task.id)}
                />
              </td>
              <td>
                <span
                  className={
                    task.completed ? "text-decoration-line-through" : ""
                  }
                >
                  {task.title}
                </span>
                <div className="mt-1">{getStatusBadge(task.completed)}</div>
              </td>
              <td>{formatDate(task.dueDate)}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeletingTaskId(task.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog
        show={!!deletingTaskId}
        onHide={() => setDeletingTaskId(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
      />
    </>
  );
};

export default TaskList;
