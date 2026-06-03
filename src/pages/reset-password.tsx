import { Card, Form, Input, Button, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UpdatePassword } from "../redux/services/authService";

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state: any) => state.auth);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    currentPassword: Yup.string().required(
      "Current password is required"
    ),

    newPassword: Yup.string()
      .required("New password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,12}$/,
        "Password must be 8-12 characters and contain uppercase, lowercase, number, and special character"
      ),

    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf(
        [Yup.ref("newPassword")],
        "Passwords do not match"
      ),
  });

  const handleSubmit = async () => {
    try {
      // Clear previous errors
      form.setFields([
        { name: "currentPassword", errors: [] },
        { name: "newPassword", errors: [] },
        { name: "confirmPassword", errors: [] },
      ]);

      const values = form.getFieldsValue(true);

      await schema.validate(values, {
        abortEarly: false,
      });

      setLoading(true);

      const userEmail =
        auth?.user_email ||
        (Array.isArray(auth) &&
          auth[0]?.[0]?.user_email);

      const payload = {
        user_email: userEmail,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      const res: any = await dispatch(
        UpdatePassword(payload)
      );

      setLoading(false);

      if (
        res?.payload?.Response_Status ===
        "Success"
      ) {
        form.resetFields();
        navigate("/profile");
      }
    } catch (error: any) {
      setLoading(false);

      if (error?.inner?.length) {
        const fieldErrors = error.inner.map(
          (err: any) => ({
            name: err.path,
            errors: [err.message],
          })
        );

        form.setFields(fieldErrors);
      }
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col
        xs={24}
        sm={22}
        md={20}
        lg={18}
        xl={14}
      >
        <Card
          style={{
            borderRadius: 12,
            padding: "24px",
          }}
        >
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 24 }}
          >
            <Col>
              <Title
                level={3}
                style={{ margin: 0 }}
              >
                Change Password
              </Title>

              <Text type="secondary">
                Update your account password
                securely
              </Text>
            </Col>
          </Row>

          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="currentPassword"
              label={
                <Text strong>
                  Current Password
                </Text>
              }
            >
              <Input.Password
                placeholder="Enter current password"
                size="large"
                style={{
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={
                <Text strong>
                  New Password
                </Text>
              }
              extra={
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                  }}
                >
                  Password must contain:
                  <br />
                  • 8-12 characters
                  <br />
                  • 1 uppercase letter
                  <br />
                  • 1 lowercase letter
                  <br />
                  • 1 number
                  <br />
                  • 1 special character
                </Text>
              }
            >
              <Input.Password
                placeholder="Enter new password"
                size="large"
                style={{
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<Text strong>Confirm Password</Text>}
              dependencies={["newPassword"]}
            >
              <Input.Password
                placeholder="Confirm new password"
                size="large"
                style={{ borderRadius: 8 }}
                onChange={async () => {
                  try {
                    const values = form.getFieldsValue();

                    await schema.validateAt(
                      "confirmPassword",
                      values
                    );

                    form.setFields([
                      {
                        name: "confirmPassword",
                        errors: [],
                      },
                    ]);
                  } catch (err: any) {
                    form.setFields([
                      {
                        name: "confirmPassword",
                        errors: [err.message],
                      },
                    ]);
                  }
                }}
              />
            </Form.Item>

            <Row
              gutter={12}
              justify="end"
              style={{
                marginTop: 24,
              }}
            >
              <Col>
                <Button
                  onClick={() =>
                    navigate(
                      "/profile"
                    )
                  }
                  style={{
                    borderRadius: 8,
                  }}
                >
                  Cancel
                </Button>
              </Col>

              <Col>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={
                    handleSubmit
                  }
                  style={{
                    borderRadius: 8,
                  }}
                >
                  Update Password
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPasswordPage;