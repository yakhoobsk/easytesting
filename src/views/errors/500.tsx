import { Result, Button } from "antd";
import { BugOutlined } from "@ant-design/icons";

const ServerError = () => {
    return (
        <Result
            icon={<BugOutlined />}
            status="500"
            title="500 - Server Error"
            subTitle="Something went wrong on our side."
            extra={<Button type="primary" onClick={() => window.location.reload()}>Retry</Button>}
        />
    );
}

export default ServerError;