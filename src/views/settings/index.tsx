import { Card, Tabs, Typography } from "antd";
import { useSearchParams } from "react-router-dom";

import UsersPage from "./UsersPage";
import EnvironmentsPage from "./EnvironmentsPage";
import ITSMConnectorsPage from "./ITSMConnectorsPage";
import EmailNotificationsPage from "./EmailNotificationsPage";
import StatusRange from "./percentagePage";

const { Text } = Typography;

const Settingspage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab =
        searchParams.get("tab") || "users";

    const handleTabChange = (key: string) => {
        setSearchParams({ tab: key });
    };

    return (
        <div
            style={{
                padding: "24px 40px",
                background: "#f8fafc",
                minHeight: "100vh",
            }}
        >
            <div style={{ marginBottom: 32 }}>
                <Typography.Title
                    level={2}
                    style={{
                        margin: 0,
                        color: "#0f172a",
                        fontWeight: 700,
                    }}
                >
                    Settings
                </Typography.Title>

                <Text type="secondary">
                    Manage your users, environments, folders and integrations
                </Text>
            </div>

            <Card
                bordered={false}
                style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    size="large"
                >
                    <Tabs.TabPane tab="Users" key="users">
                        <UsersPage />
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab="Status Configuration"
                        key="status"
                    >
                        <StatusRange />
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab="Environments"
                        key="environments"
                    >
                        <EnvironmentsPage />
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab="ITSM Connectors"
                        key="itsm"
                    >
                        <ITSMConnectorsPage />
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab="Email Notifications"
                        key="email"
                    >
                        <EmailNotificationsPage />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default Settingspage;