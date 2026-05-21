import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Switch,
    Typography,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ISTMCreate, ISTMGet } from "../../redux/services/settings/istmconnecters";
import { useState, useEffect } from "react";

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
        <Row gutter={[24, 24]} style={{ padding: 24 }}>
            <Col span={12}>
                <Card
                    title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text strong>Jira-Tickets</Text>
                            <Switch
                                checked={jiraEnabled}
                                onChange={(checked) => setJiraEnabled(checked)}
                                size="small"
                            />
                        </div>
                    }
                >
                    <Form
                        form={jiraForm}
                        layout="vertical"
                        onFinish={(values) => onFinish(values, "Jira")}
                    >
                        <Form.Item
                            name="instance_url"
                            label="instance_url"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="https://jira.com" />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="admin@gmail.com" />
                        </Form.Item>

                        <Form.Item
                            name="token"
                            label="API Token"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={jiraLoading}>
                            Save Jira
                        </Button>
                    </Form>
                </Card>
            </Col>

            <Col span={12}>
                <Card
                    title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text strong>Esi-Tickets</Text>
                            <Switch
                                checked={esiEnabled}
                                onChange={(checked) => setEsiEnabled(checked)}
                                size="small"
                            />
                        </div>
                    }
                >
                    <Form
                        form={esiForm}
                        layout="vertical"
                        onFinish={(values) => onFinish(values, "Esi")}
                    >
                        <Form.Item
                            name="instance_url"
                            label="Instance URL"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="https://esi.com" />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="admin@gmail.com" />
                        </Form.Item>

                        <Form.Item
                            name="token"
                            label="API Token"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={esiLoading}>
                            Save Esi
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default ITSMConnectorsPage;
