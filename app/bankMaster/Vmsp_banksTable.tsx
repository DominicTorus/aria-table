import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns, renderCell, tableData } from "./columns";
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

import Vmsp_banksCreateModal from "./Vmsp_banksCreateModal";
import { Button } from "../../src/Button";

export default function Vmsp_banksTable() {
  const [tableData, setTableData] = useState<tableData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [refetch, setRefetch] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const fetchData = async (page: number, filterValue: string) => {
    try {
      const response = await fetch(
        `http://192.168.2.94:3010/vmsp_banks/get?page=${page}&limit=${rowsPerPage}&filter=${filterValue}`
      );
      const data = await response.json();
      console.log("Fetched data:", data); // Log the fetched data

      // Verify that the data structure is as expected
      if (
        data &&
        Array.isArray(data.items) &&
        typeof data.totalPages === "number"
      ) {
        setTableData(data.items);
        setTotalPages(data.totalPages);
      } else {
        console.error("Unexpected data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData(page, filterValue);
  }, [page, filterValue, refetch]);

  const rowsPerPage = 10;
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "bank_code",
    direction: "ascending",
  });
  const sortedItems = useMemo(() => {
    return [...tableData].sort((a: tableData, b: tableData) => {
      const first = a[sortDescriptor.column as keyof tableData] as any;
      const second = b[sortDescriptor.column as keyof tableData] as any;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, tableData]);

  const Pagination = ({ page, total, onPageChange }: any) => {
    const pagesToShow = 5; // Number of pages to show around the current page
    const halfPagesToShow = Math.floor(pagesToShow / 2);

    const startPage = Math.max(1, page - halfPagesToShow);
    const endPage = Math.min(total, page + halfPagesToShow);

    const pageNumbers: any = [];

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

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
          isDisabled={page === total}
        >
          {">"}
        </Button>
        <Button onPress={() => onPageChange(total)} isDisabled={page === total}>
          {">>"}
        </Button>
      </div>
    );
  };

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
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
        <Vmsp_banksCreateModal setRefetch={setRefetch} />
      </div>
    );
  }, [filterValue, onSearchChange, onClear]);

  return (
    <div className="w-full flex flex-col h-full gap-2">
      {topContent}
      <ResizableTableContainer className="max-h-full w-full overflow-auto scroll-pt-[2.281rem] relative border dark:border-zinc-600 rounded-lg">
        {sortedItems.length ? (
          <Table
            aria-label="Label of the Table"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={columns}>
              {(columns) => (
                <TableColumn
                  id={columns.key}
                  isRowHeader={true}
                  
                  {...(columns.key === "actions"
                    ? { allowsSorting: false }
                    : { allowsSorting: true })}
                >
                  {columns.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sortedItems}>
              {(vmsp_banks) => (
                <TableRow id={vmsp_banks?.vmsp_id} columns={columns}>
                  {(columnKey: any) => (
                    <TableCell>
                      {renderCell(vmsp_banks, columnKey.key, setRefetch)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <h2 className="flex w-full justify-center">No data available</h2>
        )}
      </ResizableTableContainer>
      <div className="flex w-full justify-center">
        <Pagination
          page={page}
          total={totalPages}
          onPageChange={(page: any) => setPage(page)}
        />
      </div>
    </div>
  );
}
