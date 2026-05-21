import {
    Card,
    Row,
    Col,
    Select,
    Button,
    Table,
    Tag,
    Progress,
    Input,
    Space,
} from "antd";
import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { foldersGet, processGet } from "../redux/services/settings/branchServices";
import { EnvironmentFetch } from "../redux/services/settings/environmentService";
import { ExecutionDetailsFetch } from "../redux/services/settings/dashboardServices";




const { Option } = Select;

const flattenFolders = (folders: any[]): { id: string; name: string }[] => {
    if (!Array.isArray(folders)) return [];
    let list: { id: string; name: string }[] = [];
    folders.forEach((folder) => {
        list.push({ id: folder.id, name: folder.name });
        if (folder.subFolders) {
            list.push(...flattenFolders(folder.subFolders));
        }
    });
    return list;
};


type TableRow = {
    key: number;
    env: string;
    pass: number;
    fail: number;
    total: number;
    percent: number;
    status: string;
};

const TestExecution = () => {
    const dispatch = useAppDispatch();
    const { folderNames, processes } = useAppSelector((state) => state.branch);
    const { environments } = useAppSelector((state) => state.environment);
    const { executionDetails } = useAppSelector((state) => state.dashboard);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
    const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
    const [description, setDescription] = useState("");

    useEffect(() => {
        dispatch(foldersGet({ payload: {} }));
        dispatch(EnvironmentFetch());
        dispatch(ExecutionDetailsFetch({ payload: { search_by_filter: "All", search: "" } }));
    }, [dispatch]);

    useEffect(() => {
        if (selectedFolder) {
            setSelectedProcess(null);
            dispatch(processGet({ payload: { "Folder id": selectedFolder } }));
        } else {
            setSelectedProcess(null);
        }
    }, [selectedFolder, dispatch]);


    const flatFolders = useMemo(() => {
        const raw = Array.isArray(folderNames) ? folderNames[0] : folderNames;
        const tree = raw?.folderTree || [];
        return flattenFolders(tree);
    }, [folderNames]);

    const processOptions = useMemo(() => {
        return Array.isArray(processes) ? processes : [];
    }, [processes]);



    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filterField, setFilterField] = useState<keyof TableRow | "">("");
    const [filterValue, setFilterValue] = useState("");


    // --- envStats replaced by dynamic data ---

    const getExecutionStatus = (pass: number, fail: number) => {
        const total = pass + fail;
        if (total === 0) return "Pending";
        if (pass === total) return "Success";
        if (fail === total) return "Failed";
        return "Partially Success";
    };

    const handleRun = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    const cardStyle = {
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    };

    // --- pipeline replaced by dynamic data ---

    const tableData: TableRow[] = (executionDetails?.Results || executionDetails?.results || []).map((e: any, i: number) => {
        const pass = Number(e.passed) || 0;
        const fail = Number(e.failed) || 0;
        const total = Number(e.total) || (pass + fail);
        const percent = e.match_percentage ? parseInt(e.match_percentage) : (total > 0 ? Math.round((pass / total) * 100) : 0);
        const status = e.testing_status || getExecutionStatus(pass, fail);

        return {
            key: i,
            env: e.environment_name || e.env || "-",
            success: pass,
            fail: fail,
            partialSuccess: Number(e.partially_success) || 0,
            partialFailed: Number(e.partially_failed) || 0,
            total: total,
            percent: percent,
            status: status,
        };
    });

    const totalPass = tableData.reduce((a, b) => a + b.pass, 0);
    const totalFail = tableData.reduce((a, b) => a + b.fail, 0);
    const overallStatus = getExecutionStatus(totalPass, totalFail);

    const filteredData = useMemo(() => {
        let temp = tableData;

        if (searchText) {
            const value = searchText.toLowerCase();
            temp = temp.filter((item) =>
                Object.values(item).some((val) =>
                    val?.toString().toLowerCase().includes(value)
                )
            );
        }

        if (filterField && filterValue) {
            const value = filterValue.toLowerCase();
            temp = temp.filter((item) => {
                const fieldValue = item[filterField as keyof TableRow];
                return fieldValue
                    ? fieldValue.toString().toLowerCase().includes(value)
                    : false;
            });
        }

        return temp;
    }, [searchText, filterField, filterValue, tableData]);

    return (
        <div style={{ padding: 16, background: "#f5f7fb" }}>
            <Card title="Execution Setup" style={{ marginBottom: 12 }}>
                <Row gutter={[12, 12]}>
                    <Col span={8}>
                        <Select
                            placeholder="Select Folder"
                            style={{ width: "100%" }}
                            value={selectedFolder}
                            onChange={(val) => setSelectedFolder(val)}
                            showSearch
                            optionFilterProp="label"
                            allowClear
                        >
                            {flatFolders.map((folder) => (
                                <Option key={folder.id} value={folder.id} label={folder.name}>
                                    {folder.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>


                    <Col span={8}>
                        <Select
                            placeholder="Select Process"
                            style={{ width: "100%" }}
                            value={selectedProcess}
                            onChange={(val) => setSelectedProcess(val)}
                            disabled={!selectedFolder}
                            showSearch
                            optionFilterProp="label"
                            allowClear
                        >
                            {processOptions.map((proc: any) => (
                                <Option key={proc.componentId} value={proc.componentId} label={proc.name}>
                                    {proc.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>


                    <Col span={8}>
                        <Select
                            placeholder="Select Environment"
                            style={{ width: "100%" }}
                            value={selectedEnvironment}
                            onChange={(val) => setSelectedEnvironment(val)}
                            showSearch
                            optionFilterProp="label"
                            allowClear
                        >
                            {environments.map((env: any) => (
                                <Option key={env.id} value={env.id} label={env.name}>
                                    {env.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>


                    <Col span={16}>
                        <Input
                            placeholder="Description (Expected Payload)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Col>


                    <Col span={8}>
                        <Button
                            type="primary"
                            block
                            loading={loading}
                            onClick={handleRun}
                        >
                            Run Execution
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Execution Progress</span>
                        <Tag
                            color={
                                overallStatus === "Success"
                                    ? "green"
                                    : overallStatus === "Failed"
                                        ? "red"
                                        : "orange"
                            }
                        >
                            {overallStatus}
                        </Tag>
                    </div>
                }
                style={{ marginBottom: 12 }}
            >
                <Progress percent={70} status="active" />
            </Card>

            {/* <Card
                style={{ ...cardStyle, marginTop: 12, marginBottom: 12 }}
                title="Pipeline Status"
                bodyStyle={{ padding: 20 }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {tableData.map((p, i) => {
                        const status = p.status ? p.status.toLowerCase() : "pending";
                        const isSuccess = status.includes("success");
                        const isFailed = status.includes("failed");

                        const bg = isSuccess ? "#ecfdf5" : isFailed ? "#fef2f2" : "#fff7ed";
                        const color = isSuccess ? "#16a34a" : isFailed ? "#ef4444" : "#ea580c";

                        return (
                            <div key={i} style={{ display: "flex", alignItems: "center" }}>
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "14px 16px",
                                        borderRadius: 12,
                                        background: bg,
                                        minWidth: 150,
                                    }}
                                >
                                    <div style={{ fontSize: 14, fontWeight: 600, color: color }}>
                                        {p.env}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 11,
                                            marginTop: 4,
                                            color: "#94a3b8",
                                        }}
                                    >
                                        {(p.status || "PENDING").toUpperCase()}
                                    </div>
                                </div>

                                {i !== tableData.length - 1 && (
                                    <span
                                        style={{
                                            margin: "0 12px",
                                            fontSize: 18,
                                            color: "#94a3b8",
                                        }}
                                    >
                                        →
                                    </span>
                                )}
                            </div>
                        );
                    })}

                </div>
            </Card> */}

            <Card style={{ ...cardStyle, marginTop: 12 }} title="Execution Details">
                <Space style={{ marginBottom: 16 }} wrap>
                    <Select
                        placeholder="Select field"
                        value={filterField || undefined}
                        onChange={(val) => {
                            setFilterField(val as keyof TableRow);
                            setFilterValue("");
                        }}
                        style={{ width: 180 }}
                        allowClear
                    >
                        <Select.Option value="env">Environment</Select.Option>
                        <Select.Option value="total">Total</Select.Option>
                        <Select.Option value="success">Success</Select.Option>
                        <Select.Option value="fail">Failed</Select.Option>
                        <Select.Option value="partiallySuccess">Partially Success</Select.Option>
                        <Select.Option value="partiallyFailed">Partially Failed</Select.Option>
                        <Select.Option value="percent">Pass %</Select.Option>
                        <Select.Option value="status">Status</Select.Option>
                    </Select>

                    <Input
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{ width: 200 }}
                    />
                </Space>

                <Table
                    dataSource={filteredData}
                    pagination={false}
                    columns={[
                        { title: "Environment", dataIndex: "env" },
                        { title: "Total", dataIndex: "total" },
                        { title: "Success", dataIndex: "success" },
                        { title: "Partially Success", dataIndex: "partialSuccess" },
                        { title: "Failed", dataIndex: "fail" },
                        { title: "Partially Failed", dataIndex: "partialFailed" },
                        {
                            title: "Pass %",
                            dataIndex: "percent",
                            render: (p) => `${p}%`,
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            render: (s: string) => {
                                let color = "orange";
                                const status = s ? s.replace(/_/g, ' ').toLowerCase() : "pending";

                                if (status.includes("success")) color = "green";
                                else if (status.includes("failed")) color = "red";
                                else if (status.includes("pending")) color = "default";

                                return (
                                    <Tag color={color}>
                                        {s ? s.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Pending"}
                                    </Tag>
                                );
                            },
                        },
                    ]}
                />
            </Card>
        </div>
    );
};

export default TestExecution;