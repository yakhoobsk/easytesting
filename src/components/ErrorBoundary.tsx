import { Component } from "react";
import type { ReactNode } from "react";
import { Result, Button } from "antd";

interface Props {
    children: ReactNode;

}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: unknown, errorInfo: unknown) {
        console.error("Global Error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="500"
                    title="Something went wrong"
                    subTitle="Please contact admin or try again."
                    extra={
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <Button
                                onClick={() => window.location.href = "/"}
                            >
                                Go to homepage
                            </Button>
                            <Button type="primary" onClick={this.handleReload}>
                                Reload Page
                            </Button>
                        </div>
                    }
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;