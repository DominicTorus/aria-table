//step 1

// import React from "react";
// import {
//   Cell,
//   Column,
//   Input,
//   Row,
//   Table,
//   TableBody,
//   TableHeader,
// } from "react-aria-components";
// interface TableProps {
//   data?: any[];
//   className?: {
//     table?: string;
//     header?: string;
//     column?: string;
//     body?: string;
//     row?: string;
//   };
//   colour?: string;
//   isPagination?: boolean;
//   isFilter?: boolean;
//   isSort?: boolean;
// }

// const TorusTable = (props: TableProps) => {
//   console.log(props.data);

//   const columnData =
//     props.data && props.data.length > 0 ? Object.keys(props.data[0]) : [];

//   return (
//     <div>
//       {props.isFilter && (
//         <div>
//           <Input />
//         </div>
//       )}
//       <Table className={props.className?.table}>
//         <TableHeader className={props.className?.header}>
//           {columnData.map((key, id) => (
//             <Column id={id} isRowHeader className={props.className?.column}>
//               {key}
//             </Column>
//           ))}
//         </TableHeader>
//         <TableBody className={props.className?.body}>
//           {props.data &&
//             props.data.length > 0 &&
//             props.data.map((item, id) => (
//               <Row key={id} className={props.className?.row}>
//                 {columnData.map((key, id) => (
//                   <Cell>{item[key]}</Cell>
//                 ))}
//               </Row>
//             ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default TorusTable;

//-----------------------------------------------------------------

//step 2

// import React, { useState } from "react";
// import {
//   Cell,
//   Column,
//   Input,
//   Row,
//   Table,
//   TableBody,
//   TableHeader,
//   Button,
//   Label,
//   ListBox,
//   ListBoxItem,
//   Popover,
//   Select,
//   SelectValue,
// } from "react-aria-components";
// interface TableProps {
//   data?: any[];
//   className?: {
//     table?: string;
//     header?: string;
//     column?: string;
//     body?: string;
//     row?: string;
//   };
//   colour?: string;
//   isPagination?: boolean;
//   isFilter?: boolean;
//   isSort?: boolean;
// }

// const TorusTable = (props: TableProps) => {
//   const [sortBy, setSortBy] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");

//   const sortedData: any =
//     props.data &&
//     props.data.length &&
//     props?.data.sort((a, b) => {
//       if (a && b && sortBy) {
//         const aValue = a[sortBy];
//         const bValue = b[sortBy];
//         if (sortOrder === "asc") {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       } else {
//         return 0;
//       }
//     });

//   const handleSort = (column: any) => {
//     if (column === sortBy) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortOrder("asc");
//     }
//   };

//   console.log(props.data);

//   const columnData =
//     props.data && props.data.length > 0 ? Object.keys(props.data[0]) : [];

//   return (
//     <div>
//       <div className="flex justify-between">
//         {props.isFilter && (
//           <div>
//             <Input />
//           </div>
//         )}
//         {props.isPagination && (
//           <div>
//             <Select>
//               <Button>
//                 <span aria-hidden="true">Rows▼</span>
//               </Button>
//               <Popover>
//                 <ListBox>
//                   <ListBoxItem>5</ListBoxItem>
//                   <ListBoxItem>10</ListBoxItem>
//                   <ListBoxItem>15</ListBoxItem>
//                   <ListBoxItem>20</ListBoxItem>
//                 </ListBox>
//               </Popover>
//             </Select>
//           </div>
//         )}
//       </div>

//       <Table className={props.className?.table}>
//         <TableHeader className={props.className?.header}>
//           {columnData.map((key, id) => (
//             <Column id={id} isRowHeader className={props.className?.column}>
//               <div onClick={() => props.isSort && handleSort(key)}>{key}</div>
//             </Column>
//           ))}
//         </TableHeader>
//         <TableBody className={props.className?.body}>
//           {props.data &&
//             props.data.length > 0 &&
//             sortedData.map((item: any, id: any) => (
//               <Row key={id} className={props.className?.row}>
//                 {columnData.map((key, id) => (
//                   <Cell>{item[key]}</Cell>
//                 ))}
//               </Row>
//             ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default TorusTable;

