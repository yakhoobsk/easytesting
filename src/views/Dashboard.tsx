import { Row, Col, Card, Progress, Table, Tag, Spin } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { DashboardGet, ExecutionDetailsFetch } from "../redux/services/settings/dashboardServices";

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const { dashboard, executionDetails, loading } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(DashboardGet({}));
        dispatch(ExecutionDetailsFetch({ payload: { search_by_filter: "All", search: "" } }));
    }, [dispatch]);

    // 🔥 STATUS LOGIC
    const getExecutionStatus = (pass: number, fail: number) => {
        const total = pass + fail;

        if (total === 0) return "Pending";
        if (pass === total) return "Success";
        if (fail === total) return "Failed";

        return "Partially Success";
    };

    const totalPass = dashboard?.success_count || 0;
    const totalFail = dashboard?.failed_count || 0;
    const totalRuns = dashboard?.total_count || 0;
    const passPercentStr = dashboard?.pass_percentage || "0%";
    const passPercent = parseInt(passPercentStr.replace("%", "")) || 0;

    // 🔥 OVERALL STATUS
    const getOverallStatus = (percent: number) => {
        if (percent >= 91) return "Success";
        if (percent >= 50) return "Partially Success";
        if (percent >= 20) return "Partially Failed";
        return "Failed";
    };

    const overallStatus = totalRuns === 0 ? "Pending" : getOverallStatus(passPercent);

    const stats = [
        { title: "Total Runs", value: totalRuns, color: "#3b82f6" },
        { title: "Success", value: totalPass, color: "#22c55e" },
        { title: "Failed", value: totalFail, color: "#ef4444" },
        { title: "Pass %", value: passPercentStr, color: "#6366f1" },
    ];

    const cardStyle = {
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    };

    return (
        <Spin spinning={loading}>
            <div style={{ background: "#f5f7fb", padding: 16 }}>
                <Row gutter={12}>
                    {stats.map((s, i) => (
                        <Col span={6} key={i}>
                            <Card
                                bordered={false}
                                bodyStyle={{ padding: 16 }}
                                style={{
                                    borderRadius: 14,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                }}
                            >
                                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                                    {s.title}
                                </div>



                                {s.title === "Pass %" ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 4,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 26,
                                                fontWeight: 700,
                                                color: s.color,
                                            }}
                                        >
                                            {s.value}
                                        </div>

                                        <Tag
                                            style={{ marginLeft: 8 }}
                                            color={
                                                overallStatus === "Success"
                                                    ? "green"
                                                    : overallStatus === "Failed"
                                                        ? "red"
                                                        : overallStatus === "Partially Failed"
                                                            ? "volcano"
                                                            : "orange"
                                            }
                                        >
                                            {overallStatus}
                                        </Tag>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            fontSize: 26,
                                            fontWeight: 700,
                                            marginTop: 4,
                                            color: s.color,
                                        }}
                                    >
                                        {s.value}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Card
                    style={{ ...cardStyle, marginTop: 12 }}
                    title={<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Overall Execution Health</span>

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
                    </div>}

                >
                    <Progress
                        percent={passPercent}
                        strokeColor={
                            overallStatus === "Success"
                                ? "#22c55e"
                                : overallStatus === "Failed"
                                    ? "#ef4444"
                                    : overallStatus === "Partially Failed"
                                        ? "#ff7a45"
                                        : "#f59e0b"
                        }
                    />
                </Card>

                {/* 🔷 ENVIRONMENT HEALTH
                <Card
                    style={{ ...cardStyle, marginTop: 12 }}
                    title="Environment Health"
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {envStats.map((e, i) => {
                            const percent = Math.round(
                                (e.pass / (e.pass + e.fail)) * 100
                            );

                            const status = getExecutionStatus(e.pass, e.fail);

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        flex: 1,
                                    }}
                                >
                                    <div>{e.env}</div>

                                    <Progress
                                        type="circle"
                                        percent={percent}
                                        size={80}
                                        strokeColor={
                                            status === "Success"
                                                ? "#22c55e"
                                                : status === "Failed"
                                                    ? "#ef4444"
                                                    : "#f59e0b"
                                        }
                                    />

                                    <Tag
                                        style={{ marginTop: 8 }}
                                        color={
                                            status === "Success"
                                                ? "green"
                                                : status === "Failed"
                                                    ? "red"
                                                    : "orange"
                                        }
                                    >
                                        {status}
                                    </Tag>
                                </div>
                            );
                        })}
                    </div>
                </Card> */}

                {/* 🔷 TABLE */}
                <Card
                    style={{ ...cardStyle, marginTop: 12 }}
                    title="Execution Details"
                >
                    <Table
                        dataSource={(executionDetails?.Results || executionDetails?.results || []).map((e: any, i: number) => {
                            const pass = Number(e.passed) || 0;
                            const fail = Number(e.failed) || 0;
                            const partialSuccess = Number(e.partially_success) || 0;
                            const partialFailed = Number(e.partially_failed) || 0;
                            const total = Number(e.total) || (pass + fail + partialSuccess + partialFailed);
                            const percent = e.match_percentage || (total > 0 ? Math.round((pass / total) * 100) : 0);
                            const status = e.testing_status || getExecutionStatus(pass, fail);

                            return {
                                key: i,
                                env: e.environment_name || e.env || "-",
                                pass,
                                fail,
                                partialSuccess,
                                partialFailed,
                                total,
                                percent,
                                status,
                            };
                        })}
                        pagination={false}
                        columns={[
                            { title: "Environment", dataIndex: "env" },
                            { title: "Total", dataIndex: "total" },
                            { title: "Success", dataIndex: "pass" },
                            { title: "Partially Success", dataIndex: "partialSuccess" },
                            { title: "Failed", dataIndex: "fail" },
                            { title: "Partially Failed", dataIndex: "partialFailed" },
                            {
                                title: "Pass %",
                                dataIndex: "percent",
                                render: (p) => typeof p === 'string' ? p : `${p}%`,
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
        </Spin>
    );
};

export default Dashboard;