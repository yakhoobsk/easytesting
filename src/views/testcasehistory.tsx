import { useState } from "react";
import {
    Row,
    Col,
    Card,
    Table,
    Tag,
    Progress,
    Button,
    Modal,
    Typography,
} from "antd";
import {
    BarChartOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const ExecutionDashboard = () => {
    const [selectedRecord, setSelectedRecord] =
        useState<any>(null);

    const [open, setOpen] = useState(false);

    const data = [
        {
            key: 1,
            executionId: "EXE-1001",
            environment: "UAT",
            folderName: "Authentication",
            processName: "Login Validation",
            expectedPayload: {
                email: "srinu@gmail.com",
                password: "Password@123",
                role: "admin",
            },
            actualPayload: {
                email: "srinu@gmail.com",
                password: "Password@123",
                role: "admin",
            },
            resultPercentage: 98,
            status: "Success",
            testCases: [
                {
                    name: "Need to check mail",
                    percentage: 100,
                },
                {
                    name: "Password should be 16 letters",
                    percentage: 100,
                },
                {
                    name: "Role Validation",
                    percentage: 95,
                },
            ],
        },
        {
            key: 2,
            executionId: "EXE-1002",
            environment: "PROD",
            folderName: "Payments",
            processName: "Transaction Flow",
            expectedPayload: {
                transactionId: "TXN-10001",
                amount: 5000,
                currency: "INR",
                status: "Completed",
            },
            actualPayload: {
                transactionId: "TXN-10001",
                amount: 5000,
                currency: "INR",
                status: "Pending",
            },
            resultPercentage: 82,
            status: "Partial Success",
            testCases: [
                {
                    name: "Transaction Validation",
                    percentage: 100,
                },
                {
                    name: "Status Validation",
                    percentage: 45,
                },
                {
                    name: "Currency Validation",
                    percentage: 100,
                },
            ],
        },
        {
            key: 3,
            executionId: "EXE-1003",
            environment: "QA",
            folderName: "Users",
            processName: "Registration",
            expectedPayload: {
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                isActive: true,
            },
            actualPayload: {
                firstName: "John",
                lastName: "",
                email: "invalid-email",
                isActive: false,
            },
            resultPercentage: 45,
            status: "Failed",
            testCases: [
                {
                    name: "Email Validation",
                    percentage: 30,
                },
                {
                    name: "Last Name Validation",
                    percentage: 0,
                },
                {
                    name: "User Active Validation",
                    percentage: 50,
                },
            ],
        },
        {
            key: 4,
            executionId: "EXE-1004",
            environment: "DEV",
            folderName: "Employee",
            processName: "Employee Creation",
            expectedPayload: {
                employeeId: "EMP1001",
                department: "Engineering",
                designation: "Developer",
                salary: 80000,
            },
            actualPayload: {
                employeeId: "EMP1001",
                department: "Engineering",
                designation: "Tester",
                salary: 75000,
            },
            resultPercentage: 68,
            status: "Partially Failed",
            testCases: [
                {
                    name: "Department Validation",
                    percentage: 100,
                },
                {
                    name: "Designation Validation",
                    percentage: 20,
                },
                {
                    name: "Salary Validation",
                    percentage: 40,
                },
            ],
        },
    ];

    const openModal = (record: any) => {
        setSelectedRecord(record);
        setOpen(true);
    };

    const columns = [
        {
            title: "Execution ID",
            dataIndex: "executionId",
        },
        {
            title: "Environment",
            dataIndex: "environment",
        },
        {
            title: "Folder Name",
            dataIndex: "folderName",
        },
        {
            title: "Process Name",
            dataIndex: "processName",
        },
        {
            title: "Expected Payload",
            dataIndex: "expectedPayload",
            width: 250,
            render: (payload: any) => (
                <pre
                    style={{
                        background: "#f6f8fa",
                        padding: 10,
                        borderRadius: 8,
                        fontSize: 12,
                        maxWidth: 220,
                        overflow: "auto",
                    }}
                >
                    {JSON.stringify(payload, null, 2)}
                </pre>
            ),
        },
        {
            title: "Actual Payload",
            dataIndex: "actualPayload",
            width: 250,
            render: (payload: any) => (
                <pre
                    style={{
                        background: "#fff7e6",
                        padding: 10,
                        borderRadius: 8,
                        fontSize: 12,
                        maxWidth: 220,
                        overflow: "auto",
                    }}
                >
                    {JSON.stringify(payload, null, 2)}
                </pre>
            ),
        },
        {
            title: "Result %",
            dataIndex: "resultPercentage",
            render: (value: number) => (
                <Progress
                    percent={value}
                    strokeColor={
                        value >= 90
                            ? "#52c41a"
                            : value >= 70
                                ? "#faad14"
                                : "#ff4d4f"
                    }
                />
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) => {
                const colors: any = {
                    Success: "green",
                    "Partial Success": "orange",
                    Failed: "red",
                    "Partially Failed":
                        "purple",
                };

                return (
                    <Tag
                        color={colors[status]}
                        style={{
                            borderRadius: 20,
                            padding:
                                "4px 12px",
                        }}
                    >
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: "Action",
            render: (_: any, record: any) => (
                <Button
                    icon={<EyeOutlined />}
                    type="primary"
                    onClick={() =>
                        openModal(record)
                    }
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Summary Cards */}
            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={6}>
                    <motion.div
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}
                    >
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 24,
                                overflow: "hidden",
                                background:
                                    "linear-gradient(135deg,#6366F1,#8B5CF6)",
                                boxShadow:
                                    "0 15px 35px rgba(99,102,241,.35)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color:
                                                "rgba(255,255,255,.8)",
                                            fontSize: 14,
                                        }}
                                    >
                                        Total Executions
                                    </div>

                                    <div
                                        style={{
                                            color: "#fff",
                                            fontSize: 34,
                                            fontWeight: 700,
                                        }}
                                    >
                                        245
                                    </div>
                                </div>

                                <BarChartOutlined
                                    style={{
                                        fontSize: 42,
                                        color:
                                            "rgba(255,255,255,.8)",
                                    }}
                                />
                            </div>
                        </Card>
                    </motion.div>
                </Col>

                <Col xs={24} md={6}>
                    <motion.div
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}
                    >
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 24,
                                background:
                                    "linear-gradient(135deg,#10B981,#34D399)",
                                boxShadow:
                                    "0 15px 35px rgba(16,185,129,.35)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color:
                                                "rgba(255,255,255,.85)",
                                        }}
                                    >
                                        Success Rate
                                    </div>

                                    <div
                                        style={{
                                            color: "#fff",
                                            fontSize: 34,
                                            fontWeight: 700,
                                        }}
                                    >
                                        92%
                                    </div>
                                </div>

                                <CheckCircleOutlined
                                    style={{
                                        fontSize: 42,
                                        color:
                                            "rgba(255,255,255,.85)",
                                    }}
                                />
                            </div>
                        </Card>
                    </motion.div>
                </Col>

                <Col xs={24} md={6}>
                    <motion.div
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}
                    >
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 24,
                                background:
                                    "linear-gradient(135deg,#F59E0B,#FBBF24)",
                                boxShadow:
                                    "0 15px 35px rgba(245,158,11,.35)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color:
                                                "rgba(255,255,255,.85)",
                                        }}
                                    >
                                        Partial Success
                                    </div>

                                    <div
                                        style={{
                                            color: "#fff",
                                            fontSize: 34,
                                            fontWeight: 700,
                                        }}
                                    >
                                        5%
                                    </div>
                                </div>

                                <WarningOutlined
                                    style={{
                                        fontSize: 42,
                                        color:
                                            "rgba(255,255,255,.85)",
                                    }}
                                />
                            </div>
                        </Card>
                    </motion.div>
                </Col>

                <Col xs={24} md={6}>
                    <motion.div
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}
                    >
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 24,
                                background:
                                    "linear-gradient(135deg,#EF4444,#F87171)",
                                boxShadow:
                                    "0 15px 35px rgba(239,68,68,.35)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color:
                                                "rgba(255,255,255,.85)",
                                        }}
                                    >
                                        Failed
                                    </div>

                                    <div
                                        style={{
                                            color: "#fff",
                                            fontSize: 34,
                                            fontWeight: 700,
                                        }}
                                    >
                                        3%
                                    </div>
                                </div>

                                <CloseCircleOutlined
                                    style={{
                                        fontSize: 42,
                                        color:
                                            "rgba(255,255,255,.85)",
                                    }}
                                />
                            </div>
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* Table */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
            >
                <Card
                    bordered={false}
                    style={{
                        borderRadius: 24,
                    }}
                >
                    <Title level={4}>
                        Test Execution Results
                    </Title>

                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={{
                            pageSize: 5,
                        }}
                        scroll={{
                            x: 1800,
                        }}
                        size="middle"
                    />
                </Card>
            </motion.div>

            {/* Modal */}
            <Modal
                open={open}
                footer={null}
                width={750}
                onCancel={() =>
                    setOpen(false)
                }
                title={
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                        }}
                    >
                        Test Case Analysis
                    </Title>
                }
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >
                    {selectedRecord
                        ?.testCases?.map(
                            (
                                item: any,
                                index: number
                            ) => (
                                <Card
                                    key={index}
                                    size="small"
                                    style={{
                                        marginBottom:
                                            16,
                                        borderRadius:
                                            16,
                                        background:
                                            "#fafbff",
                                    }}
                                >
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                    >
                                        <Col span={16}>
                                            <Text strong>
                                                {
                                                    item.name
                                                }
                                            </Text>

                                            <Progress
                                                percent={
                                                    item.percentage
                                                }
                                                style={{
                                                    marginTop: 8,
                                                }}
                                            />
                                        </Col>

                                        <Col>
                                            <Progress
                                                type="circle"
                                                percent={
                                                    item.percentage
                                                }
                                                width={
                                                    60
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        )}
                </motion.div>
            </Modal>
        </div>
    );
};

export default ExecutionDashboard;