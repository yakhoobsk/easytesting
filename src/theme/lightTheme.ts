import type { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
    token: {
        colorPrimary: "#1570EF",
        colorLink: "#1570EF",
        colorLinkHover: "#175CD3",

        colorSuccess: "#2E7D32",

        colorWarning: "#EF6C00",

        colorError: "#D32F2F",

        colorInfo: "#0288D1",

        colorText: "#212121",
        colorTextSecondary: "#666666",
        colorTextDisabled: "#B8B8B8",

        colorBgBase: "#FFFFFF",
        colorBgLayout: "#F8FAFC",
        colorBorder: "#E0E0E0",

        borderRadius: 12,
        fontSize: 14,
        fontFamily: "'Poppins', sans-serif",
    },

    components: {
        Button: {
            borderRadius: 10,
            fontWeight: 500,
            controlHeight: 36,
        },

        Input: {
            borderRadius: 10,
        },

        Select: {
            borderRadius: 10,
        },

        Card: {
            borderRadius: 16,
        },

        Table: {
            borderRadius: 12,
            headerBg: "#EAF2FF",
            headerColor: "#175CD3",
        },

        Tag: {
            borderRadius: 20,
        },

        Typography: {
            colorText: "#212121",
        },

        Modal: {
            borderRadiusLG: 20,
        },
    },
};