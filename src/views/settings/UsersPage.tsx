import {
    Avatar,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
} from "antd";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserCreate, UserDelete, UserEdit, UserGet, UserMailGet } from "../../redux/services/settings/userService";


const { Option } = Select;

interface User {
    key: number;
    name: string;
    role: string;
    email?: string;
    status?: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const dispatch = useAppDispatch();

    const { auth } = useAppSelector((state) => state.auth);
    const { UserMail } = useAppSelector((state) => state.user);

    const [fetching, setFetching] = useState(false);

    const [filterField, setFilterField] = useState<string>("All");
    const [filterValue, setFilterValue] = useState("");

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [form, setForm] = useState<any>({});
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = (
        filterFieldParam = "All",
        filterValueParam = ""
    ) => {
        setFetching(true);

        const payload = {
            search_by_filter: filterFieldParam,
            search: filterValueParam,
        };

        dispatch(
            UserGet({
                payload,
                pagination: { page: 1, limit: 100 },
            })
        ).then((res: any) => {
            setFetching(false);

            const data =
                res.payload?.Results ||
                (Array.isArray(res.payload) ? res.payload[0] : []);

            if (Array.isArray(data)) {
                const fetchedUsers = data.map((u: any, idx: number) => ({
                    key: u.user_id || u.id || idx,
                    name: u.full_name || u.name,
                    role: u.role || "User",
                    email: u.user_email || u.email,
                    status:
                        u.is_status === 1 ||
                            u.is_status === "1" ||
                            u.Status === true ||
                            u.Status === "true" ||
                            u.status === "Active"
                            ? "Active"
                            : "Inactive",
                }));

                setUsers(fetchedUsers);
            } else {
                setUsers([]);
            }
        });
    };

    const fetchUserMails = () => {
        dispatch(UserMailGet({}));
    };

    useEffect(() => {
        fetchUsers(filterField, filterValue);
        fetchUserMails();
    }, [dispatch, filterField, filterValue]);

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
                fetchUsers(filterField, filterValue);

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
                fetchUsers(filterField, filterValue);

                setEditOpen(false);
                setForm({});
            }
        });
    };

    const handleDelete = (userId: string | number) => {
        dispatch(UserDelete({ user_id: userId })).then((res: any) => {
            if (res.payload?.Response_Status === "Success") {
                fetchUsers(filterField, filterValue);
            }
        });
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
                                { label: "Status", value: "status" }
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
                    dataSource={users}
                    rowKey="key"
                    loading={fetching}

                    size="middle"

                    pagination={{
                        pageSize: 10,
                        responsive: true
                    }}

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
                                        {record.name.charAt(0)}
                                    </Avatar>

                                    <div>

                                        <div
                                            style={{
                                                fontWeight: 600
                                            }}
                                        >
                                            {record.name}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#64748b"
                                            }}
                                        >
                                            {record.email}
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
                                <Tag color={r === "Admin" ? "blue" : "default"}>
                                    {r}
                                </Tag>
                            )
                        },

                        {
                            title: "Status",
                            dataIndex: "status",
                            width: 120
                        },

                        {
                            title: "Actions",
                            width: 160,
                            align: "right",

                            render: (_, record: User) => (

                                <Space>

                                    <Button
                                        size="small"
                                        type="text"

                                        onClick={() => {
                                            setSelectedUser(record);
                                            setForm(record);
                                            setEditOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>


                                    <Popconfirm
                                        title="Delete this user?"
                                        onConfirm={() =>
                                            handleDelete(record.key)
                                        }
                                    >

                                        <Button
                                            size="small"
                                            danger
                                            type="text"
                                        >
                                            Delete
                                        </Button>

                                    </Popconfirm>

                                </Space>

                            )
                        }

                    ]}
                />

            </Space>

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
                value={form.email}
                onChange={(v) =>
                    setForm({
                        ...form,
                        email: v,
                    })
                }
                options={(userMails || []).map((item: any) => {
                    const email = typeof item === "string" ? item : item.user_mail || item.user_email || item.email;
                    return {
                        label: email,
                        value: email,
                    };
                })}
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