import { Card, Input, Button, Typography, Row, Col, Spin, Grid } from "antd";
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
import { motion } from "framer-motion";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const LoginView = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.05,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1,
      }}
    >
      <Row
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(120deg,#eef2ff 0%,#e0e7ff 50%,#f8fafc 100%)",
        }}
      >

        {/* LEFT SIDE */}

        <Col
          xs={24}
          md={14}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: screens.xs ? 25 : 50,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Floating Glow 1 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 750,
            }}
          >

            {/* Heading */}
            <div
              style={{
                marginBottom: 40,
                position: "relative",
              }}
            >
              {/* Small Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 18px",
                  borderRadius: 50,
                  background: "rgba(22,119,255,.08)",
                  border: "1px solid rgba(22,119,255,.12)",
                  marginBottom: 24,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#52c41a",
                    boxShadow: "0 0 12px #52c41a",
                  }}
                />

                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1677ff",
                    letterSpacing: 1,
                  }}
                >
                  Next Generation AI Powered Testing Platform

                </span>
              </div>

              {/* Main Heading */}
              <div
                style={{
                  fontSize: screens.xs ? 20 : 24,
                  fontWeight: 700,
                  color: "#1677ff",
                  letterSpacing: 4,
                  marginBottom: 10,
                  textTransform: "uppercase",
                }}
              >
                EASY TESTING
              </div>

              <div
                style={{
                  fontSize: screens.xs ? 48 : 78,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                Smart.
              </div>

              <div
                style={{
                  fontSize: screens.xs ? 48 : 78,
                  fontWeight: 900,
                  lineHeight: 1,
                  background:
                    "linear-gradient(135deg,#1677ff,#2563eb,#7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 6,
                }}
              >
                Fast.
              </div>

              <div
                style={{
                  fontSize: screens.xs ? 48 : 78,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: "#0f172a",
                }}
              >
                Reliable.
              </div>

              {/* Gradient Line */}
              <div
                style={{
                  marginTop: 24,
                  width: 140,
                  height: 6,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg,#1677ff,#7c3aed)",
                  boxShadow:
                    "0 4px 20px rgba(22,119,255,.25)",
                }}
              />
            </div>

            {/* Feature Cards */}
            <Row
              gutter={[20, 20]}
              style={{
                marginTop: 40,
              }}
            >
              <Col span={8}>
                <motion.div
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                >
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 20,
                      boxShadow:
                        "0 15px 40px rgba(0,0,0,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 40,
                      }}
                    >
                      🤖
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        marginTop: 10,
                      }}
                    >
                      AI Validation
                    </div>

                    <Text type="secondary">
                      Intelligent payload comparison
                    </Text>
                  </Card>
                </motion.div>
              </Col>

              <Col span={8}>
                <motion.div
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                >
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 20,
                      boxShadow:
                        "0 15px 40px rgba(0,0,0,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 40,
                      }}
                    >
                      ⚡
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        marginTop: 10,
                      }}
                    >
                      Fast Execution
                    </div>

                    <Text type="secondary">
                      Smart, fast and efficient testing
                    </Text>
                  </Card>
                </motion.div>
              </Col>

              <Col span={8}>
                <motion.div
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                >
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 20,
                      boxShadow:
                        "0 15px 40px rgba(0,0,0,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 40,
                      }}
                    >
                      📊
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        marginTop: 10,
                      }}
                    >
                      Smart Reports
                    </div>

                    <Text type="secondary">
                      Real-time analytics and insights
                    </Text>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
          <style>
            {`
      @keyframes floatOne {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-30px); }
        100% { transform: translateY(0px); }
      }

      @keyframes floatTwo {
        0% { transform: translateY(0px); }
        50% { transform: translateY(25px); }
        100% { transform: translateY(0px); }
      }
    `}
          </style>
        </Col>


        {/* RIGHT SIDE LOGIN */}

        <Col
          xs={24}
          md={10}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: "100%", maxWidth: 430 }}
          >
            <Card
              style={{
                width: "100%",
                borderRadius: 24,
                background: "rgba(255,255,255,.25)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 50px rgba(0,0,0,.15)",


                border:
                  "1px solid rgba(255,255,255,.3)"
              }}
            >

              {/* LOGO */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20
                }}
              >
                <motion.img
                  src={logos}
                  width={70}
                  height={70}
                  animate={{
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4
                  }}
                />

                <Title
                  level={2}
                  style={{
                    margin: 0
                  }}
                >
                  Login
                </Title>

              </div>



              <Text
                type="secondary"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: 25
                }}
              >

                Please sign in to your account

              </Text>


              <Formik
                initialValues={{
                  user_email: "",
                  password: ""
                }}

                validationSchema={

                  Yup.object({

                    user_email:

                      Yup.string()
                        .email(
                          "Invalid Email"
                        )

                        .required(
                          "Email required"
                        ),

                    password:

                      Yup.string()
                        .required(
                          "Password required"
                        )

                  })

                }


                onSubmit={(values) => {

                  setLoading(true);

                  dispatch(
                    LoginUser(values)
                  )

                    .then((res: any) => {

                      setLoading(false);

                      if (

                        res.meta.requestStatus
                        ===
                        "fulfilled"

                        &&

                        res.payload
                          ?.Response_Status
                        ===
                        "Success"

                      ) {

                        localStorage.setItem(

                          "auth",

                          JSON.stringify(
                            res.payload
                          )

                        );

                        navigate("/");

                      }

                      else {

                        navigate(
                          "/login"
                        );

                      }

                    });

                }}

              >

                {({

                  errors,
                  touched,

                  values,

                  handleChange,

                  handleBlur

                }) => (

                  <Form>

                    {/* EMAIL */}

                    <div
                      style={{
                        marginBottom: 18
                      }}
                    >

                      <Text>
                        Email
                      </Text>

                      <Input

                        size="large"

                        name="user_email"

                        value={
                          values.user_email
                        }

                        onChange={
                          handleChange
                        }

                        onBlur={
                          handleBlur
                        }

                        placeholder="user@mail.com"

                        style={{
                          height: 45,
                          borderRadius: 10
                        }}

                      />

                      {

                        touched.user_email

                        &&

                        errors.user_email

                        &&

                        <Text
                          type="danger"
                        >

                          {
                            errors.user_email
                          }

                        </Text>

                      }

                    </div>



                    {/* PASSWORD */}

                    <div
                      style={{
                        marginBottom: 20
                      }}
                    >

                      <Text>
                        Password
                      </Text>


                      <Input.Password

                        size="large"

                        name="password"

                        value={
                          values.password
                        }

                        onChange={
                          handleChange
                        }

                        onBlur={
                          handleBlur
                        }

                        placeholder="Enter password"

                        iconRender={(visible) =>

                          visible

                            ?

                            <EyeTwoTone />

                            :

                            <EyeInvisibleOutlined />

                        }

                        style={{
                          height: 45,
                          borderRadius: 10
                        }}

                      />

                      {

                        touched.password

                        &&

                        errors.password

                        &&

                        <Text
                          type="danger"
                        >

                          {
                            errors.password
                          }

                        </Text>

                      }

                    </div>



                    {/* FORGOT */}

                    <Row justify="end">

                      <Text

                        style={{
                          cursor:
                            "pointer",

                          color:
                            "#1677ff"
                        }}

                        onClick={() =>
                          setOpen(true)
                        }

                      >

                        Forgot Password?

                      </Text>

                    </Row>



                    {/* LOGIN BUTTON */}

                    <Button

                      htmlType="submit"

                      type="primary"

                      block

                      size="large"

                      disabled={loading}
                      style={{
                        marginTop: 20,
                        height: 52,
                        borderRadius: 14,
                        fontWeight: 700,
                        background:
                          "linear-gradient(135deg,#1677ff,#4096ff)",
                        boxShadow:
                          "0 10px 30px rgba(22,119,255,.35)"
                      }}

                    >

                      {

                        loading

                          ?

                          <Spin />

                          :

                          "Sign In"

                      }

                    </Button>



                    <Text

                      style={{

                        display: "block",

                        textAlign:
                          "center",

                        marginTop: 18,

                        color:
                          "#555"

                      }}

                    >

                      Ensuring quality at every stage
                      of your testing journey

                    </Text>

                  </Form>

                )}

              </Formik>



              <ForgotPasswordModal
                open={open}
                onClose={() =>
                  setOpen(false)
                }
              />

            </Card>
          </motion.div>

        </Col>

      </Row>
    </motion.div>
  );
};

export default LoginView;