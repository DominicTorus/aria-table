import React from "react";
import { useCallback, useMemo } from "react";
import { Input } from "react-aria-components";
import Vmsp_banksCreateModal from "./Vmsp_banksCreateModal";
interface TopContentProps {
  filterValue?: string;
  setRefetch?: any;
  setFilterValue?: any;
  setPage?: any;
}
export default function TopContent({
  filterValue = "",
  setRefetch = () => {},
  setFilterValue = () => {},
  setPage = () => {},
}: TopContentProps) {
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

  return topContent;
}
