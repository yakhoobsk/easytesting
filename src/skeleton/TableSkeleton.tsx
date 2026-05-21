import { Table, Skeleton } from "antd";

const TableSkeleton = ({ columns }: any) => {

  const dummyData = Array.from({ length: columns.length }).map((_, i) => ({
    key: i
  }));

  const skeletonColumns = columns.map((col: any) => ({
    ...col,
    render: () => (
      <Skeleton
        active
        // title={{ width: "80%" }}
        paragraph={false}
      />
    )
  }));

  return (
    <Table
      columns={skeletonColumns}
      dataSource={dummyData}
      pagination={false}
    />
  );
};

export default TableSkeleton;