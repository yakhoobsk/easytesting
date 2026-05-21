import React, { useState, useEffect } from "react";
import {
    Card,
    Table,
    Tag,
    Modal,
    Select,
    Input,
    Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch } from "../redux/hooks";
import { AuditGet } from "../redux/services/settings/auditServices";

interface Log {
    key: string | number;
    user: string;
    action: string;
    module: string;
    time: string;
    description: string;
    old_value: string;
    new_value: string;
    details: any;
}

const AuditLogs: React.FC = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [logs, setLogs] = useState<Log[]>([]);
    const [fetching, setFetching] = useState(false);
    const [filterField, setFilterField] = useState<string>("All");
    const [filterValue, setFilterValue] = useState("");

    const formatTime = (timeStr: any) => {
        if (!timeStr) return "-";
        const str = String(timeStr).trim();
        // Match YYYYMMDD HHMMSS.mmm format (e.g. "20260519 091626.000")
        if (/^\d{8}\s+\d{6}\.\d{3}$/.test(str)) {
            const yyyy = str.substring(0, 4);
            const mm = str.substring(4, 6);
            const dd = str.substring(6, 8);
            const hh = str.substring(9, 11);
            const min = str.substring(11, 13);
            const ss = str.substring(13, 15);
            const isoStr = `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
            const date = new Date(isoStr);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString();
            }
        }
        try {
            const date = new Date(timeStr);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString();
            }
        } catch {
            // Fallback
        }
        return String(timeStr);
    };

    const fetchLogs = (
        filterFieldParam = "All",
        filterValueParam = ""
    ) => {
        setFetching(true);

        const payload = {
            search_by_filter: filterFieldParam,
            search: filterValueParam,
        };

        dispatch(
            AuditGet({
                Payload: payload,
                pagnation: { page: 1, limit: 100 },
            })
        ).then((res: any) => {
            setFetching(false);

            const data =
                res.payload?.results ||
                res.payload?.Results ||
                res.payload?.Results_Data ||
                (Array.isArray(res.payload) ? res.payload : []);

            if (Array.isArray(data)) {
                const fetchedLogs = data.map((u: any, idx: number) => {
                    const name = (u.user_name || "").trim();
                    const mail = (u.user_mail || "").trim();
                    const createdBy = (u.created_by || "").trim();
                    const legacyUser = (u.User || "").trim();
                    const legacyMail = (u.User_Email || "").trim();

                    return {
                        key: u.id || u.audit_id || idx,
                        user: name || mail || createdBy || legacyUser || legacyMail || "-",
                        action: u.action_type || u.Event || u.action || "-",
                        module: u.module_name || u.module || u.Pipeline || u.Environment || "System",
                        time: formatTime(u.created_date || u.Time || u.time),
                        description: u.description || u.Details || "",
                        old_value: u.old_value || "",
                        new_value: u.new_value || "",
                        details: u
                    };
                });

                setLogs(fetchedLogs);
            } else {
                setLogs([]);
            }
        });
    };

    useEffect(() => {
        fetchLogs(filterField, filterValue);
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
            dataIndex: "user",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (a: string) => getActionTag(a),
        },
        {
            title: "Module",
            dataIndex: "module",
        },
        {
            title: "Time",
            dataIndex: "time",
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

    return (
        <div style={{ padding: 16, background: "#f5f7fb" }}>
            {/* 🔷 TABLE */}
            <Card title="Audit Logs">
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Space size="middle">
                            <Select
                                placeholder="Filter By"
                                style={{ width: 180 }}
                                value={filterField}
                                onChange={setFilterField}
                                options={[
                                    { label: "All", value: "All" },
                                    { label: "User Name", value: "user_name" },
                                    { label: "Action Type", value: "action_type" },
                                    { label: "Module Name", value: "module_name" },
                                    { label: "User Email", value: "user_mail" },
                                ]}
                            />

                            <Input
                                placeholder="Search query..."
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                style={{ width: 300, borderRadius: 8 }}
                            />
                        </Space>
                    </div>

                    <Table
                        dataSource={logs}
                        columns={columns}
                        loading={fetching}
                        pagination={{ pageSize: 10 }}
                        rowKey="key"
                    />
                </Space>
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
                        <p><b>User:</b> {selectedLog.user}</p>
                        <p><b>Action:</b> {selectedLog.action}</p>
                        <p><b>Module:</b> {selectedLog.module}</p>

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