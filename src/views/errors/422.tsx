import { Result, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const InvalidInput = () => {
    const navigate = useNavigate();

    return (
        <Result
            icon={<ExclamationCircleOutlined />}
            status="warning"
            title="422 - Invalid Request"
            subTitle="Some fields are invalid or missing."
            extra={<Button type="primary" onClick={() => navigate(-1)}>Go Back</Button>}
        />
    );
}

export default InvalidInput;