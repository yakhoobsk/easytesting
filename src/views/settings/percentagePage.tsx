import { Card, Row, Col, Form, Tag, InputNumber, Button } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { StatusGet, StatusUpdate } from "../../redux/services/settings/statusConfigService";
import { showSnackbar } from "../../utils/snackbar";

type Status =
    | "Success"
    | "Partially Success"
    | "Partially Failed"
    | "Failed";

interface Range {
    status: Status;
    minPercentage: number | null;
    maxPercentage: number | null;
}

interface FormValues {
    ranges: Range[];
}


const colors: Record<Status, string> = {
    Success: "green",
    "Partially Success": "gold",
    "Partially Failed": "orange",
    Failed: "red"
};

const validationSchema = Yup.object({
    ranges: Yup.array()

        .of(
            Yup.object({

                minPercentage: Yup.number()
                    .required("Required")
                    .min(0)
                    .max(100),

                maxPercentage: Yup.number()
                    .required("Required")
                    .min(0)
                    .max(100)

                    .test(
                        "greater",
                        "Max must be >= Min",
                        function (value) {

                            return (
                                value ?? 0
                            ) >= (
                                    this.parent.minPercentage ?? 0
                                );
                        }
                    )
            })
        )

        .test(
            "duplicate",
            "Duplicate ranges not allowed",
            (ranges) => {
                if (!ranges)
                    return true;
                const seen =
                    new Set();
                for (
                    const r
                    of ranges
                ) {
                    const key =
                        `${r.minPercentage}-${r.maxPercentage}`;
                    if (
                        seen.has(key)
                    )
                        return false;
                    seen.add(key);
                }
                return true;
            }
        )

        .test(
            "overlap",
            "Ranges overlap",

            (ranges) => {
                if (!ranges)
                    return true;
                const sorted =
                    [...ranges]
                        .sort(
                            (a, b) =>
                                (a.minPercentage ?? 0)
                                -
                                (b.minPercentage ?? 0)
                        );
                for (
                    let i = 0;
                    i <
                    sorted.length - 1;
                    i++
                ) {
                    if (
                        (sorted[i]
                            .maxPercentage ?? 0)
                        >=
                        (sorted[i + 1]
                            .minPercentage ?? 0)
                    ) {
                        return false;
                    }
                }
                return true;
            }
        )

        .test(
            "continuous",
            "Ranges must cover continuously from 0 to 100",
            (ranges) => {
                if (!ranges)
                    return true;
                const sorted =
                    [...ranges]
                        .sort(
                            (a, b) =>
                                (a.minPercentage ?? 0)
                                -
                                (b.minPercentage ?? 0)
                        );

                const first =
                    sorted[0];

                const last =
                    sorted[
                    sorted.length - 1
                    ];
                if (
                    (first.minPercentage ?? 0)
                    !==
                    0
                )
                    return false;
                if (
                    (last.maxPercentage ?? 0)
                    !==
                    100
                )
                    return false;
                for (
                    let i = 0;
                    i <
                    sorted.length - 1;
                    i++
                ) {
                    const current =
                        sorted[i];

                    const next =
                        sorted[i + 1];
                    if (
                        (current.maxPercentage ?? 0)
                        + 1
                        !==
                        (next.minPercentage ?? 0)
                    ) {
                        return false;
                    }
                }
                return true;
            }
        )

});

