import React, { useEffect, useState } from "react";
import {
    Card,
    Table,
    Tag,
    Progress,
    Divider,
    Typography,
    Space,
    Button,
    Modal,
    Spin,
    Col,
    Row,
} from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ResultFetch, OverallResultsFetch } from "../redux/services/settings/resultServices";
import type { ColumnsType } from "antd/es/table";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MetricCard from "../components/metriccard";
import { motion } from "framer-motion";
import AppPagination from "../components/AppPagination";

const { Title, Text } = Typography;

interface ResultType {
    key: number;
    Test_Case: string;
    Pass: number;
    Fail: number;
    Total: number;
    partialSuccess: number;
    partialFailed: number;
    status: string;
    duration: string;
    percent: string | number;
    logs: string;
}

interface OverallResultsType {
    title: any, value: any, color: any, bg: any
}

const MetricBox = ({ title, value, color, bg }: OverallResultsType) => (
    <div
        style={{
            padding: 18,
            borderRadius: 14,
            background: bg,
            border: "1px solid rgba(0,0,0,0.04)",
        }}
    >
        <Text
            type="secondary"
            style={{
                fontSize: 13,
                fontWeight: 500,
            }}
        >
            {title}
        </Text>

        <div
            style={{
                marginTop: 10,
                fontSize: 30,
                fontWeight: 700,
                color,
                lineHeight: 1,
            }}
        >
            {value}
        </div>
    </div>
);

