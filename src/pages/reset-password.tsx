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
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Minimum 8 characters")
      .max(12, "Maximum 12 characters")
      .matches(/[A-Z]/, "At least one uppercase letter")
      .matches(/[a-z]/, "At least one lowercase letter")
      .matches(/[0-9]/, "At least one number")
      .matches(/[^A-Za-z0-9]/, "At least one special character")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords don't match")
      .required("Confirm your password"),
  });

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      await schema.validate(values, { abortEarly: false });

      setLoading(true);

      const userEmail = auth?.user_email || (Array.isArray(auth) && auth[0]?.[0]?.user_email);

      const payload = {
        user_email: userEmail,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      dispatch(UpdatePassword(payload)).then((res: any) => {
        setLoading(false);
        if (res.payload?.Response_Status === "Success") {
          form.resetFields();
          navigate("/profile");
        }
      });
    } catch (error: any) {
      const errors = error.inner.map((err: any) => ({
        name: err.path,
        errors: [err.message],
      }));
      form.setFields(errors);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={14}>
        <Card style={{ borderRadius: 12, padding: "24px" }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                Change Password
              </Title>
              <Text type="secondary">Update your account password securely</Text>
            </Col>
          </Row>

          <Form form={form} layout="vertical">
            {/* Current Password */}
            <Form.Item
              name="currentPassword"
              label={<Text strong>Current Password</Text>}
            >
              <Input.Password
                placeholder="Enter current password"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* New Password */}
            <Form.Item
              name="newPassword"
              label={<Text strong>New Password</Text>}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Min 8 chars, 1 uppercase, 1 number, 1 special character
                </Text>
              }
            >
              <Input.Password
                placeholder="Enter new password"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              label={<Text strong>Confirm Password</Text>}
            >
              <Input.Password
                placeholder="Confirm new password"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* Buttons */}
            <Row gutter={12} justify="end" style={{ marginTop: 24 }}>
              <Col>
                <Button onClick={() => navigate("/profile")} style={{ borderRadius: 8 }}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleSubmit}
                  style={{ borderRadius: 8 }}
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
