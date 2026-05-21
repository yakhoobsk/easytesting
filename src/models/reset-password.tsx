import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UpdatePassword } from "../redux/services/authService";

interface Props {
    open: boolean;
    onClose: () => void;
}

const ResetPasswordModal: React.FC<Props> = ({ open, onClose }) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state) => state.auth);

    const schema = Yup.object().shape({
        currentPassword: Yup.string().required("Current password is required"),

        newPassword: Yup.string()
            .min(8, "Minimum 8 characters")
            .max(12, "Maximum 12 characters")
            .matches(/[A-Z]/, "At least one uppercase letter")
            .matches(/[a-z]/, "At least one lowercase letter")
            .matches(/[0-9]/, "At least one number")
            .matches(/[^A-Za-z0-9]/, "At least one special character")
            .required(" New password is required"),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Confirm password doesn’t match the new password")
            .required("Confirm your password")
    });

    const handleSubmit = async () => {
        try {
            const values = form.getFieldsValue();
            await schema.validate(values, { abortEarly: false });

            setLoading(true);
            const payload = {
                user_email: auth?.user_email || "",
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            };

            dispatch(UpdatePassword(payload)).then((res: any) => {
                setLoading(false);
                if (res.meta.requestStatus === "fulfilled") {
                    onClose();
                    form.resetFields();
                }
            });

        } catch (error: any) {
            const errors = error.inner.map((err: any) => ({
                name: err.path,
                errors: [err.message]
            }));

            form.setFields(errors);
        }
    };

    return (
        <Modal
            title="Reset Password"
            open={open}
            onCancel={onClose}
            footer={null}
            centered

        >
            <Form layout="vertical" form={form}>

                {/* Current Password */}
                <Form.Item name="currentPassword" label="Current Password">
                    <Input.Password
                        placeholder="Enter current password"
                        onChange={() => form.setFields([{ name: "currentPassword", errors: [] }])}

                    />
                </Form.Item>

                {/* New Password */}
                <Form.Item name="newPassword" label="New Password">
                    <Input
                        placeholder="Enter new password"
                        onChange={() => form.setFields([{ name: "newPassword", errors: [] }])}

                    />
                </Form.Item>

                {/* Confirm Password */}
                <Form.Item name="confirmPassword" label="Confirm Password">
                    <Input.Password
                        placeholder="Confirm password"
                        onChange={() => form.setFields([{ name: "confirmPassword", errors: [] }])}

                    />
                </Form.Item>

                <Button
                    type="primary"
                    block
                    loading={loading}
                    onClick={handleSubmit}
                    style={{ marginTop: 16 }}
                >
                    Reset Password
                </Button>

            </Form>
        </Modal>
    );
};

export default ResetPasswordModal;