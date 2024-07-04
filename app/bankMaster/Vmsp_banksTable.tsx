import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns, Vmsp_banks } from "./columns";
import {
  Input,
  SortDescriptor,
  Table,
  TableBody,
  TableHeader,
  Column as TableColumn,
  Row as TableRow,
  Cell as TableCell,
} from "react-aria-components";

import Vmsp_banksCreateModal from "./Vmsp_banksCreateModal";
import { Button } from "../../src/Button";
import Vmsp_banksEditModal from "./Vmsp_banksEditModal";
import Vmsp_banksDeleteModal from "./Vmsp_banksDelete";

export default function Vmsp_banksTable() {
  const [vmsp_bankss, setVmsp_bankss] = useState<Vmsp_banks[]>([]);
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
      if (data && Array.isArray(data.items) && typeof data.totalPages === "number") {
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



  const rowsPerPage = 10;
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "bank_code",
    direction: "ascending",
  });
  const sortedItems = useMemo(() => {
    return [...vmsp_bankss].sort((a: Vmsp_banks, b: Vmsp_banks) => {
      const first = a[sortDescriptor.column as keyof Vmsp_banks] as any;
      const second = b[sortDescriptor.column as keyof Vmsp_banks] as any;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, vmsp_bankss]);

  const Pagination = ({ page, total, onPageChange }: any) => {
    const pagesToShow = 5; // Number of pages to show around the current page
    const halfPagesToShow = Math.floor(pagesToShow / 2);

    const startPage = Math.max(1, page - halfPagesToShow);
    const endPage = Math.min(total, page + halfPagesToShow);

    const pageNumbers:any = [];

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
        {pageNumbers.map((number) => (
          <Button
            key={number}
            onPress={() => onPageChange(number)}
            isDisabled={number === page}
          >
            {number}
          </Button>
        ))}
        <Button onPress={() => onPageChange(page + 1)} isDisabled={page === total}>
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
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            value={filterValue}
            // onClear={() => onClear()}
            onChange={(e) => onSearchChange(e.target.value)}
            // onValueChange={(e)=>onSearchChange(e.target.value)}
          />
          <div color="primary" className="flex h-14 gap-1">
            <Vmsp_banksCreateModal setRefetch={setRefetch} />
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, onClear]);

  const renderCell = (
    vmsp_banks: Vmsp_banks,
    columnKey: React.Key,
    setRefetch: any
  ) => {
    console.log(columnKey, "paramasss");
    const cellValue: any = vmsp_banks[columnKey as keyof Vmsp_banks];
    console.log(cellValue, "cellValue");

    switch (columnKey) {
      case "vmsp_id":
        return <span>{cellValue}</span>;
      case "bank_code":
        return <span>{cellValue}</span>;
      case "short_code":
        return <span>{cellValue}</span>;
      case "bank_type":
        return <span>{cellValue}</span>;
      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            <Vmsp_banksEditModal
              id={vmsp_banks.vmsp_id}
              update={vmsp_banks}
              setRefetch={setRefetch}
            />
            <Vmsp_banksDeleteModal
              id={vmsp_banks.vmsp_id}
              setRefetch={setRefetch}
            />
          </div>
        );
      default:
        return cellValue;
    }
  };
  return (
    <div>
      <div className="w-full flex justify-between">
      {topContent}
        
        {/* <Vmsp_banksCreateModal setRefetch={setRefetch} /> */}
      </div>
      <Table
        aria-label="Vmsp_bankss table"
        // topContent={topContent}
        // topContentPlacement='outside'
        // bottomContent={
        //   <div className='flex w-full justify-center'>
        //     <Pagination
        //       isCompact
        //       showControls
        //       showShadow
        //       color='primary'
        //       page={page}
        //       total={pages}
        //       onChange={page => setPage(page)}
        //     />
        //   </div>
        // }
        // bottomContentPlacement='outside'
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        // classNames={{
        //   wrapper: 'min-h-[222px]'
        // }}
      >
        {/* <TableHeader columns={columns}> */}
        <TableHeader columns={columns}>
          {(columns) => (
            <TableColumn
              id={columns.key}
              // key={columns.key} // Use column.key as the unique key
              isRowHeader={true}
              {...(columns.key === "vmsp_id" ? { allowsSorting: true } : {})}
              {...(columns.key === "bank_code" ? { allowsSorting: true } : {})}
              {...(columns.key === "short_code" ? { allowsSorting: true } : {})}
              {...(columns.key === "bank_type" ? { allowsSorting: true } : {})}
            >
              {columns.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems} /*emptyContent={<Spinner />}*/>
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
