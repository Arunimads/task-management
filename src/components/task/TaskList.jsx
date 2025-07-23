import React, { useState } from "react";
import { Table, Button, Badge, Form } from "react-bootstrap";
import useTasks from "../../hooks/useTasks";
import TaskForm from "./TaskForm";
import Dialog from "../ui/Dialog";

const TaskList = ({ tasks }) => {
  const { deleteTask, toggleStatus, updateTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const handleToggleStatus = (taskId) => {
    toggleStatus(taskId);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = (data) => {
    const dueDate = new Date(data.dueDate);
    const yyyy = dueDate.getFullYear();
    const mm = String(dueDate.getMonth() + 1).padStart(2, "0");
    const dd = String(dueDate.getDate()).padStart(2, "0");
    const formattedDueDate = `${yyyy}-${mm}-${dd}`;
    updateTask({
      id: editingTask.id,
      ...data,
      userId: editingTask.userId,
      dueDate: formattedDueDate,
    });
    setEditingTask(null);
  };

  const handleDelete = () => {
    deleteTask(deletingTaskId);
    setDeletingTaskId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("In");
  };

  const getStatusBadge = (completed) => {
    return completed ? (
      <Badge bg="success">Completed</Badge>
    ) : (
      <Badge bg="warning" className="text-dark">
        Pending
      </Badge>
    );
  };

  return (
    <>
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table responsive hover className="mb-0" size="sm">
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
                  <div className="d-flex gap-1">
                    <Form.Check
                      type="switch"
                      label=""
                      checked={task.completed}
                      onChange={() => handleToggleStatus(task.id)}
                    />
                    <div className="">{getStatusBadge(task.completed)}</div>
                  </div>
                </td>
                <td>
                  <span
                    className={
                      task.completed ? "text-decoration-line-through" : ""
                    }
                  >
                    {task.title}
                  </span>
                </td>
                <td>{formatDate(task.dueDate)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="primary"
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {editingTask && (
        <TaskForm
          show={!!editingTask}
          onHide={() => setEditingTask(null)}
          onSubmit={handleUpdate}
          initialData={editingTask}
        />
      )}

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
