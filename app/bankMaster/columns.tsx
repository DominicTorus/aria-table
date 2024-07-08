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