// import React, { useState } from "react";
// import {
//   Cell,
//   Column,
//   Input,
//   Row,
//   Table,
//   TableBody,
//   TableHeader,
//   Button,
//   Label,
//   ListBox,
//   ListBoxItem,
//   Popover,
//   Select,
//   SelectValue,
// } from "react-aria-components";
// interface TableProps {
//   data?: any[];
//   className?: {
//     table?: string;
//     header?: string;
//     column?: string;
//     body?: string;
//     row?: string;
//   };
//   colour?: string;
//   isPagination?: boolean;
//   isFilter?: boolean;
//   isSort?: boolean;
// }

// const TorusTable = (props: TableProps) => {
//   const [noOfRows, setNoOfRows] = useState(
//     props.isPagination
//       ? 5
//       : props.data && props.data.length
//       ? props.data.length
//       : 0
//   );
//   const [pageRows, setPageRows] = useState({
//     start: 0,
//     end: props.isPagination ? 5 : props.data && props.data.length,
//   });
//   const [sortBy, setSortBy] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");

//   const sortedData: any =
//     props.data &&
//     props.data.length &&
//     props?.data.sort((a, b) => {
//       if (a && b && sortBy) {
//         const aValue = a[sortBy];
//         const bValue = b[sortBy];
//         if (sortOrder === "asc") {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       } else {
//         return 0;
//       }
//     });

//   const handleSort = (column: any) => {
//     if (column === sortBy) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortOrder("asc");
//     }
//   };

//   console.log(props.data);

//   const columnData =
//     props.data && props.data.length > 0 ? Object.keys(props.data[0]) : [];

//   const handlePagination = () => {
//     const rows =
//       props.data && props.data.length > 0 ? props.data.length / noOfRows : 0;
//     return (
//       <div className="flex gap-2">
//         {Array.from({ length: rows + 1 }, (_, index) => (
//           <Button
//             key={index}
//             onPress={() =>
//               setPageRows({
//                 start: noOfRows * (index + 1 - 1) + 1,
//                 end: noOfRows * (index + 1),
//               })
//             }
//           >
//             {index + 1}
//           </Button>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="flex justify-between">
//         {props.isFilter && (
//           <div>
//             <Input />
//           </div>
//         )}
//         {props.isPagination && (
//           <div>
//             <Select>
//               <Button>
//                 <span aria-hidden="true">Rows▼</span>
//               </Button>
//               <Popover>
//                 <ListBox>
//                   <ListBoxItem>5</ListBoxItem>
//                   <ListBoxItem>10</ListBoxItem>
//                   <ListBoxItem>15</ListBoxItem>
//                   <ListBoxItem>20</ListBoxItem>
//                 </ListBox>
//               </Popover>
//             </Select>
//           </div>
//         )}
//       </div>

//       <Table className={props.className?.table}>
//         <TableHeader className={props.className?.header}>
//           {columnData.map((key, id) => (
//             <Column id={id} isRowHeader className={props.className?.column}>
//               <div onClick={() => props.isSort && handleSort(key)}>{key}</div>
//             </Column>
//           ))}
//         </TableHeader>
//         <TableBody className={props.className?.body}>
//           {props.data &&
//             props.data.length > 0 &&
//             sortedData
//               .slice(pageRows.start, pageRows.end)
//               .map((item: any, id: any) => (
//                 <Row key={id} className={props.className?.row}>
//                   {noOfRows > id &&
//                     columnData.map((key) => <Cell>{item[key]}</Cell>)}
//                 </Row>
//               ))}
//         </TableBody>
//       </Table>
//       <div className=" flex w- full justify-center">
//         {props.isPagination && handlePagination()}
//       </div>
//     </div>
//   );
// };

// export default TorusTable;

//-----------------------------------------------------------------

//step 3

// import React, { useState } from "react";
// import {
//   Cell,
//   Column,
//   Input,
//   Row,
//   Table,
//   TableBody,
//   TableHeader,
//   Button,
//   Label,
//   ListBox,
//   ListBoxItem,
//   Popover,
//   Select,
//   SelectValue,
// } from "react-aria-components";
// interface TableProps {
//   data?: any[];
//   className?: {
//     table?: string;
//     header?: string;
//     column?: string;
//     body?: string;
//     row?: string;
//   };
//   colour?: string;
//   isPagination?: boolean;
//   isFilter?: boolean;
//   isSort?: boolean;
// }

