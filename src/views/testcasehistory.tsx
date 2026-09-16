import { useState } from "react";
import {
    Row,
    Col,
    Card,
    Table,
    Progress,
    Button,
    Modal,
    Typography,
    Tooltip,
    message,
} from "antd";
import {
    BarChartOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CopyOutlined,
    EyeOutlined,
    WarningOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ExecutionDashboard = () => {
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [open, setOpen] = useState(false);

    // Payload Modal State
    const [payloadModal, setPayloadModal] = useState<{
        open: boolean;
        title: string;
        content: any;
    }>({
        open: false,
        title: "",
        content: null,
    });

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
                { name: "Transaction Validation", percentage: 100 },
                { name: "Status Validation", percentage: 100 },
                { name: "Currency Validation", percentage: 95 },
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
                { name: "Transaction Validation", percentage: 100 },
                { name: "Status Validation", percentage: 45 },
                { name: "Currency Validation", percentage: 100 },
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
                { name: "Email Validation", percentage: 30 },
                { name: "Last Name Validation", percentage: 0 },
                { name: "User Active Validation", percentage: 50 },
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
                { name: "Department Validation", percentage: 100 },
                { name: "Designation Validation", percentage: 20 },
                { name: "Salary Validation", percentage: 40 },
            ],
        },
    ];

    const openModal = (record: any) => {
        setSelectedRecord(record);
        setOpen(true);
    };

    const openPayloadModal = (title: string, payload: any) => {
        setPayloadModal({
            open: true,
            title,
            content: payload,
        });
    };

    const handleCopyPayload = () => {
        if (payloadModal.content) {
            navigator.clipboard.writeText(JSON.stringify(payloadModal.content, null, 2));
            message.success("Payload copied to clipboard!");
        }
    };

    const formatPayloadPreview = (payload: any) => {
        if (!payload) return "";
        const str = JSON.stringify(payload, null, 2);
        const lines = str.split("\n");
        if (lines.length <= 4) {
            return str;
        }
        return lines.slice(0, 4).join("\n");
    };

    const getStatusTag = (status: string) => {
        const styles: any = {
            Success: { bg: "#ecfdf5", color: "#047857" },
            "Partial Success": { bg: "#fff7ed", color: "#b45309" },
            Failed: { bg: "#fee2e2", color: "#dc2626" },
            "Partially Failed": { bg: "#f3e8ff", color: "#7c3aed" },
        };

        const style = styles[status] || {
            bg: "#f3f4f6",
            color: "#374151",
        };

        return (
            <span
                style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: style.bg,
                    color: style.color,
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    maxWidth: 200,
                }}
            >
                {status}
            </span>
        );
    };

    const columns = [
        {
            title: "Execution ID",
            dataIndex: "executionId",
        },
        {
            title: "Environment",
            dataIndex: "environment",
            render: (env: string) => {
                const bg: any = {
                    UAT: "#e0f2fe",
                    PROD: "#fef3c7",
                    QA: "#e0e7ff",
                    DEV: "#ede9fe",
                };
                const color: any = {
                    UAT: "#0284c7",
                    PROD: "#b45309",
                    QA: "#4338ca",
                    DEV: "#6d28d9",
                };

                return (
                    <span
                        style={{
                            padding: "2px 10px",
                            borderRadius: 12,
                            fontSize: 11,
                            background: bg[env],
                            color: color[env],
                            fontWeight: 600,
                        }}
                    >
                        {env}
                    </span>
                );
            },
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
            render: (payload: any) => (
                <Tooltip title="Click to view full payload">
                    <pre
                        onClick={() => openPayloadModal("Expected Payload", payload)}
                        style={{
                            background: "#f8fafc",
                            padding: 12,
                            borderRadius: 10,
                            fontSize: 12,
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#2563eb";
                            e.currentTarget.style.background = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.background = "#f8fafc";
                        }}
                    >
                        {formatPayloadPreview(payload)}
                    </pre>
                </Tooltip>
            ),
        },
        {
            title: "Actual Payload",
            dataIndex: "actualPayload",
            render: (payload: any) => (
                <Tooltip title="Click to view full payload">
                    <pre
                        onClick={() => openPayloadModal("Actual Payload", payload)}
                        style={{
                            background: "#fff1f2",
                            padding: 12,
                            borderRadius: 10,
                            fontSize: 12,
                            border: "1px solid #fecaca",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#ef4444";
                            e.currentTarget.style.background = "#ffe4e6";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#fecaca";
                            e.currentTarget.style.background = "#fff1f2";
                        }}
                    >
                        {formatPayloadPreview(payload)}
                    </pre>
                </Tooltip>
            ),
        },
        {
            title: "Result %",
            dataIndex: "resultPercentage",
            render: (value: number) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 160 }}>
                    <Progress
                        percent={value}
                        strokeWidth={12}
                        showInfo={false}
                        style={{ width: 140 }}
                        strokeColor={
                            value >= 90
                                ? "#22c55e"
                                : value >= 70
                                    ? "#f59e0b"
                                    : "#ef4444"
                        }
                    />
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) => getStatusTag(status),
        },
        {
            title: "Action",
            render: (_: any, record: any) => (
                <Button
                    icon={<EyeOutlined />}
                    type="primary"
                    style={{ borderRadius: 8, background: "#2563eb" }}
                    onClick={() => openModal(record)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: "#f9fafb" }}>
            {/* SUMMARY CARDS */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>

                {/* Total Executions */}
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            borderRadius: 16,
                            background: "#eef2ff",
                            border: "1px solid #e0e7ff",
                        }}
                    >
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div
                                style={{
                                    background: "#6366f1",
                                    color: "#fff",
                                    borderRadius: 10,
                                    padding: 8,
                                }}
                            >
                                <BarChartOutlined />
                            </div>

                            <div>
                                <Text style={{ color: "#6366f1", fontSize: 12 }}>
                                    Total executions
                                </Text>
                                <Title level={3} style={{ margin: 0, color: "#3730a3" }}>
                                    245
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Success */}
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            borderRadius: 16,
                            background: "#ecfdf5",
                            border: "1px solid #bbf7d0",
                        }}
                    >
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div
                                style={{
                                    background: "#22c55e",
                                    color: "#fff",
                                    borderRadius: 10,
                                    padding: 8,
                                }}
                            >
                                <CheckCircleOutlined />
                            </div>

                            <div>
                                <Text style={{ color: "#16a34a", fontSize: 12 }}>
                                    Success rate
                                </Text>
                                <Title level={3} style={{ margin: 0, color: "#166534" }}>
                                    92%
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Partial */}
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            borderRadius: 16,
                            background: "#fff7ed",
                            border: "1px solid #fed7aa",
                        }}
                    >
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div
                                style={{
                                    background: "#f59e0b",
                                    color: "#fff",
                                    borderRadius: 10,
                                    padding: 8,
                                }}
                            >
                                <WarningOutlined />
                            </div>

                            <div>
                                <Text style={{ color: "#d97706", fontSize: 12 }}>
                                    Partial success
                                </Text>
                                <Title level={3} style={{ margin: 0, color: "#92400e" }}>
                                    5%
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Failed */}
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            borderRadius: 16,
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                        }}
                    >
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div
                                style={{
                                    background: "#ef4444",
                                    color: "#fff",
                                    borderRadius: 10,
                                    padding: 8,
                                }}
                            >
                                <CloseCircleOutlined />
                            </div>

                            <div>
                                <Text style={{ color: "#dc2626", fontSize: 12 }}>
                                    Failed
                                </Text>
                                <Title level={3} style={{ margin: 0, color: "#7f1d1d" }}>
                                    3%
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

            </Row>

            {/* TABLE */}
            <Card style={{ borderRadius: 16 }}>
                <Title level={4}>Test Execution Results</Title>

                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 5 }}
                    bordered
                    style={{ borderRadius: 12, overflow: "hidden" }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* ✅ TEST CASE ANALYSIS MODAL (UNCHANGED UI) */}
            <Modal
                open={open}
                footer={null}
                width={750}
                onCancel={() => setOpen(false)}
                title="Test Case Analysis"
            >
                {selectedRecord?.testCases?.map((item: any, index: number) => {
                    const isFull = item.percentage === 100;

                    return (
                        <Card
                            key={index}
                            size="small"
                            style={{
                                marginBottom: 16,
                                borderRadius: 14,
                                background: "#f8fafc",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <Row justify="space-between" align="middle">

                                {/* LEFT SIDE */}
                                <Col span={16}>
                                    <Text strong style={{ fontSize: 13 }}>
                                        {item.name}
                                    </Text>

                                    <div style={{ marginTop: 8 }}>
                                        <Progress
                                            percent={item.percentage}
                                            showInfo={false}
                                            strokeWidth={10}
                                            strokeColor={
                                                item.percentage === 100
                                                    ? "#22c55e"
                                                    : "#3b82f6"
                                            }
                                            style={{ width: 220 }}
                                        />
                                    </div>
                                </Col>

                                {/* RIGHT SIDE */}
                                <Col>
                                    {isFull ? (
                                        <div
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: "50%",
                                                border: "3px solid #22c55e",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#22c55e",
                                                fontSize: 18,
                                                fontWeight: 700,
                                            }}
                                        >
                                            ✓
                                        </div>
                                    ) : (
                                        <Progress
                                            type="circle"
                                            percent={item.percentage}
                                            width={56}
                                            strokeColor="#3b82f6"
                                        />
                                    )}
                                </Col>

                            </Row>
                        </Card>
                    );
                })}
            </Modal>

            {/* ✅ PAYLOAD VIEWER MODAL */}
            <Modal
                open={payloadModal.open}
                title={payloadModal.title}
                footer={[
                    <Button
                        key="copy"
                        icon={<CopyOutlined />}
                        onClick={handleCopyPayload}
                        style={{ borderRadius: 6 }}
                    >
                        Copy
                    </Button>,
                    <Button
                        key="close"
                        type="primary"
                        style={{ borderRadius: 6 }}
                        onClick={() => setPayloadModal({ ...payloadModal, open: false })}
                    >
                        Close
                    </Button>,
                ]}
                onCancel={() => setPayloadModal({ ...payloadModal, open: false })}
                width={650}
                centered
            >
                <pre
                    style={{
                        background: payloadModal.title.includes("Actual") ? "#fff1f2" : "#f8fafc",
                        padding: 16,
                        borderRadius: 10,
                        fontSize: 12,
                        border: `1px solid ${
                            payloadModal.title.includes("Actual") ? "#fecaca" : "#e5e7eb"
                        }`,
                        maxHeight: "500px",
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                    }}
                >
                    {JSON.stringify(payloadModal.content, null, 2)}
                </pre>
            </Modal>
        </div>
    );
};

export default ExecutionDashboard;