import {
    Avatar,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
} from "antd";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserCreate, UserEdit, UserGet, UserMailGet } from "../../redux/services/settings/userService";
import AppPagination from "../../components/AppPagination";
import { EditOutlined } from "@ant-design/icons";


const { Option } = Select;

interface User {
    key: number;
    full_name: string;
    role: string;
    user_email?: string;
    is_status?: boolean;
}

const UsersPage = () => {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state) => state.auth);
    const { UserMail } = useAppSelector((state) => state.user);
    console.log("UserMail data:", UserMail)
    const [filterField, setFilterField] = useState<string>("All");
    const [filterValue, setFilterValue] = useState("");
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [form, setForm] = useState<any>({});
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 100 });
    const users = useAppSelector((state) => state.user?.userGet);




    useEffect(() => {
        const payload = {
            search_by_filter: filterField,
            search: filterValue,
        }
        dispatch(
            UserGet({
                payload,
                pagination: pagination,
            })
        );

    }, [dispatch, filterField, filterValue]);

    useEffect(() => {
        dispatch(UserMailGet({}));
    }, [dispatch]);

    const handleAdd = () => {
        const currentUserEmail =
            auth?.user_email ||
            (Array.isArray(auth) && auth[0]?.[0]?.user_email) ||
            "admin@company.com";

        const payload = {
            full_name: form.name,
            user_email: form.email,
            role: form.role,
            Status: form.status === "Active",
            created_by: currentUserEmail,
        };

        dispatch(UserCreate({ payload })).then((res: any) => {
            if (res.payload?.Response_Status === "Success") {
                dispatch(
                    UserGet({
                        payload: {
                            search_by_filter: filterField,
                            search: filterValue,
                        },
                        pagination: pagination,
                    })
                );

                setOpen(false);
                setForm({});
            }
        });
    };

    const handleUpdate = () => {
        if (!selectedUser) return;

        const currentUserEmail =
            auth?.user_email ||
            (Array.isArray(auth) && auth[0]?.[0]?.user_email) ||
            "admin@company.com";

        const payload = {
            full_name: form.name,
            User_Email: form.email,
            role: form.role,
            status: form.status === "Active" ? 1 : 0,
            updated_by: currentUserEmail,
        };

        dispatch(UserEdit(payload)).then((res: any) => {
            if (res.payload?.Response_Status === "Success") {
                dispatch(
                    UserGet({
                        payload: {
                            search_by_filter: filterField,
                            search: filterValue,
                        },
                        pagination: pagination,
                    })
                );

                setEditOpen(false);
                setForm({});
            }
        });
    };



    const handlePagination = async (page: number, limit: number) => {
        setPagination({ page, limit });

        try {
            await dispatch(
                UserGet({
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
        <>
            <Space direction="vertical" style={{ width: "100%" }} size="large">

                {/* Filters */}
                <Row gutter={[12, 12]} align="middle">

                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Filter By"
                            value={filterField}
                            onChange={setFilterField}
                            style={{ width: "100%" }}
                            options={[
                                { label: "All", value: "All" },
                                { label: "Name", value: "full_name" },
                                { label: "Email", value: "user_email" },
                                { label: "Role", value: "role" },

                            ]}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Search query..."
                            value={filterValue}
                            onChange={(e) =>
                                setFilterValue(e.target.value)
                            }
                            style={{ borderRadius: 8 }}
                            allowClear
                        />
                    </Col>

                    <Col
                        xs={24}
                        md={6}

                        style={{
                            marginLeft: "auto"
                        }}
                    >

                        <Button
                            block
                            type="primary"

                            onClick={() => {
                                setForm({
                                    status: "Active"
                                });

                                setOpen(true);
                            }}

                            style={{
                                borderRadius: 8,
                                height: 40,
                                fontWeight: 600,
                                background: "#2563eb"
                            }}
                        >

                            + Add User

                        </Button>

                    </Col>

                </Row>


                {/* Table */}

                <Table
                    dataSource={users?.Results || []}
                    rowKey="key"

                    size="middle"

                    pagination={false}

                    scroll={{
                        x: "max-content"
                    }}

                    columns={[

                        {
                            title: "User",
                            key: "user",
                            width: 250,

                            render: (_, record: User) => (

                                <Space size="middle">

                                    <Avatar
                                        style={{
                                            backgroundColor: "#eff6ff",
                                            color: "#3b82f6"
                                        }}
                                    >
                                        {record?.full_name?.charAt(0) || "U"}
                                    </Avatar>

                                    <div>

                                        <div
                                            style={{
                                                fontWeight: 600
                                            }}
                                        >
                                            {record.full_name}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#64748b"
                                            }}
                                        >
                                            {record.user_email}
                                        </div>

                                    </div>

                                </Space>

                            )
                        },

                        {
                            title: "Role",
                            dataIndex: "role",
                            width: 120,

                            render: (r: string) => (
                                <Tag color={r === "Admin" ? "blue" : "blue"}>
                                    {r}
                                </Tag>
                            )
                        },

                        {
                            title: "Status",
                            dataIndex: "is_status",
                            width: 120,
                            render: (status: number) => (
                                <Tag color={status === 1 ? "green" : "red"}>
                                    {status === 1 ? "Active" : "Inactive"}
                                </Tag>
                            )
                        },

                        {
                            title: "Actions",
                            width: 160,
                            align: "right",

                            render: (_, record: User) => (

                                <Space>
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setSelectedUser(record);

                                            setForm({
                                                name: record.full_name,
                                                email: record.user_email,
                                                role: record.role,
                                                status:
                                                    Number(record.is_status) === 1
                                                        ? "Active"
                                                        : "Inactive",
                                            });

                                            setEditOpen(true);
                                        }}
                                        style={{
                                            background: "#f0f7ff",
                                            border: "1px solid #d6e4ff",
                                            color: "#1677ff",
                                            borderRadius: 8,
                                            fontWeight: 500,
                                            boxShadow: "none",
                                        }}
                                    >
                                        Edit
                                    </Button>


                                </Space>

                            )
                        }

                    ]}
                />

            </Space>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>

                <AppPagination
                    totalRecords={users?.totalResults || 0}
                    onChange={handlePagination}
                />
            </div>
            <Modal
                open={open}
                title="Create User"
                onCancel={() => setOpen(false)}
                onOk={handleAdd}
            >
                <FormUI
                    form={form}
                    setForm={setForm}
                    userMails={UserMail}
                />
            </Modal>

            <Modal
                open={editOpen}
                title="Edit User"
                onCancel={() => setEditOpen(false)}
                onOk={handleUpdate}
            >
                <FormUI
                    form={form}
                    setForm={setForm}
                    userMails={UserMail}
                />
            </Modal>
        </>
    );
};