// const TorusTable = (props: TableProps) => {
//   const [noOfRows, setNoOfRows] = useState(
//     props.isPagination
//       ? 5
//       : props.data && props.data.length
//       ? props.data && props.data.length
//       : 0
//   );
//   const [pageRows, setPageRows] = useState({
//     start: 0,
//     end: props.isPagination ? 5 : props.data && props.data.length,
//   });
//   const [sortBy, setSortBy] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");

//   const sortedData: any =
//     props.data &&
//     props.data.length &&
//     props?.data.sort((a, b) => {
//       if (a && b && sortBy) {
//         const aValue = a[sortBy];
//         const bValue = b[sortBy];
//         if (sortOrder === "asc") {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       } else {
//         return 0;
//       }
//     });

//   const handleSort = (column: any) => {
//     if (column === sortBy) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortOrder("asc");
//     }
//   };

//   console.log(props.data);

//   const columnData =
//     props.data && props.data.length > 0 ? Object.keys(props.data[0]) : [];

//   const handlePagination = () => {
//     const rows =
//       props.data && props.data.length > 0 ? props.data.length / noOfRows : 0;
//     return (
//       <div className="flex gap-2">
//         {Array.from({ length: rows + 1 }, (_, index) => (
//           <Button
//             key={index}
//             onPress={() =>
//               setPageRows({
//                 start: noOfRows * (index + 1 - 1) + 1,
//                 end: noOfRows * (index + 1),
//               })
//             }
//           >
//             {index + 1}
//           </Button>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div>
//         totalLength :{props.data && props.data.length}
//         noOfRows: {noOfRows}
//         pagination: {pageRows.start} - {pageRows.end}
//       </div>
//       <div className="flex justify-between">
//         {props.isFilter && (
//           <div>
//             <Input />
//           </div>
//         )}
//         {props.isPagination && (
//           <div>
//             <Select>
//               <Button>
//                 <span aria-hidden="true">Rows▼</span>
//               </Button>
//               <Popover>
//                 <ListBox>
//                   <ListBoxItem>5</ListBoxItem>
//                   <ListBoxItem>10</ListBoxItem>
//                   <ListBoxItem>15</ListBoxItem>
//                   <ListBoxItem>20</ListBoxItem>
//                 </ListBox>
//               </Popover>
//             </Select>
//           </div>
//         )}
//       </div>

//       <Table className={props.className?.table}>
//         <TableHeader className={props.className?.header}>
//           {columnData.map((key, id) => (
//             <Column id={id} isRowHeader className={props.className?.column}>
//               <div onClick={() => props.isSort && handleSort(key)}>{key}</div>
//             </Column>
//           ))}
//         </TableHeader>
//         <TableBody className={props.className?.body}>
//           {props.data &&
//             props.data.length > 0 &&
//             sortedData
//               .slice(pageRows.start, pageRows.end)
//               .map((item: any, id: any) => (
//                 <Row key={id} className={props.className?.row}>
//                   {noOfRows > id &&
//                     columnData.map((key) => <Cell>{item[key]}</Cell>)}
//                 </Row>
//               ))}
//         </TableBody>
//       </Table>
//       <div className=" flex w- full justify-center">
//         {props.isPagination && handlePagination()}
//       </div>
//     </div>
//   );
// };

// export default TorusTable;
//-----------------------------------------

//step 3

// import React, { useState } from "react";
// import {
//   Cell,
//   Column,
//   Input,
//   Row,
//   Table,
//   TableBody,
//   TableHeader,
//   Button,
//   Label,
//   ListBox,
//   ListBoxItem,
//   Popover,
//   Select,
//   SelectValue,
// } from "react-aria-components";
// import TorusDropDown from "./TorusDropDown";
// interface TableProps {
//   data?: any[];
//   className?: {
//     table?: string;
//     header?: string;
//     column?: string;
//     body?: string;
//     row?: string;
//   };
//   colour?: string;
//   isPagination?: boolean;
//   isFilter?: boolean;
//   isSort?: boolean;
// }

// const TorusTable = (props: TableProps) => {
//   const [noOfRows, setNoOfRows] = useState(
//     props.isPagination
//       ? 5
//       : props.data && props.data.length
//       ? props.data && props.data.length
//       : 0
//   );

