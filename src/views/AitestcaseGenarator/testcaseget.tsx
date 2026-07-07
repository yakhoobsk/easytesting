import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Table,
    Input,
    Space,
    Button,
    Card,
    Spin,
    Popconfirm,
    Tag,
    Popover
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    CloseOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TescasesGet, TestCasesUpdate, TestCasesDelete } from "../../redux/services/aitestcasesService";

interface TestCase {
    test_case_id: string;
    test_case_gen_id: string;
    description: string;
    expected_result: string;
    steps_to_execute: string;
    process_name: string;
    folder_name: string;
    environment_name: string;
    [key: string]: any;
}

const TestCaseTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { testCasesList, testCasesListLoading } = useAppSelector(
        (state) => state.Ai || {}
    );

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingRow, setEditingRow] = useState<TestCase | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "AITestCaseGenarator";

    const handleEditStart = (record: TestCase) => {
        setEditingKey(record.test_case_gen_id);
        setEditingRow({ ...record });
    };

    const handleEditCancel = () => {
        setEditingKey(null);
        setEditingRow(null);
    };

    const handleEditSave = async () => {
        if (!editingRow) return;

        const payload = [
            {
                Test_Case_Gen_Id: editingRow.test_case_gen_id || "",
                Environment_Id: editingRow.environment_id || editingRow.Environment_Id || editingRow.Enviornment_Id || "",
                Environment_Name: editingRow.environment_name || editingRow.Environment_Name || editingRow.Enviornment_Name || "",
                Folder_Id: editingRow.folder_id || editingRow.Folder_Id || "",
                Folder_Name: editingRow.folder_name || editingRow.Folder_Name || "",
                Process_Name: editingRow.process_name || editingRow.Process_Name || "",
                Component_Id: editingRow.component_id || editingRow.Component_Id || "",
                Description: editingRow.description || "",
                Is_Ai_Generated: (editingRow.is_ai_generated == 1 || editingRow.is_ai_generated === "1" || editingRow.is_ai_generated === true || editingRow.is_ai_generated === "true") ? "true" : "false",
                Test_Case_Id: editingRow.test_case_id || "",
                Expected_Result: editingRow.expected_result || "",
                Steps_To_Execute: editingRow.steps_to_execute || ""
            }
        ];

        try {
            await dispatch(TestCasesUpdate(payload)).unwrap();
            setEditingKey(null);
            setEditingRow(null);
            setIsRefreshing(true);
            await dispatch(TescasesGet({ page: currentPage, limit: pageSize }));
            setIsRefreshing(false);
        } catch (error) {
            setIsRefreshing(false);
            console.error("Update failed", error);
        }
    };

    const handleDelete = async (record: TestCase) => {
        try {
            await dispatch(
                TestCasesDelete({
                    test_case_gen_id: record.test_case_gen_id
                })
            ).unwrap();
            setIsRefreshing(true);
            await dispatch(TescasesGet({ page: currentPage, limit: pageSize }));
            setIsRefreshing(false);
        } catch (error) {
            setIsRefreshing(false);
            console.error("Delete failed", error);
        }
    };

    useEffect(() => {
        if (activeTab === "testcases") {
            dispatch(TescasesGet({ page: currentPage, limit: pageSize }));
        }
    }, [dispatch, activeTab, currentPage, pageSize]);

    const filteredData = useMemo(() => {
        const list = Array.isArray(testCasesList) ? testCasesList : [];
        if (!searchText) return list;
        return list.filter((item: TestCase) =>
            Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(searchText.toLowerCase())
        );
    }, [testCasesList, searchText]);

    const columns: ColumnsType<TestCase> = [
        {
            title: "Test case ID",
            dataIndex: "test_case_id",
            key: "test_case_id",
            width: 140,
            render: (text, record) => {
                const isEditing = editingKey === record.test_case_gen_id;
                return isEditing ? (
                    <Input
                        value={editingRow?.test_case_id}
                        onChange={(e) =>
                            setEditingRow((prev: any) => ({ ...prev, test_case_id: e.target.value }))
                        }
                    />
                ) : (
                    text
                );
            }
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 350,
            ellipsis: true,
            render: (text, record) => {
                const isEditing = editingKey === record.test_case_gen_id;
                return isEditing ? (
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Input
                            placeholder="Description"
                            value={editingRow?.description}
                            onChange={(e) =>
                                setEditingRow((prev: any) => ({ ...prev, description: e.target.value }))
                            }
                        />
                        <Input
                            placeholder="Expected Result"
                            value={editingRow?.expected_result}
                            onChange={(e) =>
                                setEditingRow((prev: any) => ({ ...prev, expected_result: e.target.value }))
                            }
                        />
                    </Space>
                ) : (
                    <div>
                        <div style={{ fontWeight: 600, color: '#262626' }}>{text}</div>
                        <div style={{ color: '#8c8c8c', fontSize: '13px', marginTop: '4px' }}>{record.expected_result}</div>
                    </div>
                );
            }
        },
        {
            title: "Category",
            key: "category",
            width: 120,
            render: (_, record) => {
                let categoryName = "common";
                if (record.test_case_id?.toLowerCase().includes("process")) categoryName = "process";
                return (
                    <Tag color={categoryName === "process" ? "green" : "blue"} style={{ borderRadius: '12px', padding: '2px 10px', fontSize: '13px' }}>
                        {categoryName}
                    </Tag>
                );
            }
        },
        {
            title: "Steps",
            dataIndex: "steps_to_execute",
            key: "steps_to_execute",
            width: 140,
            render: (text, record) => {
                const isEditing = editingKey === record.test_case_gen_id;
                return isEditing ? (
                    <Input
                        value={editingRow?.steps_to_execute}
                        onChange={(e) =>
                            setEditingRow((prev: any) => ({ ...prev, steps_to_execute: e.target.value }))
                        }
                    />
                ) : (
                    <Popover
                        content={
                            <div style={{ maxWidth: 300 }}>
                                <ol style={{ paddingLeft: 20, margin: 0 }}>
                                    {text ? text.split(',').map((step: string, idx: number) => (
                                        <li key={idx} style={{ marginBottom: 4 }}>{step.trim()}</li>
                                    )) : null}
                                </ol>
                            </div>
                        }
                        title="Steps"
                        trigger="click"
                    >
                        <Button size="small" icon={<UnorderedListOutlined />} style={{ borderRadius: '16px' }}>
                            {text ? text.split(',').length : 0} steps
                        </Button>
                    </Popover>
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 120,
            render: (_, record) => {
                const isEditing = editingKey === record.test_case_gen_id;
                return isEditing ? (
                    <Space>
                        <Button
                            icon={<SaveOutlined />}
                            onClick={() => handleEditSave()}
                            style={{ color: "#52c41a", borderColor: "#52c41a" }}
                            title="Save"
                        />
                        <Button
                            icon={<CloseOutlined />}
                            onClick={handleEditCancel}
                            title="Cancel"
                        />
                    </Space>
                ) : (
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEditStart(record)}
                            disabled={!!editingKey}
                        />
                        <Popconfirm
                            title="Delete this test case?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                disabled={!!editingKey}
                            />
                        </Popconfirm>
                    </Space>
                );
            }
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
                    {/* <Title level={3}>Test Cases Management</Title> */}

                    <Input
                        placeholder="Search test cases..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />

                    {testCasesListLoading && !isRefreshing ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            loading={isRefreshing}
                            rowSelection={{
                                type: "checkbox",
                            }}
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="test_case_gen_id"
                            onChange={(pagination) => {
                                setCurrentPage(pagination.current || 1);
                                setPageSize(pagination.pageSize || 5);
                            }}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
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
                    )}
                </Space>
            </Card>
        </motion.div>
    );
};

export default TestCaseTable;