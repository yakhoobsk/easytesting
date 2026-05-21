import { Space, Switch, Button, Modal, Form, Select, List, Typography, Card, Spin } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, MailOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { EmailnotificatsGet, EmailNotificationCreate, EmailNotificationUpdate } from "../../redux/services/settings/emailnotificationServices";


import { UserMailGet } from "../../redux/services/settings/userService";

const { Text, Title } = Typography;
const { Option } = Select;

const EmailNotificationsPage = () => {
    const dispatch = useAppDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const { emailNotifications, loading } = useAppSelector((state) => state.email);
    const { UserMail } = useAppSelector((state) => state.user);

    const [localNotifications, setLocalNotifications] = useState<any[]>([]);

    useEffect(() => {
        dispatch(EmailnotificatsGet({ payload: {} }));
        dispatch(UserMailGet({}));
    }, [dispatch]);

    useEffect(() => {
        if (emailNotifications) {
            setLocalNotifications(emailNotifications);
        } else {
            setLocalNotifications([]);
        }
    }, [emailNotifications]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = (values: any) => {
        const payload = {
            email: values.email,
            status: values.status ? 1 : 0,
        };
        dispatch(EmailNotificationCreate(payload)).then((action: any) => {
            if (action.meta.requestStatus === 'fulfilled') {
                dispatch(EmailnotificatsGet({ payload: {} }));
                setIsModalVisible(false);
                form.resetFields();
            }
        });
    };

    const handleToggle = (checked: boolean, item: any) => {
        const emailVal = item.recipients || item.email || item.email_id;

        setLocalNotifications(prev =>
            prev.map(notif => {
                const currentEmail = notif.recipients || notif.email || notif.email_id;
                if (currentEmail === emailVal) {
                    return {
                        ...notif,
                        is_enabled: checked ? 1 : 0,
                        status: checked ? 1 : 0,
                        is_active: checked ? 1 : 0
                    };
                }
                return notif;
            })
        );

        const payload = {
            email: emailVal,
            status: checked ? 1 : 0,
        };
        dispatch(EmailNotificationUpdate(payload)).then((action: any) => {
            if (action.meta.requestStatus === 'fulfilled') {
                dispatch(EmailnotificatsGet({ payload: {} }));
            }
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={4} style={{ margin: 0 }}>Email Notifications</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    style={{ borderRadius: '6px' }}
                >
                    Create
                </Button>
            </div>

            <Card style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin tip="Loading notifications..." />
                    </div>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={localNotifications}
                        renderItem={(item: any) => {
                            const emailVal = item.recipients || item.email || item.email_id;
                            const isActive = item.is_enabled === 1 || item.status === 1 || item.is_active === 1;
                            return (
                                <List.Item
                                    actions={[
                                        <Switch
                                            key="active-toggle"
                                            checked={isActive}
                                            onChange={(checked) => handleToggle(checked, item)}
                                            checkedChildren="Active"
                                            unCheckedChildren="In-Active"
                                        />
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<MailOutlined style={{ fontSize: '20px', color: '#1890ff', marginTop: '4px' }} />}
                                        title={<Text strong>{emailVal}</Text>}
                                        description={<Text type="secondary">Receive alerts at this email address</Text>}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </Card>

            <Modal
                title={<Title level={5}>Configure Email Notification</Title>}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ status: true }}
                >
                    <Form.Item
                        name="email"
                        label="Select Email"
                        rules={[{ required: true, message: 'Please select an email' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Search or select email"
                            style={{ width: '100%' }}
                        >
                            {(Array.isArray(UserMail) ? UserMail : (UserMail?.Results || UserMail?.results || [])).map((item: any) => {
                                const email = typeof item === "string" ? item : item.user_mail || item.user_email || item.email;
                                return (
                                    <Option key={email} value={email}>
                                        {email}
                                    </Option>
                                );
                            })}

                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '24px' }}>
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EmailNotificationsPage;