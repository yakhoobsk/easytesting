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

    Typography,
} from "antd";
import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { foldersGet, processGet } from "../redux/services/settings/branchServices";
import { EnvironmentFetch } from "../redux/services/settings/environmentService";
import { ComparisonCreate, ExecutionCreate, ExecutionDetailsFetch } from "../redux/services/settings/dashboardServices";
import AppPagination from "../components/AppPagination";
import { showSnackbar } from "../utils/snackbar";




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
const { Title, Text } = Typography;
const TestExecution = () => {
    const dispatch = useAppDispatch();
    const { folderNames, processes } = useAppSelector((state) => state.branch);
    const { environments } = useAppSelector((state) => state.environment);
    const { executionDetails } = useAppSelector((state) => state.dashboard);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
    const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 5 });
    const { auth } = useAppSelector((state) => state.auth);
    const [searchText, setSearchText] = useState("");
    const [filterField, setFilterField] = useState<any | "">("All");
    const [filterValue, setFilterValue] = useState("");
    useEffect(() => {
        dispatch(foldersGet({ payload: {} }));
        dispatch(EnvironmentFetch());
        dispatch(ExecutionDetailsFetch({ payload: { search_by_filter: filterField, search: searchText }, pagination }));
    }, [dispatch, searchText, filterField, pagination]);

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





    // --- envStats replaced by dynamic data ---

    const getExecutionStatus = (pass: number, fail: number) => {
        const total = pass + fail;
        if (total === 0) return "Pending";
        if (pass === total) return "Success";
        if (fail === total) return "Failed";
        return "Partially Success";
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



    const handlePagination = async (page: number, limit: number) => {
        setPagination({ page, limit });

        try {
            await dispatch(
                ExecutionDetailsFetch({
                    payload: {
                        search_by_filter: "All",
                        search: "",
                    },
                    pagination: { page, limit },
                })
            ).unwrap();
        } catch (err) {
            console.error("Pagination error:", err);
        } finally {
            console.warn("Pagination completed");
        }
    };


    const handleExecuted = async () => {
        // Required field validation
        if (
            !selectedFolder ||
            !selectedProcess ||
            !selectedEnvironment ||
            !description?.trim()
        ) {
            showSnackbar(
                "error",
                "Folder, Process, Environment and Payload are required."
            );
            return;
        }

        // JSON/XML validation
        try {
            const trimmedPayload = description.trim();

            if (trimmedPayload.startsWith("{") || trimmedPayload.startsWith("[")) {
                JSON.parse(trimmedPayload);
            } else if (trimmedPayload.startsWith("<")) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(
                    trimmedPayload,
                    "application/xml"
                );

                if (
                    xmlDoc.getElementsByTagName("parsererror").length > 0
                ) {
                    throw new Error("Invalid XML");
                }
            } else {
                throw new Error("Payload must be valid JSON or XML");
            }
        } catch (err) {
            showSnackbar(
                "error",
                "Please enter a valid JSON or XML payload."
            );
            return;
        }

        const selectedFolderName =
            flatFolders.find((f) => f.id === selectedFolder)?.name || "";

        const selectedProcessName =
            processOptions.find(
                (p: any) => p.componentId === selectedProcess
            )?.name || "";

        const selectedEnvironmentData =
            environments.find(
                (env: any) => env.id === selectedEnvironment
            );

        const payload = {
            folder: selectedFolderName,
            process: selectedProcessName,
            environment_name: selectedEnvironmentData?.name || "",
            environment_id: selectedEnvironmentData?.id || "",
            processId: selectedProcess || "",
            userMail: auth?.user_email || "",
            expectedPayload: description,
        };

        try {
            await dispatch(ExecutionCreate(payload)).unwrap();

            await dispatch(
                ComparisonCreate({
                    User_Email: auth?.user_email || "",
                })
            ).unwrap();

            dispatch(
                ExecutionDetailsFetch({
                    payload: {
                        search_by_filter: "All",
                        search: "",
                    },
                    pagination,
                })
            );

            showSnackbar(
                "success",
                "Execution completed successfully."
            );
        } catch (error: any) {
            showSnackbar(
                "error",
                error?.message || "Execution failed."
            );
        }
    };

    return (
        <div style={{ padding: 30, background: "#ffffff" }}>
            <div style={{ marginBottom: 16 }}>
                <Title level={4}>Test Execution</Title>
                <Text type="secondary">
                    Execute your test processes and monitor results in real-time
                </Text>
            </div>
            <Card
                title={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontWeight: 600
                        }}
                    >
                        Execution Setup
                    </div>
                }

                style={{
                    marginBottom: 16,

                    borderRadius: 18,

                    boxShadow:
                        "0 8px 30px rgba(0,0,0,.06)",

                    border: "none"
                }}
            >

                <Row gutter={[16, 16]}>

                    {/* Folder */}

                    <Col
                        xs={24}
                        sm={12}
                        lg={8}
                    >

                        <Text strong>
                            Folder
                        </Text>

                        <Select

                            placeholder=
                            "Choose Folder"

                            size="large"

                            style={{
                                width: "100%",
                                marginTop: 6
                            }}

                            value={
                                selectedFolder
                            }

                            onChange={
                                setSelectedFolder
                            }

                            showSearch

                            allowClear

                            optionFilterProp=
                            "label"

                        >

                            {
                                flatFolders.map(
                                    folder => (

                                        <Option

                                            key={folder.id}

                                            value={folder.id}

                                            label={folder.name}

                                        >

                                            {folder.name}

                                        </Option>

                                    ))
                            }

                        </Select>

                    </Col>



                    {/* Process */}

                    <Col
                        xs={24}
                        sm={12}
                        lg={8}
                    >

                        <Text strong>
                            Process
                        </Text>

                        <Select

                            placeholder=
                            "Choose Process"

                            size="large"

                            disabled={
                                !selectedFolder
                            }

                            style={{
                                width: "100%",
                                marginTop: 6
                            }}

                            value={
                                selectedProcess
                            }

                            onChange={
                                setSelectedProcess
                            }

                            showSearch

                            allowClear

                        >

                            {
                                processOptions.map(
                                    (proc: any) => (

                                        <Option

                                            key={
                                                proc.componentId
                                            }

                                            value={
                                                proc.componentId
                                            }

                                        >

                                            {proc.name}

                                        </Option>

                                    ))
                            }

                        </Select>

                    </Col>



                    {/* Environment */}

                    <Col
                        xs={24}
                        sm={12}
                        lg={8}
                    >

                        <Text strong>
                            Environment
                        </Text>

                        <Select

                            placeholder=
                            "Choose Environment"

                            size="large"

                            style={{
                                width: "100%",
                                marginTop: 6
                            }}

                            value={
                                selectedEnvironment
                            }

                            onChange={
                                setSelectedEnvironment
                            }

                            showSearch

                            allowClear

                        >

                            {
                                environments.map(
                                    (env: any) => (

                                        <Option

                                            key={env.id}

                                            value={env.id}

                                        >

                                            {env.name}

                                        </Option>

                                    ))
                            }

                        </Select>

                    </Col>



                    {/* Payload Editor */}

                    <Col
                        xs={24}
                        lg={18}
                    >

                        <div
                            style={{

                                padding: 14,

                                background:
                                    "#f8fafc",

                                borderRadius: 14,

                                border:
                                    "1px solid #e2e8f0"

                            }}
                        >

                            <div
                                style={{

                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    marginBottom: 10

                                }}
                            >

                                <Text strong>
                                    Payload Editor
                                </Text>

                                <Tag color="blue">
                                    JSON / XML
                                </Tag>

                            </div>

                            <Input.TextArea

                                value={
                                    description
                                }

                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }

                                placeholder={`Enter request payload in JSON or XML format

JSON Example:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}

XML Example:
<user>
  <firstName>John</firstName>
  <lastName>Doe</lastName>
  <email>john.doe@example.com</email>
</user>

Paste your payload here...`}

                                autoSize={{

                                    minRows: 8,

                                    maxRows: 14

                                }}

                                style={{

                                    fontFamily:
                                        "monospace",

                                    fontSize: 13,

                                    background:
                                        "#ffffff",

                                    color: "#e2e8f0",

                                    border:
                                        "none",

                                    borderRadius: 10,

                                    padding: 14

                                }}

                            />


                            <div
                                style={{

                                    marginTop: 10,

                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    flexWrap: "wrap",

                                    gap: 8

                                }}
                            >

                                <Text
                                    type="secondary"
                                >

                                    Supports:
                                    JSON • XML

                                </Text>


                                <Text
                                    type="secondary"
                                >

                                    Characters:
                                    {description?.length || 0}

                                </Text>

                            </div>

                        </div>

                    </Col>



                    {/* Run Button */}

                    <Col
                        xs={24}
                        lg={6}
                    >

                        <div
                            style={{

                                height: "100%",

                                display: "flex",

                                alignItems: "center"

                            }}
                        >

                            <Button
                                type="primary"
                                block
                                size="large"
                                onClick={handleExecuted}

                                style={{

                                    height: 52,

                                    fontWeight: 700,

                                    borderRadius: 12,

                                    boxShadow:
                                        "0 8px 20px rgba(22,119,255,.25)"

                                }}

                            >

                                Run Execution

                            </Button>

                        </div>

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



            <Card
                style={{ ...cardStyle, marginTop: 12 }}
                title="Execution Details"
            >
                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Select field"
                            value={filterField || "All"}
                            onChange={(val) => {
                                setFilterField(val as keyof TableRow);
                                setFilterValue("");
                            }}
                            style={{ width: "100%" }}
                            allowClear
                        >
                            <Select.Option value="All">All</Select.Option>
                            <Select.Option value="env">Environment</Select.Option>
                            <Select.Option value="total">Total</Select.Option>
                            <Select.Option value="success">Success</Select.Option>
                            <Select.Option value="fail">Failed</Select.Option>
                            <Select.Option value="partiallySuccess">
                                Partially Success
                            </Select.Option>
                            <Select.Option value="partiallyFailed">
                                Partially Failed
                            </Select.Option>
                            <Select.Option value="percent">Pass %</Select.Option>
                            <Select.Option value="status">Status</Select.Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                </Row>

                <Table
                    dataSource={filteredData}
                    bordered
                    size="middle"
                    pagination={false}
                    scroll={{ x: 1000 }}
                    columns={[
                        {
                            title: "Environment",
                            dataIndex: "env",
                            fixed: "left",
                            width: 180,
                            ellipsis: true,
                        },
                        {
                            title: "Total",
                            dataIndex: "total",
                            width: 100,
                        },
                        {
                            title: "Success",
                            dataIndex: "success",
                            width: 100,
                        },
                        {
                            title: "Partially Success",
                            dataIndex: "partialSuccess",
                            width: 150,
                            responsive: ["md"],
                        },
                        {
                            title: "Failed",
                            dataIndex: "fail",
                            width: 100,
                        },
                        {
                            title: "Partially Failed",
                            dataIndex: "partialFailed",
                            width: 150,
                            responsive: ["md"],
                        },
                        {
                            title: "Pass %",
                            dataIndex: "percent",
                            width: 100,
                            render: (p) => `${p}%`,
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            width: 150,
                            render: (s: string) => {
                                let color = "orange";
                                const status = s?.toLowerCase() || "pending";

                                if (status.includes("success")) color = "green";
                                else if (status.includes("failed")) color = "red";
                                else if (status.includes("pending")) color = "yellow";

                                return <Tag color={color}>{s || "Pending"}</Tag>;
                            },
                        },
                    ]}
                />
                <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>

                    <AppPagination
                        totalRecords={executionDetails?.totalResults || 0}
                        onChange={handlePagination}
                    />
                </div>
            </Card>
        </div>
    );
};

export default TestExecution;

