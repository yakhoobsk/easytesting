import Text from "antd/es/typography/Text";


interface MetricCardProps {
    title: string;
    value: number;
    color: string;
    bg: string;
}

const MetricCard = ({ title, value, color, bg }: MetricCardProps) => {
    return (
        <div
            style={{
                padding: 20,
                borderRadius: 14,
                background: bg,
                border: "1px solid rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.2s ease",
            }}
        >
            <div
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: color,
                    opacity: 0.12,
                    position: "absolute",
                    top: -10,
                    right: -10,
                }}
            />

            <Text
                type="secondary"
                style={{
                    fontSize: 13,
                    fontWeight: 500,
                }}
            >
                {title}
            </Text>

            <div
                style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color,
                    marginTop: 12,
                    lineHeight: 1,
                }}
            >
                {value}
            </div>
        </div>
    );
};

export default MetricCard;