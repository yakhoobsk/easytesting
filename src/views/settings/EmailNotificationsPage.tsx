import { Space, Switch, Button, Modal, Form, Select, Typography, Spin, Tag, Row, Col, Card } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, MailOutlined, BellFilled } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { EmailnotificatsGet, EmailNotificationCreate, EmailNotificationUpdate } from "../../redux/services/settings/emailnotificationServices";
import { motion } from "framer-motion";
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
        dispatch(EmailNotificationCreate(payload)).unwrap().then(() => {
            dispatch(EmailnotificatsGet({ payload: {} }));
            setIsModalVisible(false);
            form.resetFields();
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
        dispatch(EmailNotificationUpdate(payload));
    };

    return (
        <div style={{ padding: '10px', background: '#f8fafc', minHeight: '100%' }}>
            {/* Content Container */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>

                {/* Section Hero Card */}
                <Card
                    style={{
                        borderRadius: 14,
                        marginBottom: 32,
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                    bodyStyle={{ padding: '24px 32px' }}
                >
                    <Row justify="space-between" align="middle" gutter={[16, 16]}>
                        <Col xs={24} md={16}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    background: '#1677ff',
                                    borderRadius: 12,
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <BellFilled style={{ fontSize: 24, color: '#fff' }} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>Email Notifications</Title>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Manage alert & execution emails</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Tag color="blue" style={{ borderRadius: 6, padding: '2px 10px', fontWeight: 600, border: 'none', background: '#e6f4ff', margin: 0 }}>
                                    {localNotifications.length} Emails
                                </Tag>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="middle"
                                    onClick={showModal}
                                    style={{ borderRadius: 8, fontWeight: 600 }}
                                >
                                    Add Email
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Notifications Grid */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: 100 }}>
                        <Spin size="large" tip="Loading notifications..." />
                    </div>
                ) : (
                    <Row gutter={[24, 24]}>
                        {localNotifications.map((item, index) => {
                            const emailVal = item.recipients || item.email || item.email_id;
                            const isActive = item.is_enabled === 1 || item.status === 1 || item.is_active === 1;

                            return (
                                <Col xs={24} lg={12} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            style={{
                                                borderRadius: 16,
                                                border: '1px solid #f1f5f9',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                                            }}
                                            bodyStyle={{ padding: '16px 20px' }}
                                        >
                                            <Row justify="space-between" align="middle" gutter={[12, 12]}>
                                                <Col xs={24} sm={16}>
                                                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
                                                        <div style={{
                                                            width: 48,
                                                            height: 48,
                                                            background: isActive ? '#e6f4ff' : '#fef2f2',
                                                            borderRadius: 10,
                                                            flexShrink: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <MailOutlined style={{ fontSize: 20, color: isActive ? '#1677ff' : '#ef4444' }} />
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                                            <Text strong style={{
                                                                display: 'block',
                                                                fontSize: 16,
                                                                color: '#334155',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {emailVal}
                                                            </Text>
                                                            <Text style={{
                                                                fontSize: 13,
                                                                color: '#64748b',
                                                                display: 'block'
                                                            }}>
                                                                Receives alerts & execution notifications
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={24} sm={8}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
                                                        <Tag color={isActive ? "success" : "error"} style={{
                                                            borderRadius: 8,
                                                            padding: '2px 10px',
                                                            fontWeight: 600,
                                                            border: 'none',
                                                            background: isActive ? '#f0fdf4' : '#fef2f2',
                                                            color: isActive ? '#22c55e' : '#ef4444',
                                                            margin: 0
                                                        }}>
                                                            {isActive ? "Active" : "Inactive"}
                                                        </Tag>
                                                        <Switch
                                                            checked={isActive}
                                                            onChange={(checked) => handleToggle(checked, item)}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </motion.div>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </div>

            {/* Modal */}
            <Modal
                title={<Title level={4} style={{ margin: 0 }}>Configure Email Notification</Title>}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                destroyOnClose
                bodyStyle={{ padding: '24px 0' }}
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
                            size="large"
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

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '32px' }}>
                        <Space size={12}>
                            <Button onClick={handleCancel} size="large" style={{ borderRadius: 8 }}>Cancel</Button>
                            <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: 8, paddingLeft: 32, paddingRight: 32 }}>
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