import {
    Card,
    Input,
    Button,
    Table,
    Space,
    Select,
    Spin,
    Typography,
    App,
    Popconfirm
} from "antd";

import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    AiTescases,
    AiTescasesGet,
    ComponentDescriptionGet,
    AiTestCasesCreate,
    AiTestCasesUpdate,
    AiTestCasesDelete
} from "../redux/services/aitestcasesService";
import {
    foldersGet,
    processGet
} from "../redux/services/settings/branchServices";
import { EnvironmentFetch } from "../redux/services/settings/environmentService";

const { TextArea } = Input;
const { Option } = Select;

const flattenFolders = (folders: any) => {
    if (!Array.isArray(folders)) return [];
    let list: any = [];
    folders.forEach((folder: any) => {
        list.push({ id: folder.id, name: folder.name });
        if (folder.subFolders) {
            list.push(...flattenFolders(folder.subFolders));
        }
    });
    return list;
};

const AITestCases = () => {
    const staticApp = App.useApp();
    const messageApi = staticApp?.message;
    const dispatch = useAppDispatch();

    const { folderNames, processes, loading } =
        useAppSelector((state) => state.branch);

    const { componentDescription } =
        useAppSelector((state) => state.Ai || {});
    const { environments } = useAppSelector((state) => state.environment);

    const [selectedFolder, setSelectedFolder] = useState<any>(null);
    const [selectedProcess, setSelectedProcess] = useState<any>(null);
    const [selectedEnvironment, setSelectedEnvironment] = useState<any>(null);

    const [tableData, setTableData] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

    const [editingKey, setEditingKey] = useState<any>(null);
    const [editingRow, setEditingRow] = useState<any>(null);

    const [processName, setProcessName] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [prompt, setPrompt] = useState("");

    // ─── NEW: track whether existing test cases were fetched ─────────
    const [hasExistingTestCases, setHasExistingTestCases] = useState(false);
    const [existingCheckLoading, setExistingCheckLoading] = useState(false);

    useEffect(() => {
        dispatch(foldersGet({ payload: {} }));
        dispatch(EnvironmentFetch());
    }, [dispatch]);

    useEffect(() => {
        if (selectedFolder) {
            setSelectedProcess(null);
            dispatch(processGet({ payload: { "Folder id": selectedFolder } }));
        }
    }, [selectedFolder, dispatch]);

    // ─── NEW: fetch existing test cases when folder, process & environment are selected ───
    useEffect(() => {
        const fetchExisting = async () => {
            if (!selectedFolder || !selectedProcess || !selectedEnvironment) {
                setHasExistingTestCases(false);
                return;
            }

            setExistingCheckLoading(true);

            try {
                const res = await dispatch(
                    AiTescasesGet({
                        folder_id: selectedFolder,
                        environment_id: selectedEnvironment,
                        component_id: selectedProcess
                    })
                ).unwrap();

                const results = res?.[0]?.Results || res?.Results || [];
                if (Array.isArray(results) && results.length > 0) {
                    const formatted = results.map((item: any, index: number) => ({
                        key: item.id ?? index,
                        id: item.test_case_id,
                        description: item.description,
                        expectedResult: item.expected_result,
                        steps: item.steps_to_execute,
                        isManual: false,
                        test_case_gen_id: item.test_case_gen_id
                    }));

                    setTableData(formatted);
                    setProcessName(results[0]?.process_name || "Generated Test Cases");
                    setHasExistingTestCases(true);
                } else {
                    setHasExistingTestCases(false);
                }
            } catch (err) {
                console.error(err);
                setHasExistingTestCases(false);
            } finally {
                setExistingCheckLoading(false);
            }
        };

        fetchExisting();
    }, [selectedFolder, selectedProcess, selectedEnvironment, dispatch]);

    const flatFolders = useMemo(() => {
        const raw = Array.isArray(folderNames) ? folderNames[0] : folderNames;
        const tree = raw?.folderTree || [];
        return flattenFolders(tree);
    }, [folderNames]);

    const processOptions = useMemo(() => {
        return Array.isArray(processes) ? processes : [];
    }, [processes]);

    const handleProcessChange = (value: any) => {
        setSelectedProcess(value);
        if (value) {
            dispatch(ComponentDescriptionGet({ component_id: value }));
        }
    };

    const handleGenerate = async () => {
        if (!selectedProcess) return;

        setBtnLoading(true);

        try {
            const res = await dispatch(
                AiTescases({
                    process_id: selectedProcess,
                    prompt: prompt || "Generate test cases"
                })
            ).unwrap();

            const output = res?.data?.generated_output || {};
            const combined = [
                ...(output.processSpecificTestCases || []),
                ...(output.commonTestCases || [])
            ];

            const formatted = combined.map((item, index) => ({
                key: index,
                id: item.id,
                description: item.description,
                expectedResult: item.expectedResult,
                steps: (item.steps || []).join(", "),
                test_case_gen_id: item.test_case_gen_id,
                isManual: false
            }));

            setTableData(formatted);
            setProcessName(output.processName || "Generated Test Cases");
        } catch (err) {
            console.error(err);
        } finally {
            setBtnLoading(false);
        }
    };

    const handleAddTestCase = () => {
        const hasEmpty = tableData.some(
            (row: any) =>
                row.isManual &&
                (!row.id || !row.description || !row.expectedResult || !row.steps)
        );

        if (hasEmpty) {
            messageApi?.warning("Please fill existing manual test case first");
            return;
        }

        const newRow = {
            key: Date.now(),
            id: "",
            description: "",
            expectedResult: "",
            steps: "",
            test_case_gen_id: "",
            isManual: true
        };

        setTableData([...tableData, newRow]);
    };

    const handleChange = (value: any, key: any, field: string) => {
        const updated = tableData.map((row: any) =>
            row.key === key ? { ...row, [field]: value } : row
        );
        setTableData(updated);
    };

    const handleSave = async () => {
        if (!selectedEnvironment) {
            messageApi?.error("Select Environment");
            return;
        }

        const selectedEnv = environments.find(
            (env: any) =>
                (env.environment_id || env.id) === selectedEnvironment
        );

        const selectedFolderObj = flatFolders.find(
            (f: any) => f.id === selectedFolder
        );

        const selectedProcessObj = processOptions.find(
            (p: any) => p.componentId === selectedProcess
        );

        const selectedRows = selectedRowKeys.length > 0
            ? tableData.filter((row: any) =>
                selectedRowKeys.includes(row.key)
            )
            : tableData;

        if (!selectedRows.length) {
            messageApi?.warning("No test cases available to save");
            return;
        }

        const payload = selectedRows.map((row: any) => ({
            Environment_Id: selectedEnv?.environment_id || selectedEnv?.id || "",
            Environment_Name: selectedEnv?.name || "",
            Folder_Id: selectedFolderObj?.id || "",
            Folder_Name: selectedFolderObj?.name || "",
            Process_Name: selectedProcessObj?.name || "",
            Component_Id: selectedProcessObj?.componentId,
            Description: row.description,
            Is_Ai_Generated: !row.isManual,
            Test_Case_Id: row.id,
            Expected_Result: row.expectedResult,
            Steps_To_Execute: row.steps

        }));
        try {
            await dispatch(AiTestCasesCreate(payload)).unwrap();
            messageApi?.success("Saved successfully");
        } catch (err) {
            console.error(err);
            messageApi?.error("Failed to save test cases");
        }
    };

    // ─── Edit handlers ───────────────────────────────────────────────
    const handleEditStart = (record: any) => {
        setEditingKey(record.key);
        setEditingRow({ ...record });
    };

    const handleEditCancel = () => {
        setEditingKey(null);
        setEditingRow(null);
    };

    const handleEditSave = async (record: any) => {
        if (!editingRow.id || !editingRow.description || !editingRow.expectedResult || !editingRow.steps) {
            messageApi?.warning("Please fill all fields before saving");
            return;
        }

        try {
            await dispatch(
                AiTestCasesUpdate({
                    test_case_gen_id: editingRow.test_case_gen_id,
                    Test_Case_Id: editingRow.id,
                    Description: editingRow.description,
                    Expected_Result: editingRow.expectedResult,
                    Steps_To_Execute: editingRow.steps
                })
            ).unwrap();

            const updated = tableData.map((row: any) =>
                row.key === record.key ? { ...row, ...editingRow } : row
            );
            setTableData(updated);
            setEditingKey(null);
            setEditingRow(null);
            messageApi?.success("Test case updated successfully");
        } catch (err) {
            console.error(err);
            messageApi?.error("Failed to update test case");
        }
    };

    // ─── Delete handler ──────────────────────────────────────────────
    const handleDelete = async (record: any) => {
        try {
            await dispatch(
                AiTestCasesDelete({ test_case_gen_id: record.test_case_gen_id
 })
            ).unwrap();

            setTableData((prev: any) =>
                prev.filter((row: any) => row.test_case_gen_id !== record.test_case_gen_id)
            );
            setSelectedRowKeys((prev) =>
                prev.filter((k) => k !== record.test_case_gen_id)
            );
            messageApi?.success("Test case deleted successfully");
        } catch (err) {
            console.error(err);
            messageApi?.error("Failed to delete test case");
        }
    };

    const columns = [
        {
            title: "Test Case",
            dataIndex: "id",
            render: (text: any, record: any) => {
                const isEditing = editingKey === record.key;
                return isEditing ? (
                    <Input
                        value={editingRow?.id}
                        onChange={(e) =>
                            setEditingRow((prev: any) => ({ ...prev, id: e.target.value }))
                        }
                    />
                ) : record.isManual ? (
                    <Input
                        value={text}
                        onChange={(e) =>
                            handleChange(e.target.value, record.key, "id")
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
            render: (text: any, record: any) => {
                const isEditing = editingKey === record.key;
                return isEditing ? (
                    <Input
                        value={editingRow?.description}
                        onChange={(e) =>
                            setEditingRow((prev: any) => ({ ...prev, description: e.target.value }))
                        }
                    />
                ) : record.isManual ? (
                    <Input
                        value={text}
                        onChange={(e) =>
                            handleChange(e.target.value, record.key, "description")
                        }
                    />
                ) : (
                    text
                );
            }
        },
        {
            title: "Expected Result",
            dataIndex: "expectedResult",
            render: (text: any, record: any) => {
                const isEditing = editingKey === record.key;
                return isEditing ? (
                    <Input
                        value={editingRow?.expectedResult}
                        onChange={(e) =>
                            setEditingRow((prev: any) => ({ ...prev, expectedResult: e.target.value }))
                        }
                    />
                ) : record.isManual ? (
                    <Input
                        value={text}
                        onChange={(e) =>
                            handleChange(e.target.value, record.key, "expectedResult")
                        }
                    />
                ) : (
                    text
                );
            }
        },
        {
            title: "Steps",
            dataIndex: "steps",
            render: (text: any, record: any) => {
                const isEditing = editingKey === record.key;
                return isEditing ? (
                    <Input
                        value={editingRow?.steps}
                        onChange={(e) =>
                            setEditingRow((prev: any) => ({ ...prev, steps: e.target.value }))
                        }
                    />
                ) : record.isManual ? (
                    <Input
                        value={text}
                        onChange={(e) =>
                            handleChange(e.target.value, record.key, "steps")
                        }
                    />
                ) : (
                    text
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_: any, record: any) => {
                const isEditing = editingKey === record.key;

                return isEditing ? (
                    <Space>
                        <Button
                            type="link"
                            icon={<SaveOutlined />}
                            onClick={() => handleEditSave(record)}
                            style={{ color: "#52c41a", padding: 0 }}
                            title="Save"
                        />
                        <Button
                            type="link"
                            icon={<CloseOutlined />}
                            onClick={handleEditCancel}
                            style={{ color: "#8c8c8c", padding: 0 }}
                            title="Cancel"
                        />
                    </Space>
                ) : (
                    <Space>
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEditStart(record)}
                            disabled={!!editingKey}
                            style={{ padding: 0 }}
                            title="Edit"
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
                                type="link"
                                icon={<DeleteOutlined />}
                                danger
                                disabled={!!editingKey}
                                style={{ padding: 0 }}
                                title="Delete"
                            />
                        </Popconfirm>
                    </Space>
                );
            }
        }
    ];

    return (
        <div style={{ padding: 16, background: "#f5f7fb" }}>
            <Card title="AI Test Case Generator" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", gap: "2%", marginBottom: 12 }}>
                    <Select
                        placeholder="Select Folder"
                        style={{ width: "32%" }}
                        value={selectedFolder}
                        onChange={setSelectedFolder}
                        showSearch
                        optionFilterProp="children"
                        allowClear
                    >
                        {flatFolders.map((folder: any) => (
                            <Option key={folder.id} value={folder.id}>
                                {folder.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Select Process"
                        style={{ width: "32%" }}
                        value={selectedProcess}
                        onChange={handleProcessChange}
                        disabled={!selectedFolder}
                        showSearch
                        optionFilterProp="children"
                        allowClear
                    >
                        {processOptions.map((proc: any) => (
                            <Option key={proc.componentId} value={proc.componentId}>
                                {proc.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Select Environment"
                        style={{ width: "32%" }}
                        value={selectedEnvironment}
                        onChange={setSelectedEnvironment}
                        showSearch
                        optionFilterProp="children"
                        allowClear
                    >
                        {environments?.map((env: any) => (
                            <Option
                                key={env.environment_id || env.id}
                                value={env.environment_id || env.id}
                            >
                                {env.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                {componentDescription?.prompt && (
                    <div
                        style={{
                            marginBottom: 12,
                            background: "#fafafa",
                            padding: 12,
                            borderRadius: 6,
                            border: "1px solid #eee",
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                    >
                        <div style={{ maxWidth: "90%" }}>
                            <strong>Description:</strong>
                            <Typography.Text
                                copyable={{
                                    text: componentDescription.prompt,
                                    onCopy: () => {
                                        if (messageApi?.success) {
                                            messageApi.success("Copied!");
                                        }
                                    }
                                }}
                                style={{ display: "block", margin: 0 }}
                            >
                                {componentDescription.prompt}
                            </Typography.Text>
                        </div>
                    </div>
                )}

                <TextArea
                    rows={4}
                    placeholder="Enter prompt (optional)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                <Space style={{ marginTop: 10 }}>
                    <Button
                        type="primary"
                        loading={btnLoading || existingCheckLoading}
                        onClick={handleGenerate}
                        disabled={!selectedProcess || hasExistingTestCases}
                    >
                        Generate Test Cases
                    </Button>
                </Space>
            </Card>

            <Card
                title={processName || "Generated Test Cases"}
                extra={
                    tableData.length > 0 && (
                        <Button onClick={handleAddTestCase}>
                            Add Test Case
                        </Button>
                    )
                }
            >
                {loading || existingCheckLoading ? (
                    <Spin />
                ) : (
                    <>
                        <Table
                            rowSelection={{
                                selectedRowKeys,
                                onChange: setSelectedRowKeys
                            }}
                            dataSource={tableData}
                            columns={columns}
                            pagination={false}
                        />

                        {tableData.length > 0 && (
                            <div style={{ marginTop: 16, textAlign: "right" }}>
                                <Button type="primary" onClick={handleSave}>
                                    Save
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default AITestCases;