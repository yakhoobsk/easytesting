import { Card, Table, Tag, Button, Space, Modal, Select, Input } from "antd";
import { useMemo, useState } from "react";

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
        <div style={{ padding: 16, background: "#f5f7fb" }}>

            {/* 🔷 Header */}
            <Card
                title="Payload Store"
                style={{ marginBottom: 12 }}
            >
                <p style={{ color: "#64748b" }}>
                    View all execution payloads and details
                </p>
            </Card>

      {/* 🔷 Table */}
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Select field"
            style={{ width: 180 }}
            value={filterField || undefined}
            onChange={(val: any) => {
              setFilterField(val);
              setFilterValue("");
            }}
            allowClear
            options={[
              { label: "Execution ID", value: "executionId" },
              { label: "Pipeline", value: "pipeline" },
              { label: "Environment", value: "env" },
              { label: "Module", value: "module" },
              { label: "Status", value: "status" },
            ]}
          ></Select>

          <Input
            placeholder="Search value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: 200 }}
          />
        </Space>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
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