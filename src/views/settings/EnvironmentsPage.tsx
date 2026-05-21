import { Typography, Tag, Spin, Card, Row, Col } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { EnvironmentFetch } from "../../redux/services/settings/environmentService";

const { Text, Title } = Typography;

const EnvironmentsPage = () => {
    const dispatch = useAppDispatch();
    const { environments, loading } = useAppSelector((state) => state.environment);

    useEffect(() => {
        dispatch(EnvironmentFetch());
    }, [dispatch]);

    const getClassificationColor = (classification: string) => {
        switch (classification?.toUpperCase()) {
            case "PROD":
                return "volcano";
            case "TEST":
                return "green";
            case "DEV":
                return "blue";
            default:
                return "default";
        }
    };

    if (loading && environments.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" tip="Loading environments..." />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={4} style={{ marginBottom: '24px' }}>Environments</Title>
            <Row gutter={[24, 24]}>
                {environments.map((env) => (
                    <Col xs={24} sm={12} key={env.id}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '20px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: '16px', color: '#1f1f1f' }}>
                                    {env.name}
                                </Text>
                                <Tag
                                    color={getClassificationColor(env.classification)}
                                    style={{
                                        borderRadius: '6px',
                                        padding: '2px 10px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {env.classification || "N/A"}
                                </Tag>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default EnvironmentsPage;