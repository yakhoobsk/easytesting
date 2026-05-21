import { Card, Row, Col, Avatar, Typography, Button, Space, Spin, Modal, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { UserProfileGet, UserProfileUpdate } from "../redux/services/settings/userService";
import { Logout } from "../redux/services/settings/logoutServices";
import { clearAuth } from "../redux/slices/authSlice";


const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state: any) => state.auth);

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchProfile = () => {
    const userEmail = auth?.user_email || (Array.isArray(auth) && auth[0]?.[0]?.user_email);
    if (userEmail) {
      setLoading(true);
      const payload = { User_Email: userEmail };
      dispatch(UserProfileGet(payload)).then((res: any) => {
        setLoading(false);
        if (res.payload && Array.isArray(res.payload) && res.payload.length > 0 && Array.isArray(res.payload[0]) && res.payload[0].length > 0) {
          setProfileData(res.payload[0][0]);
        } else if (res.payload && !Array.isArray(res.payload)) {
          setProfileData(res.payload);
        }
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch, auth]);

  const handleUpdate = (values: any) => {
    setUpdateLoading(true);
    const payload = {
      First_Name: values.First_Name,
      Last_Name: values.Last_Name,
      User_Email: profileData?.User_Email,
      Role: profileData?.Role
    };

    dispatch(UserProfileUpdate(payload)).then((res: any) => {
      setUpdateLoading(false);
      if (res.payload?.Response_Status === "Success") {
        setIsModalOpen(false);
        fetchProfile();
      }
    });
  };

  const openUpdateModal = () => {
    form.setFieldsValue({
      first_Name: profileData?.First_name,
      last_Name: profileData?.Last_name,
    });
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    const payload = {
      user_email: auth?.user_email || (Array.isArray(auth) && auth[0]?.[0]?.user_email) || ""
    };

    const log = {
      Time: new Date().toISOString(),
      User: auth?.user_name || "User",
      User_Email: payload.user_email
    };

    dispatch(Logout({
      payload,
      navigate,
      clearAuthAction: clearAuth,
      log
    }));
  };

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={14}>
        <Card style={{ borderRadius: 12, padding: "24px" }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                Profile
              </Title>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={openUpdateModal}>Update</Button>
                <Button onClick={() => navigate("/reset-password")}>Change Password</Button>
              </Space>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <Row gutter={[24, 24]} justify="center" align="middle">
              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                <Avatar size={140} style={{ backgroundColor: "#e6e6e6" }} icon={<UserOutlined />} />
              </Col>
              <Col xs={24} sm={16}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>First Name :</Text> <Text>{profileData?.First_name || "-"}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Last Name :</Text> <Text>{profileData?.Last_name || "-"}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Role Name :</Text> <Text>{profileData?.Role || "-"}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Email :</Text> <Text>{profileData?.User_Email || "-"}</Text>
                  </Col>
                </Row>
              </Col>

              <Col span={24} style={{ textAlign: "center", marginTop: 20 }}>
                <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                  Logout
                </Button>
              </Col>
            </Row>
          </Spin>
        </Card>
      </Col>

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="first_Name"
            label="First Name"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="last_Name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={updateLoading}>
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default ProfilePage;
