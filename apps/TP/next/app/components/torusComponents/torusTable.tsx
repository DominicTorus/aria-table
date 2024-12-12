import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Cell,
  Column,
  Heading,
  Input,
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
  Checked,
  DeleteIcon,
  EditIcon,
  UnChecked,
} from "../../constants/svgApplications";
import { twMerge } from "tailwind-merge";
import TorusDialog from "./torusdialogmodal";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { hexWithOpacity } from "../../../lib/utils/utility";

export const TableDataContext = createContext<null | any>(null);
export function TorusColumn(props: any) {
  return (
    <Column
      aria-label="Column"
      {...props}
      className={twMerge(
        "text-xs  font-medium px-4 center bg-[#EAECF0] py-[0.8rem] focus:outline-none focus:border-none",
        props.className
      )}
      styles={props?.styles}
    >
      {({ allowsSorting, sortDirection }) => (
        <div className="w-[100%]  flex justify-center items-center group">
          <div className="w-[100%] flex items-center justify-center gap-1">
            <div
              className={`w-[80%] flex items-center  ${props?.leftalign ? "" : "justify-center"}`}
            >
              {props.children.charAt(0).toUpperCase() + props.children.slice(1)}
            </div>
            <div className="w-[20%] flex items-center justify-center  ">
              {allowsSorting && (
                <span
                  aria-hidden="true"
                  className="sort-indicator opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaArrowDown
                    size={12}
                    color="#667085"
                    className={` transition-rotate ease-in-out duration-100 ${
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
  styles,
}: any) {
  const { selectionBehavior, selectionMode, isSkeleton } =
    useContext(TableDataContext);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  return (
    <TableHeader
      style={{
        display: className?.includes("flex") ? "unset" : "",

        borderColor: styles?.borderColor || torusTheme["bordercard"],
      }}
      aria-label="Table Header"
      className={twMerge("w-full sticky top-0", className)}
    >
      {/* Add extra columns for drag and drop and selection. */}
      {/* {allowsDragging && <Column />} */}
      {selectionBehavior === "toggle" && (
        <Column
          aria-label="Column"
          className={twMerge(
            `text-xs font-medium px-[0.58vw] py-[0.8rem] focus:outline-none focus:border-none`,
            className
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
          {columns.map((column: any) => (
            <TorusColumn
              key={column.id}
              id={column.id}
              allowsSorting={column.allowsSorting}
              isRowHeader={column.isRowHeader}
              className={`w-[${100 / columns.length + 1}%]`}
            >
              {column.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </TorusColumn>
          ))}
        </>
      )}
      {/* <Collection items={columns}>{children}</Collection> */}
    </TableHeader>
  );
}

export function TorusRow({
  id,
  columns,
  className,
  children,
  ...otherProps
}: any) {
  let { selectionBehavior, isSkeleton } = useContext(TableDataContext);

  const handleRowAction = (item: any) => {
    if (otherProps?.onAction) {
      otherProps?.onAction(item);
    } else {
      console.log("Action not found");
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
          <Cell
            aria-label="Select row"
            className={otherProps?.disableSelection ? "invisible" : ""}
          >
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
            {columns.map((column: any) => {
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
                    <div className="w-full h-full flex flex-col items-center justify-center py-[1rem] text-xs font-normal ">
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

export function TorusCheckbox({ children, disabled, index, ...props }: any) {
  const { selectedRows, setSelectedRows, tableIndex, selectionMode } =
    useContext(TableDataContext);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);

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
                    (prev: any) =>
                      new Set(Array.from(prev).filter((item) => item !== index))
                  );
                else setSelectedRows(new Set([]));
              } else if (
                selectedRows.has("all") &&
                selectionMode === "multiple"
              ) {
                setSelectedRows(
                  new Set(
                    Array.from(tableIndex).filter((item) => item !== index)
                  )
                );
              } else {
                if (
                  Array.from(selectedRows).filter(Boolean).length + 1 ==
                    Array.from(tableIndex).length &&
                  selectionMode === "multiple"
                ) {
                  setSelectedRows(new Set(["all"]));
                } else if (selectionMode === "multiple")
                  setSelectedRows(
                    (prev: any) => new Set([...Array.from(prev), index])
                  );
                else setSelectedRows(new Set([index]));
              }
            }}
          >
            <svg
              className="h-5 w-5 mt-1.5"
              viewBox="0 0 18 18"
              aria-hidden="true"
            >
              {isIndeterminate ? <Checked fill={accentColor} /> : <UnChecked />}
            </svg>
          </div>
          {children}
        </>
      )}
    </Checkbox>
  );
}
function TorusColumnCheckbox({ children, ...props }: any) {
  const { selectedRows, setSelectedRows } = useContext(TableDataContext);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);

  return (
    <Checkbox
      // {...props}
      slot={"selection"}
      className={
        "w-full, h-full, flex items-center justify-center cursor-pointer"
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
              if (selectedRows && selectedRows.has("all")) {
                setSelectedRows(new Set([""]));
              } else {
                setSelectedRows(new Set(["all"]));
              }
            }}
          >
            <svg
              className="h-5 w-5 mt-1"
              viewBox="0 0 18 18"
              aria-hidden="true"
            >
              {isIndeterminate ? <Checked fill={accentColor} /> : <UnChecked />}
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
}: any) => {
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
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

  const handlePageChange = (page: any) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full flex items-center justify-center gap-4 ">
      <Button
        style={{ color: torusTheme["text"], borderColor: torusTheme["border"] }}
        className="px-[0.58vw] py-[0.29vw]  border rounded shadow flex items-center text-[0.72vw] gap-2 focus:outline-none"
        onPress={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      >
        <BiLeftArrowAlt fill={torusTheme["text"]} size={12} /> Previous
      </Button>
      <div className="flex gap-2">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            style={{
              color: page === currentPage ? accentColor : "#667085",
              backgroundColor:
                page === currentPage
                  ? hexWithOpacity(accentColor, 0.35)
                  : "transparent",
            }}
            className={`pagination-button text-[0.72vw] focus:outline-none dark:focus:bg-[#3063FF]/35 dark:text-[#FFFFFF] ${
              page === currentPage && `px-[0.58vw] py-[0.29vw] rounded`
            }`}
            onPress={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        {totalPages > 4 && currentPage + 2 < totalPages && (
          <span className="text-[#667085] dark:text-[#FFFFFF]">...</span>
        )}
      </div>
      {totalPages > 4 && currentPage + 1 < totalPages && (
        <Button
          style={{
            color: totalPages === currentPage ? accentColor : "#667085",
          }}
          className={`pagination-button text-[0.72vw] focus:outline-none dark:text-[#FFFFFF] ${
            totalPages === currentPage &&
            "bg-[#E3EAFF] px-[0.58vw] py-[0.29vw] rounded"
          }`}
          onPress={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )}
      <Button
        style={{ color: torusTheme["text"], borderColor: torusTheme["border"] }}
        className="px-[0.58vw] py-[0.29vw]  border rounded shadow flex items-center text-[0.72vw] gap-2 focus:outline-none aria-pressed:hidden"
        onPress={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        Next <BiRightArrowAlt fill={torusTheme["text"]} size={12} />
      </Button>
    </div>
  );
};

export function TorusTable({
  isAsync = false,
  allowsSorting = true,
  primaryColumn,
  tableData,
  onSave,
  onEdit,
  rowsPerPage = 6,
  isEditable = true,
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
  isFixedWidth = true,
  chwp = "73", //Custom height with pagination
  chwop = "75", //Custom height without pagination
  contentLessText = "No data found",
  styles,
  isPaginationRequired = true
}: any) {
  const [data, setData] = useState<any>([]);
  const [columns, setColumns] = useState<any>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<null | any>(null);
  const [page, setPage] = useState<any>(1);
  const [totalPages, setTotalPages] = useState<null | any>(null);
  const [TotalColumns, setTotalColumns] = useState<any>([]);
  const [tableDataLength, setTableDataLength] = useState<any>(0);
  const [tableIndex, setTableIndex] = useState<any>(new Set([]));
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);

  const serachedItems: any = React.useMemo(() => {
    try {
      if (isAsync) return data;
      return data.filter((item: any) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchValue.toLowerCase())
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
        (col: any) =>
          col?.name == primaryColumn || Array.from(columns).includes(col?.name)
      );
    } catch (e) {
      console.error(e);
    }
  }, [columns, primaryColumn, TotalColumns]);

  const sortedItems = React.useMemo(() => {
    try {
      if (!allowsSorting) return items;
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
        setTableIndex((prev: any) => {
          return new Set([
            ...prev,
            ...data.map((item: any) => item[primaryColumn]),
          ]);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [data]);
  useEffect(() => {
    tableIndexs();
  }, [data]);
  const getColumns = (tableData: any, visibleColumns: any) => {
    try {
      let newColumns: any = new Set([]);
      tableData.forEach((item: any) => {
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
          ...visibleColumns.map((key: any) => {
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
  let [selectedKeys, setSelectedKeys] = React.useState<null | any>(null);
  useEffect(() => {
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
  }, [tableData, primaryColumn, visibleColumns]);

  const initalsAysncData = (isIntial = false, page: any) => {
    try {
      getAysncData(page, searchValue, rowsPerPage).then((data: any) => {
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
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isAsync) setTotalPages(Math.ceil(data.length / rowsPerPage));
  }, [data, rowsPerPage]);
  const handleSave = React.useCallback(() => {
    try {
      if (onSave && !isAsync) {
        let returnValue: any = [];
        if (
          (selectionMode == "multiple" || selectionMode == "single") &&
          selectedRows.size > 0
        ) {
          Array.from(selectedRows).forEach((item: any) => {
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
        styles,
      }}
    >
      {filterColmns &&
      filterColmns.length > 0 &&
      sortDescriptor &&
      totalPages ? (
        <div
          className={`w-full ${isFixedWidth ? "h-screen" : "h-full"} flex flex-col items-center`}
          style={
            styles?.container || {
              backgroundColor: torusTheme["bgcard"],
              color: torusTheme["text"],
            }
          }
        >
          <div
            style={{
              height: totalPages > 1 ? `${chwp}%` : `${chwop}%`,
            }}
            className={`w-full flex flex-col justify-between items-center`}
          >
            <div
              className={`w-full overflow-y-scroll overflow-x-hidden mt-2 border-b-1 border-transparent`}
            >
              <Table
                aria-label="table"
                selectedKeys={selectedKeys}
                onSortChange={setSortDescriptor}
                sortDescriptor={sortDescriptor}
                onSelectionChange={setSelectedKeys}
                className={"w-full h-full "}
                style={
                  styles?.table || {
                    backgroundColor: torusTheme["bgcard"],
                    color: torusTheme["text"],
                  }
                }
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
                      style={
                        styles?.header || {
                          backgroundColor: torusTheme["bgcard"],
                          color: torusTheme["text"],
                        }
                      }
                    />

                    <TableBody
                      aria-label="table body"
                      renderEmptyState={() => (
                        <div className="text-center"> No Data </div>
                      )}
                      style={styles?.body}
                    >
                      {sortedItems.map((item: any, index: number) => (
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
                              "border-1 border-b-slate-800 border-t-transparent border-l-transparent border-r-transparent"
                            }
                            style={styles?.row}
                          />
                        </>
                      ))}
                    </TableBody>
                  </>
                )}
              </Table>
            </div>
          </div>
        
         {isPaginationRequired && <div className="w-full h-[7%] flex items-center">
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              totalPages={totalPages}
            />
          </div>}
        </div>
      ) : (
        <div
          style={{ color: torusTheme["text"] }}
          className={`flex items-center justify-center w-full h-[75vh]`}
        >
          {contentLessText}
        </div>
      )}
    </TableDataContext.Provider>
  );
}
export const TableCellActions = ({ id }: any) => {
  return (
    <div className=" w-full h-full flex flex-col items-center justify-center ">
      <div className="w-[100%] h-[50%] flex justify-center items-center ">
        <div className="w-[25%] h-[100%] flex justify-end items-center">
          <TorusDialog
            key={"TableDelete"}
            triggerElement={
              <Button className={"w-10 h-10 rounded-full"}>
                <DeleteIcon />
              </Button>
            }
            classNames={{
              dialogClassName:
                " flex  border border-gray-300 dark: border-[#212121] rounded-lg flex-col bg-white",
            }}
          >
            {({ close }: any) => (
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

        <div className="w-[25%] h-[100%] flex justify-start items-center">
          <TorusDialog
            key={"TableEdit"}
            triggerElement={
              <Button className={"w-10 h-10 rounded-full"}>
                <EditIcon />
              </Button>
            }
            classNames={{
              dialogClassName:
                " flex  border-2 dark: border-[#212121]  flex-col bg-white",
            }}
          >
            {({ close }: any) => <EditAction id={id} close={close} />}
          </TorusDialog>
        </div>
      </div>
    </div>
  );
};
export const RenderTableChildren = ({ children }: any) => (
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
              <div key={key} className=" flex gap-2 items-center justify-start">
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

const EditAction = ({ id, close }: any) => {
  const { data, setData, primaryColumn, onEdit, isAsync, editableColumns } =
    React.useContext(TableDataContext);
  const [obj, setObj] = React.useState<null | any>(null);
  useEffect(() => {
    let orginalObj = data?.find((item: any) => item?.[primaryColumn] === id);
    let modifiedObj: any = {};
    Object.keys(orginalObj).forEach((key) => {
      if (key !== primaryColumn && editableColumns.includes(key)) {
        modifiedObj[key] = orginalObj[key];
      }
    });
    setObj(modifiedObj);
  }, [id, data]);

  const handleSave = () => {
    if (isAsync) onEdit(id, obj);
    setData((prev: any) => {
      return prev.map((item: any, index: number) => {
        if (item?.[primaryColumn] === id) {
          return { ...item, ...obj };
        }
        return item;
      });
    });
    close();
  };
  return (
    <div className="w-[300px] bg-white h-[400px] rounded-lg  border-none flex flex-col gap-3 p-2 items-start justify-between">
      <div className="w-full h-[350px] overflow-y-scroll scrollbar-hide p-2">
        {obj && <Cycle obj={obj} setObj={setObj} />}
      </div>
      <div className="w-full flex justify-center">
        <Button
          className={"bg-[#0736C4] w-[95%] h-[45px] border-none text-white"}
          onPress={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
const AddAction = ({ close }: any) => {
  const {
    data,
    setData,
    primaryColumn,
    onAdd,
    isAsync,
    TotalColumns,
    addableColumns,
  } = React.useContext(TableDataContext);
  const [obj, setObj] = useState<null | any>(null);

  useEffect(() => {
    let newObj: any = {};
    TotalColumns.forEach((item: any) => {
      if (item.key !== primaryColumn && addableColumns.includes(item?.key))
        newObj = { ...newObj, [item?.key]: "" };
    });
    setObj(newObj);
  }, []);

  const handleSave = () => {
    if (isAsync && onAdd) onAdd(obj);
    setData((prev: any) => {
      return [...prev, obj];
    });
    close();
  };
  return (
    <div className="w-[300px] bg-white h-[400px] rounded-lg  border-none flex flex-col gap-3 p-2 items-start justify-between">
      <div className="w-full h-[350px] overflow-y-scroll scrollbar-hide p-2">
        {obj && <Cycle obj={obj} setObj={setObj} />}
      </div>
      <div className="w-full flex justify-center">
        <Button
          className={
            "bg-[#0736C4] w-[95%] h-[45px] border-none text-white"
          }
          onPress={handleSave}
        >Add</Button>
      </div>
    </div>
  );
};

const DeleteAction = ({ id, close }: any) => {
  const { data, setData, primaryColumn, onDelete, isAsync } =
    useContext(TableDataContext);

  const handleDelete = () => {
    if (isAsync) onDelete(id);
    setData((prev: any) => {
      return prev.filter(
        (item: any, index: any) => item?.[primaryColumn] !== id
      );
    });
    close();
  };
  return (
    <div className="w-[400px] bg-white h-[100px] rounded-lg  border-none flex flex-row gap-3 items-center justify-end">
      <Button
        className={"bg-gray-200 w-[80px] h-[40px] text-black"}
        onPress={close}
      >Cancel</Button>
      <Button
        className={"bg-red-500 w-[80px] h-[40px] text-white"}
        onPress={handleDelete}
      >Delete</Button>
    </div>
  );
};

const Cycle = ({ obj, setObj }: any) => {
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
                  setObj={(newObj: any) =>
                    setObj(
                      obj && obj?.map((e, i) => (i === index ? newObj : e))
                    )
                  }
                />
              </li>
            )}
          </>
        ))
      ) : obj && typeof obj == "object" ? (
        Object.keys(obj).map((ele, i) => {
          if (typeof obj[ele] === "object")
            return (
              <React.Fragment key={i}>
                <p>{ele}:</p>
                <Cycle
                  key={ele}
                  obj={obj[ele]}
                  setObj={(newObj: any) => setObj({ ...obj, [ele]: newObj })}
                />
              </React.Fragment>
            );
          return (
            <Input
              key={JSON.stringify(ele)}
              placeholder=""
              onChange={(e: any) => setObj({ ...obj, [ele]: e })}
              value={obj[ele]}
              type="text"
            />
          );
        })
      ) : (
        <Input
          placeholder=""
          onChange={(e: any) => setObj(e)}
          value={obj != null ? obj : ""}
          type="text"
        />
      )}
    </>
  );
};
