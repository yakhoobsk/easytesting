import {
    Card,
    Input,
    Button,
    Table,
    Tag,
    Space,
    Checkbox,
} from "antd";
import { useState } from "react";

const { TextArea } = Input;

const AITestCases = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

    const handleGenerate = () => {
        setLoading(true);

        // 🔥 Mock AI response
        setTimeout(() => {
            setData([
                { key: 1, name: "Login with valid credentials", type: "Positive" },
                { key: 2, name: "Login with invalid password", type: "Negative" },
                { key: 3, name: "Empty username validation", type: "Edge" },
            ]);
            setLoading(false);
        }, 1000);
    };

    const columns = [
        {
            title: "",
            render: (record: any) => (
                <Checkbox
                    checked={selectedKeys.includes(record.key)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedKeys([...selectedKeys, record.key]);
                        } else {
                            setSelectedKeys(selectedKeys.filter(k => k !== record.key));
                        }
                    }}
                />
            ),
        },
        {
            title: "Test Case",
            dataIndex: "name",
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (t: string) => (
                <Tag
                    color={
                        t === "Positive"
                            ? "green"
                            : t === "Negative"
                                ? "red"
                                : "orange"
                    }
                >
                    {t}
                </Tag>
            ),
        },
        {
            title: "Action",
            render: () => (
                <Button size="small">Edit</Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 16, background: "#f5f7fb" }}>

            {/* 🔷 INPUT SECTION */}
            <Card title="AI Test Case Generator" style={{ marginBottom: 12 }}>
                <TextArea
                    rows={4}
                    placeholder="Describe API / Feature (e.g., Login API with validations...)"
                />

                <Space style={{ marginTop: 10 }}>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleGenerate}
                    >
                        Generate Test Cases
                    </Button>

                    <Button>Clear</Button>
                </Space>
            </Card>

            {/* 🔷 GENERATED TEST CASES */}
            <Card title="Generated Test Cases">
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                />
            </Card>

            {/* 🔷 ACTION BAR */}
            {data.length > 0 && (
                <Card style={{ marginTop: 12 }}>
                    <Space>
                        <Button type="primary" disabled={!selectedKeys.length}>
                            Save Selected
                        </Button>

                        <Button disabled={!selectedKeys.length}>
                            Run Selected
                        </Button>
                    </Space>
                </Card>
            )}
        </div>
    );
};

export default AITestCases;