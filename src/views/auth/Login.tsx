import { Card, Input, Button, Typography, Row, Col, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import { LoginUser } from "../../redux/services/authService";
import ForgotPasswordModal from "../../models/forgot-password";
import logos from "../../assets/logocomany.png";
import Title from "antd/es/typography/Title";


const { Text } = Typography;

const LoginView = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Row
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        background:
          "linear-gradient(120deg, #eef2ff 0%, #e0e7ff 50%, #f8fafc 100%)",
      }}
    >
      {/* LEFT SIDE */}
      <Col
        xs={0}
        md={14}
        style={{
          background: "transparent",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "10%",
            display: "flex",
            flexDirection: "column",
            lineHeight: 0.9,
          }}
        >
          <div
            style={{
              color: "#1677ff",
              fontSize: 70,
              fontWeight: 600,
              letterSpacing: 3,
              margin: 0,
            }}
          >
            EASY
          </div>

          <div
            style={{
              color: "#000",
              fontSize: 80,
              fontWeight: 800,
              margin: 10,
              paddingLeft: "2ch",
            }}
          >
            TESTING
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "10%",
          }}
        >
          <Text style={{ color: "#000", fontSize: 20 }}>
            AI Testing Platform
          </Text>
        </div>
      </Col>

      {/* RIGHT SIDE (FIXED) */}
      <Col
        xs={24}
        md={10}
        style={{
          background: "rgba(255, 255, 255, 0.35)",
        }}
      />

      {/* LOGIN CARD */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "62%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 380,
        }}
      >
        <Card
          style={{
            borderRadius: 16,
            padding: "20px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 50
            }}
          >
            <img
              src={logos}
              alt="logo"
              width={60}
              height={60}
            />

            <Title level={2} style={{ margin: 0 }}>
              Login
            </Title>
          </div>

          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Please sign in to your account
          </Text>

          <Formik
            initialValues={{
              user_email: "",
              password: "",
            }}
            validationSchema={Yup.object({
              user_email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
              password: Yup.string().required("Password is required"),
            })}
            onSubmit={(values) => {
              setLoading(true);

              dispatch(LoginUser(values)).then((res: any) => {
                setLoading(false);

                // SUCCESS LOGIN
                if (
                  res.meta.requestStatus === "fulfilled" &&
                  res.payload?.Response_Status === "Success" &&
                  res.payload?.Response_Code === "200"
                ) {

                  localStorage.setItem(
                    "auth",
                    JSON.stringify(res.payload)
                  );

                  navigate("/");
                }

                else {
                  navigate("/login");
                }
              });
            }}
          >
            {({ errors, handleChange, handleBlur, values, touched }) => (
              <Form>
                {/* EMAIL */}
                <div style={{ marginBottom: 16 }}>
                  <Text>Email</Text>

                  <Input
                    name="user_email"
                    placeholder="user@company.com"
                    size="large"
                    value={values.user_email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ borderRadius: 8, height: 45 }}
                  />

                  {touched.user_email && errors.user_email && (
                    <Text type="danger">{errors.user_email}</Text>
                  )}
                </div>

                {/* PASSWORD */}
                <div style={{ marginBottom: 16 }}>
                  <Text>Password</Text>

                  <Input.Password
                    name="password"
                    placeholder="Enter password"
                    size="large"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    style={{ borderRadius: 8, height: 45 }}
                  />

                  {touched.password && errors.password && (
                    <Text type="danger">{errors.password}</Text>
                  )}
                </div>

                {/* FORGOT PASSWORD */}
                <Row justify="end">
                  <span
                    style={{ color: "#1677ff", cursor: "pointer" }}
                    onClick={() => setOpen(true)}
                  >
                    Forgot Password?
                  </span>
                </Row>

                {/* BUTTON */}
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  style={{
                    marginTop: 20,
                    height: 45,
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Sign In"}
                </Button>

                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 12,
                    fontSize: 13,
                    color: "#000",
                  }}
                >
                  Ensuring quality at every stage of your testing journey
                </Text>
              </Form>
            )}
          </Formik>

          <ForgotPasswordModal open={open} onClose={() => setOpen(false)} />
        </Card>
      </div>
    </Row>
  );
};

export default LoginView;