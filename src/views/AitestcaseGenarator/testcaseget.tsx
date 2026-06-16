import React, { useState } from "react";
import {
    Table,
    Input,
    Space,
    Button,
    Card,
    Typography,
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

interface TestCase {
    id: number;
    testCase: string;
    description: string;
    expectedResult: string;
    steps: string;
}

const initialData: TestCase[] = [
    {
        id: 1,
        testCase: "Login Validation",
        description: "Verify user login functionality",
        expectedResult: "User should login successfully",
        steps: "Enter username and password",
    },
    {
        id: 2,
        testCase: "Forgot Password",
        description: "Verify password reset process",
        expectedResult: "Reset link should be sent",
        steps: "Click forgot password and submit email",
    },
];

const TestCaseTable: React.FC = () => {
    const [searchText, setSearchText] = useState("");

    const filteredData = initialData.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<TestCase> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "Test Cases",
            dataIndex: "testCase",
            key: "testCase",
            ellipsis: true,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Expected Results",
            dataIndex: "expectedResult",
            key: "expectedResult",
            ellipsis: true,
        },
        {
            title: "Steps",
            dataIndex: "steps",
            key: "steps",
            ellipsis: true,
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 160,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        type="link"
                    />
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        type="link"
                    />
                </Space>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card
                style={{
                    margin: "20px",
                    borderRadius: "12px",
                }}
            >
                <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                >
                    <Title level={3}>Test Cases Management</Title>

                    <Input
                        placeholder="Search test cases..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                        }}
                        scroll={{ x: 1200 }}
                        bordered
                        components={{
                            body: {
                                row: (props: any) => (
                                    <motion.tr
                                        {...props}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ),
                            },
                        }}
                    />
                </Space>
            </Card>
        </motion.div>
    );
};

export default TestCaseTable;