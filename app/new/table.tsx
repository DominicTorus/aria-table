"use client";
import React from "react";

import { useEffect, useMemo, useState } from "react";
import { SortDescriptor } from "react-aria-components";
import { columns, Vmsp_banks } from "../bankMaster/columns";
import ResizableTable from "../testComps/Vmsp_banksTable";

const TestComps = () => {
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

  return (
    <div>
      <ResizableTable
        totalPages={totalPages}
        items={sortedItems}
        fetchData={fetchData}
        columns={columns}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default TestComps;
