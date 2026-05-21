import { notification, Button } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from "@ant-design/icons";

type SnackbarType = "success" | "error" | "info" | "warning";

const colors = {
  success: "#4a664d",
  error: "#8e6464",
  info: "#52617c",
  warning: "#74644a"
};

const icons = {
  success: (
    <CheckCircleFilled
      style={{ color: "#52c41a", fontSize: 18, display: "flex", alignItems: "center" }}
    />
  ),
  error: (
    <CloseCircleFilled
      style={{ color: "#ff4d4f", fontSize: 18, display: "flex", alignItems: "center" }}
    />
  ),
  info: (
    <InfoCircleFilled
      style={{ color: "#1677ff", fontSize: 18, display: "flex", alignItems: "center" }}
    />
  ),
  warning: (
    <WarningFilled
      style={{ color: "#faad14", fontSize: 18, display: "flex", alignItems: "center" }}
    />
  )
};

export const showSnackbar = (
  type: SnackbarType,
  message: string,
  actionText?: string,
  onAction?: () => void
) => {
  const bgColor = colors[type];
  const icon = icons[type];

  notification.open({
    message: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 10
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          <span style={{ color: "#fff", fontWeight: 400 }}>
            {message}
          </span>
        </div>

        {actionText && (
          <Button
            type="link"
            onClick={onAction}
            style={{
              color: "#fff",
              fontWeight: 400,
              padding: 0,
              height: "auto"
            }}
          >
            {actionText}
          </Button>
        )}
      </div>
    ),

    placement: "bottomLeft",
    duration: 4,

    closeIcon: null,

    style: {
      background: bgColor,
      borderRadius: 8,
      color: "#fff",
      padding: "12px 12px",
      display: "flex",
      alignItems: "center"
    }
  });
};