/* eslint-disable */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Cell,
  Column,
  Heading,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";

import { FaArrowDown } from "react-icons/fa";
import { Checkbox } from "react-aria-components";
import { BiLeftArrowAlt } from "react-icons/bi";
import { BiRightArrowAlt } from "react-icons/bi";

import {
  DeleteIcon,
  EditIcon,
  TickSign,
  UnTickSign,
} from "../../SVG_Application.jsx";

import { twMerge } from "tailwind-merge";
import TorusDialog from "../../torusComponents/TorusDialog.jsx";
import TorusInput from "../../torusComponents/TorusInput.jsx";
import TorusButton from "../../torusComponents/TorusButton.jsx";
import { TorusModellerContext } from "../../Layout.jsx";
import { isLightColor } from "../../asset/themes/useTheme.js";
import gsap from "gsap";

const defaultClassName = {
  table: "",
  tableHeader: "",
  tableBody: "",
  tableRow: "",
  tableCell: "",
};

export const TableDataContext = createContext(null);

export function TorusColumn(props) {
  return (
    <Column
      aria-label="Column"
      {...props}
      className={twMerge(
        "center   px-4 py-[0.8rem] text-xs font-medium focus:border-none focus:outline-none",
        props.className,
      )}
      style={{
        backgroundColor:`${props.columnBgColor}`,
        color:`${props.textColor}`,
      }}
    >
      {({ allowsSorting, sortDirection }) => (
        <div className="group  flex w-[100%] items-center justify-center">
          <div className="flex w-[100%] items-center justify-center gap-1">
            <div className="flex w-[80%] items-center justify-center">
              {props.children.charAt(0).toUpperCase() + props.children.slice(1)}
            </div>
            <div className="flex w-[20%] items-center justify-center  ">
              {allowsSorting && (
                <span
                  aria-hidden="true"
                  className="sort-indicator opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <FaArrowDown
                    size={12}
                    color="#667085"
                    className={` transition-rotate duration-100 ease-in-out ${
                      sortDirection === "ascending" ? "rotate-180" : ""
                    }`}
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Column>
  );
}

export function TorusTableHeader({
  columns,
  children,
  selectedKeys,
  className,
}) {
  let { selectionBehavior, isSkeleton, selectionMode } =
    useContext(TableDataContext);

  return (
    <TableHeader
      aria-label="Table Header"
      className={twMerge("sticky top-0 w-full", className)}
      style={{
        backgroundColor:`${columns[0].headerBgColor}`,
      }}
    >
      {/* Add extra columns for drag and drop and selection. */}
      {/* {allowsDragging && <Column />} */}
      {selectionBehavior === "toggle" && (
        <Column
          aria-label="Column"
          className={twMerge(
            `text-xs w-[${
              100 / columns.length + 1
            }%] px-[0.58vw] py-[0.8rem] font-medium focus:border-none focus:outline-none`,
            className,
          )}
        >
          {selectionMode === "multiple" && (
            <TorusColumnCheckbox
              slot="selection"
              selectedKeys={selectedKeys}
              className="cursor-pointer"
            />
          )}
        </Column>
      )}
      {isSkeleton ? (
        <>
          {children && typeof children === "function" && children({ columns })}
        </>
      ) : (
        <>
          {columns.map((column) => (
            <TorusColumn
              key={column.id}
              id={column.id}
              allowsSorting={column.allowsSorting}
              isRowHeader={column.isRowHeader}
              className={`w-[${100 / columns.length + 1}%]`}
            >
              {column.name}
            </TorusColumn>
          ))}
        </>
      )}
      {/* <Collection items={columns}>{children}</Collection> */}
    </TableHeader>
  );
}

export function TorusRow({ id, columns, className, children, ...otherProps }) {
  let { selectionBehavior, isSkeleton } = useContext(TableDataContext);

  const handleRowAction = (item) => {
    try {
      if (otherProps?.onAction) {
        otherProps?.onAction(item);
      } else {
        console.log("Action not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row
        aria-label="Row"
        {...otherProps}
        key={id}
        className={className}
        onAction={() => handleRowAction(otherProps?.item)}
      >
        {/* {allowsDragging && (
              <Cell className={"min-h-4"}>
                <Button slot="drag">≡</Button>
              </Cell>
            )} */}
        {selectionBehavior === "toggle" && (
          <Cell aria-label="Select row">
            <TorusCheckbox
              selectedKeys={otherProps?.selectedKeys}
              slot="selection"
              className="cursor-pointer"
              index={otherProps?.index}
            />

            {/* <TorusCheckBox type="single" /> */}
          </Cell>
        )}

        {isSkeleton ? (
          <>
            {children &&
              typeof children === "function" &&
              children({
                columns,
                item: otherProps?.item,
                index: otherProps?.index,
              })}
          </>
        ) : (
          <>
            {columns.map((column) => {
              if (column?.id == "Actions") {
                return (
                  <Cell
                    key={column?.id}
                    aria-label="Actions"
                    className={"border-b border-[#EAECF0]"}
                  >
                    <TableCellActions id={otherProps?.index} />
                  </Cell>
                );
              } else
                return (
                  <Cell
                    key={column?.id}
                    aria-label="table cell"
                    className={"border-b border-[#EAECF0]"}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center py-[1rem] text-xs font-normal ">
                      <RenderTableChildren>
                        {otherProps?.item?.[column?.id]}
                      </RenderTableChildren>
                    </div>
                  </Cell>
                );
            })}
          </>
        )}
      </Row>
    </>
  );
}

export function TorusCheckbox({ children, index, ...props }) {
  const { selectedRows, setSelectedRows, tableIndex, selectionMode } =
    useContext(TableDataContext);
  return (
    <Checkbox
      aria-label="Aria-checkbox"
      {...props}
      className={"w-full, h-full, flex items-center justify-center"}
      isIndeterminate={
        selectedRows &&
        Array.from(selectedRows).length > 0 &&
        (selectedRows.has(index) || selectedRows.has("all"))
          ? true
          : false
      }
    >
      {({ isIndeterminate }) => (
        <>
          <div
            className="checkbox"
            onClick={() => {
              if (selectedRows.has(index)) {
                if (selectionMode === "multiple")
                  setSelectedRows(
                    (prev) =>
                      new Set(
                        Array.from(prev).filter((item) => item !== index),
                      ),
                  );
                else setSelectedRows(new Set([]));
              } else if (
                selectedRows.has("all") &&
                selectionMode === "multiple"
              ) {
                setSelectedRows(
                  new Set(
                    Array.from(tableIndex).filter((item) => item !== index),
                  ),
                );
              } else {
                if (
                  Array.from(selectedRows).length + 1 ==
                    Array.from(tableIndex).length &&
                  selectionMode === "multiple"
                ) {
                  setSelectedRows(new Set(["all"]));
                } else if (selectionMode === "multiple")
                  setSelectedRows(
                    (prev) => new Set([...Array.from(prev), index]),
                  );
                else setSelectedRows(new Set([index]));
              }
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 18 18" aria-hidden="true">
              {isIndeterminate ? <TickSign /> : <UnTickSign />}
            </svg>
          </div>
          {children}
        </>
      )}
    </Checkbox>
  );
}
function TorusColumnCheckbox({ children, ...props }) {
  const { selectedRows, setSelectedRows } = useContext(TableDataContext);

  return (
    <Checkbox
      // {...props}
      slot={"selection"}
      className={
        "w-full, h-full, flex cursor-pointer items-center justify-center"
      }
      id="all"
      isIndeterminate={
        selectedRows &&
        Array.from(selectedRows).length > 0 &&
        selectedRows.has("all")
          ? true
          : false
      }
    >
      {({ isIndeterminate }) => (
        <>
          <div
            className="checkbox"
            onClick={() => {
              if (selectedRows.has("all")) {
                setSelectedRows(new Set([""]));
              } else {
                setSelectedRows(new Set(["all"]));
              }
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 18 18" aria-hidden="true">
              {isIndeterminate ? <TickSign /> : <UnTickSign />}
            </svg>
          </div>
          {children}
        </>
      )}
    </Checkbox>
  );
}

export const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  bgColor,
  borderColor,
  textColor,
  accntColor,
}) => {
  const paginationRef = useRef(null);

 
  const animateClick = (button) => {
    gsap.fromTo(
      button,
      { scale: 1 },
      { scale: 1.2, duration: 0.2, ease: "power1.out", yoyo: true, repeat: 1 }
    );
  };

  const handlePageChange = (page, buttonRef) => {
    if (page >= 1 && page <= totalPages) {
      animateClick(buttonRef); 
      setTimeout(() => setCurrentPage(page), 200); 
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 4;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(currentPage - 2, 1);
      let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div ref={paginationRef} className="flex w-full items-center justify-center gap-4">
      <button
        className="flex items-center gap-2 rounded border px-[0.58vw] py-[0.29vw] text-[0.72vw] shadow focus:outline-none"
        onClick={(e) => handlePageChange(currentPage - 1, e.currentTarget)}
        disabled={currentPage === 1}
        style={{
          backgroundColor: currentPage === 1 ? accntColor : bgColor,
          color:
            currentPage === 1
              ? isLightColor(accntColor) === "light"
              ? "#000000"
                : "#FFFFFF"
              : `${textColor}80`,
          borderColor: currentPage === 1 ? accntColor : borderColor,
        }}
      >
        <BiLeftArrowAlt size={12} /> Previous
      </button>
      <div className="flex gap-2">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination-button-container text-[0.72vw] focus:outline-none ${
              page === currentPage
                ? "rounded px-[0.58vw] py-[0.29vw] border"
                : "px-[0.58vw] py-[0.29vw] border rounded"
            }`}
            style={{
              backgroundColor: page === currentPage ? accntColor : bgColor,
              color:
                page === currentPage
                  ? isLightColor(accntColor) === "light"
                    ? "#000000"
                    : "#ffffff"
                  : `${textColor}80`,
              borderColor: page === currentPage ? accntColor : borderColor,
            }}
            onClick={(e) => handlePageChange(page, e.currentTarget)}
          >
            {page}
          </button>
        ))}
        {totalPages > 4 && currentPage + 2 < totalPages && (
          <span className="text-[#667085] dark:text-[#FFFFFF]">...</span>
        )}
      </div>
      <button
        className="flex items-center gap-2 rounded border px-[0.58vw] py-[0.29vw] text-[0.72vw] text-[#344054] shadow focus:outline-none"
        onClick={(e) => handlePageChange(currentPage + 1, e.currentTarget)}
        disabled={currentPage === totalPages}
        style={{
          backgroundColor: currentPage === totalPages ? accntColor : bgColor,
          color:
            currentPage === totalPages
              ? isLightColor(accntColor) === "light"
              ?"#000000"
              : "#FFFFFF"
              : `${textColor}80`,
          borderColor: currentPage === totalPages ? accntColor : borderColor,
        }}
      >
        Next <BiRightArrowAlt size={12} />
      </button>
    </div>
  );
};

export function TorusDoTable({
  isAsync = false,
  allowsSorting = true,
  primaryColumn,
  tableData,
  onSave,
  onEdit,
  rowsPerPage = 6,
  isEditable = true,
  description,
  selectionMode,
  selectionBehavior,
  getAysncData,
  selectedRows,
  setSelectedRows,
  onDelete,
  onAdd,
  children,
  editableColumns,
  addableColumns,
  visibleColumns,
  isSkeleton = false,
  searchValue = "",
  SecurityTableHeight,
}) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [TotalColumns, setTotalColumns] = useState([]);
  // const [searchValue, setSearchValue] = useState<string>("");
  const {selectedTheme,selectedAccntColor} = useContext(TorusModellerContext);

  const [tableDataLength, setTableDataLength] = useState(0);
  const [tableIndex, setTableIndex] = useState(new Set([]));
  const descriptions = (description) => {
    if (description) {
      return (
        <div className="col-span-6 flex items-center justify-start dark:text-[#FFFFFF]">
          <div className="w-[100%] whitespace-nowrap text-sm font-normal">
            {`Keep track of ${description} and display them in a table. `}
          </div>
        </div>
      );
    }
  };

  const length = () => {
    if (tableDataLength) {
      return (
        <>
          <div className="rounded-md bg-[#F9F5FF] px-1.5 py-[2px] text-xs">
            <p className="font-medium text-[#0736C4]">{`${tableDataLength}+ ${description}`}</p>
          </div>
        </>
      );
    }
  };
  // const handleSerach = useCallback(
  //   (e) => {
  //     if (isAsync)
  //       getAysncData(page, e, rowsPerPage).then((data) => {
  //         if (data && data.tableData && data.tableData.length > 0) {
  //           setData(data.tableData);
  //           setSearchValue(e);
  //         } else {
  //           setData([]);
  //           setSearchValue(e);
  //         }
  //       });
  //     else setSearchValue(e);
  //   },
  //   [page, rowsPerPage, getAysncData]
  // );

  const serachedItems = React.useMemo(() => {
    try {
      if (isAsync) return data;
      return data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
      );
    } catch (e) {
      console.error(e);
    }
  }, [searchValue, data, page, rowsPerPage, getAysncData]);

  const items = React.useMemo(() => {
    try {
      if (isAsync) return serachedItems;
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      return serachedItems.slice(start, end);
    } catch (e) {
      console.error(e);
    }
  }, [page, serachedItems, rowsPerPage]);

  const filterColmns = React.useMemo(() => {
    try {
      if (!TotalColumns) return [];
      return TotalColumns.filter(
        (col) =>
          col?.name == primaryColumn || Array.from(columns).includes(col?.name),
      );
    } catch (e) {
      console.error(e);
    }
  }, [columns, primaryColumn, TotalColumns]);

  const sortedItems = React.useMemo(() => {
    try {
      if (!sortDescriptor) return items;
      return [...items].sort((a, b) => {
        const first = a[sortDescriptor?.column];
        const second = b[sortDescriptor?.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    } catch (e) {
      console.error(e);
    }
  }, [sortDescriptor, items]);

  const tableIndexs = useCallback(() => {
    try {
      if (data) {
        setTableIndex((prev) => {
          return new Set([...prev, ...data.map((item) => item[primaryColumn])]);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [data]);
  useEffect(() => {
    try {
      tableIndexs();
    } catch (e) {
      console.error(e);
    }
  }, [data]);
  const getColumns = (tableData, visibleColumns) => {
    try {
      let newColumns = new Set([]);
      tableData.forEach((item) => {
        if (typeof item == "object")
          Object.keys(item).forEach((key) => newColumns.add(key));
      });

      let cc = Array.from(newColumns).map((key) => ({
        id: key,
        name: key,
        key: key,
        label: key,
        isRowHeader: key == primaryColumn ? true : false,
        allowsSorting: allowsSorting,
      }));
      if (visibleColumns && visibleColumns.length > 0) {
        setTotalColumns([
          {
            id: primaryColumn,
            name: primaryColumn,
            key: primaryColumn,
            label: primaryColumn,
            isRowHeader: true,
            allowsSorting: allowsSorting,
          },
          ...visibleColumns.map((key) => {
            if (key !== primaryColumn) {
              return {
                id: key,
                name: key,
                key: key,
                label: key,
                isRowHeader: key == primaryColumn ? true : false,
                allowsSorting: allowsSorting,
              };
            }
          }),
        ]);
      } else {
        setTotalColumns(cc);
      }

      setColumns(newColumns);
    } catch (error) {
      console.error(error);
    }
  };
  let [selectedKeys, setSelectedKeys] = React.useState(null);
  useEffect(() => {
    try {
      if (Array.isArray(tableData) && !isAsync) {
        getColumns(tableData, visibleColumns);
        setData(tableData);
        setTableDataLength(tableData.length);

        setSortDescriptor({
          column: primaryColumn,
          direction: "ascending",
        });
      } else if (isAsync && getAysncData) {
        initalsAysncData(true, page);
      } else {
        console.error("tableData is not an array");
      }
    } catch (error) {
      console.error(error);
    }
  }, [tableData, primaryColumn, visibleColumns]);

  const initalsAysncData = (isIntial = false, page) => {
    try {
      getAysncData(page, searchValue, rowsPerPage)
        .then((data) => {
          if (
            data &&
            data.tableData &&
            Array.isArray(data.tableData) &&
            data?.totalPages
          ) {
            setData(data.tableData);
            if (isIntial) {
              getColumns(data.tableData, visibleColumns);
              setTableDataLength(data.totalPages / rowsPerPage);
              setTotalPages(data.totalPages);
              setSortDescriptor({
                column: primaryColumn,
                direction: "ascending",
              });
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      if (!isAsync) setTotalPages(Math.ceil(data.length / rowsPerPage));
    } catch (error) {
      console.log(error);
    }
  }, [data, rowsPerPage]);
  const handleSave = React.useCallback(() => {
    try {
      if (onSave && !isAsync) {
        let returnValue = [];
        if (
          (selectionMode == "multiple" || selectionMode == "single") &&
          selectedRows.size > 0
        ) {
          Array.from(selectedRows).forEach((item) => {
            if (item && item !== "all") returnValue.push(data[item]);
            else if (item && item === "all") returnValue = data;
          });
        } else {
          returnValue = data;
        }

        onSave(returnValue);
      }
    } catch (error) {
      console.error(error);
    }
  }, [data, onSave, selectedRows, selectionMode]);
  const handlePageChange = async (type) => {
    let newPage;
    if (type == "next") {
      newPage = (p) => {
        if (p < totalPages) return p + 1;
        return p;
      };
    }
    if (type == "prev") {
      newPage = (p) => {
        if (p > 1) return p - 1;
        return p;
      };
    }
    if (isAsync && getAysncData) {
      initalsAysncData(false, newPage(page));
    }
    setPage(newPage(page));
  };

  return (
    <TableDataContext.Provider
      value={{
        primaryColumn,
        data,
        setData,
        selectedRows,
        setSelectedRows,
        selectionMode,
        selectionBehavior,
        tableIndex,
        isAsync,
        onEdit,
        onDelete,
        onAdd,
        TotalColumns,
        editableColumns,
        addableColumns,
        isSkeleton,
      }}
    >
      {filterColmns &&
      filterColmns.length > 0 &&
      sortDescriptor &&
      totalPages ? (
        <div className="flex h-[85vh] w-full flex-col items-center ">
          {/* <div className="w-full h-[8%] flex justify-center items-center ">
                <div className="w-[95%] h-full flex justify-between items-center pl-2">
                  <div className="w-[60%] h-full bg-transparent rounded-md flex justify-start  ">
                    <div className="w-[100%] h-full bg-transparent gap-1 rounded-md flex flex-col items-center">
                      <div className="w-[100%] h-full bg-transparent">
                        <div className="grid grid-cols-12 gap-0.5 ">
                          <div className="col-span-3 flex justify-start items-center">
                            <div className="w-[100%]">
                              <span className="text-lg font-medium text-[#101828]">
                                {heading}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-3 flex justify-start items-center">
                            {length()}
                          </div>
                        </div>
                      </div>
                      <div className="w-[100%] h-full bg-transparent">
                        <div className="grid grid-cols-12 gap-0.5 ">
                          {descriptions(description)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[40%] h-full flex flex-row justify-end gap-[0.2rem] items-center">
                    <div className="w-[20%] flex justify-end items-center py-2">
                      <TorusButton
                        Children="Save"
                      //   width={"full"}
                        btncolor={"#FFFFFF"}
                        outlineColor="hover:ring-gray-200/50"
                        borderColor={"2px solid #D0D5DD"}
                        radius={"lg"}
                        color={"#000000"}
                        gap={"py-[0.2rem] px-[0.5rem]"}
                      //   height={"md"}
                        fontStyle={"text-sm font-medium text-[#344054]"}
                        startContent={<CiSaveUp1 size={22} color="#344054" />}
                        onPress={handleSave}
                      />
                    </div>
                    <div className="w-[20%] flex justify-end items-center py-2">
                      <TorusButton
                        Children="Import"
                      //   width={"full"}
                        btncolor={"#FFFFFF"}
                        outlineColor="hover:ring-gray-200/50"
                        borderColor={"2px solid #D0D5DD"}
                        radius={"lg"}
                        color={"#000000"}
                        gap={"py-[0.2rem] px-[0.5rem]"}
                      //   height={"md"}
                        fontStyle={"text-sm font-medium text-[#344054]"}
                        startContent={<ImportIcon />}
                      />
                    </div>
                    <div className="w-[25%] h-[100%] flex bg-transparent rounded-md  items-center">
                      <TorusDialog
                        key={"TableDelete"}
                        triggerElement={
                          <TorusButton
                            Children={`Add`}
                            size={"xs"}
                            btncolor={"#0736C4"}
                            outlineColor="hover:ring-[#0736C4]/50"
                            radius={"lg"}
                            color={"#ffffff"}
                            gap={"py-[0.2rem] px-[0.2rem]"}
                          //   height={"md"}
                            borderColor={"3px solid #0736C4"}
                            startContent={<PlusIcon />}
                            fontStyle={"text-sm font-medium text-[#FFFFFF]"}
                          />
                        }
                        classNames={{
                          dialogClassName: " flex  border-2 flex-col bg-white",
                        }}
                        title={"Add"}
                        message={"Edit"}
                        children={({ close }:any) => <AddAction close={close} />}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
          <div
            className={`w-full  ${
              totalPages > 1 ? "h-[73%]" : "h-[75%]"
            } flex flex-col items-center justify-between`}
          >
            <div
              className={`mt-2 h-full w-full overflow-y-scroll border-b-1 border-transparent ${SecurityTableHeight ? SecurityTableHeight : ""} `}
            >
              <Table
                aria-label="table"
                selectedKeys={selectedKeys}
                onSortChange={setSortDescriptor}
                sortDescriptor={sortDescriptor}
                onSelectionChange={setSelectedKeys}
                className={"h-full w-full "}
              >
                {isSkeleton ? (
                  <>
                    {children &&
                      typeof children === "function" &&
                      children({
                        selectedKeys,
                        sortedItems,
                        filterColmns,
                        primaryColumn,
                      })}
                  </>
                ) : (
                  <>
                    <TorusTableHeader
                      selectedKeys={selectedKeys}
                      columns={[
                        ...filterColmns,
                        isEditable && {
                          id: "Actions",
                          name: "Actions",
                          key: "Actions",
                          label: "Actions",
                          isRowHeader: false,
                        },
                      ]}
                    />

                    <TableBody
                      aria-label="table body"
                      renderEmptyState={() => (
                        <div className="text-center"> No Data </div>
                      )}
                    >
                      {sortedItems.map((item, index) => (
                        <>
                          <TorusRow
                            key={item[primaryColumn]}
                            item={item}
                            id={index}
                            index={item[primaryColumn]}
                            columns={[
                              ...filterColmns,
                              isEditable && {
                                id: "Actions",
                                name: "Actions",
                                key: "Actions",
                                label: "Actions",
                                isRowHeader: false,
                              },
                            ]}
                            selectedKeys={selectedKeys}
                            className={
                              "border-1 border-b-slate-800 border-l-transparent border-r-transparent border-t-transparent"
                            }
                          />
                        </>
                      ))}
                    </TableBody>
                  </>
                )}
              </Table>
            </div>
          </div>
          {/* {totalPages > 1 ? ( */}
          <div className="flex h-[7%] w-full items-center">
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              totalPages={totalPages}
              bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
              borderColor={`${selectedTheme && selectedTheme?.border}`}
              textColor={`${selectedTheme && selectedTheme?.text}`}
              accntColor = {`${selectedAccntColor && selectedAccntColor}`}
            />
          </div>
          {/* ) : null} */}

          {/* <div className="flex flex-col items-center justify-center pl-2 w-[100%] h-[5%]">
                <div className="w-[95%] flex justify-between "> */}
          {/* <div className="w-[85%] flex justify-start">
                    <span className="text-sm font-medium text-[#344054]">
                      Page {page} of {totalPages}
                    </span>
                  </div> */}

          {/* <div className="w-[15%] flex items-center justify-end gap-2"> */}
          {/* <TorusButton
                      Children={<FaArrowDown  color="white"/>}
                      size={"md"}
                      outlineColor="hover:ring-gray-200/50"
                      btncolor={"warning"}
                      borderColor={"2px solid #D0D5DD"}
                      fontStyle={"text-xs font-normal text-[#344054]"}
                      radius={"lg"}
                      gap={"py-[0.2rem] px-[0.5rem]"}
                      isIconOnly={true}
                    /> */}

          {/* <div className="w-[40%] flex justify-start">
                      <TorusButton
                        Children="Previous"
                        size={"md"}
                        btncolor={"#FFFFFF"}
                        outlineColor="hover:ring-gray-200/50"
                        borderColor={"2px solid #D0D5DD"}
                        fontStyle={"text-xs font-normal text-[#344054]"}
                        radius={"lg"}
                        gap={"py-[0.2rem] px-[0.5rem]"}
                        // startContent={<GiPreviousButton />}
                        onPress={() => handlePageChange("prev")}
                      />
                    </div> */}

          {/* <div className="w-[30%] flex justify-end">
                      <TorusButton
                        Children={"Next"}
                        btncolor={"#FFFFFF"}
                        outlineColor="hover:ring-gray-200/50"
                        borderColor={"2px solid #D0D5DD"}
                        fontStyle={"text-xs font-normal text-[#344054]"}
                        radius={"lg"}
                        gap={"py-[0.2rem] px-[0.5rem]"}
                        size={"md"}
                        // startContent={<GiPreviousButton />}
                        onPress={() => handlePageChange("next")}
                      />
                    </div> */}
          {/* </div> */}
          {/* </div>
              </div> */}
        </div>
      ) : (
        <div className="flex h-[80vh] w-full items-center justify-center dark:text-white">
          No Data available
        </div>
      )}
    </TableDataContext.Provider>
  );
}
export const TableCellActions = ({ id }) => {
  return (
    <div className=" flex h-full w-full flex-col items-center justify-center ">
      <div className="flex h-[50%] w-[100%] items-center justify-center ">
        <div className="flex h-[100%] w-[25%] items-center justify-end">
          <TorusDialog
            Header="      Do you want to delete this item"
            key={"TableDelete"}
            triggerElement={
              <TorusButton
                buttonClassName={"w-10 h-10 rounded-full"}
                Children={<DeleteIcon />}
                isIconOnly={true}
                btncolor={"bg-transparent"}
              />
            }
            classNames={{
              dialogClassName:
                " flex  border border-gray-300 dark: border-[#212121] rounded-lg flex-col bg-white",
            }}
            message={"Delete"}
          >
            {({ close }) => (
              <>
                <div className="p-4">
                  <Heading
                    aria-label="heading"
                    className="font-medium text-black "
                    slot="title"
                  >
                    Delete Item
                  </Heading>
                  <p className="mt-2">
                    This will permanently delete the selected item. Continue?
                  </p>
                  <DeleteAction id={id} close={close} />
                </div>
              </>
            )}
          </TorusDialog>
        </div>

        <div className="flex h-[100%] w-[25%] items-center justify-start">
          <TorusDialog
            key={"TableEdit"}
            triggerElement={
              <TorusButton
                buttonClassName={"w-10 h-10 rounded-full"}
                Children={<EditIcon />}
                isIconOnly={true}
                btncolor={"bg-#D0D5DD"}
              />
            }
            classNames={{
              dialogClassName:
                " flex  border-2 dark: border-[#212121]  flex-col bg-white",
            }}
            title={"Edit"}
            message={"Edit"}
          >
            {({ close }) => <EditAction id={id} close={close} />}
          </TorusDialog>
        </div>
      </div>
    </div>
  );
};
export const RenderTableChildren = ({ children }) => (
  <>
    {children && typeof children === "object" ? (
      <>
        {Array.isArray(children) ? (
          <div className=" flex flex-col gap-1">
            {children.map((item, index) => (
              <li className="text-sm font-medium" key={index}>
                <RenderTableChildren key={index}>{item}</RenderTableChildren>
              </li>
            ))}
          </div>
        ) : (
          <div className=" flex flex-col gap-1 ">
            {Object.keys(children).map((key) => (
              <div key={key} className=" flex items-center justify-start gap-2">
                <h1>{key}:</h1>
                <RenderTableChildren key={key}>
                  {children[key]}
                </RenderTableChildren>
              </div>
            ))}
          </div>
        )}
      </>
    ) : (
      children
    )}
  </>
);

const EditAction = ({ id, close }) => {
  const { data, setData, primaryColumn, onEdit, isAsync, editableColumns } =
    React.useContext(TableDataContext);
  const [obj, setObj] = React.useState(null);
  useEffect(() => {
    try {
      let orginalObj = data?.find((item) => item?.[primaryColumn] === id);
      let modifiedObj = {};
      Object.keys(orginalObj).forEach((key) => {
        if (key !== primaryColumn && editableColumns.includes(key)) {
          modifiedObj[key] = orginalObj[key];
        }
      });
      setObj(modifiedObj);
    } catch (error) {
      console.log(error);
    }
  }, [id, data]);

  const handleSave = () => {
    try {
      if (isAsync) onEdit(id, obj);
      setData((prev) => {
        return prev.map((item, index) => {
          if (item?.[primaryColumn] === id) {
            return { ...item, ...obj };
          }
          return item;
        });
      });
      close();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-[400px] w-[300px] flex-col  items-start justify-between gap-3 rounded-lg border-none bg-white p-2">
      <div className="h-[350px] w-full overflow-y-scroll p-2 scrollbar-hide">
        {obj && <Cycle obj={obj} setObj={setObj} />}
      </div>
      <div className="flex w-full justify-center">
        <TorusButton
          buttonClassName={
            "bg-[#0736C4] w-[95%] h-[45px] border-none text-white"
          }
          Children={"Save"}
          onPress={handleSave}
        />
      </div>
    </div>
  );
};
const AddAction = ({ close }) => {
  const {
    data,
    setData,
    primaryColumn,
    onAdd,
    isAsync,
    TotalColumns,
    addableColumns,
  } = React.useContext(TableDataContext);
  const [obj, setObj] = useState(null);

  useEffect(() => {
    let newObj = {};
    TotalColumns.forEach((item) => {
      if (item.key !== primaryColumn && addableColumns.includes(item?.key))
        newObj = { ...newObj, [item?.key]: "" };
    });
    setObj(newObj);
  }, []);

  const handleSave = () => {
    if (isAsync && onAdd) onAdd(obj);
    setData((prev) => {
      return [...prev, obj];
    });
    close();
  };
  return (
    <div className="flex h-[400px] w-[300px] flex-col  items-start justify-between gap-3 rounded-lg border-none bg-white p-2">
      <div className="h-[350px] w-full overflow-y-scroll p-2 scrollbar-hide">
        {obj && <Cycle obj={obj} setObj={setObj} />}
      </div>
      <div className="flex w-full justify-center">
        <TorusButton
          buttonClassName={
            "bg-[#0736C4] w-[95%] h-[45px] border-none text-white"
          }
          Children={"Add"}
          onPress={handleSave}
        />
      </div>
    </div>
  );
};

const DeleteAction = ({ id, close }) => {
  const { data, setData, primaryColumn, onDelete, isAsync } =
    useContext(TableDataContext);

  const handleDelete = () => {
    try {
      if (isAsync) onDelete(id);
      setData((prev) => {
        return prev.filter((item, index) => item?.[primaryColumn] !== id);
      });
      close();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-[100px] w-[400px] flex-row  items-center justify-end gap-3 rounded-lg border-none bg-white">
      <TorusButton
        buttonClassName={"bg-gray-200 w-[80px] h-[40px] text-black"}
        Children={"Cancel"}
        onPress={close}
      />
      <TorusButton
        buttonClassName={"bg-red-500 w-[80px] h-[40px] text-white"}
        Children={"Delete"}
        onPress={handleDelete}
      />
    </div>
  );
};

const Cycle = ({ obj, setObj }) => {
  console.log(obj, "obj");
  return (
    <>
      {obj && Array.isArray(obj) ? (
        obj?.map((ele, index) => (
          <>
            {ele && (
              <li>
                <Cycle
                  key={index}
                  obj={ele}
                  setObj={(newObj) =>
                    setObj(
                      obj && obj?.map((e, i) => (i === index ? newObj : e)),
                    )
                  }
                />
              </li>
            )}
          </>
        ))
      ) : obj && typeof obj == "object" ? (
        Object.keys(obj).map((ele) => {
          if (typeof obj[ele] === "object")
            return (
              <>
                <p>{ele}:</p>
                <Cycle
                  key={ele}
                  obj={obj[ele]}
                  setObj={(newObj) => setObj({ ...obj, [ele]: newObj })}
                />
              </>
            );
          return (
            <TorusInput
              key={ele}
              variant="bordered"
              label={ele}
              labelColor="text-[#000000]/50"
              borderColor="[#000000]/50"
              outlineColor="focus:ring-[#000000]/50"
              placeholder=""
              isDisabled={false}
              onChange={(e) => setObj({ ...obj, [ele]: e })}
              radius="lg"
              width="xl"
              height="xl"
              textColor="text-[#000000]"
              bgColor="bg-[#FFFFFF]"
              value={obj[ele]}
              type="text"
            />
          );
        })
      ) : (
        <TorusInput
          variant="bordered"
          labelColor="text-[#000000]/50"
          borderColor="[#000000]/50"
          outlineColor="focus:ring-[#000000]/50"
          placeholder=""
          isDisabled={false}
          onChange={(e) => setObj(e)}
          radius="lg"
          width="xl"
          height="xl"
          textColor="text-[#000000]"
          bgColor="bg-[#FFFFFF]"
          value={obj != null ? obj : ""}
          type="text"
        />
      )}
    </>
  );
};
