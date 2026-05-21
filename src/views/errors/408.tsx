import { Result, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const RequestTimeout = () => {
    return (
        <Result
            icon={<ClockCircleOutlined />}
            status="warning"
            title="408 - Request Timeout"
            subTitle="The server took too long to respond."
            extra={<Button type="primary" onClick={() => window.location.reload()}>Retry</Button>}
        />
    );
}

export default RequestTimeout;