const Results: React.FC = () => {
    const dispatch = useAppDispatch();
    const { resultData, overallResults, loading } = useAppSelector((state) => state.result);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<ResultType | null>(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });

    useEffect(() => {
        dispatch(ResultFetch());
        dispatch(OverallResultsFetch(pagination));
    }, [dispatch, pagination]);

    // STATUS FUNCTION
    const getStatus = (pass: number, fail: number) => {
        const total = pass + fail;

        if (total === 0) return "Pending";
        if (pass === total) return "Success";
        if (fail === total) return "Failed";

        if (pass >= fail) return "Partially Success";
        return "Partially Failed";
    };

    // DATA MAPPING
    const data: ResultType[] = (overallResults?.results || overallResults?.Results || []).map(
        (r: any, i: number) => {
            const pass = Number(r.passed ?? r.Pass ?? 0);
            const fail = Number(r.failed ?? r.Fail ?? 0);
            const total = Number(r.total ?? r.Total ?? (pass + fail));
            const percent = r.match_percentage ?? (total > 0 ? Math.round((pass / total) * 100) : 0);

            return {
                key: i,
                Test_Case: r.Test_Case || "-",
                Pass: pass,
                Fail: fail,
                Total: total,
                percent: percent,
                partialSuccess: Number(r.partially_success ?? r.partialSuccess ?? 0),
                partialFailed: Number(r.partially_failed ?? r.partialFailed ?? 0),
                status: r.status || getStatus(pass, fail),
                duration: r.created_date || "-",
                logs: `Actual: ${r.actual_payload}\nExpected: ${r.expected_payload}`,
            };
        }
    );

    // SUMMARY
    const totalPass = resultData?.passed_count ?? 0;
    const totalFail = resultData?.failed_count ?? 0;
    const totalRuns = resultData?.total_count ?? (totalPass + totalFail);

    const percentRaw =
        resultData?.passed_percentage ??
        (totalRuns > 0 ? Math.round((totalPass / totalRuns) * 100) : 0);

    const percent =
        typeof percentRaw === "string" ? parseFloat(percentRaw) : percentRaw;

    const getOverallStatus = (p: number) => {
        if (p >= 91) return "Success";
        if (p >= 50) return "Partially Success";
        if (p >= 20) return "Partially Failed";
        return "Failed";
    };

    const overallStatus = resultData?.final_status
        ? resultData.final_status
            .split("_")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : (totalRuns === 0 ? "Pending" : getOverallStatus(percent));

    // ✅ PARTIAL CALCULATIONS
    const totalPartialSuccess = data.reduce(
        (acc, item) => acc + (Number(item.partialSuccess) || 0),
        0
    );

    const totalPartialFailed = data.reduce(
        (acc, item) => acc + (Number(item.partialFailed) || 0),
        0
    );

    // DOWNLOAD REPORT
    const downloadReport = async () => {
        const input = document.getElementById("pdf-content");
        if (!input) return;

        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");

            const orientation = canvas.width >= canvas.height ? "landscape" : "portrait";
            const pdf = new jsPDF({
                orientation: orientation,
                unit: "px",
                format: [canvas.width, canvas.height],
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("test-report.pdf");
        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    // TABLE COLUMNS
    const columns: ColumnsType<ResultType> = [
        { title: "Test Case", dataIndex: "Test_Case" },
        { title: "Success", dataIndex: "Pass" },
        { title: "Partial Success", dataIndex: "partialSuccess" },
        { title: "Failed", dataIndex: "Fail" },
        { title: "Partial Failed", dataIndex: "partialFailed" },
        { title: "Total", dataIndex: "Total" },
        {
            title: "Status",
            dataIndex: "status",
            render: (s: string, record: ResultType) => {
                const status = s || getStatus(record.Pass, record.Fail);
                const normalized = status.toLowerCase();

                let color = "orange";
                if (normalized.includes("success")) color = "green";
                else if (normalized.includes("failed")) color = "red";
                else if (normalized.includes("pending")) color = "default";

                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Action",
            onHeaderCell: () => ({ "data-html2canvas-ignore": "true" } as any),
            onCell: () => ({ "data-html2canvas-ignore": "true" } as any),
            render: (_, record) => (
                <Button
                    size="small"
                    onClick={() => {
                        setSelectedRow(record);
                        setOpen(true);
                    }}
                >
                    View
                </Button>
            ),
        },
    ];

    const progressColor =
        percent >= 80
            ? "#52c41a"
            : percent >= 50
                ? "#faad14"
                : "#ff4d4f";

    const statusColor =
        overallStatus.toUpperCase() === "SUCCESS"
            ? "success"
            : overallStatus.toUpperCase() === "FAILED"
                ? "error"
                : overallStatus.toUpperCase().includes("PARTIAL")
                    ? "volcano"
                    : "warning";

    const handlePagination = async (page: number, limit: number) => {
        setPagination({ page, limit });

        try {
            await dispatch(
                OverallResultsFetch({

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
        <div style={{ padding: 20, background: "#fff" }}>
            <div id="pdf-content" style={{ padding: 10, background: "#fff" }}>
                {/* HEADER */}
                <div style={{ marginBottom: 16 }}>
                    <Title level={4}>Execution Results</Title>
                    <Text type="secondary">
                        Detailed execution report and analysis
                    </Text>
                </div>

                {/* SUMMARY */}
                <Card
                    bordered={false}
                    style={{
                        marginBottom: 20,
                        borderRadius: 16,
                        overflow: "hidden",
                        background: "#ffffff",
                        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                    }}
                    bodyStyle={{
                        padding: 24,
                    }}
                >
                    <Spin spinning={loading}>
                        {/* TOP ROW */}
                        <div
                            style={{
                                display: "grid",

                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(180px,1fr))",

                                gap: 16,

                                marginBottom: 16,

                                width: "100%"
                            }}
                        >

                            <MetricCard
                                title="Total Runs"
                                value={totalRuns}
                                color="#1677ff"
                                bg="#f0f5ff"
                            />

                            <MetricCard
                                title="Success"
                                value={totalPass}
                                color="#52c41a"
                                bg="#f6ffed"
                            />

                            <MetricCard
                                title="Partial Success"
                                value={totalPartialSuccess}
                                color="#faad14"
                                bg="#fffbe6"
                            />

                            <MetricCard
                                title="Failed"
                                value={totalFail}
                                color="#ff4d4f"
                                bg="#fff2f0"
                            />

                            <MetricCard
                                title="Partial Failed"
                                value={totalPartialFailed}
                                color="#cf1322"
                                bg="#fff1f0"
                            />

                        </div>

                        {/* BOTTOM ROW */}


                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: .5 }}
                            whileHover={{
                                y: -4,
                                boxShadow: "0 12px 30px rgba(0,0,0,.08)"
                            }}
                        >

                            <div
                                style={{
                                    padding: 24,
                                    borderRadius: 20,
                                    background: "#fff",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 24,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    boxShadow: "0 4px 20px rgba(0,0,0,.05)"
                                }}
                            >

                                {/* LEFT */}

                                <div
                                    style={{
                                        flex: 1,
                                        minWidth: 260
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 16
                                        }}
                                    >

                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 500
                                            }}
                                        >

                                            Pass Percentage

                                        </Text>


                                        <motion.div

                                            initial={{
                                                scale: .5,
                                                opacity: 0
                                            }}

                                            animate={{
                                                scale: 1,
                                                opacity: 1
                                            }}

                                            transition={{
                                                delay: .3
                                            }}

                                            style={{

                                                fontSize: 38,

                                                fontWeight: 800,

                                                color: progressColor

                                            }}

                                        >

                                            {percent}%

                                        </motion.div>

                                    </div>



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

                                            percent={percent}

                                            showInfo={false}

                                            strokeWidth={14}

                                            strokeColor={progressColor}

                                            trailColor="#f3f4f6"

                                        />

                                    </motion.div>


                                    <Text
                                        type="secondary"

                                        style={{
                                            marginTop: 14,
                                            display: "block",
                                            fontSize: 14
                                        }}
                                    >

                                        {percent}% execution completed successfully

                                    </Text>

                                </div>



                                {/* RIGHT */}

                                <div

                                    style={{

                                        flex: 1,

                                        minWidth: 220,

                                        paddingLeft: 24,

                                        borderLeft:
                                            window.innerWidth > 768

                                                ?

                                                "1px solid #eee"

                                                :

                                                "none"

                                    }}

                                >

                                    <Text
                                        type="secondary"

                                        style={{
                                            fontSize: 15
                                        }}
                                    >

                                        Overall Status

                                    </Text>


                                    <motion.div

                                        animate={{

                                            scale: [1, 1.05, 1]

                                        }}

                                        transition={{

                                            repeat: Infinity,

                                            duration: 2

                                        }}

                                        style={{
                                            marginTop: 16
                                        }}

                                    >

                                        <Tag

                                            color={statusColor}

                                            style={{

                                                padding:
                                                    "10px 20px",

                                                fontSize: 15,

                                                fontWeight: 700,

                                                borderRadius: 30,

                                                border: "none"

                                            }}

                                        >

                                            {overallStatus}

                                        </Tag>

                                    </motion.div>



                                    <div
                                        style={{
                                            marginTop: 24
                                        }}
                                    >

                                        <Row gutter={[12, 12]}>

                                            <Col span={8}>
                                                <Text type="secondary">
                                                    Runs
                                                </Text>

                                                <div
                                                    style={{
                                                        fontSize: 24,
                                                        fontWeight: 700
                                                    }}
                                                >

                                                    {totalRuns}

                                                </div>

                                            </Col>



                                            <Col span={8}>
                                                <Text type="secondary">
                                                    Success
                                                </Text>

                                                <div
                                                    style={{
                                                        fontSize: 24,
                                                        fontWeight: 700,
                                                        color: "#52c41a"
                                                    }}
                                                >

                                                    {totalPass}

                                                </div>

                                            </Col>



                                            <Col span={8}>
                                                <Text type="secondary">
                                                    Failed
                                                </Text>

                                                <div
                                                    style={{
                                                        fontSize: 24,
                                                        fontWeight: 700,
                                                        color: "#ff4d4f"
                                                    }}
                                                >

                                                    {totalFail}

                                                </div>

                                            </Col>

                                        </Row>

                                    </div>

                                </div>

                            </div>

                        </motion.div>
                    </Spin>
                </Card>

                {/* TABLE */}
                <Card
                    title="Execution Details"
                    style={{
                        borderRadius: 16
                    }}
                >
                    <Table
                        dataSource={data}
                        columns={columns}
                        bordered
                        size="middle"
                        pagination={false}
                        scroll={{
                            x: "max-content"
                        }}
                    />
                    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>

                        <AppPagination
                            totalRecords={overallResults?.totalRecords || 0}
                            onChange={handlePagination}
                        />
                    </div>
                </Card>
            </div>

            {/* ACTIONS */}
            <Divider />
            <Space>
                <Button onClick={downloadReport} type="primary">Download Report</Button>
            </Space>

            {/* MODAL */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
                width={700}
                title={
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        Test Case Details
                    </div>
                }
            >
                {selectedRow && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                            marginTop: 12,
                        }}
                    >
                        {/* Header Card */}
                        <div
                            style={{
                                position: "relative",
                                overflow: "hidden",
                                padding: 24,
                                borderRadius: 18,
                                background:
                                    selectedRow.status.includes("success")
                                        ? "linear-gradient(135deg, #f6ffed 0%, #ecfdf3 100%)"
                                        : selectedRow.status.includes("fail")
                                            ? "linear-gradient(135deg, #fff1f0 0%, #fff5f5 100%)"
                                            : "linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%)",
                                border:
                                    selectedRow.status.includes("success")
                                        ? "1px solid #b7eb8f"
                                        : selectedRow.status.includes("fail")
                                            ? "1px solid #ffa39e"
                                            : "1px solid #ffe58f",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                            }}
                        >
                            {/* Decorative Circle */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: -30,
                                    right: -30,
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    background:
                                        selectedRow.status.includes("success")
                                            ? "rgba(84, 223, 15, 0.12)"
                                            : selectedRow.status.includes("fail")
                                                ? "rgba(255,77,79,0.12)"
                                                : "rgba(250,173,20,0.12)",
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                {/* Left Content */}
                                <div>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: 1,
                                            color: "#6b7280",
                                        }}
                                    >
                                        Test Case
                                    </Text>

                                    <div
                                        style={{
                                            marginTop: 10,
                                            fontSize: 26,
                                            fontWeight: 700,
                                            color: "#111827",
                                            lineHeight: 1.3,
                                            maxWidth: 500,
                                        }}
                                    >
                                        {selectedRow.Test_Case}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 14,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                                background:
                                                    selectedRow.status.includes("success")
                                                        ? "#52c41a"
                                                        : selectedRow.status.includes("fail")
                                                            ? "#ff4d4f"
                                                            : "#faad14",
                                                boxShadow:
                                                    selectedRow.status.includes("success")
                                                        ? "0 0 10px rgba(82,196,26,0.5)"
                                                        : selectedRow.status.includes("fail")
                                                            ? "0 0 10px rgba(255,77,79,0.5)"
                                                            : "0 0 10px rgba(250,173,20,0.5)",
                                            }}
                                        />

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color:
                                                    selectedRow.status.includes("success")
                                                        ? "#389e0d"
                                                        : selectedRow.status.includes("fail")
                                                            ? "#cf1322"
                                                            : "#d48806",
                                            }}
                                        >
                                            {selectedRow.status}
                                        </Text>
                                    </div>
                                </div>

                                {/* Right Badge */}
                                <Tag
                                    color={
                                        selectedRow.status.includes("success")
                                            ? "#389e0d"
                                            : selectedRow.status.includes("fail")
                                                ? "#cf1322"
                                                : "#d48806"
                                    }
                                    style={{
                                        padding: "8px 18px",
                                        borderRadius: 999,
                                        fontSize: 13,
                                        fontWeight: 700,
                                        border: "none",
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {selectedRow.status}
                                </Tag>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: 16,
                            }}
                        >
                            <MetricBox
                                title="Pass"
                                value={selectedRow.Pass}
                                color="#52c41a"
                                bg="#f6ffed"
                            />

                            <MetricBox
                                title="Partial Success"
                                value={selectedRow.partialSuccess}
                                color="#faad14"
                                bg="#fffbe6"
                            />

                            <MetricBox
                                title="Partial Failed"
                                value={selectedRow.partialFailed}
                                color="#ff7a45"
                                bg="#fff7e6"
                            />

                            <MetricBox
                                title="Fail"
                                value={selectedRow.Fail}
                                color="#ff4d4f"
                                bg="#fff2f0"
                            />
                        </div>



                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Results;