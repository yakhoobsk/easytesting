import {
  Card,
  Tabs,
  Input,
  Button,
  Select,
  Switch,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Typography,
  Avatar,
} from "antd"
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UserGet, UserCreate, UserEdit, UserMailGet } from "../redux/services/settings/userService";

const { TabPane } = Tabs;
const { Option } = Select;
const { Text } = Typography;

/* ✅ TYPE */
interface User {
  key: number;
  name: string;
  role: string;
  email?: string;
  status?: string;
}

interface Environment {
  key: string;
  name: string;
}
const Dummy = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userMails, setUserMails] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state.auth);
  const [fetching, setFetching] = useState(false);

  const [filterField, setFilterField] = useState<string>("All");
  const [filterValue, setFilterValue] = useState("");

  const fetchUsers = (filterFieldParam = "All", filterValueParam = "") => {
    setFetching(true);
    const payload = {
      search_by_filter: filterFieldParam,
      search: filterValueParam
    };
    dispatch(UserGet({ payload, pagination: { page: 1, limit: 100 } })).then((res: any) => {
      setFetching(false);
      const data = res.payload?.Results || (Array.isArray(res.payload) ? res.payload[0] : []);

      if (Array.isArray(data)) {
        const fetchedUsers = data.map((u: any, idx: number) => ({
          key: u.user_id || u.id || idx,
          name: u.full_name || u.name,
          role: u.role || "User",
          email: u.user_email || u.email,
          status: (u.is_status === 1 || u.is_status === "1" || u.Status === true || u.Status === "true" || u.status === "Active") ? "Active" : "Inactive",
        }));
        setUsers(fetchedUsers);
      } else {
        setUsers([]);
      }
    });
  };

  const fetchUserMails = () => {
    dispatch(UserMailGet({})).then((res: any) => {
      if (res.payload && Array.isArray(res.payload)) {
        // Assuming response is an array of emails or objects with user_email/email
        const emails = res.payload.map((item: any) =>
          typeof item === "string" ? item : item.user_mail || item.user_email || item.email
        ).filter(Boolean);
        setUserMails(emails);
      }
    });
  };

  useEffect(() => {
    fetchUsers(filterField, filterValue);
    fetchUserMails();
  }, [dispatch, filterField, filterValue]);

  const [environments] = useState<Environment[]>([
    { key: "1", name: "3_Boomi_Cloud_ESI_Test" },
    { key: "2", name: "4_Boomi_Cloud_ESI_Prod" },
    { key: "3", name: "5_MDM_Cloud" },
    { key: "4", name: "MQTT" },
    { key: "5", name: "2_ESI_Production" },
    { key: "6", name: "1_ESI_QA" },
    { key: "7", name: "Z_ESI_AI_Alerting" },
    { key: "8", name: "ZZ_ConnectorTestEnv" },
    { key: "9", name: "OnlyForSDK" },
    { key: "10", name: "Molecule_Test" },
    { key: "11", name: "OT_GROUP_POC" },
  ]);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /* 🔥 ADD USER */
  const handleAdd = () => {
    const currentUserEmail = auth?.user_email || (Array.isArray(auth) && auth[0]?.[0]?.user_email) || "admin@company.com";

    const payload = {
      full_name: form.name,
      user_email: form.email,
      role: form.role,
      Status: form.status === "Active",
      created_by: currentUserEmail
    };

    dispatch(UserCreate({ payload })).then((res: any) => {
      if (res.payload?.Response_Status === "Success") {
        fetchUsers(filterField, filterValue);
        setOpen(false);
        setForm({});
      }
    });
  };

  /* 🔥 UPDATE USER */
  const handleUpdate = () => {
    if (!selectedUser) return;

    const currentUserEmail = auth?.user_email || (Array.isArray(auth) && auth[0]?.[0]?.user_email) || "admin@company.com";

    const payload = {
      full_name: form.name,
      user_email: form.email,
      role: form.role,
      updated_by: currentUserEmail
    };

    dispatch(UserEdit(payload)).then((res: any) => {
      if (res.payload?.Response_Status === "Success") {
        fetchUsers(filterField, filterValue);
        setEditOpen(false);
        setForm({});
      }
    });
  };

  /* 🔥 DELETE USER */


  return (
    <div style={{ padding: "24px 40px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32 }}>
        <Typography.Title level={2} style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>Settings</Typography.Title>
        <Text type="secondary">Manage your users, environments, and integrations</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Tabs
          defaultActiveKey="1"
          size="large"
          tabBarStyle={{ marginBottom: 32, borderBottom: "1px solid #f1f5f9" }}
        >
          {/* 🔷 USERS */}
          <TabPane tab="Users" key="1">
            <div className="fade-in">
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space size="middle">
                    <Select
                      placeholder="Filter By"
                      style={{ width: 180 }}
                      value={filterField}
                      onChange={setFilterField}
                      options={[
                        { label: "All", value: "All" },
                        { label: "Name", value: "full_name" },
                        { label: "Email", value: "user_email" },
                        { label: "Role", value: "role" },
                        { label: "Status", value: "status" },
                      ]}
                    />
                    <Input
                      placeholder="Search query..."
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      prefix={<i className="anticon anticon-search" style={{ color: "#94a3b8" }} />}
                      style={{ width: 300, borderRadius: 8 }}
                    />
                  </Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setForm({ status: "Active" });
                      setOpen(true);
                    }}
                    style={{ borderRadius: 8, height: 40, fontWeight: 600, background: "#2563eb" }}
                  >
                    + Add User
                  </Button>
                </div>

                <Table
                  dataSource={users}
                  rowKey="key"
                  loading={fetching}
                  pagination={{ pageSize: 10 }}
                  style={{ border: "1px solid #f1f5f9", borderRadius: 12, overflow: "hidden" }}
                  columns={[
                    {
                      title: "User",
                      key: "user",
                      render: (_, record) => (
                        <Space size="middle">
                          <Avatar
                            style={{ backgroundColor: "#eff6ff", color: "#3b82f6" }}
                          >
                            {record.name.charAt(0)}
                          </Avatar>
                          <div>
                            <div style={{ fontWeight: 600, color: "#1e293b" }}>{record.name}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{record.email}</div>
                          </div>
                        </Space>
                      )
                    },
                    {
                      title: "Role",
                      dataIndex: "role",
                      render: (r: string) => (
                        <Tag
                          color={r === "Admin" ? "blue" : "default"}
                          style={{ borderRadius: 6, fontWeight: 500, padding: "2px 10px", border: "none", background: r === "Admin" ? "#dbeafe" : "#f1f5f9", color: r === "Admin" ? "#1e40af" : "#475569" }}
                        >
                          {r}
                        </Tag>
                      ),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      render: (s: string) => (
                        <Space size={6}>
                          <span style={{
                            height: 8,
                            width: 8,
                            borderRadius: "50%",
                            background: s === "Active" ? "#10b981" : "#94a3b8",
                            display: "inline-block"
                          }}></span>
                          <span style={{ color: s === "Active" ? "#10b981" : "#64748b", fontWeight: 500 }}>{s}</span>
                        </Space>
                      )
                    },
                    {
                      title: "Actions",
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
                            style={{ color: "#3b82f6", fontWeight: 600 }}
                          >
                            Edit
                          </Button>

                        </Space>
                      ),
                    },
                  ]}
                />
              </Space>
            </div>
          </TabPane>

          {/* 🔷 ENVIRONMENTS */}
          <TabPane tab="Environments" key="3">
            <div className="fade-in">
              <Table
                dataSource={environments}
                rowKey="key"
                pagination={false}
                style={{ border: "1px solid #f1f5f9", borderRadius: 12, overflow: "hidden" }}
                columns={[
                  {
                    title: "Environment",
                    dataIndex: "name",
                    key: "name",
                    render: (text) => <Text strong style={{ color: "#334155" }}>{text}</Text>
                  },
                ]}
              />
            </div>
          </TabPane>

          <TabPane tab="ITSM Connectors" key="4">
            <Row gutter={[24, 24]} style={{ padding: 24 }}>
              {/* Jira Tickets */}
              <Col span={12}>
                <Card
                  style={{ borderRadius: 8, border: "1px solid #f0f0f0" }}
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text strong style={{ fontSize: 16 }}>Jira-Tickets</Text>
                      <Switch defaultChecked size="small" />
                    </div>
                  }
                >
                  <Form layout="vertical">
                    <Form.Item label="instance_url">
                      <Input placeholder="https://praveenreddy417.atlassian.net" style={{ borderRadius: 4 }} />
                    </Form.Item>
                    <Form.Item label="Username">
                      <Input placeholder="praveenreddy417@gmail.com" style={{ borderRadius: 4 }} />
                    </Form.Item>
                    <Form.Item label="API Token">
                      <Input.Password placeholder="••••••••••••" style={{ borderRadius: 4 }} />
                    </Form.Item>
                    <div style={{ marginTop: 16 }}>
                      <Button type="primary" style={{ borderRadius: 6, background: "#0050b3", padding: "0 20px" }}>
                        Save Jira
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>

              {/* Esi Tickets */}
              <Col span={12}>
                <Card
                  style={{ borderRadius: 8, border: "1px solid #f0f0f0" }}
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text strong style={{ fontSize: 16 }}>Esi-Tickets</Text>
                      <Switch defaultChecked size="small" />
                    </div>
                  }
                >
                  <Form layout="vertical">
                    <Form.Item label="Instance URL">
                      <Input placeholder="https://esiservice.easystepin.com" style={{ borderRadius: 4 }} />
                    </Form.Item>
                    <Form.Item label="Username">
                      <Input placeholder="praveen.bhima@easystepin.com" style={{ borderRadius: 4 }} />
                    </Form.Item>
                    <Form.Item label="API Token">
                      <Input.Password placeholder="••••••••••••" style={{ borderRadius: 4 }} />
                    </Form.Item>
                    <div style={{ marginTop: 16 }}>
                      <Button type="primary" style={{ borderRadius: 6, background: "#0050b3", padding: "0 20px" }}>
                        Save Esi
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 🔷 EMAIL NOTIFICATIONS */}
          <TabPane tab="Email Notifications" key="5">
            <Space direction="vertical" style={{ padding: 20 }}>
              <div>
                Email Alerts <Switch defaultChecked />
              </div>
              <div>
                Failure Alerts <Switch defaultChecked />
              </div>
            </Space>
          </TabPane>



        </Tabs>
      </Card>

      {/* ADD USER MODAL */}
      <Modal
        open={open}
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Create User</span>}
        onCancel={() => setOpen(false)}
        onOk={handleAdd}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ style: { background: "#0050b3", borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
      >
        <div style={{ paddingTop: 10 }}>
          <FormUI form={form} setForm={setForm} userMails={userMails} />
        </div>
      </Modal>

      <Modal
        open={editOpen}
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Edit User</span>}
        onCancel={() => setEditOpen(false)}
        onOk={handleUpdate}
        okText="Update"
        cancelText="Cancel"
        okButtonProps={{ style: { background: "#0050b3", borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
      >
        <div style={{ paddingTop: 10 }}>
          <FormUI form={form} setForm={setForm} userMails={userMails} />
        </div>
      </Modal>
    </div>
  );
};

/* 🔥 REUSABLE FORM */
const FormUI = ({ form, setForm, userMails }: any) => (
  <Form layout="vertical">
    <Form.Item label={<span style={{ fontWeight: 500 }}>Full Name</span>}>
      <Input
        placeholder="Enter full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ borderRadius: 6, padding: "8px 12px" }}
      />
    </Form.Item>

    <Form.Item label={<span style={{ fontWeight: 500 }}>Email</span>}>
      <Select
        showSearch
        placeholder="Select email"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
        style={{ width: "100%" }}
        filterOption={(input, option) =>
          String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={(userMails || []).map((email: string) => ({ label: email, value: email }))}
      />
    </Form.Item>

    <Form.Item label={<span style={{ fontWeight: 500 }}>Role</span>}>
      <Select
        placeholder="Select role"
        value={form.role}
        onChange={(v) => setForm({ ...form, role: v })}
        style={{ width: "100%" }}
      >
        <Option value="Admin">Admin</Option>
        <Option value="Developer">Developer</Option>
        <Option value="Tester">Tester</Option>
        <Option value="Auditor">Auditor</Option>
        <Option value="Release Engineer">Release Engineer</Option>
      </Select>
    </Form.Item>

    <Form.Item label={<span style={{ fontWeight: 500 }}>Status</span>}>
      <Switch
        checkedChildren="Active"
        unCheckedChildren="Inactive"
        checked={form.status === "Active"}
        onChange={(checked) => setForm({ ...form, status: checked ? "Active" : "Inactive" })}
        style={{ background: form.status === "Active" ? "#0050b3" : undefined }}
      />
    </Form.Item>
  </Form>
);

export default Dummy;
