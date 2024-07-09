import React from "react";
import { useEffect, useMemo, useState } from "react";
import { columns, renderCell, Vmsp_banks } from "./columns";
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

const Assemble = () => {
  const rowsPerPage = 10;
  const [vmsp_bankss, setVmsp_bankss] = useState<Vmsp_banks[]>([]);
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
        setVmsp_bankss(data.items);
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
    return [...vmsp_bankss].sort((a: Vmsp_banks, b: Vmsp_banks) => {
      const first = a[sortDescriptor.column as keyof Vmsp_banks] as any;
      const second = b[sortDescriptor.column as keyof Vmsp_banks] as any;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, vmsp_bankss]);

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
            aria-label="Vmsp_bankss table"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={columns}>
              {(columns) => (
                <TableColumn
                  id={columns.key}
                  isRowHeader={true}
                  {...(columns.key === "vmsp_id"
                    ? { allowsSorting: true }
                    : {})}
                  {...(columns.key === "bank_code"
                    ? { allowsSorting: true }
                    : {})}
                  {...(columns.key === "short_code"
                    ? { allowsSorting: true }
                    : {})}
                  {...(columns.key === "bank_type"
                    ? { allowsSorting: true }
                    : {})}
                >
                  {columns.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={SortedItems}>
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
};

export default Assemble;
