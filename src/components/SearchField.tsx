import React, { useState, useEffect } from "react";
import { Input } from "antd";

interface Props {
    placeholder?: string;
    paramKey?: string;
    onSearch?: (value: string) => void;
}

const SearchField: React.FC<Props> = ({
    placeholder = "Search...",
    paramKey = "search",
    onSearch
}) => {

    const [value, setValue] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        const searchValue = url.searchParams.get(paramKey) || "";

        setValue(searchValue);

        if (searchValue) {
            onSearch?.(searchValue);
        }
    }, []);

    useEffect(() => {

        const timer = setTimeout(() => {

            const url = new URL(window.location.href);

            if (value) {
                url.searchParams.set(paramKey, value);
            } else {
                url.searchParams.delete(paramKey);
            }

            url.searchParams.set("page", "1");

            window.history.pushState({}, "", url);

            onSearch?.(value);

        }, 500);

        return () => clearTimeout(timer);

    }, [value]);

    return (
        <Input
            placeholder={placeholder}
            value={value}
            allowClear
            onChange={(e) => setValue(e.target.value)}
            style={{ width: 300 }}
        />
    );
};

export default SearchField;