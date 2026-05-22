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

const { useBreakpoint } = Grid;
const { Text } = Typography;

const LoginView = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  return (
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
          padding:
            screens.xs
              ? 25
              : 50,
        }}
      >

        <div>

          <Title
            style={{
              color: "#1677ff",
              margin: 0,
              fontWeight: 700,
              fontSize:
                screens.xs
                  ? 40
                  : 70,
            }}
          >
            EASY
          </Title>


          <Title
            style={{
              margin: 0,
              fontWeight: 800,
              lineHeight: 1,
              fontSize:
                screens.xs
                  ? 45
                  : 85,
            }}
          >
            TESTING
          </Title>


          <Text
            style={{
              fontSize:
                screens.xs
                  ? 16
                  : 22,
              color: "#555",
            }}
          >
            AI Testing Platform
          </Text>

        </div>

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

        <Card
          style={{
            width: "100%",
            maxWidth: 430,
            borderRadius: 20,

            background:
              "rgba(255,255,255,.35)",

            backdropFilter:
              "blur(20px)",

            boxShadow:
              "0 25px 50px rgba(0,0,0,.08)",

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

            <img
              src={logos}
              width={60}
              height={60}
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

                    height: 48,

                    borderRadius: 10,

                    fontWeight: 600

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

      </Col>

    </Row>
  );
};

export default LoginView;