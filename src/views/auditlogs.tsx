import React, { useState, useEffect } from "react";
import {
    Card,
    Table,
    Tag,
    Modal,
    Select,
    Input,
    Space,
    Typography,
    Row,
    Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AuditGet } from "../redux/services/settings/auditServices";
import AppPagination from "../components/AppPagination";


const { Title, Text } = Typography;
interface Log {
    key: string | number;
    user_name: string;
    action_type: string;
    module_name: string;
    created_date: string;
    description: string;
    old_value: string;
    new_value: string;
    details: any;
}

const AuditLogs: React.FC = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [filterField, setFilterField] = useState<string>("All");
    const [filterValue, setFilterValue] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const audits = useAppSelector((state) => state.audit.audit);


    useEffect(() => {
        const payload = {
            search_by_filter: filterField,
            search: filterValue,
        }
        dispatch(
            AuditGet({
                payload: payload,
                pagination: pagination,
            })
        )
    }, [dispatch, filterField, filterValue]);

    const getActionTag = (action: string) => {
        const normalized = (action || "").toLowerCase();
        const colors: any = {
            create: "green",
            update: "orange",
            delete: "red",
            run: "blue",
        };
        const color = colors[normalized] || "default";
        const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
        return <Tag color={color}>{label}</Tag>;
    };

    const columns: ColumnsType<Log> = [
        {
            title: "User",
            dataIndex: "user_name",
        },
        {
            title: "Action",
            dataIndex: "action_type",
            render: (a: string) => getActionTag(a),
        },
        {
            title: "Module",
            dataIndex: "module_name",
        },
        {
            title: "Time",
            dataIndex: "created_date",
        },
        {
            title: "Details",
            render: (_, record) => (
                <a
                    style={{ color: "#1677ff" }}
                    onClick={() => {
                        setSelectedLog(record);
                        setOpen(true);
                    }}
                >
                    View
                </a>
            ),
        },
    ];

    const renderValue = (val: any) => {
        if (!val) return "None";
        if (typeof val === "object") {
            return JSON.stringify(val, null, 2);
        }
        try {
            const parsed = JSON.parse(val);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return val;
        }
    };

    const handlePagination = async (page: number, limit: number) => {
        setPagination({ page, limit });

        try {

            await dispatch(
                AuditGet({
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

            <div style={{ marginBottom: 30 }}>
                <Title level={4}>Audit Logs</Title>
                <Text type="secondary">
                    View all changes and actions performed within the system, along with details of what was changed, when, and by whom.
                </Text>
            </div>
            <Card>
                <Space direction="vertical" style={{ width: "100%" }} size="middle">

                    <Row gutter={[12, 12]}>
                        <Col xs={24} sm={12} md={8}>
                            <Select
                                placeholder="Filter By"
                                value={filterField}
                                onChange={setFilterField}
                                style={{ width: "100%" }}
                                options={[
                                    { label: "All", value: "All" },
                                    { label: "User Name", value: "user_name" },
                                    { label: "Action Type", value: "action_type" },
                                    { label: "Module Name", value: "module_name" },
                                    { label: "User Email", value: "user_mail" }
                                ]}
                            />
                        </Col>

                        <Col xs={24} sm={12} md={10}>
                            <Input
                                placeholder="Search query..."
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                style={{ borderRadius: 8 }}
                                allowClear
                            />
                        </Col>
                    </Row>

                    <Table
                        dataSource={audits?.results || []}
                        columns={columns}
                        rowKey="key"
                        bordered
                        size="middle"
                        pagination={false}
                        scroll={{
                            x: "max-content"
                        }}
                    />

                </Space>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>

                    <AppPagination
                        totalRecords={audits?.totalResults || 0}
                        onChange={handlePagination}
                    />
                </div>
            </Card>

            {/* 🔷 DETAILS MODAL */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title="Change Details"
            >
                {selectedLog && (
                    <>
                        <p><b>User:</b> {selectedLog.user_name}</p>
                        <p><b>Action:</b> {selectedLog.action_type}</p>
                        <p><b>Module:</b> {selectedLog.module_name}</p>

                        {selectedLog.description && (
                            <p><b>Description:</b> {selectedLog.description}</p>
                        )}

                        {(selectedLog.old_value || selectedLog.details?.before) && (
                            <Card size="small" style={{ marginTop: 10 }} title="Before">
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    {renderValue(selectedLog.old_value || selectedLog.details?.before)}
                                </pre>
                            </Card>
                        )}

                        {(selectedLog.new_value || selectedLog.details?.after) && (
                            <Card size="small" style={{ marginTop: 10 }} title="After">
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    {renderValue(selectedLog.new_value || selectedLog.details?.after)}
                                </pre>
                            </Card>
                        )}

                        {(!selectedLog.old_value && !selectedLog.new_value && selectedLog.details && typeof selectedLog.details === "object" && Object.keys(selectedLog.details).length > 0) && (
                            <Card size="small" style={{ marginTop: 10 }} title="Details">
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    {renderValue(selectedLog.details)}
                                </pre>
                            </Card>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AuditLogs;