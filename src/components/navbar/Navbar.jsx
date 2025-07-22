import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Button, Form } from "react-bootstrap";
import { logout } from "../../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

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
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Navbar;
