import { Result, Button } from "antd";
import { StopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <Result
            icon={<StopOutlined />}
            status="403"
            title="403 - Forbidden"
            subTitle="You don't have permission to access this page."
            extra={
                <Button type="primary" onClick={() => navigate("/")}>
                    Back Home
                </Button>
            }
        />
    );
}

export default Forbidden;