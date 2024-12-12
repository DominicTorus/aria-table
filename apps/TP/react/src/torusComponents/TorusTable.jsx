import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Cell,
  Checkbox,
  Column,
  Row,
  Tab,
  Table,
  TableBody,
  TableHeader,
  TabList,
  Tabs,
} from 'react-aria-components';
import { CiSaveUp1 } from 'react-icons/ci';
import { FaArrowDown } from 'react-icons/fa';
import {
  DeleteIcon,
  EditIcon,
  FilterIcon,
  ImportIcon,
  PlusIcon,
  TickSign,
  UnTickSign,
} from '../SVG_Application';
import TorusButton from './TorusButton';
import TorusDialog from './TorusDialog';
import TorusDropDown from './TorusDropDown';
import TorusInput from './TorusInput';
import TorusSearch from './TorusSearch';

const defaultClassName = {
  table: '',
  tableHeader: '',
  tableBody: '',
  tableRow: '',
  tableCell: '',
};
const TableDataContext = createContext();
function TorusColumn(props) {
  return (
    <Column
      {...props}
      className={
        'bg-[#EAECF0] py-[0.8rem] text-xs font-medium torus-focus:border-none torus-focus:outline-none'
      }
    >
      {({ allowsSorting, sortDirection }) => (
        <div className="flex  w-[100%] items-center justify-center">
          <div className="flex w-[100%] justify-between gap-1">
            <div className="flex w-[50%] justify-end">
              {props.children.charAt(0).toUpperCase() + props.children.slice(1)}
            </div>
            <div className="flex w-[50%] justify-start">
              {allowsSorting && (
                <span aria-hidden="true" className="sort-indicator">
                  <FaArrowDown
                    size={15}
                    color="#667085"
                    className={` transition-rotate duration-100 ease-in-out ${
                      sortDirection === 'ascending' ? 'rotate-180' : ''
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

function TorusTableHeader({ columns, children, selectedKeys }) {
  const { selectionBehavior, selectionMode } = useContext(TableDataContext);
  return (
    <TableHeader>
      {/* Add extra columns for drag and drop and selection. */}
      {/* {allowsDragging && <Column />} */}
      {selectionBehavior === 'toggle' && (
        <Column className={'bg-[#EAECF0]'}>
          {selectionMode === 'multiple' && (
            <TorusColumnCheckbox
              slot="selection"
              selectedKeys={selectedKeys}
              className="cursor-pointer"
            />

            // <TorusCheckBox type="single" />
          )}
        </Column>
      )}
      {columns.map((column) => (
        <TorusColumn
          key={column.id}
          id={column.id}
          allowsSorting={column.allowsSorting}
          isRowHeader={column.isRowHeader}
        >
          {column.name}
        </TorusColumn>
      ))}
      {/* {children} */}
      {/* <Collection items={columns}>{children}</Collection> */}
    </TableHeader>
  );
}

function TorusRow({ id, columns, children, ...otherProps }) {
  let { selectionBehavior } = useContext(TableDataContext);

  return (
    <>
      <Row {...otherProps} key={id}>
        {/* {allowsDragging && (
          <Cell className={"min-h-4"}>
            <Button slot="drag">≡</Button>
          </Cell>
        )} */}
        {selectionBehavior === 'toggle' && (
          <Cell>
            <TorusCheckbox
              selectedKeys={otherProps?.selectedKeys}
              slot="selection"
              className="cursor-pointer"
              index={otherProps?.index}
            />

            {/* <TorusCheckBox type="single" /> */}
          </Cell>
        )}
        {columns.map((column) => {
          if (column?.id == 'Actions') {
            return (
              <Cell
                className={'border-b border-[#EAECF0]'}
                children={<TableCellActions id={otherProps?.index} />}
              />
            );
          } else
            return (
              <Cell
                className={'border-b border-[#EAECF0]'}
                children={
                  <div className="flex h-full w-full flex-col items-center justify-center py-[1rem] text-xs font-normal ">
                    <RenderTableChildren
                      children={otherProps?.item?.[column?.id]}
                    />
                    {/* <hr
                      style={{
                        marginTop: "0.5rem",
                        width: "100%",
                        border: "1px solid #EAECF0",
                        borderRadius: "10px",
                      }}
                    /> */}
                  </div>
                }
              />
            );
        })}

        {/* <Collection items={columns}>{children}</Collection> 
        {children} 
        <RenderTableChildren key={id} columns={columns} data={children} /> */}
      </Row>
    </>
  );
}

function TorusCheckbox({ children, index, ...props }) {
  const { selectedRows, setSelectedRows, tableIndex, selectionMode } =
    useContext(TableDataContext);
  return (
    <Checkbox
      {...props}
      className={'w-full, h-full, flex items-center justify-center'}
      isIndeterminate={
        selectedRows &&
        Array.from(selectedRows).length > 0 &&
        (selectedRows.has(index) || selectedRows.has('all'))
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
                if (selectionMode === 'multiple')
                  setSelectedRows(
                    (prev) =>
                      new Set(
                        Array.from(prev).filter((item) => item !== index),
                      ),
                  );
                else setSelectedRows(new Set([]));
              } else if (
                selectedRows.has('all') &&
                selectionMode === 'multiple'
              ) {
                setSelectedRows(
                  new Set(tableIndex.filter((item) => item !== index)),
                );
              } else {
                if (
                  Array.from(selectedRows).length + 1 == tableIndex.length &&
                  selectionMode === 'multiple'
                ) {
                  setSelectedRows(new Set(['all']));
                } else if (selectionMode === 'multiple')
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
function TorusColumnCheckbox({ children, selectedKeys, ...props }) {
  const { selectedRows, setSelectedRows } = useContext(TableDataContext);

  return (
    <Checkbox
      // {...props}
      slot={'selection'}
      className={
        'w-full, h-full, flex cursor-pointer items-center justify-center'
      }
      id="all"
      isIndeterminate={
        selectedRows &&
        Array.from(selectedRows).length > 0 &&
        selectedRows.has('all')
          ? true
          : false
      }
    >
      {({ isIndeterminate }) => (
        <>
          <div
            className="checkbox"
            onClick={() => {
              if (selectedRows.has('all')) {
                setSelectedRows(new Set(['']));
              } else {
                setSelectedRows(new Set(['all']));
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
export function TorusTable({
  allowsSorting = true,
  primaryColumn,
  tableData,
  onSave,
  rowsPerPage = 6,
  isEditable = true,
  heading,
  description,
  selectionMode,
  selectionBehavior,
}) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [TotalColumns, setTotalColumns] = useState([]);
  const [serchValue, setSerchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set(['']));
  const [tableDataLength, setTableDataLength] = useState(0);

  const descriptions = (description) => {
    if (description) {
      return (
        <div className="col-span-6 flex items-center justify-start">
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
            <p className="font-medium text-[#0736C4]">{`${tableDataLength} ${description}`}</p>
          </div>
        </>
      );
    }
  };

  const serachedItems = React.useMemo(() => {
    try {
      if (!serchValue) return data;
      return data.filter((item) =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(serchValue.toLowerCase()),
      );
    } catch (e) {
      console.error(e);
    }
  }, [serchValue, data]);

  const items = React.useMemo(() => {
    try {
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
          col.name == primaryColumn || Array.from(columns).includes(col.name),
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

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      });
    } catch (e) {
      console.error(e);
    }
  }, [sortDescriptor, items]);
  const tableIndex = useMemo(() => {
    try {
      if (!tableData) return [];
      return tableData.map((item, index) => index);
    } catch (e) {
      console.error(e);
    }
  }, [tableData]);
  const getColumns = (tableData) => {
    try {
      let newColumns = new Set([]);
      tableData.forEach((item) => {
        if (typeof item == 'object')
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
      setTotalColumns(cc);

      setColumns(newColumns);
    } catch (error) {
      console.error(error);
    }
  };
  let [selectedKeys, setSelectedKeys] = React.useState(null);
  useEffect(() => {
    if (Array.isArray(tableData)) {
      getColumns(tableData);
      setData(tableData);
      setTableDataLength(tableData.length);

      setSortDescriptor({
        column: primaryColumn,
        direction: 'ascending',
      });
    } else {
      console.error('tableData is not an array');
    }
  }, [tableData, primaryColumn]);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / rowsPerPage));
  }, [data, rowsPerPage]);
  const handleSave = React.useCallback(() => {
    try {
      if (onSave) {
        let returnValue = [];
        if (
          (selectionMode == 'multiple' || selectionMode == 'single') &&
          selectedRows.size > 0
        ) {
          Array.from(selectedRows).forEach((item) => {
            if (item && item !== 'all') returnValue.push(data[item]);
            else if (item && item === 'all') returnValue = data;
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
        data,
        setData,
        selectedRows,
        setSelectedRows,
        selectionMode,
        selectionBehavior,
        tableIndex,
      }}
    >
      {filterColmns.length > 0 && sortDescriptor && totalPages && (
        <>
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-[95%] items-center justify-between pl-2">
              <div className="flex h-full w-[60%] justify-start rounded-md bg-transparent  ">
                <div className="flex h-full w-[100%] flex-col items-center gap-1 rounded-md bg-transparent">
                  <div className="h-full w-[100%] bg-transparent">
                    <div className="grid grid-cols-12 gap-0.5 ">
                      <div className="col-span-3 flex items-center justify-start">
                        <div className="w-[100%]">
                          <span className="text-lg font-medium text-[#101828]">
                            {heading}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-3 flex items-center justify-start">
                        {length()}
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-[100%] bg-transparent">
                    <div className="grid grid-cols-12 gap-0.5 ">
                      {descriptions(description)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex h-full w-[40%] flex-row items-center justify-end gap-[0.2rem]">
                <div className="flex w-[20%] items-center justify-end py-2">
                  <TorusButton
                    Children="Save"
                    width={'full'}
                    btncolor={'#FFFFFF'}
                    outlineColor="torus-hover:ring-gray-200/50"
                    borderColor={'2px solid #D0D5DD'}
                    radius={'lg'}
                    color={'#000000'}
                    gap={'py-[0.2rem] px-[0.5rem]'}
                    height={'md'}
                    fontStyle={'text-sm font-medium text-[#344054]'}
                    startContent={<CiSaveUp1 size={22} color="#344054" />}
                    onPress={handleSave}
                  />
                </div>
                <div className="flex w-[20%] items-center justify-end py-2">
                  <TorusButton
                    Children="Import"
                    width={'full'}
                    btncolor={'#FFFFFF'}
                    outlineColor="torus-hover:ring-gray-200/50"
                    borderColor={'2px solid #D0D5DD'}
                    radius={'lg'}
                    color={'#000000'}
                    gap={'py-[0.2rem] px-[0.5rem]'}
                    height={'md'}
                    fontStyle={'text-sm font-medium text-[#344054]'}
                    startContent={<ImportIcon />}
                  />
                </div>
                <div className="flex h-[100%] w-[25%] items-center rounded-md  bg-transparent">
                  <TorusButton
                    Children={`Add`}
                    size={'full'}
                    btncolor={'#0736C4'}
                    outlineColor="torus-hover:ring-[#0736C4]/50"
                    radius={'lg'}
                    color={'#ffffff'}
                    gap={'py-[0.2rem] px-[0.2rem]'}
                    height={'md'}
                    borderColor={'3px solid #0736C4'}
                    startContent={<PlusIcon />}
                    fontStyle={'text-sm font-medium text-[#FFFFFF]'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex h-[100%] w-[95%] items-center justify-center">
              <div className="flex h-full w-full items-center justify-end">
                <div className="flex h-full  w-[60%] rounded-md bg-transparent ">
                  <div className="h-full w-[20%] rounded-md bg-white pl-2">
                    <Tabs>
                      <TabList
                        aria-label="UnIdentified-Tabs"
                        className={'flex justify-between gap-0 bg-transparent'}
                      >
                        <Tab
                          className={
                            'rounded-l-md  border-2 border-[#D0D5DD] border-r-transparent bg-white px-[0.5rem] py-[0.2rem] torus-focus:bg-[#F9FAFB] torus-focus:outline-none '
                          }
                          id="FoR"
                        >
                          <span className="whitespace-nowrap text-xs font-normal text-black">
                            view all
                          </span>
                        </Tab>
                        <Tab
                          className={
                            'border-2  border-[#D0D5DD] bg-white px-[0.5rem] py-[0.2rem] torus-focus:bg-[#F9FAFB] torus-focus:outline-none  '
                          }
                          id="MaR"
                        >
                          <span className="text-xs font-normal text-black">
                            Monitered
                          </span>
                        </Tab>
                        <Tab
                          className={
                            'rounded-r-md  border-2 border-[#D0D5DD] border-l-transparent bg-white px-[0.5rem] py-[0.2rem] torus-focus:bg-[#F9FAFB] torus-focus:outline-none '
                          }
                          id="Emp"
                        >
                          <span className="text-xs font-normal text-black">
                            Text
                          </span>
                        </Tab>
                      </TabList>
                    </Tabs>
                  </div>
                </div>
                <div className="flex h-full w-[40%] flex-row items-center justify-between gap-2">
                  <div className="flex w-[80%] items-center justify-start">
                    <TorusSearch
                      variant="bordered"
                      labelColor="text-[#000000]/50"
                      borderColor="border-[#000000]/20"
                      outlineColor="torus-focus:ring-[#000000]/50"
                      placeholder="search"
                      onChange={setSerchValue}
                      isDisabled={false}
                      radius="lg"
                      textColor="text-[#000000]"
                      bgColor="bg-[#FFFFFF]"
                      value={serchValue}
                      type="text"
                    />
                  </div>
                  <div className="flex h-[100%] w-[20%] items-center justify-end rounded-md bg-transparent">
                    <TorusDropDown
                      title={'Filter'}
                      selectionMode="multiple"
                      selected={columns}
                      setSelected={setColumns}
                      items={TotalColumns.filter(
                        (col) => col.name != primaryColumn,
                      )}
                      btWidth={'full'}
                      btncolor={'#FFFFFF'}
                      btheight={'md'}
                      outlineColor="torus-hover:ring-gray-200/50"
                      radius={'lg'}
                      color={'#000000'}
                      gap={'py-[0.2rem] px-[0.5rem]'}
                      borderColor={'2px solid #D0D5DD'}
                      startContent={<FilterIcon />}
                      fontStyle={'text-sm font-medium text-[#344054]'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Table
              selectedKeys={selectedKeys}
              onSortChange={setSortDescriptor}
              sortDescriptor={sortDescriptor}
              onSelectionChange={setSelectedKeys}
              className={'mt-2 h-[90%] w-full'}
            >
              <TorusTableHeader
                selectedKeys={selectedKeys}
                columns={[
                  ...filterColmns,
                  isEditable && {
                    id: 'Actions',
                    name: 'Actions',
                    key: 'Actions',
                    label: 'Actions',
                    isRowHeader: false,
                  },
                ]}
              />

              <TableBody
                renderEmptyState={() => (
                  <div className="text-center"> No Data </div>
                )}
              >
                {sortedItems.map((item, index) => (
                  <>
                    <TorusRow
                      key={tableData.findIndex(
                        (el) => el[primaryColumn] == item[primaryColumn],
                      )}
                      item={item}
                      id={index}
                      index={data.findIndex(
                        (el) => el[primaryColumn] === item[primaryColumn],
                      )}
                      columns={[
                        ...filterColmns,
                        isEditable && {
                          id: 'Actions',
                          name: 'Actions',
                          key: 'Actions',
                          label: 'Actions',
                          isRowHeader: false,
                        },
                      ]}
                      selectedKeys={selectedKeys}
                      className={
                        'border-1 border-b-slate-800 border-l-transparent border-r-transparent border-t-transparent'
                      }
                    />
                  </>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-5 flex h-[15%] w-[100%] flex-col items-center justify-center pl-2">
            <div className="mt-3 flex w-[95%] justify-between">
              <div className="flex w-[85%] justify-start">
                <span className="text-sm font-medium text-[#344054]">
                  Page {page} of {totalPages}
                </span>
              </div>

              <div className="flex w-[15%] items-center justify-end gap-2">
                <div className="flex w-[40%] justify-start">
                  <TorusButton
                    Children="Previous"
                    size={'md'}
                    btncolor={'#FFFFFF'}
                    outlineColor="torus-hover:ring-gray-200/50"
                    borderColor={'2px solid #D0D5DD'}
                    fontStyle={'text-xs font-normal text-[#344054]'}
                    radius={'lg'}
                    gap={'py-[0.2rem] px-[0.5rem]'}
                    // startContent={<GiPreviousButton />}
                    onPress={() =>
                      setPage((p) => {
                        if (p > 1) return p - 1;
                        return p;
                      })
                    }
                  />
                </div>

                <div className="flex w-[30%] justify-end">
                  <TorusButton
                    Children={'Next'}
                    btncolor={'#FFFFFF'}
                    outlineColor="torus-hover:ring-gray-200/50"
                    borderColor={'2px solid #D0D5DD'}
                    fontStyle={'text-xs font-normal text-[#344054]'}
                    radius={'lg'}
                    gap={'py-[0.2rem] px-[0.5rem]'}
                    size={'md'}
                    // startContent={<GiPreviousButton />}
                    onPress={() =>
                      setPage((p) => {
                        if (p < totalPages) return p + 1;
                        return p;
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </TableDataContext.Provider>
  );
}
const TableCellActions = ({ id }) => {
  return (
    <div className=" flex h-full w-full flex-col items-center justify-center ">
      <div className="flex h-[50%] w-[100%] items-center justify-center ">
        <div className="flex h-[100%] w-[25%] items-center justify-end">
          <TorusDialog
            key={'TableDelete'}
            triggerElement={<TorusButton Children={<DeleteIcon />} />}
            classNames={{
              dialogClassName: ' flex  border-2 flex-col bg-white',
            }}
            title={'Delete'}
            message={'Edit'}
            children={({ close }) => <DeleteAction id={id} close={close} />}
          />
        </div>

        <div className="flex h-[100%] w-[25%] items-center justify-start">
          <TorusDialog
            key={'TableEdit'}
            triggerElement={<TorusButton Children={<EditIcon />} />}
            classNames={{
              dialogClassName: ' flex  border-2 flex-col bg-white',
            }}
            title={'Edit'}
            message={'Edit'}
            children={({ close }) => <EditAction id={id} close={close} />}
          />
        </div>
      </div>
    </div>
  );
};
const RenderTableChildren = ({ children }) => (
  <>
    {children && typeof children === 'object' ? (
      <>
        {Array.isArray(children) ? (
          <div className=" flex flex-col gap-1">
            {children.map((item, index) => (
              <li className="text-sm font-medium">
                <RenderTableChildren key={index} children={item} />
              </li>
            ))}
          </div>
        ) : (
          <div className=" flex flex-col gap-1 ">
            {Object.keys(children).map((key) => (
              <div key={key} className=" flex items-center justify-start gap-2">
                <h1>{key}:</h1>
                <RenderTableChildren key={key} children={children[key]} />
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
  const { data, setData } = React.useContext(TableDataContext);
  const [obj, setObj] = React.useState(null);
  useEffect(() => {
    setObj(data[id]);
  }, [id, data]);

  const handleSave = () => {
    setData((prev) => {
      return prev.map((item, index) => {
        if (index === id) {
          return { ...item, ...obj };
        }
        return item;
      });
    });
    close();
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {obj && <Cycle obj={obj} setObj={setObj} />}
      <TorusButton Children={'Save'} onPress={handleSave} />
    </div>
  );
};

const DeleteAction = ({ id, close }) => {
  const { data, setData } = React.useContext(TableDataContext);

  const handleDelete = () => {
    setData((prev) => {
      return prev.filter((item, index) => index !== id);
    });
    close();
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <TorusButton Children={'Cancel'} onPress={close} />
      <TorusButton Children={'Delete'} onPress={handleDelete} />
    </div>
  );
};

const Cycle = ({ obj, setObj }) => {
  return (
    <>
      {obj && Array.isArray(obj) ? (
        obj.map((ele, index) => (
          <li>
            <Cycle
              key={index}
              obj={ele}
              setObj={(newObj) =>
                setObj(obj.map((e, i) => (i === index ? newObj : e)))
              }
            />
          </li>
        ))
      ) : typeof obj == 'object' ? (
        Object.keys(obj).map((ele) => {
          if (typeof obj[ele] === 'object')
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
              outlineColor="torus-focus:ring-[#000000]/50"
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
          outlineColor="torus-focus:ring-[#000000]/50"
          placeholder=""
          isDisabled={false}
          onChange={(e) => setObj(e)}
          radius="lg"
          width="xl"
          height="xl"
          textColor="text-[#000000]"
          bgColor="bg-[#FFFFFF]"
          value={obj}
          type="text"
        />
      )}
    </>
  );
};
