"use client";

import { useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Typography,
  Statistic,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useHospitalData } from "../hooks/useHospitalData";
import RecordForm from "./RecordForm";
import type {
  FieldConfig,
  FieldValue,
  HospitalRecord,
  ModuleName,
} from "../types/hospital";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const settings: Record<
  ModuleName,
  { title: string; fields: FieldConfig[] }
> = {
  patients: {
    title: "Patients",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "age", label: "Age", type: "number", required: true },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: ["Male", "Female", "Other"],
      },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: true },
    ],
  },

  doctors: {
    title: "Doctors",
    fields: [
      { name: "name", label: "Doctor Name", type: "text", required: true },
      {
        name: "specialty",
        label: "Specialty",
        type: "select",
        required: true,
        options: ["Cardiology", "Pediatrics", "Neurology", "General Medicine"],
      },
      { name: "phone", label: "Phone", type: "tel", required: true },
      {
        name: "available",
        label: "Availability",
        type: "select",
        required: true,
        options: ["Yes", "No"],
      },
    ],
  },

  appointments: {
    title: "Appointments",
    fields: [
      { name: "patient", label: "Patient Name", type: "text", required: true },
      { name: "doctor", label: "Doctor Name", type: "text", required: true },
      { name: "date", label: "Appointment Date", type: "date", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: ["Scheduled", "Completed", "Cancelled"],
      },
    ],
  },

  billing: {
    title: "Billing",
    fields: [
      { name: "patient", label: "Patient Name", type: "text", required: true },
      { name: "amount", label: "Amount (₹)", type: "number", required: true },
      {
        name: "status",
        label: "Payment Status",
        type: "select",
        required: true,
        options: ["Paid", "Pending"],
      },
    ],
  },

  beds: {
    title: "Beds & Wards",
    fields: [
      {
        name: "ward",
        label: "Ward",
        type: "select",
        required: true,
        options: ["General", "ICU", "Private"],
      },
      { name: "bedNumber", label: "Bed Number", type: "text", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: ["Available", "Occupied", "Maintenance"],
      },
    ],
  },
};

type Page = ModuleName | "dashboard";

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "patients", icon: <TeamOutlined />, label: "Patients" },
  { key: "doctors", icon: <UserOutlined />, label: "Doctors" },
  { key: "appointments", icon: <CalendarOutlined />, label: "Appointments" },
  { key: "billing", icon: <DollarOutlined />, label: "Billing" },
  { key: "beds", icon: <HomeOutlined />, label: "Beds & Wards" },
];

export default function HospitalApp() {
  const { data, saveData, isSaving } = useHospitalData();
  const [page, setPage] = useState<Page>("dashboard");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HospitalRecord | undefined>();

  const stats = useMemo(
    () => [
      { title: "Patients", value: data.patients.length },
      { title: "Doctors", value: data.doctors.length },
      { title: "Appointments", value: data.appointments.length },
      {
        title: "Available Beds",
        value: data.beds.filter((bed) => bed.status === "Available").length,
      },
    ],
    [data],
  );

  const rows: HospitalRecord[] =
    page === "dashboard" ? [] : data[page];

  const filteredRows = useMemo(() => {
    const term = search.toLowerCase().trim();

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term),
      ),
    );
  }, [rows, search]);

  function openAddForm() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEditForm(row: HospitalRecord) {
    setEditing(row);
    setFormOpen(true);
  }

  function submitRecord(values: Record<string, FieldValue>) {
    if (page === "dashboard") return;

    const currentRows = data[page];
    const id = editing?.id ?? `${page}-${Date.now()}`;

    const record: HospitalRecord = { ...values, id };

    const nextRows = editing
      ? currentRows.map((row) => (row.id === id ? record : row))
      : [...currentRows, record];

    saveData({ ...data, [page]: nextRows });
    setFormOpen(false);
    setEditing(undefined);
    message.success(editing ? "Record updated" : "Record added");
  }

  function deleteRecord(id: string) {
    if (page === "dashboard") return;

    saveData({
      ...data,
      [page]: data[page].filter((row) => row.id !== id),
    });

    message.success("Record deleted");
  }

  const columns: ColumnsType<HospitalRecord> = useMemo(() => {
    if (page === "dashboard") return [];

    const keys = Array.from(
      new Set(rows.flatMap((row) => Object.keys(row))),
    ).filter((key) => key !== "id");

    return [
      ...keys.map((key) => ({
        title: key === "bedNumber"
          ? "Bed Number"
          : key.charAt(0).toUpperCase() + key.slice(1),
        dataIndex: key,
        key,
        render: (value: FieldValue) => {
          if (key === "status" || key === "available") {
            return <Tag color={value === "Paid" || value === "Available" || value === "Yes" || value === "Completed" ? "green" : "orange"}>{String(value)}</Tag>;
          }

          if (key === "amount") {
            return `₹${Number(value).toLocaleString("en-IN")}`;
          }

          return String(value ?? "");
        },
      })),
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space wrap>
            <Button
              icon={<EditOutlined />}
              onClick={() => openEditForm(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete this record?"
              description="This action cannot be undone."
              onConfirm={() => deleteRecord(record.id)}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  }, [page, rows]);

  return (
    <Layout className="app-layout">
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="brand">MediCare Admin</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          items={menuItems}
          onClick={({ key }) => {
            setPage(key as Page);
            setSearch("");
          }}
        />
      </Sider>

      <Layout>
        <Header className="top-header">
          Hospital Management System
        </Header>

        <Content className="main-content">
          {page === "dashboard" ? (
            <>
              <Title level={2}>Hospital Dashboard</Title>

              <Row gutter={[16, 16]}>
                {stats.map((item) => (
                  <Col xs={24} sm={12} lg={6} key={item.title}>
                    <Card>
                      <Statistic title={item.title} value={item.value} />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card title="Recent Appointments" className="section-card">
                <Table
                  rowKey="id"
                  dataSource={data.appointments}
                  pagination={{ pageSize: 5 }}
                  columns={[
                    { title: "Patient", dataIndex: "patient" },
                    { title: "Doctor", dataIndex: "doctor" },
                    { title: "Date", dataIndex: "date" },
                    { title: "Status", dataIndex: "status" },
                  ]}
                  scroll={{ x: true }}
                />
              </Card>
            </>
          ) : (
            <>
              <div className="page-heading">
                <Title level={2}>{settings[page].title}</Title>

                <Space wrap>
                  <Input
                    placeholder="Search records..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    allowClear
                  />

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddForm}
                  >
                    Add New
                  </Button>
                </Space>
              </div>

              <Card>
                <Table
                  rowKey="id"
                  dataSource={filteredRows}
                  columns={columns}
                  loading={isSaving}
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: true }}
                />
              </Card>

              <RecordForm
                open={formOpen}
                title={`${editing ? "Edit" : "Add"} ${settings[page].title}`}
                fields={settings[page].fields}
                initialValues={editing}
                loading={isSaving}
                onCancel={() => setFormOpen(false)}
                onSubmit={submitRecord}
              />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}