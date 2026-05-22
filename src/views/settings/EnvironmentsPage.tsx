import { Typography, Tag, Spin, Card, Row, Col } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { EnvironmentFetch } from "../../redux/services/settings/environmentService";
import { motion } from "framer-motion";
import { EnvironmentOutlined } from "@ant-design/icons";
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
        <div style={{ padding: 20 }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 12
                }}
            >

                <Title
                    level={3}
                    style={{
                        margin: 0
                    }}
                >

                </Title>

                <Text type="secondary">
                    Total: {environments.length}
                </Text>

            </div>


            <Row gutter={[18, 18]}>

                {environments.map((env, index) => (

                    <Col
                        key={env.id}

                        xs={24}
                        sm={12}
                        lg={8}
                    >

                        <motion.div

                            initial={{
                                opacity: 0,
                                y: 20
                            }}

                            animate={{
                                opacity: 1,
                                y: 0
                            }}

                            transition={{
                                delay: index * 0.08
                            }}

                            whileHover={{
                                y: -6,
                                scale: 1.02
                            }}

                        >

                            <Card

                                hoverable

                                bodyStyle={{
                                    padding: 22
                                }}

                                style={{

                                    borderRadius: 18,

                                    border: "none",

                                    background:
                                        "linear-gradient(135deg,#fff,#f8fafc)",

                                    boxShadow:
                                        "0 8px 30px rgba(0,0,0,.05)"

                                }}

                            >

                                <div
                                    style={{

                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems:
                                            "flex-start",

                                        gap: 12

                                    }}
                                >

                                    <div>

                                        <div
                                            style={{

                                                width: 42,

                                                height: 42,

                                                borderRadius: 12,

                                                background:
                                                    "#eff6ff",

                                                display: "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                marginBottom: 12

                                            }}
                                        >

                                            <EnvironmentOutlined
                                                style={{
                                                    color:
                                                        "#2563eb",

                                                    fontSize:
                                                        18
                                                }}
                                            />

                                        </div>


                                        <Text
                                            strong

                                            style={{

                                                fontSize: 17,

                                                display: "block"

                                            }}
                                        >

                                            {env.name}

                                        </Text>


                                        <Text
                                            type="secondary"

                                            style={{
                                                fontSize: 13
                                            }}
                                        >

                                            Environment ID:
                                            {env.id}

                                        </Text>

                                    </div>



                                    <Tag

                                        color={
                                            getClassificationColor(
                                                env.classification
                                            )
                                        }

                                        style={{

                                            borderRadius:
                                                20,

                                            padding:
                                                "4px 12px",

                                            fontWeight:
                                                600,

                                            textTransform:
                                                "uppercase"

                                        }}

                                    >

                                        {env.classification || "N/A"}

                                    </Tag>

                                </div>

                            </Card>

                        </motion.div>

                    </Col>

                ))}

            </Row>

        </div>
    );
};

export default EnvironmentsPage;