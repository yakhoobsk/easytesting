import { Result, Button } from "antd";
import { HourglassOutlined } from "@ant-design/icons";

const TooManyRequests = () => {
    return (
        <Result
            icon={<HourglassOutlined />}
            status="warning"
            title="429 - Too Many Requests"
            subTitle="You are sending requests too quickly. Please slow down."
            extra={<Button type="primary" onClick={() => window.location.reload()}>Retry</Button>}
        />
    );
}

export default TooManyRequests;