export default function StatusConfig() {
    const status = useAppSelector((state) => state.status.status);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(StatusGet({}));
    }, [dispatch])

    const mappedValues: FormValues = {

        ranges:

            status?.records?.length
                ?
                status.records.map(
                    (item: any) => ({
                        status: item.status === "PartiallySuccess" ? "Partially Success" : item.status === "PartiallyFailed" ? "Partially Failed" : item.status,

                        minPercentage:
                            item.minpercentage,

                        maxPercentage:
                            item.maxpercentage

                    })
                )

                :

                [
                    {
                        status: "Success",
                        minPercentage: null,
                        maxPercentage: null
                    },
                    {
                        status: "Partially Success",
                        minPercentage: null,
                        maxPercentage: null
                    },
                    {
                        status: "Partially Failed",
                        minPercentage: null,
                        maxPercentage: null
                    },
                    {
                        status: "Failed",
                        minPercentage: null,
                        maxPercentage: null
                    }
                ]

    };


    return (

        <Formik<FormValues>
            enableReinitialize
            initialValues={mappedValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {

                const payload = {

                    status_id: status?.status_id,

                    records: values.ranges.map(
                        (item) => ({
                            status:
                                item.status
                                    === "Partially Success"
                                    ?
                                    "PartiallySuccess"
                                    :
                                    item.status === "Partially Failed"
                                        ? "PartiallyFailed"
                                        :
                                        item.status,
                            minpercentage:
                                item.minPercentage,

                            maxpercentage:
                                item.maxPercentage

                        })
                    ),
                    updated_by: auth?.User_Email

                };

                try {

                    dispatch(StatusUpdate(payload)).unwrap();
                    dispatch(StatusGet({}));

                }

                catch {

                    showSnackbar(
                        "error",
                        "Something went wrong"
                    );

                }

            }}
        >
            {({

                values,
                errors,
                setFieldValue,
                handleSubmit,


            }) => (

                <Form onFinish={() => handleSubmit()}>
                    <Row gutter={[20, 20]}>
                        {values.ranges.map((item, index) => (
                            <Col xs={24} sm={12} xl={6} key={item.status}>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ duration: .25 }}
                                >

                                    <Card
                                        bordered={false}
                                        style={{
                                            height: "100%",
                                            borderRadius: 24,
                                            background: "linear-gradient(180deg,#fff,#fafafa)",
                                            boxShadow: "0 10px 30px rgba(0,0,0,.06)"
                                        }}
                                        bodyStyle={{ padding: 24 }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginBottom: 28
                                            }}
                                        >

                                            <Tag
                                                color={colors[item.status]}
                                                style={{
                                                    padding: "8px 18px",
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    borderRadius: 20
                                                }}
                                            >
                                                {item.status}
                                            </Tag>

                                        </div>


                                        <Form.Item
                                            label={<span style={{ fontWeight: 600 }}>Minimum %</span>}
                                            validateStatus={
                                                (errors.ranges as any)?.[index]?.minPercentage
                                                    ? "error"
                                                    : ""
                                            }
                                            help={
                                                (errors.ranges as any)?.[index]?.minPercentage
                                            }
                                        >

                                            <InputNumber
                                                style={{
                                                    width: "100%",
                                                    height: 44
                                                }}
                                                controls={false}
                                                placeholder="Enter Min"
                                                min={0}
                                                max={100}
                                                value={item.minPercentage}
                                                onChange={(v) =>
                                                    setFieldValue(
                                                        `ranges.${index}.minPercentage`,
                                                        v
                                                    )}
                                            />

                                        </Form.Item>



                                        <Form.Item
                                            label={<span style={{ fontWeight: 600 }}>Maximum %</span>}
                                            validateStatus={
                                                (errors.ranges as any)?.[index]?.maxPercentage
                                                    ? "error"
                                                    : ""
                                            }
                                            help={
                                                (errors.ranges as any)?.[index]?.maxPercentage
                                            }
                                        >

                                            <InputNumber
                                                style={{
                                                    width: "100%",
                                                    height: 44
                                                }}
                                                controls={false}
                                                placeholder="Enter Max"
                                                min={0}
                                                max={100}
                                                value={item.maxPercentage}
                                                onChange={(v) =>
                                                    setFieldValue(
                                                        `ranges.${index}.maxPercentage`,
                                                        v
                                                    )}
                                            />

                                        </Form.Item>



                                        <div style={{ marginTop: 24 }}>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    fontSize: 12,
                                                    color: "#666",
                                                    marginBottom: 10
                                                }}
                                            >

                                                <span>
                                                    Min: {item.minPercentage ?? 0}%
                                                </span>

                                                <span>
                                                    Max: {item.maxPercentage ?? 100}%
                                                </span>

                                            </div>



                                            <div
                                                style={{
                                                    position: "relative",
                                                    height: 14,
                                                    background: "#f1f5f9",
                                                    borderRadius: 30,
                                                    overflow: "hidden"
                                                }}
                                            >

                                                <div

                                                    style={{

                                                        position: "absolute",

                                                        left:
                                                            `${item.minPercentage ?? 0}%`,

                                                        width:
                                                            `${(item.maxPercentage ?? 0) - (item.minPercentage ?? 0)}%`,

                                                        height: "100%",

                                                        background:
                                                            colors[item.status],

                                                        borderRadius: 30,

                                                        transition:
                                                            "all .4s ease"

                                                    }}

                                                />

                                            </div>



                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    marginTop: 8,
                                                    fontSize: 12,
                                                    color: "#888"
                                                }}
                                            >

                                                <span>0%</span>

                                                <span>25%</span>

                                                <span>50%</span>

                                                <span>75%</span>

                                                <span>100%</span>

                                            </div>

                                        </div>

                                    </Card>

                                </motion.div>

                            </Col>
                        ))}
                    </Row>


                    {typeof errors.ranges ===
                        "string" && (

                            <div
                                style={{
                                    color: "red",
                                    marginTop: 15,
                                    fontWeight: 600
                                }}
                            >
                                {errors.ranges}
                            </div>
                        )}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 24
                        }}
                    >
                        <Button
                            htmlType="submit"
                            type="primary"
                            size="large"
                            style={{
                                borderRadius: 10,
                                padding: "0 28px",
                                height: 42,
                                fontWeight: 600
                            }}
                        >
                            Save Configuration
                        </Button>

                    </div>
                </Form>
            )}
        </Formik>
    );

}