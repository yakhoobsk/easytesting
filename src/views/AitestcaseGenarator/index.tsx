import { Card, Tabs, Typography } from "antd";
import { useSearchParams } from "react-router-dom";
import AITestCases from "./aitestcase";
import TestCaseTable from "./testcaseget";

const { Text } = Typography;

const Testcasepage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab =
        searchParams.get("tab") || "AITestCaseGenarator";

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
                    AI Test Case Genarator
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
                    <Tabs.TabPane tab="AI Test Case Genarator" key="AITestCaseGenarator">
                        <AITestCases />
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab="Test Cases"
                        key="testcases"
                    >
                        <TestCaseTable />
                    </Tabs.TabPane>



                </Tabs>
            </Card>
        </div>
    );
};

export default Testcasepage;