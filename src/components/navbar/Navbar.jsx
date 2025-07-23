import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Container,
  Button,
  Form,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { logout } from "../../store/slices/authSlice";
import { toggleDarkMode } from "../../store/slices/themeSlice";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!token) return null;

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      className="py-3"
    >
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col
            xs={12}
            md="auto"
            className="mb-2 mb-md-0 text-center text-md-start"
          >
            <Navbar.Brand>Task Management</Navbar.Brand>
          </Col>

          <Col
            xs={12}
            md
            className="d-flex flex-column flex-md-row align-items-center justify-content-md-end gap-2"
          >
            {user && (
              <Badge bg="primary" className="mb-2 mb-md-0">
                {user.first_name} {user.last_name}!
              </Badge>
            )}
            <Form.Check
              type="switch"
              label="Dark Mode"
              checked={darkMode}
              onChange={() => dispatch(toggleDarkMode())}
              className="mb-2 mb-md-0"
            />
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
