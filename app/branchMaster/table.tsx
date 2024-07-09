import React from "react";
import { useEffect, useMemo, useState } from "react";
import { columns, renderCell, tableData } from "./columns";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableHeader,
  Column as TableColumn,
  Row as TableRow,
  Cell as TableCell,
  ResizableTableContainer,
} from "react-aria-components";
import TopContent from "./TopContent";
import Pagination from "./Pagination";

const TableComponent = () => {
  const rowsPerPage = 10;
  const [tableData, setTableData] = useState<tableData[]>([]);
  const [filterValue, setFilterValue] = useState("");

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

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "bank_code",
    direction: "ascending",
  });
  const SortedItems = useMemo(() => {
    return [...tableData].sort((a: tableData, b: tableData) => {
      const first = a[sortDescriptor.column as keyof tableData] as any;
      const second = b[sortDescriptor.column as keyof tableData] as any;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, tableData]);

  return (
    <div className="w-full flex flex-col h-full gap-2">
      <TopContent
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        setPage={setPage}
      />
      <ResizableTableContainer className="max-h-full w-full overflow-auto scroll-pt-[2.281rem] relative border dark:border-zinc-600 rounded-lg">
        {SortedItems.length ? (
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
            <TableBody items={SortedItems}>
              {(tableData) => (
                <TableRow  columns={columns}>  
                  {(columnKey: any) => (
                    <TableCell>
                      {renderCell(tableData, columnKey.key, setRefetch)}
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
};

export default TableComponent;
