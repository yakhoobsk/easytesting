import { Card, Row, Col, Avatar, Typography, Button, Space, Spin, Modal, Form, Input, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { UserProfileGet, UserProfileUpdate } from "../redux/services/settings/userService";
import { Logout } from "../redux/services/settings/logoutServices";
import { clearAuth } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import { MailOutlined, SafetyOutlined } from "@ant-design/icons";

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

  const fetchProfile = (email?: string) => {
    const userEmail = email || auth?.user_email || (Array.isArray(auth) && auth[0]?.[0]?.user_email);
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

  const handleUpdate = async (values: any) => {
    try {
      setUpdateLoading(true);

      const payload = {
        first_Name: values.first_Name,
        last_Name: values.last_Name,
        User_Email: values.User_Email,
        Role: values.Role,
        Profile_Image: ""
      };

      await dispatch(UserProfileUpdate(payload)).unwrap();

      setIsModalOpen(false);
      fetchProfile(values.User_Email);

    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const openUpdateModal = () => {
    form.setFieldsValue({
      first_Name: profileData?.First_name,
      last_Name: profileData?.Last_name,
      User_Email: profileData?.User_Email,
      Role: profileData?.Role
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
    <Row
      justify="center"
      style={{
        padding: 20,
        minHeight: "100vh",
      }}
    >      <Col span={24}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <Card
            bordered={false}
            style={{
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0,0,0,.08)",
              width: "100%"
            }}
          >

            {/* Header */}

            <div
              style={{
                background: "linear-gradient(135deg,#1677ff,#69b1ff)",
                padding: 30,
                color: "#fff",
                margin: "-24px -24px 30px"
              }}
            >

              <Row
                justify="space-between"
                align="middle"
                gutter={[16, 16]}
              >

                <Col>
                  <Title
                    level={2}
                    style={{
                      color: "#fff",
                      margin: 0
                    }}
                  >
                    My Profile
                  </Title>

                  <Text style={{ color: "#e6f4ff" }}>
                    Manage account settings
                  </Text>
                </Col>


                <Col>

                  <Space wrap>

                    <Button
                      type="primary"
                      style={{ color: "#1677ff", background: "#e6f4ff", border: "none" }}
                      ghost

                      onClick={
                        openUpdateModal
                      }
                    >
                      Update Profile
                    </Button>


                    <Button
                      onClick={() =>
                        navigate(
                          "/reset-password"
                        )
                      }
                    >
                      Change Password
                    </Button>

                  </Space>

                </Col>

              </Row>

            </div>



            <Spin spinning={loading}>

              <Row
                gutter={[30, 30]}
                align="middle"
              >

                {/* Avatar */}

                <Col
                  xs={24}
                  md={8}
                  style={{
                    textAlign: "center"
                  }}
                >

                  <motion.div
                    whileHover={{
                      scale: 1.05
                    }}
                  >

                    <Avatar

                      size={150}

                      icon={<UserOutlined />}

                      style={{

                        background:
                          "#f0f5ff",

                        color:
                          "#1677ff",

                        border:
                          "6px solid #fff",

                        boxShadow:
                          "0 10px 30px rgba(0,0,0,.08)"

                      }}

                    />

                  </motion.div>


                  <Title
                    level={4}
                    style={{
                      marginTop: 16
                    }}
                  >

                    {
                      profileData?.First_name
                    }

                    {" "}

                    {
                      profileData?.Last_name
                    }

                  </Title>


                  <Tag color="blue">

                    {
                      profileData?.Role
                    }

                  </Tag>

                </Col>



                {/* Info */}

                <Col xs={24} md={16}>

                  <Row gutter={[16, 20]}>

                    <Col xs={24} sm={12}>
                      <Card size="small">
                        <UserOutlined /> First Name
                        <div>
                          {profileData?.First_name || "-"}
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Card size="small">
                        <UserOutlined /> Last Name
                        <div>
                          {profileData?.Last_name || "-"}
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Card size="small">
                        <SafetyOutlined /> Role
                        <div>
                          {profileData?.Role || "-"}
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Card size="small">
                        <MailOutlined /> Email
                        <div>
                          {profileData?.User_Email || "-"}
                        </div>
                      </Card>
                    </Col>

                  </Row>


                  <Button

                    danger

                    type="primary"

                    icon={<LogoutOutlined />}

                    onClick={
                      handleLogout
                    }

                    style={{
                      marginTop: 30,
                      borderRadius: 10
                    }}
                  >

                    Logout

                  </Button>

                </Col>

              </Row>

            </Spin>

          </Card>

        </motion.div>

      </Col>



      {/* Modal */}

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={() =>
          setIsModalOpen(false)
        }
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
            rules={[
              {
                required: true,
                message:
                  "Required"
              }
            ]}
          >

            <Input size="large" />

          </Form.Item>


          <Form.Item
            name="last_Name"
            label="Last Name"
            rules={[
              {
                required: true
              }
            ]}
          >

            <Input size="large" />

          </Form.Item>


          <Form.Item
            name="User_Email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email"
              }
            ]}
          >

            <Input size="large" />

          </Form.Item>


          <Form.Item
            name="Role"
            label="Role"
            rules={[
              {
                required: true
              }
            ]}
          >

            <Input size="large" />

          </Form.Item>


          <Button
            block

            type="primary"

            htmlType="submit"

            loading={
              updateLoading
            }
          >

            Save Changes

          </Button>

        </Form>

      </Modal>

    </Row>
  );
};

export default ProfilePage;