import React, { useState, useEffect } from "react";
import { Row, Col, Select } from "antd";

const { Option } = Select;

interface FilterOption {
    label: string;
    value: string;
}

interface FilterConfig {
    key: string;
    placeholder: string;
    options: FilterOption[];
}

interface Props {
    filters: FilterConfig[];
    onChange: (values: Record<string, any>) => void;
}

const SearchFilters: React.FC<Props> = ({ filters, onChange }) => {

    const [values, setValues] = useState<Record<string, any>>({});

    useEffect(() => {

        const url = new URL(window.location.href);
        const params = url.searchParams;

        const initialValues: Record<string, any> = {};

        filters.forEach((filter) => {
            const value = params.get(filter.key);
            if (value) {
                initialValues[filter.key] = value;
            }
        });

        setValues(initialValues);

        const page = parseInt(params.get("page") || "1");
        const limit = parseInt(params.get("row") || "10");

        onChange({
            page,
            limit,
            ...initialValues
        });

    }, []);

    const handleChange = (key: string, value: any) => {

        const url = new URL(window.location.href);

        const updatedValues = {
            ...values,
            [key]: value
        };

        setValues(updatedValues);

        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }

        url.searchParams.set("page", "1");

        window.history.pushState({}, "", url);

        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("row") || "10");

        onChange({
            page,
            limit,
            ...updatedValues
        });
    };

    return (
        <Row gutter={[16, 16]}>
            {filters.map((filter) => (
                <Col key={filter.key}>
                    <Select
                        showSearch

                        allowClear
                        placeholder={filter.placeholder}
                        style={{ width: "100%" }}
                        value={values[filter.key]}
                        optionFilterProp="children"
                        onChange={(value) => handleChange(filter.key, value)}
                        filterOption={(input, option) =>
                            (option?.children as unknown as string)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        {filter.options.map((opt) => (
                            <Option key={opt.value} value={opt.value}>
                                {opt.label}
                            </Option>
                        ))}
                    </Select>
                </Col>
            ))}
        </Row>
    );
};

export default SearchFilters;