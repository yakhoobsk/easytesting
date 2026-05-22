import { Row, Col, Card, Progress, Table, Tag, Spin } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { DashboardGet, ExecutionDetailsFetch } from "../redux/services/settings/dashboardServices";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
const Dashboard = () => {
    const dispatch = useAppDispatch();
    const { dashboard, executionDetails, loading } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(DashboardGet({}));
        dispatch(ExecutionDetailsFetch({ payload: { search_by_filter: "All", search: "" } }));
    }, [dispatch]);

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



    const pieData = [

        {
            name: "Success",
            value:
                dashboard?.success_count || 0
        },

        {
            name: "Failed",
            value:
                dashboard?.failed_count || 0
        },

        {
            name: "Remaining",
            value:
                (dashboard?.total_count || 0)
                -
                (
                    (dashboard?.success_count || 0)
                    +
                    (dashboard?.failed_count || 0)
                )
        }

    ];



    const barData = [

        {
            name: "Total",
            value:
                dashboard?.total_count || 0
        },

        {
            name: "Success",
            value:
                dashboard?.success_count || 0
        },

        {
            name: "Failed",
            value:
                dashboard?.failed_count || 0
        }

    ];



    return (
        <Spin spinning={loading}>
            <div style={{ background: "#f5f7fb", padding: 16 }}>
                <Row gutter={[12, 12]}>

                    {stats.map((s, i) => (

                        <Col
                            key={i}
                            xs={24}
                            sm={12}
                            md={12}
                            lg={6}
                        >

                            <motion.div

                                initial={{
                                    opacity: 0,
                                    y: 30
                                }}

                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}

                                transition={{
                                    duration: .4,
                                    delay: i * .1
                                }}

                                whileHover={{
                                    y: -6,
                                    scale: 1.02,
                                    transition: {
                                        duration: .2
                                    }
                                }}

                            >

                                <Card
                                    bordered={false}
                                    bodyStyle={{
                                        padding: 16
                                    }}

                                    style={{
                                        borderRadius: 18,
                                        height: "100%",
                                        cursor: "pointer",
                                        transition:
                                            "all .3s ease",
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,.06)"
                                    }}
                                    hoverable
                                >
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#94a3b8",
                                            fontWeight: 500
                                        }}
                                    >
                                        {s.title}

                                    </div>
                                    {s.title === "Pass %" ?
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: 10,
                                                gap: 8,
                                                flexWrap: "wrap"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 30,
                                                    fontWeight: 700,
                                                    color: s.color
                                                }}
                                            >
                                                {s.value}
                                            </div>

                                            <Tag
                                                style={{
                                                    padding:
                                                        "4px 10px",
                                                    fontWeight: 600,
                                                    borderRadius: 20
                                                }}

                                                color={
                                                    overallStatus === "Success"
                                                        ?
                                                        "green"
                                                        :
                                                        overallStatus === "Failed"
                                                            ?
                                                            "red"
                                                            :
                                                            overallStatus === "Partially Failed" ?
                                                                "volcano"
                                                                :
                                                                "orange"
                                                }

                                            >

                                                {overallStatus}

                                            </Tag>

                                        </div>

                                        :

                                        <div

                                            style={{

                                                fontSize: 30,

                                                fontWeight: 700,

                                                marginTop: 10,

                                                color: s.color

                                            }}

                                        >

                                            {s.value}

                                        </div>

                                    }


                                </Card>

                            </motion.div>

                        </Col>

                    ))}

                </Row>

                <motion.div

                    initial={{
                        opacity: 0,
                        y: 20
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}

                    transition={{
                        duration: 0.5
                    }}

                    whileHover={{
                        scale: 1.01
                    }}

                >

                    <Card
                        style={{
                            ...cardStyle,
                            marginTop: 12,
                            borderRadius: 16
                        }}

                        title={

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",

                                    flexWrap: "wrap",

                                    gap: 8
                                }}
                            >

                                <span>
                                    Overall Execution Health
                                </span>

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

                    >

                        <motion.div

                            initial={{
                                width: 0
                            }}

                            animate={{
                                width: "100%"
                            }}

                            transition={{
                                duration: 1
                            }}

                        >

                            <Progress

                                percent={passPercent}

                                strokeWidth={12}

                                showInfo

                                strokeColor={

                                    overallStatus === "Success"

                                        ?

                                        "#22c55e"

                                        :

                                        overallStatus === "Failed"

                                            ?

                                            "#ef4444"

                                            :

                                            overallStatus === "Partially Failed"

                                                ?

                                                "#ff7a45"

                                                :

                                                "#f59e0b"

                                }

                            />

                        </motion.div>


                        <motion.div

                            initial={{
                                opacity: 0
                            }}

                            animate={{
                                opacity: 1
                            }}

                            transition={{
                                delay: .8
                            }}

                            style={{
                                marginTop: 12,

                                fontSize: 13,

                                color: "#64748b"
                            }}

                        >

                            {passPercent}% of executions
                            completed successfully

                        </motion.div>

                    </Card>

                </motion.div>


                <Row
                    gutter={[16, 16]}
                    style={{ marginTop: 20 }}
                >
                    {/* PIE */}
                    <Col
                        xs={24}
                        lg={12}
                    >
                        <Card
                            style={{
                                borderRadius: 16
                            }}
                        >
                            <h3>
                                Execution Overview
                            </h3>

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <PieChart>

                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        label
                                        outerRadius={100}
                                    >

                                        <Cell fill="#22C55E" />

                                        <Cell fill="#EF4444" />

                                        <Cell fill="#F59E0B" />

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </Card>

                    </Col>



                    {/* BAR */}

                    <Col
                        xs={24}
                        lg={12}
                    >

                        <Card
                            style={{
                                borderRadius: 16
                            }}
                        >

                            <h3>
                                Execution Summary
                            </h3>

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <BarChart
                                    data={barData}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        dataKey="name"
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="value"
                                        radius={[8, 8, 0, 0]}
                                    >

                                        <Cell fill="#3B82F6" />

                                        <Cell fill="#22C55E" />

                                        <Cell fill="#EF4444" />

                                    </Bar>

                                </BarChart>

                            </ResponsiveContainer>

                        </Card>

                    </Col>

                </Row>
                {/* 🔷 TABLE */}
                <Card
                    style={{
                        ...cardStyle,
                        marginTop: 12
                    }}
                    title="Execution Details"
                >
                    <Table
                        scroll={{
                            x: 1000,

                        }}
                        size="middle"
                        bordered
                        pagination={false}

                        dataSource={
                            (
                                executionDetails?.Results ||

                                executionDetails?.results ||

                                []
                            ).map((e: any, i: number) => {

                                const pass =
                                    Number(e.passed) || 0;

                                const fail =
                                    Number(e.failed) || 0;

                                const partialSuccess =
                                    Number(
                                        e.partially_success
                                    ) || 0;

                                const partialFailed =
                                    Number(
                                        e.partially_failed
                                    ) || 0;

                                const total =
                                    Number(e.total)

                                    ||

                                    (
                                        pass +
                                        fail +
                                        partialSuccess +
                                        partialFailed
                                    );

                                const percent =
                                    e.match_percentage ||

                                    (
                                        total > 0

                                            ?

                                            Math.round(
                                                (
                                                    pass /
                                                    total
                                                ) * 100
                                            )

                                            :

                                            0
                                    );

                                const status =
                                    e.testing_status

                                    ||

                                    getExecutionStatus(
                                        pass,
                                        fail
                                    );

                                return {

                                    key: i,

                                    env:
                                        e.environment_name
                                        ||
                                        e.env
                                        ||
                                        "-",

                                    pass,

                                    fail,

                                    partialSuccess,

                                    partialFailed,

                                    total,

                                    percent,

                                    status,
                                };

                            })
                        }


                        columns={[

                            {
                                title:
                                    "Environment",

                                dataIndex:
                                    "env",

                                fixed: "left",

                                width: 180,

                                ellipsis: true
                            },

                            {
                                title:
                                    "Total",

                                dataIndex:
                                    "total",

                                width: 100,

                                responsive:
                                    ["sm"]
                            },

                            {
                                title:
                                    "Success",

                                dataIndex:
                                    "pass",

                                width: 100
                            },

                            {
                                title:
                                    "Partially Success",

                                dataIndex:
                                    "partialSuccess",

                                width: 140,

                                responsive:
                                    ["md"]
                            },

                            {
                                title:
                                    "Failed",

                                dataIndex:
                                    "fail",

                                width: 100
                            },

                            {
                                title:
                                    "Partially Failed",

                                dataIndex:
                                    "partialFailed",

                                width: 140,

                                responsive:
                                    ["md"]
                            },

                            {
                                title:
                                    "Pass %",

                                dataIndex:
                                    "percent",

                                width: 100,

                                render:
                                    (p) =>

                                        typeof p ===
                                            "string"

                                            ?

                                            p

                                            :

                                            `${p}%`
                            },

                            {
                                title:
                                    "Status",

                                dataIndex:
                                    "status",

                                width: 160,

                                render:
                                    (s: string) => {

                                        let color =
                                            "orange";

                                        const status =
                                            s

                                                ?

                                                s.replace(
                                                    /_/g,
                                                    " "
                                                )

                                                    .toLowerCase()

                                                :

                                                "pending";


                                        if (
                                            status.includes(
                                                "success"
                                            )
                                        )
                                            color =
                                                "green";

                                        else if (
                                            status.includes(
                                                "failed"
                                            )
                                        )
                                            color =
                                                "red";

                                        else if (
                                            status.includes(
                                                "pending"
                                            )
                                        )
                                            color =
                                                "default";

                                        return (

                                            <Tag
                                                color={
                                                    color
                                                }
                                            >

                                                {

                                                    s

                                                        ?

                                                        s.replace(
                                                            /_/g,
                                                            " "
                                                        )

                                                            .split(
                                                                " "
                                                            )

                                                            .map(
                                                                w =>
                                                                    w.charAt(
                                                                        0
                                                                    )
                                                                        .toUpperCase()

                                                                    +

                                                                    w.slice(
                                                                        1
                                                                    )
                                                            )

                                                            .join(
                                                                " "
                                                            )

                                                        :

                                                        "Pending"

                                                }

                                            </Tag>

                                        );

                                    }
                            }

                        ]}

                    />

                </Card>
            </div>
        </Spin>
    );
};

export default Dashboard;