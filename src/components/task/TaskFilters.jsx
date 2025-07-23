import React from "react";
import { ButtonGroup, Button, Form, Row, Col } from "react-bootstrap";
import useTasks from "../../hooks/useTasks";

const TaskFilters = () => {
  const {
    filter,
    sortBy,
    sortOrder,
    setTaskFilter,
    setTaskSortBy,
    setTaskSortOrder,
  } = useTasks();

  const handleSortChange = (e) => {
    const [sortField, order] = e.target.value.split("-");
    setTaskSortBy(sortField);
    setTaskSortOrder(order);
  };

  const getSortValue = () => {
    return `${sortBy}-${sortOrder}`;
  };

  return (
    <Row className="mb-3 g-2">
      <Col xs={12} md={8} className="d-flex justify-content-start">
        <ButtonGroup>
          <Button
            variant={filter === "all" ? "secondary" : "outline-secondary"}
            onClick={() => setTaskFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "completed" ? "secondary" : "outline-secondary"}
            onClick={() => setTaskFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant={filter === "pending" ? "secondary" : "outline-secondary"}
            onClick={() => setTaskFilter("pending")}
          >
            Pending
          </Button>
        </ButtonGroup>
      </Col>
      <Col xs={12} md={4} className="d-flex justify-content-md-end">
        <Form.Select
          value={getSortValue()}
          onChange={handleSortChange}
          style={{ maxWidth: "250px" }}
        >
          <option value="dueDate-asc">Sort by Due Date Ascending</option>
          <option value="dueDate-desc">Sort by Due Date Descending</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default TaskFilters;
