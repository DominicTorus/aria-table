import React from "react";
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
  const cellValue: any = vmsp_banks[columnKey as keyof Vmsp_banks];
  console.log(columnKey, "paramasss");

  {
    switch (columnKey) {
      case "vmsp_id":
        return <span>{cellValue}</span>;
      case "bank_code":
        return <span>{cellValue}</span>;
      case "short_code":
        return <span>{cellValue}</span>;
      case "bank_type":
        return <span>{cellValue}</span>;
      //   case 'actions':
      //     return (
      //       <div className='relative flex items-center gap-4'>
      //         <Tooltip content='Edit Record'>
      //           <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
      //             <Vmsp_banksEditModal
      //               id={vmsp_banks.vmsp_id}
      //               setRefetch={setRefetch}
      //               update={vmsp_banks}
      //             />
      //           </span>
      //         </Tooltip>
      //         <Tooltip color='danger' content='Delete Record'>
      //           <span className='cursor-pointer text-lg text-danger active:opacity-50'>
      //             <Vmsp_banksDeleteModal id={vmsp_banks.vmsp_id} setRefetch={setRefetch} />
      //           </span>
      //         </Tooltip>
      //       </div>
      //     )
      default:
        return cellValue;
    }
  }
};
