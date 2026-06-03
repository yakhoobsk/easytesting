import {
    Layout,
    Menu,
    Avatar,
    Typography,
    Grid,
    Drawer,
    Button,
    Space,

} from "antd";

import {
    DashboardOutlined,
    DeploymentUnitOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    EditOutlined,
    FileSearchOutlined,
    RobotOutlined,
    // FileSearchOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode, ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Logout } from "../redux/services/settings/logoutServices";
import { clearAuth } from "../redux/slices/authSlice";
import { UserProfileGet } from "../redux/services/settings/userService";
import logo from "../assets/logocomany.png";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface Props {
    children: ReactNode;
}



export default function MainLayout({ children }: Props): ReactElement {
    const navigate = useNavigate();
    const location = useLocation();
    const screens = useBreakpoint();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = screens.xs && !screens.sm;

    const isTablet = (screens.sm || screens.md) && !screens.lg;

    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth.auth);
    const { UserProfileData } = useAppSelector((state) => state.user);

    const profile = Array.isArray(UserProfileData) ? UserProfileData[0]?.[0] : UserProfileData;

    useEffect(() => {
        const userEmail = auth?.user_email || (Array.isArray(auth) && auth[0]?.[0]?.user_email);
        if (userEmail && !profile) {
            dispatch(UserProfileGet({ User_Email: userEmail }));
        }
    }, [dispatch, auth, profile]);
    const handleLogout = () => {
        const payload = {
            user_email: auth?.user_email || ""
        };

        const log = {
            Time: new Date().toISOString(),
            User: auth?.user_name || "User",
            User_Email: auth?.user_email || ""
        };

        dispatch(Logout({
            payload,
            navigate,
            clearAuthAction: clearAuth,
            log
        }));
    };



    const menuItems = [
        { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
        { key: "/test-execution", icon: <DeploymentUnitOutlined />, label: "Test Execution" },
        { key: "/payload-store", icon: <FileTextOutlined />, label: "Payload Store" },
        { key: "/ai-testcase", icon: <RobotOutlined />, label: "AI Test Cases" },
        { key: "/results-page", icon: <CheckCircleOutlined />, label: "Results" },
        // { key: "/tickets-page", icon: <ExclamationCircleOutlined />, label: "Tickets" },
        { key: "/audit-logs", icon: <FileSearchOutlined />, label: "Audit Logs" },
        { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    ];

    const SidebarContent = (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",

            }}
        >
            {/* 🔷 Logo */}
            <div
                style={{
                    padding: "18px 16px",
                    margin: "10px",
                    borderRadius: 14,

                    background:
                        "linear-gradient(135deg,#1D4ED8,#2563EB)",

                    border:
                        "1px solid rgba(255,255,255,.12)",

                    boxShadow:
                        "0 8px 24px rgba(0,0,0,.15)",

                    cursor: "pointer",

                    textAlign:
                        collapsed ? "center" : "left",
                }}
                onClick={() => navigate("/")}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        justifyContent:
                            collapsed
                                ? "center"
                                : "flex-start",
                    }}
                >
                    {/* Logo Circle */}
                    <img
                        src={logo}   // put image inside public/logo.png
                        alt="EasyTesting"
                        style={{
                            width: 42,
                            height: 42,

                            borderRadius: 10,
                            objectFit: "contain",

                            background: "#fff",
                            padding: 4,

                            boxShadow:
                                "0 4px 12px rgba(0,0,0,.12)",
                        }}
                    />

                    {!collapsed && (
                        <div>
                            <Title
                                level={5}
                                style={{
                                    margin: 0,
                                    color: "#fff",
                                    fontWeight: 700,
                                }}
                            >
                                EasyTesting
                            </Title>

                            <Text
                                style={{
                                    fontSize: 11,
                                    color:
                                        "rgba(255,255,255,.75)",
                                }}
                            >
                                AI Testing Platform
                            </Text>
                        </div>
                    )}
                </div>
            </div>


            {/* 🔷 Menu */}
            <div
                style={{
                    padding: "0 10px",
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                }}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={(e) => {
                        navigate(e.key);
                        setMobileOpen(false);
                    }}
                    items={menuItems}
                    style={{
                        borderRight: "none",
                        flex: 1,
                        background: "transparent",
                    }}
                />
            </div>

            {/* 🔷 User Section */}
            <div
                style={{
                    marginTop: "auto",
                    padding: 12,
                    flexShrink: 0,

                    borderTop:
                        "1px solid rgba(255,255,255,.15)",

                    background:
                        "rgba(255,255,255,.03)"
                }}
            >
                {!collapsed ? (
                    <Space
                        style={{
                            cursor: "pointer",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                        onClick={() => navigate("/profile")}
                    >
                        {/* Avatar */}
                        <div
                            style={{
                                position: "relative",
                                flexShrink: 0,

                            }}
                        >
                            <Avatar size={42}>
                                {(profile?.First_name?.[0] || auth?.user_name?.[0])?.toUpperCase()}
                            </Avatar>

                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 4,
                                    right: -2,

                                    width: 18,
                                    height: 18,

                                    borderRadius: "50%",
                                    background: "#2563EB",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    border: "2px solid #0F52BA",
                                }}
                            >
                                <EditOutlined
                                    style={{
                                        color: "#fff",
                                        fontSize: 9,
                                    }}
                                />
                            </div>
                        </div>

                        {/* User */}
                        <div
                            style={{
                                overflow: "hidden",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: 600,
                                    display: "block",
                                }}
                            >
                                {profile ? `${profile.First_name} ${profile.Last_name}` : (auth?.user_name || "User")}
                            </Text>

                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#CBD5E1",
                                }}
                            >
                                {profile?.Role || auth?.role || "QA Engineer"}
                            </Text>
                        </div>
                    </Space>
                ) : (
                    <div
                        onClick={() => navigate("/profile")}
                        style={{
                            position: "relative",
                            cursor: "pointer",
                            alignSelf: "center",
                        }}
                    >
                        <Avatar size={42}>
                            {(profile?.First_name?.[0] || auth?.user_name?.[0] || "U")?.toUpperCase()}
                        </Avatar>

                        <div
                            style={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,

                                width: 18,
                                height: 18,

                                borderRadius: "50%",
                                background: "#2563EB",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                border: "2px solid #0F52BA",
                            }}
                        >
                            <EditOutlined
                                style={{
                                    color: "#fff",
                                    fontSize: 9,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Logout */}
                <Button
                    block
                    onClick={handleLogout}
                    style={{
                        height: 40,

                        background: "#EF4444",
                        border: "none",

                        color: "#fff",
                        fontWeight: 600,

                        borderRadius: 8,
                    }}
                >
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <Layout style={{ height: "100vh" }}>

            {/* Sidebar */}
            {!isMobile && (
                <Sider
                    width={260}
                    collapsible
                    collapsed={
                        screens.md && !screens.lg
                            ? false      // md shows names
                            : collapsed
                    }

                    trigger={null}
                    style={{
                        background: "#0F52BA",
                        borderRight: "1px solid #2E6FD1",
                        height: "100vh",
                    }}
                >
                    {!isTablet && (
                        <div style={{ padding: 10 }}>
                            <Button
                                type="text"
                                icon={
                                    collapsed
                                        ?
                                        <MenuUnfoldOutlined />
                                        :
                                        <MenuFoldOutlined />
                                }

                                onClick={() =>
                                    setCollapsed(
                                        !collapsed
                                    )
                                }
                                style={{ color: "#fff" }}
                            />
                        </div>
                    )}
                    {SidebarContent}
                </Sider>
            )}

            {/* Mobile */}
            {isMobile && (
                <Drawer
                    placement="left"
                    width={260}
                    open={mobileOpen}

                    onClose={() =>
                        setMobileOpen(false)
                    }

                    styles={{
                        body: {
                            padding: 0,
                            background: "#0F52BA"
                        }
                    }}
                >
                    {SidebarContent}
                </Drawer>
            )}

            {/* Content */}
            <Layout>
                <Content
                    style={{

                        borderRadius: 12,

                        overflowY: "auto",
                    }}
                >
                    {isMobile && (

                        <Button
                            icon={<MenuUnfoldOutlined />}
                            type="text"

                            onClick={() =>
                                setMobileOpen(true)
                            }

                            style={{
                                margin: 10
                            }}
                        />

                    )}
                    {children}
                </Content>
            </Layout>

            {/* Menu Styling */}
            <style>
                {`
.ant-menu {
   background: transparent !important;
}

.ant-menu-item {
    border-radius: 10px !important;
    margin: 6px 0 !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
    width: 100% !important;

    color: rgba(255,255,255,.85) !important;

    transition: all .2s ease;
}

.ant-menu-item:hover {
    background: rgba(255,255,255,.12) !important;
    color: #fff !important;
}

.ant-menu-item-selected {
    background: #FFFFFF !important;

    color: #0F52BA !important;

    font-weight: 700 !important;

    box-shadow:
      0 4px 12px rgba(0,0,0,.08);
}

.ant-menu-item-selected .ant-menu-item-icon,
.ant-menu-item-selected svg {
     color:#0F52BA !important;
}

.ant-menu-item-icon,
.ant-menu-item svg{
     color:rgba(255,255,255,.85);
}

.ant-menu-item:hover .ant-menu-item-icon,
.ant-menu-item:hover svg{
     color:#fff;
}
`}
            </style>
        </Layout>
    );
}