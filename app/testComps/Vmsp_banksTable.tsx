import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Input,
  SortDescriptor,
  Table,
  TableBody,
  TableHeader,
  Column as TableColumn,
  Row as TableRow,
  Cell as TableCell,
  ResizableTableContainer,
} from "react-aria-components";
import { Button } from "../../src/Button";

interface Props {
  fetchData: (page: number, filterValue: string) => Promise<void>;
  items: any[];
  totalPages: any;
  columns: any[]; // Define your columns structure type here
  createModalComponent: React.ReactNode; // Component for create modal
  editModalComponent: React.ReactNode; // Component for edit modal
  deleteModalComponent: React.ReactNode; // Component for delete modal
}

const ResizableTable: React.FC<Props> = ({
  fetchData,
  items,
  columns,
  createModalComponent,
  editModalComponent,
  deleteModalComponent,
  totalPages,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<any>({
    column: "bank_code",
    direction: "ascending",
  });

  useEffect(() => {
    fetchData(page, filterValue);
  }, [page, filterValue]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const Pagination = ({ page, onPageChange }: any) => {
    const pagesToShow = 5;
    const halfPagesToShow = Math.floor(pagesToShow / 2);
    const startPage = Math.max(1, page - halfPagesToShow);
    const endPage = Math.min(totalPages, page + halfPagesToShow);
    const pageNumbers: any = [];

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    console.log(
      "from pagination",
      page,
      pagesToShow,
      halfPagesToShow,
      startPage,
      endPage,
      pageNumbers
    );

    return (
      <div className="pagination flex gap-2 items-center">
        <Button onPress={() => onPageChange(1)} isDisabled={page === 1}>
          {"<<"}
        </Button>
        <Button onPress={() => onPageChange(page - 1)} isDisabled={page === 1}>
          {"<"}
        </Button>
        {pageNumbers.map((number: any) => (
          <Button
            key={number}
            onPress={() => onPageChange(number)}
            isDisabled={number === page}
          >
            {number}
          </Button>
        ))}
        <Button
          onPress={() => onPageChange(page + 1)}
          isDisabled={page === totalPages}
        >
          {">"}
        </Button>
        <Button
          onPress={() => onPageChange(totalPages)}
          isDisabled={page === totalPages}
        >
          {">>"}
        </Button>
      </div>
    );
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "vmsp_id":
      case "bank_code":
      case "short_code":
      case "bank_type":
        return <span>{item[columnKey]}</span>;
      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            {editModalComponent}
            {deleteModalComponent}
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between p-2">
        <Input
          className="w-[400px]  pl-3"
          placeholder="Search by Bank Code..."
          value={filterValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {createModalComponent}
      </div>
    );
  }, [filterValue, onSearchChange]);

  return (
    <div className="w-full flex flex-col h-full gap-2">
      {topContent}
      <ResizableTableContainer className="max-h-full w-full overflow-auto scroll-pt-[2.281rem] relative border dark:border-zinc-600 rounded-lg">
        <Table
          aria-label="Vmsp_bankss table"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(columns) => (
              <TableColumn
                id={columns.key}
                isRowHeader={true}
                allowsSorting={true} // Assuming all columns can be sorted
              >
                {columns.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={sortedItems}>
            {(item) => (
              <TableRow id={item.vmsp_id} columns={columns}>
                {(columnKey: any) => (
                  <TableCell>{renderCell(item, columnKey.key)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ResizableTableContainer>
      <div className="flex w-full justify-center">
        <Pagination
          page={page}
          total={5} // Replace with actual total pages
          onPageChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default ResizableTable;
