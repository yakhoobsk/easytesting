import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Space,
    Switch,
    Typography,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ISTMCreate, ISTMGet } from "../../redux/services/settings/istmconnecters";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ApiOutlined, LinkOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ITSMConnectorsPage = () => {
    const dispatch = useAppDispatch();
    const { Istm } = useAppSelector((state) => state.ISTM);
    const [jiraForm] = Form.useForm();
    const [esiForm] = Form.useForm();

    const [jiraEnabled, setJiraEnabled] = useState(true);
    const [esiEnabled, setEsiEnabled] = useState(true);
    const [jiraLoading, setJiraLoading] = useState(false);
    const [esiLoading, setEsiLoading] = useState(false);

    useEffect(() => {
        dispatch(ISTMGet({ payload: {} }));
    }, [dispatch]);

    useEffect(() => {
        if (Istm && Array.isArray(Istm)) {
            const jiraData = Istm.find((i: any) => i.type === "Jira");
            const esiData = Istm.find((i: any) => i.type === "Esi");

            if (jiraData) {
                jiraForm.setFieldsValue(jiraData);
                setJiraEnabled(jiraData.Enabled !== false && jiraData.Enabled !== 0 && jiraData.Enabled !== "0");
            }
            if (esiData) {
                esiForm.setFieldsValue(esiData);
                setEsiEnabled(esiData.Enabled !== false && esiData.Enabled !== 0 && esiData.Enabled !== "0");
            }

        }
    }, [Istm, jiraForm, esiForm]);

    const onFinish = (values: any, type: "Jira" | "Esi") => {
        if (type === "Jira") setJiraLoading(true);
        else setEsiLoading(true);

        const payload = {
            instance_url: values.instance_url,
            username: values.username,
            token: values.token,
            type: type,
            Enabled: type === "Jira" ? jiraEnabled : esiEnabled
        };

        dispatch(ISTMCreate({ payload })).then((res: any) => {
            if (type === "Jira") setJiraLoading(false);
            else setEsiLoading(false);

            if (res.payload?.Response_Status === "Success") {
                dispatch(ISTMGet({ payload: {} }));
            }
        }).catch(() => {
            if (type === "Jira") setJiraLoading(false);
            else setEsiLoading(false);
        });
    };

    return (
        <Row gutter={[20, 20]} style={{ padding: 20 }}>

            {/* Jira */}

            <Col xs={24} lg={12}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .4 }}
                    whileHover={{ y: -4 }}
                >

                    <Card
                        bordered={false}

                        style={{
                            borderRadius: 20,

                            background:
                                "linear-gradient(145deg,#fff,#f8fafc)",

                            boxShadow:
                                "0 10px 30px rgba(0,0,0,.05)"
                        }}

                        title={

                            <div
                                style={{

                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center"

                                }}
                            >

                                <Space>

                                    <ApiOutlined
                                        style={{
                                            color: "#1677ff"
                                        }}
                                    />

                                    <Text strong>
                                        Jira Tickets
                                    </Text>

                                </Space>


                                <Switch
                                    checked={jiraEnabled}
                                    onChange={
                                        setJiraEnabled
                                    }
                                />

                            </div>

                        }

                    >

                        <Form
                            form={jiraForm}
                            layout="vertical"
                            onFinish={(v) =>
                                onFinish(
                                    v,
                                    "Jira"
                                )
                            }
                        >

                            <Form.Item
                                name="instance_url"
                                label="Instance URL"
                                rules={[
                                    {
                                        required: true,
                                        message: "Required"
                                    }
                                ]}
                            >

                                <Input
                                    prefix={<LinkOutlined />}
                                    placeholder="https://jira.com"
                                />

                            </Form.Item>



                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >

                                <Input
                                    placeholder="admin@gmail.com"
                                />

                            </Form.Item>



                            <Form.Item
                                name="token"
                                label="API Token"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >

                                <Input.Password />

                            </Form.Item>



                            <Button
                                block

                                type="primary"

                                htmlType="submit"

                                loading={
                                    jiraLoading
                                }

                                style={{

                                    height: 42,

                                    borderRadius: 10,

                                    fontWeight: 600

                                }}

                            >

                                Save Jira

                            </Button>

                        </Form>

                    </Card>

                </motion.div>

            </Col>




            {/* ESI */}

            <Col xs={24} lg={12}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: .1
                    }}

                    whileHover={{
                        y: -4
                    }}
                >

                    <Card
                        bordered={false}

                        style={{

                            borderRadius: 20,

                            background:
                                "linear-gradient(145deg,#fff,#f8fafc)",

                            boxShadow:
                                "0 10px 30px rgba(0,0,0,.05)"
                        }}

                        title={

                            <div
                                style={{

                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center"

                                }}
                            >

                                <Space>

                                    <ApiOutlined
                                        style={{
                                            color: "#1677ff"
                                        }}
                                    />

                                    <Text strong>
                                        ESI Tickets
                                    </Text>

                                </Space>


                                <Switch
                                    checked={
                                        esiEnabled
                                    }

                                    onChange={
                                        setEsiEnabled
                                    }
                                />

                            </div>

                        }

                    >

                        <Form
                            form={esiForm}
                            layout="vertical"

                            onFinish={(v) =>
                                onFinish(
                                    v,
                                    "Esi"
                                )
                            }
                        >

                            <Form.Item
                                name="instance_url"
                                label="Instance URL"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >

                                <Input
                                    prefix={<LinkOutlined />}
                                    placeholder="https://esi.com"
                                />

                            </Form.Item>


                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >

                                <Input />

                            </Form.Item>


                            <Form.Item
                                name="token"
                                label="API Token"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >

                                <Input.Password />

                            </Form.Item>


                            <Button
                                block

                                type="primary"

                                htmlType="submit"

                                loading={
                                    esiLoading
                                }

                                style={{

                                    height: 42,

                                    borderRadius: 10,



                                    fontWeight: 600

                                }}

                            >

                                Save ESI

                            </Button>

                        </Form>

                    </Card>

                </motion.div>

            </Col>

        </Row>
    );
};

export default ITSMConnectorsPage;
