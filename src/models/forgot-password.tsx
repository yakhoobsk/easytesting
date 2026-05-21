import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import * as Yup from "yup";
import { showSnackbar } from "../utils/snackbar";
import { useAppDispatch } from "../redux/hooks";
import { ForgotPassword } from "../redux/services/authService";

interface Props {
    open: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ open, onClose }) => {
    const [form] = Form.useForm();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();


    const schema = Yup.object().shape({
        email: Yup.string()
            .email("Enter valid email")
            .required("Email is required"),

        newPassword: Yup.string()
            .min(8, "Minimum 8 characters")
            .max(12, "Maximum 12 characters")
            .matches(/[A-Z]/, "At least one uppercase letter")
            .matches(/[a-z]/, "At least one lowercase letter")
            .matches(/[0-9]/, "At least one number")
            .matches(/[^A-Za-z0-9]/, "At least one special character")
            .required("Password is required"),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords do not match")
            .required("Confirm your password"),
    });

    // ✅ Verify Email
    const handleVerifyEmail = async () => {
        try {
            const values = form.getFieldsValue();

            await schema.validateAt("email", values);

            setLoading(true);

            setTimeout(() => {
                setLoading(false);
                setIsEmailVerified(true);
                showSnackbar("success", "Email verified successfully");
            }, 1000);
        } catch (error: any) {
            form.setFields([
                {
                    name: "email",
                    errors: [error.message],
                },
            ]);
        }
    };

    // ✅ Submit Password Reset
    const handleSubmit = async () => {
        try {
            const values = form.getFieldsValue();

            await schema.validate(values, { abortEarly: false });

            setLoading(true);

            const payload = {
                user_email: values.email,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            };

            dispatch(ForgotPassword(payload)).then((res: any) => {
                setLoading(false);
                if (res.meta.requestStatus === "fulfilled") {
                    onClose();
                    form.resetFields();
                    setIsEmailVerified(false);
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

    // ✅ Reusable Input Style
    const inputStyle = {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "#fff",
        borderRadius: 10,
        height: 42,
    };

    return (
        <Modal
            open={open}
            onCancel={() => {
                onClose();
                form.resetFields();
                setIsEmailVerified(false);
            }}
            footer={null}
            centered
            width={400}
            bodyStyle={{
                background: "transparent",
                padding: 0,
            }}

            closeIcon={
                null
            }
        >
            {/* ✅ Glass Card */}
            <div
                style={{
                    background: "rgba(40, 40, 70, 0.9)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 20,
                    padding: 24,
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                }}
            >
                {/* Title */}
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ color: "#fff", marginBottom: 4 }}>
                        Forgot Password
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                        Reset your password securely
                    </p>
                </div>

                <Form layout="vertical" form={form}>
                    {/* Email */}
                    <Form.Item
                        name="email"
                        label={<span style={{ color: "#ccc" }}>Email</span>}
                        style={{ marginBottom: 14 }}
                    >
                        <Input
                            placeholder="Enter email"
                            disabled={isEmailVerified}
                            style={inputStyle}
                            onChange={() =>
                                form.setFields([
                                    { name: "email", errors: [] },
                                ])
                            }
                        />
                    </Form.Item>

                    {/* Verify Button */}
                    <Button
                        block
                        onClick={handleVerifyEmail}
                        loading={loading}
                        disabled={isEmailVerified}
                        style={{
                            background:
                                "linear-gradient(135deg, #7b2ff7, #2b7bff)",
                            border: "none",
                            height: 42,
                            borderRadius: 10,
                            fontWeight: 600,
                            marginBottom: 16,
                            color: "white"
                        }}
                    >
                        Verify Email
                    </Button>

                    {/* Password */}
                    <Form.Item
                        name="newPassword"
                        label={
                            <span style={{ color: "#ccc" }}>
                                New Password
                            </span>
                        }
                        style={{ marginBottom: 14 }}
                    >
                        <Input.Password
                            placeholder="Enter new password"
                            disabled={!isEmailVerified}
                            style={inputStyle}
                            onChange={() =>
                                form.setFields([
                                    { name: "newPassword", errors: [] },
                                ])
                            }
                        />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item
                        name="confirmPassword"
                        label={
                            <span style={{ color: "#ccc" }}>
                                Confirm Password
                            </span>
                        }
                        style={{ marginBottom: 18 }}
                    >
                        <Input.Password
                            placeholder="Confirm password"
                            disabled={!isEmailVerified}
                            style={inputStyle}
                            onChange={() =>
                                form.setFields([
                                    {
                                        name: "confirmPassword",
                                        errors: [],
                                    },
                                ])
                            }
                        />
                    </Form.Item>

                    {/* Reset Button */}
                    <Button
                        block
                        loading={loading}
                        onClick={handleSubmit}
                        disabled={!isEmailVerified}
                        style={{
                            background:
                                "linear-gradient(135deg, #ff7a5c, #ffb199)",
                            border: "none",
                            height: 42,
                            borderRadius: 10,
                            fontWeight: 600,
                        }}
                    >
                        Reset Password
                    </Button>
                </Form>
            </div>
        </Modal>
    );
};

export default ForgotPasswordModal;