//   const [search, setSearch] = useState("");
//   const [pageRows, setPageRows] = useState({
//     start: 0,
//     end: props.isPagination ? 5 : props.data && props.data.length,
//   });
//   const [sortBy, setSortBy] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");

//   const sortedData: any =
//     props.data &&
//     props.data.length &&
//     props?.data.sort((a, b) => {
//       if (a && b && sortBy) {
//         const aValue = a[sortBy];
//         const bValue = b[sortBy];
//         if (sortOrder === "asc") {
//           return aValue > bValue ? 1 : -1;
//         } else {
//           return aValue < bValue ? 1 : -1;
//         }
//       } else {
//         return 0;
//       }
//     });

//   const handleSort = (column: any) => {
//     if (column === sortBy) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortOrder("asc");
//     }
//   };

//   console.log(props.data);

//   const columnData =
//     props.data && props.data.length > 0 ? Object.keys(props.data[0]) : [];

//   const handlePagination = () => {
//     const rows =
//       props.data && props.data.length > 0 ? props.data.length / noOfRows : 0;
//     return (
//       <div className="flex gap-2">
//         {Array.from({ length: rows + 1 }, (_, index) => (
//           <Button
//             key={index}
//             onPress={() =>
//               setPageRows({
//                 start: noOfRows * (index + 1 - 1) + 1,
//                 end: noOfRows * (index + 1),
//               })
//             }
//           >
//             {index + 1}
//           </Button>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div>
//         totalLength :{props.data && props.data.length}
//         noOfRows: {noOfRows}
//         pagination: {pageRows.start} - {pageRows.end}
//         search: {search}
//       </div>
//       <div className="flex justify-between">
//         {props.isFilter && (
//           <div>
//             <Input onChange={(e) => setSearch(e.target.value)} />
//           </div>
//         )}
//         {props.isPagination && (
//           <div>
//             <TorusDropDown
//               // selected={noOfRows}
//               setSelected={(e: any) => setNoOfRows(e.currentKey * 5)}
//               title={"Rows"}
//               classNames={"bg-red-500"}
//               items={[
//                 { key: "1", label: "5" },
//                 { key: "2", label: "10" },
//                 { key: "3", label: "15" },
//                 { key: "4", label: "20" },
//               ]}
//               selectionMode="single"
//             />
//           </div>
//         )}
//       </div>

//       <Table className={props.className?.table}>
//         <TableHeader className={props.className?.header}>
//           {columnData.map((key, id) => (
//             <Column id={id} isRowHeader className={props.className?.column}>
//               <div onClick={() => props.isSort && handleSort(key)}>{key}</div>
//             </Column>
//           ))}
//         </TableHeader>
//         <TableBody className={props.className?.body}>
//           {props.data &&
//             props.data.length > 0 &&
//             sortedData
//               .slice(pageRows.start, pageRows.end)
//               .filter((app: any) =>
//                 app[columnData[1]]
//                   .toLowerCase()
//                   .includes(search.trim().toLowerCase())
//               )
//               .map((item: any, id: any) => (
//                 <Row key={id} className={props.className?.row}>
//                   {noOfRows > id &&
//                     columnData.map((key) => <Cell>{item[key]}</Cell>)}
//                 </Row>
//               ))}
//         </TableBody>
//       </Table>
//       <div className=" flex w- full justify-center">
//         {props.isPagination && handlePagination()}
//       </div>
//     </div>
//   );
// };

// export default TorusTable;

import React, { useState } from "react";
import {
  Cell,
  Column,
  Input,
  Row,
  Table,
  TableBody,
  TableHeader,
  Button,
} from "react-aria-components";
import TorusDropDown from "./TorusDropDown";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
interface TableProps {
  data?: any[];
  className?: {
    table?: string;
    header?: string;
    column?: string;
    body?: string;
    row?: string;
    cell?: string;
  };
  colour?: string;
  isPagination?: boolean;
  isFilter?: boolean;
  isSearch?: boolean;
  isSort?: boolean;
}

