import { Result, Button } from "antd";
import { WifiOutlined } from "@ant-design/icons";

const NetworkError = () => {
    return (
        <Result
            icon={<WifiOutlined />}
            status="warning"
            title="Network Error"
            subTitle="No internet connection detected."
            extra={<Button type="primary" onClick={() => window.location.reload()}>Reconnect</Button>}
        />
    );
}

export default NetworkError;