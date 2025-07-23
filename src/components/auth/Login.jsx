import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { login, clearError } from "../../store/slices/authSlice";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }

    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                {...register("email")}
                isInvalid={!!errors.email}
                placeholder="email"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                {...register("password")}
                isInvalid={!!errors.password}
                placeholder="password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/register">Register</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
