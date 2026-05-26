import { Card, Table, Tag, Button, Space, Modal, Select, Input, Typography, Row, Col } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ExecutionDetailsFetch } from "../redux/services/settings/dashboardServices";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import AppPagination from "../components/AppPagination";



const { Title, Text } = Typography;
const PayloadStore = () => {
    const [open, setOpen] = useState(false);
    const [selectedPayload, setSelectedPayload] = useState<any>(null);
    const [filterField, setFilterField] = useState<string>("");
    const [filterValue, setFilterValue] = useState("");
    const dispatch = useAppDispatch();
    const { executionDetails } = useAppSelector((state) => state.dashboard);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });

    useEffect(() => {
        dispatch(ExecutionDetailsFetch({ payload: { search_by_filter: "All", search: "" }, pagination }));
    }, [dispatch]);


    const data =
        (
            executionDetails?.Results

            ||

            executionDetails?.results

            ||

            []

        )

            .map(

                (item: any, index: number) => ({

                    key: item.id || index,

                    executionId: item.execution_id,

                    pipeline: item.process_name,

                    env: item.environment_name,

                    module: item.step_name === "NA" ? "-" : item.step_name,

                    status: item.status ? item.status.replace("_", " ") : "Pending",

                    time: item.created_date,

                    payload: {
                        actualPayload: JSON.parse(item.actual_payload || "{}"),

                        expectedPayload: JSON.parse(item.expected_payload || "{}"),

                        matchPercentage: item.match_percentage,

                        resultId: item.result_id

                    }
                })

            );
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
            title: "process Name",
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
            title: "Status",
            dataIndex: "status",

            render: (s: string) => {

                const status =
                    s?.replaceAll(
                        "_",
                        " "
                    )
                        .toUpperCase();

                let color = "default";

                if (
                    status === "SUCCESS"
                )
                    color = "green";

                else if (
                    status ===
                    "PARTIAL SUCCESS"
                )
                    color = "gold";

                else if (
                    status ===
                    "PARTIAL FAILED"
                )
                    color = "orange";

                else if (
                    status ===
                    "FAILED"
                )
                    color = "red";

                return (

                    <Tag color={color}>

                        {status}

                    </Tag>

                );

            }

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
                    pagination={false}
                    scroll={{ x: "max-content" }}
                />
                <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>

                    <AppPagination
                        totalRecords={executionDetails?.totalResults || 0}
                        onChange={handlePagination}
                    />
                </div>
            </Card>

            {/* 🔷 Payload Modal */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                closable={false}
                width={900}
                title={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <span>Payload Details</span>

                        <Tag
                            color={
                                selectedPayload?.matchPercentage === "100.00"
                                    ? "green"
                                    : selectedPayload?.matchPercentage > 50
                                        ? "orange"
                                        : "red"
                            }
                        >
                            Match  {selectedPayload?.matchPercentage}%
                        </Tag>
                    </div>
                }
            >

                <Row gutter={[20, 20]}>

                    {/* Expected Payload */}

                    <Col xs={24} md={12}>

                        <Card
                            title="Expected Payload"
                            style={{
                                borderRadius: 14,
                                background: "#fafafa",
                                height: "100%"
                            }}
                        >

                            <pre
                                style={{
                                    margin: 0,
                                    maxHeight: 350,
                                    overflow: "auto",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    fontSize: 13
                                }}
                            >

                                {JSON.stringify(
                                    selectedPayload?.expectedPayload,
                                    null,
                                    2
                                )}

                            </pre>

                        </Card>

                    </Col>



                    {/* Actual Payload */}

                    <Col xs={24} md={12}>

                        <Card
                            title="Actual Payload"
                            style={{
                                borderRadius: 14,
                                background: "#f6ffed",
                                height: "100%"
                            }}
                        >

                            <pre
                                style={{
                                    margin: 0,
                                    maxHeight: 350,
                                    overflow: "auto",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    fontSize: 13
                                }}
                            >

                                {JSON.stringify(
                                    selectedPayload?.actualPayload,
                                    null,
                                    2
                                )}

                            </pre>

                        </Card>

                    </Col>

                </Row>



                <div
                    style={{
                        marginTop: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <Text type="secondary">
                        Result ID:
                        {" "}
                        {selectedPayload?.resultId}
                    </Text>

                    <Tag color="blue">
                        Execution Compared
                    </Tag>

                </div>

            </Modal>
        </div>
    );
};

export default PayloadStore;