const FormUI = ({ form, setForm, userMails }: any) => (
    <Form layout="vertical">
        <Form.Item label="Full Name">
            <Input
                value={form.name}
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value,
                    })
                }
            />
        </Form.Item>

        <Form.Item label="Email">
            <Select
                showSearch
                allowClear
                placeholder="Select Email"
                value={form.email}
                optionFilterProp="label"
                filterOption={(input, option) =>
                    String(option?.label || "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
                onChange={(v) =>
                    setForm({
                        ...form,
                        email: v,
                    })
                }
                options={Array.from(
                    new Set(
                        (userMails || [])
                            .map((item: any) => item?.user_mail)
                            .filter(Boolean)
                    )
                ).map((email) => ({
                    label: email,
                    value: email,
                }))}
            />
        </Form.Item>

        <Form.Item label="Role">
            <Select
                value={form.role}
                onChange={(v) =>
                    setForm({
                        ...form,
                        role: v,
                    })
                }
            >
                <Option value="Admin">Admin</Option>
                <Option value="Developer">Developer</Option>
                <Option value="Tester">Tester</Option>
            </Select>
        </Form.Item>

        <Form.Item label="Status">
            <Switch
                checked={form.status === "Active"}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                onChange={(checked) =>
                    setForm({
                        ...form,
                        status: checked ? "Active" : "Inactive",
                    })
                }
            />
        </Form.Item>
    </Form>
);

export default UsersPage;