const TorusTable = (props: TableProps) => {
  const [noOfRows, setNoOfRows] = useState(
    props.isPagination
      ? 5
      : props.data && props.data.length
      ? props.data && props.data.length
      : 0
  );

  const [search, setSearch] = useState("");
  const [pageRows, setPageRows] = useState({
    start: 0,
    end: props.isPagination ? 5 : props.data && props.data.length,
  });
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedData: any =
    props.data &&
    props.data.length &&
    props?.data.sort((a, b) => {
      if (a && b && sortBy) {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      } else {
        return 0;
      }
    });

  const handleSort = (column: any) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const headerStyle = twMerge(
    "sticky top-0 z-10 bg-gray-100/60 dark:bg-zinc-700/60 backdrop-blur-md supports-[-moz-appearance:none]:bg-gray-100 dark:supports-[-moz-appearance:none]:bg-zinc-700 forced-colors:bg-[Canvas] rounded-t-lg border-b dark:border-b-zinc-700",
    props.className?.header
  );

  const columnData =
    props.data && props.data.length > 0 ? Object.keys(props.data[0]) : [];

  const columnStyles = tv({
    extend: props.className?.column,
    base: "px-2 h-5 flex-1 flex gap-1 items-center overflow-hidden",
  });

  const rowStyle = tv({
    extend: props.className?.row,
    base: "group/row relative cursor-default select-none -outline-offset-2 text-gray-900 disabled:text-gray-300 dark:text-zinc-200 dark:disabled:text-zinc-600 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700/60 selected:bg-blue-100 selected:hover:bg-blue-200 dark:selected:bg-blue-700/30 dark:selected:hover:bg-blue-700/40",
  });

  const cellStyles = tv({
    extend: props.className?.cell,
    base: "border-b dark:border-b-zinc-700 group-last/row:border-b-0 [--selected-border:theme(colors.blue.200)] dark:[--selected-border:theme(colors.blue.900)] group-selected/row:border-[--selected-border] [:has(+[data-selected])_&]:border-[--selected-border] p-2 truncate -outline-offset-2",
  });

  const handlePagination = () => {
    const rows =
      props.data && props.data.length > 0 ? props.data.length / noOfRows : 0;
    return (
      <div className="flex gap-2">
        {Array.from({ length: rows + 1 }, (_, index) => (
          <Button
            key={index}
            onPress={() =>
              setPageRows({
                start: noOfRows * (index + 1 - 1) + 1,
                end: noOfRows * (index + 1),
              })
            }
          >
            {index + 1}
          </Button>
        ))}
      </div>
    );
  };
  return (
    <div>
      <div>
        totalLength :{props.data && props.data.length}
        noOfRows: {noOfRows}
        pagination: {pageRows.start} - {pageRows.end}
        search: {search}
      </div>
      <div className="flex justify-between">
        {props.isSearch && (
          <div>
            <Input onChange={(e) => setSearch(e.target.value)} />
          </div>
        )}
        {props.isPagination && (
          <div>
            <TorusDropDown
              // selected={noOfRows}
              setSelected={(e: any) => setNoOfRows(e.currentKey * 5)}
              title={"Rows"}
              classNames={"bg-red-500"}
              items={[
                { key: "1", label: "5" },
                { key: "2", label: "10" },
                { key: "3", label: "15" },
                { key: "4", label: "20" },
              ]}
              selectionMode="single"
            />
          </div>
        )}
      </div>

      <Table className={props.className?.table}>
        <TableHeader className={headerStyle}>
          {columnData.map((key, id) => (
            <Column id={id} isRowHeader className={columnStyles}>
              <div onClick={() => props.isSort && handleSort(key)}>{key}</div>
            </Column>
          ))}
        </TableHeader>
        <TableBody className={props.className?.body}>
          {props.data &&
            props.data.length > 0 &&
            sortedData
              .slice(pageRows.start, pageRows.end)
              .filter((app: any) =>
                app[columnData[1]]
                  .toLowerCase()
                  .includes(search.trim().toLowerCase())
              )
              .map((item: any, id: any) => (
                <Row key={id} className={rowStyle}>
                  {noOfRows > id &&
                    columnData.map((key) => (
                      <Cell className={cellStyles}>{item[key]}</Cell>
                    ))}
                </Row>
              ))}
        </TableBody>
      </Table>
      <div className=" flex w- full justify-center">
        {props.isPagination && handlePagination()}
      </div>
    </div>
  );
};

export default TorusTable;

{
  /* <TorusTable
data={user}
isFilter={true}
isSort={true}
className={{ table: "", header: "bg-red-500", row: "bg-blue-400" }}
isPagination={true}
/> */
}
