import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonGroup, Button, Form, Row, Col } from "react-bootstrap";
import { setFilter, setSortBy } from "../../store/slices/taskSlice";

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filter, sortBy } = useSelector((state) => state.tasks);

  return (
    <Row className="mb-3">
      <Col md={8}>
        <ButtonGroup>
          <Button
            variant={filter === "all" ? "primary" : "outline-primary"}
            onClick={() => dispatch(setFilter("all"))}
          >
            All
          </Button>
          <Button
            variant={filter === "completed" ? "primary" : "outline-primary"}
            onClick={() => dispatch(setFilter("completed"))}
          >
            Completed
          </Button>
          <Button
            variant={filter === "pending" ? "primary" : "outline-primary"}
            onClick={() => dispatch(setFilter("pending"))}
          >
            Pending
          </Button>
        </ButtonGroup>
      </Col>
      <Col md={4}>
        <Form.Select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
        >
          <option value="dueDate">Sort by Due Date</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default TaskFilters;
