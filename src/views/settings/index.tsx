import { Card, Tabs, Typography } from "antd";
import UsersPage from "./UsersPage";
import EnvironmentsPage from "./EnvironmentsPage";
import ITSMConnectorsPage from "./ITSMConnectorsPage";
import EmailNotificationsPage from "./EmailNotificationsPage";


const { TabPane } = Tabs;
const { Text } = Typography;

const Settingspage = () => {
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
                    style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}
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
                    defaultActiveKey="1"
                    size="large"
                    tabBarStyle={{
                        marginBottom: 32,
                        borderBottom: "1px solid #f1f5f9",
                    }}
                >
                    <TabPane tab="Users" key="1">
                        <UsersPage />
                    </TabPane>

                    <TabPane tab="Environments" key="2">
                        <EnvironmentsPage />
                    </TabPane>

                    <TabPane tab="ITSM Connectors" key="4">
                        <ITSMConnectorsPage />
                    </TabPane>

                    <TabPane tab="Email Notifications" key="5">
                        <EmailNotificationsPage />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default Settingspage;