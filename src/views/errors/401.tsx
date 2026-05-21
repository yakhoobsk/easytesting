import { Result, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Result
            icon={<LockOutlined />}
            status="403"
            title="401 - Unauthorized"
            subTitle="You must login to access this resource."
            extra={
                <Button type="primary" onClick={() => navigate("/login")}>
                    Login
                </Button>
            }
        />
    );
}

export default Unauthorized;