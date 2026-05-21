import { Result, Button } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BadRequest = () => {
    const navigate = useNavigate();

    return (
        <Result
            icon={<WarningOutlined />}
            status="warning"
            title="400 - Bad Request"
            subTitle="The request could not be understood by the server."
            extra={
                <Button type="primary" onClick={() => navigate("/")}>
                    Go Home
                </Button>
            }
        />
    );
}

export default BadRequest;