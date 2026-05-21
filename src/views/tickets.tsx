import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";

interface Ticket {
  key: number;
  title: string;
  status: string;
  priority: string;
  assignedTo: string;
}

const Tickets: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [form, setForm] = useState<any>({});
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [filterField, setFilterField] = useState<string>("");
  const [filterValue, setFilterValue] = useState("");

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      key: 1,
      title: "Payment API Failure",
      status: "Open",
      priority: "High",
      assignedTo: "John",
    },
    {
      key: 2,
      title: "Login Issue",
      status: "In Progress",
      priority: "Medium",
      assignedTo: "David",
    },
  ]);

  const statusColor: any = {
    Open: "red",
    "In Progress": "orange",
    Closed: "green",
  };

  const priorityColor: any = {
    High: "red",
    Medium: "orange",
    Low: "blue",
  };

  // ✅ FILTER LOGIC
  const filteredData = useMemo(() => {
    if (!filterField || !filterValue) return tickets;

    return tickets.filter((item: any) =>
      item[filterField]
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  }, [filterField, filterValue, tickets]);

  // ✅ ADD
  const handleAdd = () => {
    setTickets([...tickets, { key: Date.now(), ...form }]);
    setOpen(false);
    setForm({});
  };

  // ✅ UPDATE
  const handleUpdate = () => {
    const updated = tickets.map((t) =>
      t.key === selectedTicket?.key ? { ...t, ...form } : t
    );

    setTickets(updated);
    setUpdateOpen(false);
    setForm({});
  };

  const columns: ColumnsType<Ticket> = [
    { title: "Title", dataIndex: "title" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (p: string) => <Tag color={priorityColor[p]}>{p}</Tag>,
    },
    { title: "Assigned To", dataIndex: "assignedTo" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedTicket(record);
              setViewOpen(true);
            }}
          >
            View
          </Button>

          <Button
            size="small"
            onClick={() => {
              setSelectedTicket(record);
              setForm(record);
              setUpdateOpen(true);
            }}
          >
            Update
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#f5f7fb" }}>
      
      {/* HEADER */}
      <Card style={{ marginBottom: 12 }}>
        <Row justify="space-between">
          <Col><h3>Tickets</h3></Col>
          <Col>
            <Button type="primary" onClick={() => setOpen(true)}>
              + Create Ticket
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 🔥 FILTER UI */}
      <Card style={{ marginBottom: 12 }}>
        <Space>
          <Select
            placeholder="Select field"
            style={{ width: 180 }}
            value={filterField || undefined}
            onChange={(val: any) => {
              setFilterField(val);
              setFilterValue("");
            }}
            allowClear
            options={[
              { label: "Title", value: "title" },
              { label: "Status", value: "status" },
              { label: "Priority", value: "priority" },
              { label: "Assigned To", value: "assignedTo" },
            ]}
          />

          <Input
            placeholder={`Search ${filterField || "value"}`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ width: 200 }}
          />
        </Space>
      </Card>

      {/* TABLE */}
      <Card>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
        />
      </Card>

      {/* CREATE */}
      <Modal open={open} onCancel={() => setOpen(false)} onOk={handleAdd} title="Create Ticket">
        <FormUI form={form} setForm={setForm} />
      </Modal>

      {/* VIEW */}
      <Modal open={viewOpen} onCancel={() => setViewOpen(false)} footer={null} title="View Ticket">
        {selectedTicket && (
          <>
            <p><b>Title:</b> {selectedTicket.title}</p>
            <p><b>Status:</b> {selectedTicket.status}</p>
            <p><b>Priority:</b> {selectedTicket.priority}</p>
            <p><b>Assigned To:</b> {selectedTicket.assignedTo}</p>
          </>
        )}
      </Modal>

      {/* UPDATE */}
      <Modal open={updateOpen} onCancel={() => setUpdateOpen(false)} onOk={handleUpdate} title="Update Ticket">
        <FormUI form={form} setForm={setForm} />
      </Modal>
    </div>
  );
};

// 🔥 FORM
const FormUI = ({ form, setForm }: any) => (
  <Space direction="vertical" style={{ width: "100%" }}>
    <Input
      placeholder="Title"
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
    />

    <Select
      placeholder="Status"
      value={form.status}
      onChange={(v) => setForm({ ...form, status: v })}
      style={{ width: "100%" }}
      options={[
        { label: "Open", value: "Open" },
        { label: "In Progress", value: "In Progress" },
        { label: "Closed", value: "Closed" },
      ]}
    />

    <Select
      placeholder="Priority"
      value={form.priority}
      onChange={(v) => setForm({ ...form, priority: v })}
      style={{ width: "100%" }}
      options={[
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" },
      ]}
    />

    <Input
      placeholder="Assigned To"
      value={form.assignedTo}
      onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
    />
  </Space>
);

export default Tickets;