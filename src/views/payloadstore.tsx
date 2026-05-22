import { Card, Table, Tag, Button, Space, Modal, Select, Input, Typography, Row, Col } from "antd";
import { useMemo, useState } from "react";



const { Title, Text } = Typography;
const PayloadStore = () => {
    const [open, setOpen] = useState(false);
    const [selectedPayload, setSelectedPayload] = useState<any>(null);
    const [filterField, setFilterField] = useState<string>("");
    const [filterValue, setFilterValue] = useState("");

    const data = [
        {
            key: 1,
            executionId: "EXE001",
            pipeline: "Pipeline A",
            env: "DEV",
            module: "API",
            status: "Success",
            time: "10:30 AM",
            payload: {
                pipeline: "Pipeline A",
                env: "DEV",
                module: "API",
            },
        },
        {
            key: 2,
            executionId: "EXE002",
            pipeline: "Pipeline B",
            env: "TEST",
            module: "UI",
            status: "Failed",
            time: "11:00 AM",
            payload: {
                pipeline: "Pipeline B",
                env: "TEST",
                module: "UI",
            },
        },
    ];
    const filteredData = useMemo(() => {
        if (!filterField || !filterValue) return data;

        return data.filter((item: any) =>
            item[filterField]
                ?.toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase())
        );
    }, [filterField, filterValue, data]);

    const columns = [
        {
            title: "Execution ID",
            dataIndex: "executionId",
        },
        {
            title: "Pipeline",
            dataIndex: "pipeline",
        },
        {
            title: "Environment",
            dataIndex: "env",
            render: (env: string) => (
                <Tag color="blue">{env}</Tag>
            ),
        },
        {
            title: "Module",
            dataIndex: "module",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s: string) => (
                <Tag
                    color={
                        s === "Success"
                            ? "green"
                            : s === "Failed"
                                ? "red"
                                : "orange"
                    }
                >
                    {s}
                </Tag>
            ),
        },
        {
            title: "Time",
            dataIndex: "time",
        },
        {
            title: "Action",
            render: (record: any) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() => {
                            setSelectedPayload(record.payload);
                            setOpen(true);
                        }}
                    >
                        View Payload
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 30, background: "#f5f7fb" }}>

            <div style={{ marginBottom: 16 }}>
                <Title level={4}>Payload Store</Title>
                <Text type="secondary">
                    View and manage all test execution payloads in one place.
                </Text>
            </div>


            {/* 🔷 Table */}
            <Card>
                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Select field"
                            value={filterField || undefined}
                            onChange={(val: any) => {
                                setFilterField(val);
                                setFilterValue("");
                            }}
                            allowClear
                            style={{ width: "100%" }}
                            options={[
                                { label: "Execution ID", value: "executionId" },
                                { label: "Pipeline", value: "pipeline" },
                                { label: "Environment", value: "env" },
                                { label: "Module", value: "module" },
                                { label: "Status", value: "status" }
                            ]}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Search value"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                        />
                    </Col>
                </Row>

                <Table
                    dataSource={filteredData}
                    columns={columns}
                    bordered
                    size="middle"
                    pagination={{
                        pageSize: 5,
                        responsive: true
                    }}
                    scroll={{ x: "max-content" }}
                />
            </Card>

            {/* 🔷 Payload Modal */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title="Payload Details"
            >
                <pre
                    style={{
                        background: "#f1f5f9",
                        padding: 12,
                        borderRadius: 6,
                    }}
                >
                    {JSON.stringify(selectedPayload, null, 2)}
                </pre>
            </Modal>
        </div>
    );
};

export default PayloadStore;