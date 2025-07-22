// src/components/common/Navbar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Button, Form } from "react-bootstrap";
import { logout } from "../../store/slices/authSlice";
import { toggleDarkMode } from "../../store/slices/themeSlice";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
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
    >
      <Container>
        <Navbar.Brand>Task Manager</Navbar.Brand>
        <div className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Dark Mode"
            checked={darkMode}
            onChange={() => dispatch(toggleDarkMode())}
            className="me-3"
          />
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
