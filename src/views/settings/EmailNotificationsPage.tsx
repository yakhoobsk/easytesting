import { Space, Switch, Button, Modal, Form, Select, List, Typography, Spin, Avatar, Tag } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, MailOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { EmailnotificatsGet, EmailNotificationCreate, EmailNotificationUpdate } from "../../redux/services/settings/emailnotificationServices";
import { motion } from "framer-motion";
import { BellOutlined } from "@ant-design/icons";

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

            <div

                style={{
                    borderRadius: 20,

                }}
            >


                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 24
                    }}
                >

                    {/* Left */}

                    <Space size="middle">

                        <div
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <BellOutlined
                                style={{
                                    color: "#1677ff",
                                    fontSize: 20
                                }}
                            />
                        </div>


                        <div>

                            <Title
                                level={4}
                                style={{
                                    margin: 0
                                }}
                            >
                                Notifications
                            </Title>

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12
                                }}
                            >
                                Manage alert emails
                            </Text>

                        </div>

                    </Space>



                    {/* Right */}

                    <Space wrap>

                        <Tag
                            color="blue"
                            style={{
                                padding: "4px 10px",
                                borderRadius: 20,
                                fontWeight: 600
                            }}
                        >
                            {localNotifications.length} Emails
                        </Tag>


                        <Button

                            type="primary"

                            icon={<PlusOutlined />}

                            onClick={showModal}

                            style={{

                                borderRadius: 10,

                                height: 38,

                                fontWeight: 600

                            }}

                        >

                            Create

                        </Button>

                    </Space>

                </div>



                {loading ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: 50
                        }}
                    >

                        <Spin
                            size="large"
                            tip="Loading notifications..."
                        />

                    </div>

                ) : (

                    <List

                        dataSource={
                            localNotifications
                        }

                        renderItem={(
                            item: any,
                            index: number
                        ) => {

                            const emailVal =
                                item.recipients
                                ||
                                item.email
                                ||
                                item.email_id;


                            const isActive =

                                item.is_enabled === 1 ||

                                item.status === 1 ||

                                item.is_active === 1;


                            return (

                                <motion.div

                                    initial={{
                                        opacity: 0,
                                        x: -20
                                    }}

                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}

                                    transition={{
                                        delay: index * .08
                                    }}

                                >

                                    <List.Item

                                        style={{

                                            padding:
                                                "16px",

                                            borderRadius:
                                                14,

                                            marginBottom:
                                                12,

                                            background:
                                                "#fff",

                                            boxShadow:
                                                "0 2px 12px rgba(0,0,0,.04)",

                                            flexWrap:
                                                "wrap"

                                        }}

                                        actions={[

                                            <Switch

                                                key="toggle"

                                                checked={
                                                    isActive
                                                }

                                                onChange={(
                                                    checked
                                                ) =>

                                                    handleToggle(
                                                        checked,
                                                        item
                                                    )

                                                }

                                                checkedChildren=
                                                "ON"

                                                unCheckedChildren=
                                                "OFF"

                                            />

                                        ]}

                                    >

                                        <List.Item.Meta

                                            avatar={

                                                <Avatar

                                                    style={{

                                                        background:
                                                            "#e6f4ff",

                                                        color:
                                                            "#1677ff"

                                                    }}

                                                    icon={
                                                        <MailOutlined />
                                                    }

                                                />

                                            }

                                            title={

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 10,
                                                        flexWrap: "wrap"
                                                    }}
                                                >

                                                    <Text strong>

                                                        {emailVal}

                                                    </Text>


                                                    <Tag
                                                        color={
                                                            isActive

                                                                ?

                                                                "green"

                                                                :

                                                                "red"
                                                        }
                                                    >

                                                        {

                                                            isActive

                                                                ?

                                                                "ACTIVE"

                                                                :

                                                                "INACTIVE"

                                                        }

                                                    </Tag>

                                                </div>

                                            }

                                            description={

                                                <Text
                                                    type="secondary"
                                                >

                                                    Receive alerts
                                                    and execution
                                                    notifications

                                                </Text>

                                            }

                                        />

                                    </List.Item>

                                </motion.div>

                            );

                        }}

                    />

                )}

            </div>
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