import React from "react";
import Vmsp_banksEditModal from "./Vmsp_banksEditModal";
import Vmsp_banksDeleteModal from "./Vmsp_banksDelete";
import { OverlayArrow, Tooltip, TooltipTrigger } from "react-aria-components";
export type Vmsp_banks = {
  vmsp_id: number;
  bank_code: string;
  short_code: string;
  bank_type: string;
};

export const columns = [
  {
    key: "vmsp_id",
    label: "vmsp_Id",
  },
  {
    key: "bank_code",
    label: "Bank code",
  },
  {
    key: "short_code",
    label: "Short code",
  },
  {
    key: "bank_type",
    label: "Bank type",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export const renderCell = (
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
          <TooltipTrigger>
            <Vmsp_banksEditModal
              id={vmsp_banks.vmsp_id}
              update={vmsp_banks}
              setRefetch={setRefetch}
            />
            <Tooltip
              className={
                " p-2 text-sm font-medium text-white bg-orange-300 rounded-lg shadow-sm transition-opacity"
              }
            >
              <OverlayArrow>
                <svg width={8} height={8}></svg>
              </OverlayArrow>
              Edit
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <Vmsp_banksDeleteModal
              id={vmsp_banks.vmsp_id}
              setRefetch={setRefetch}
            />
            <Tooltip
              className={
                " p-2 text-sm font-medium text-white bg-orange-300 rounded-lg shadow-sm transition-opacity"
              }
            >
              <OverlayArrow>
                <svg width={8} height={8}></svg>
              </OverlayArrow>
              Delete
            </Tooltip>
          </TooltipTrigger>
        </div>
      );
    default:
      return cellValue;
  }
};
