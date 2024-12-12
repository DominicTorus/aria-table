/* eslint-disable */
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { Tooltip } from '@nextui-org/tooltip';
import { Toast } from 'primereact/toast';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { IoFilterOutline } from 'react-icons/io5';
import useOnClickOutsideRef from '../../../commonComponents/customhooks/outsidecall';

import Deletepop from '../utils/Deletepop';
import TableUidecider from './TableUidecider';

import { Input } from 'react-aria-components';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { CiSearch } from 'react-icons/ci';
import { GrSplits } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { booleanContext } from '../../../jonui/NewNodeInfoSidebar';
import TorusButton from '../../../torusComponents/TorusButton';
import TorusModularInput from '../../../torusComponents/TorusModularInput.jsx';
import { BuilderContext } from '../../builder';
import { RenderTooltip } from '../utils/RenderTooltip';
import TableInput from './TableInput.jsx';
import Pagination from './pagination.jsx';
import TorusDropDown from '../../../torusComponents/TorusDropDown.jsx';

export default function Tableui({
  toogleFunctionality = true,
  keyJson,
  ArrayJson,
  path,
  children,
}) {
  const { functionality, editedValues, setEditedValues, builderChildren } =
    useContext(BuilderContext);

  const { expandTableUi, shownLength } = useContext(booleanContext);

  const [deltekys, setdleteKyes] = useState(null);

  const [selectedkey, setSelectedkey] = useState(null);
  const [selectedhead, setSelectedhead] = useState(null);
  const [showhead, setShowhead] = useState(null);

  const [headkey, setHeadkey] = useState(null);
  const [hoverhead, sethoverhead] = useState(null);

  const modalRef = useOnClickOutsideRef(() => setSelectedkey(false));
  const modalRefs = useOnClickOutsideRef(() => setSelectedhead(false));

  const [newkey, setNewkey] = useState(null);
  const [deletepop, setDeletepop] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedColumns, setSelectedColumns] = useState([]);

  const [search, setSearch] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState({
    column: '',
    direction: 'ascending',
  });

  const json = React.useMemo(() => ArrayJson, [ArrayJson]);

  const uniqueColumns = React.useMemo(() => {
    try {
      let uniq = [];

      Object.keys(json) &&
        Object.keys(json).length > 0 &&
        Object.keys(json)?.map((key) => {
          Object.keys(json[key]).map((ele) => {
            if (!uniq.includes(ele) && ele !== 'path' && ele !== 'isHeader') {
              uniq.push(ele);
            }
          });
        });
      setSelectedColumns(uniq);

      return uniq;
    } catch (e) {
      console.error(e);
    }
  }, [json]);

  const handlepath = (keys2) => {
    try {
      let index = '';
      json &&
        json.length > 0 &&
        json.map((item, i) => {
          if (Object.keys(item).includes(keys2)) {
            if (index == '') index = i;
          }
        });
      let paths = path + '.' + index + '.' + keys2;
      let result;

      result = paths.split('.');
      result.shift();
      result = result.join('.');
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  const toast = useRef(null);

  const handlekeyhead = (newkey) => {
    try {
      json &&
        json.length > 0 &&
        json.map((items, key) => {
          if (newkey) {
            if (!Object.keys(items).includes(newkey)) {
              functionality('add', path + '.' + key, {
                key: newkey,
                values: '',
                options: 'string',
              });
              setNewkey('');
            } else {
              toast.current.show({
                severity: 'warm',
                summary: 'warming',
                detail: 'Key already exists',
                life: 1000,
              });
            }
          } else {
            toast.current.show({
              severity: 'warm',
              summary: 'Warming',
              detail: 'Key should not be empty',
              life: 1000,
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handlehead = (e) => {
    try {
      setHeadkey(e.target.value);
    } catch (e) {
      console.error(e);
    }
  };

  const handlekeyDelete = (keys) => {
    try {
      setDeletepop(false);
      Object.keys(json).length > 0 &&
        Object.keys(json)?.map((key) => {
          Object.keys(json[key]).length > 0 &&
            Object.keys(json[key]).map((ele) => {
              if (ele == keys) {
                functionality('delete', path + '.' + key + '.' + keys);
                setDeletepop(false);
              }
            });
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handlekeyedit = useCallback(
    (e, headkey, keys) => {
      try {
        Object.keys(json).length > 0 &&
          Object.keys(json)?.map((key) => {
            Object.keys(json[key]).map((ele) => {
              if (ele == keys) {
                functionality(
                  'edit',
                  path + '.' + key + '.' + keys,
                  e.target.value,
                );
              }
            });
          });
      } catch (error) {
        console.error(error);
      }
    },
    [json, path, functionality],
  );

  const handlerow = useCallback(() => {
    try {
      let newrow = {};
      uniqueColumns &&
        uniqueColumns.length > 0 &&
        uniqueColumns.map((key) => {
          if (key.toLowerCase() == 'datatype') {
            newrow = {
              ...newrow,
              [key]: {
                selectedValue: '',
                type: 'singleSelect',
                selectionList: [
                  'Int',
                  'String',
                  'Float',
                  'Boolean',
                  'DateTime',
                  'Json',
                ],
              },
            };
          } else if (key.toLowerCase() == 'isrequired') {
            newrow = {
              ...newrow,
              [key]: {
                value: false,
                type: 'checkbox',
              },
            };
          } else newrow = { ...newrow, [key]: '' };
        });

      if (Object.keys(newrow).length > 0) {
        functionality('add', path, {
          key: Object.keys(json).length,
          options: 'string',
          values: newrow,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [json, path, uniqueColumns]);

  const filteredColumns = React.useMemo(() => {
    try {
      if (json) {
        let visibleColumns = Object.keys(json);
        if (search) {
          const filteredColumns = visibleColumns.filter((parentKey) =>
            Object.keys(json[parentKey]).some((key) => {
              if (
                json[parentKey][key]
                  .toString()
                  .toLowerCase()
                  .includes(search.toString().toLowerCase())
              )
                return true;
              if (
                editedValues?.[path + '.' + parentKey + '.' + key] &&
                editedValues?.[path + '.' + parentKey + '.' + key]
                  .toString()
                  .toLowerCase()
                  .includes(search.toString().toLowerCase())
              )
                return true;
              return false;
            }),
          );

          return filteredColumns;
        } else return visibleColumns;
      } else return [];
    } catch (e) {
      console.error(e);
    }
  }, [search, json]);

  const totalPages = React.useMemo(() => {
    try {
      if (filteredColumns.length > 0) {
        const rowsPerPage = 5;
        const pages = Math.ceil(filteredColumns.length / rowsPerPage);
        return pages;
      } else return 0;
    } catch (e) {
      console.error(e);
    }
  }, [filteredColumns]);

  const handleRowDelete = useCallback(
    (keys) => {
      try {
        Object.keys(json).length > 0 &&
          functionality('delete', path + '.' + keys);
      } catch (e) {
        console.error(e);
      }
    },
    [path, json],
  );

  const currentPage = React.useMemo(() => {
    try {
      return page > totalPages ? totalPages : page;
    } catch (e) {
      console.error(e);
    }
  }, [totalPages, page]);

  const items = React.useMemo(() => {
    try {
      if (shownLength) {
        const rowsPerPage = shownLength;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredColumns.slice(start, end);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentPage, filteredColumns]);

  const sortedItems = React.useMemo(() => {
    try {
      return [...items].sort((a, b) => {
        const first = a[Object.keys(a)[0]];
        const second = b[Object.keys(b)[0]];
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      });
    } catch (e) {
      console.error(e);
    }
  }, [sortDescriptor, items]);

  const tableExWrapperHeightClass = React.useMemo(() => {
    const length = items.length;
    const height =
      {
        1: 'h-[20vh]',
        2: 'h-[30vh]',
        3: 'h-[40vh]',
        4: 'h-[50vh]',
        5: 'h-[75vh]',
      }[length] || 'h-[72vh]';
    return `${height} w-[100%] transition-all ease-in-out duration-300`;
  }, [items]);

  const tableWrapperHeightClass = React.useMemo(() => {
    const length = items.length;
    const height =
      {
        1: 'h-[15vh]',
        2: 'h-[25vh]',
        3: 'h-[36vh]',
        4: 'h-[40vh]',
        5: 'h-[46vh]',
      }[length] || 'h-[72vh]';
    return `${height} w-[100%] transition-all ease-in-out duration-300`;
  }, [items]);

  return (
    <div className="flex min-h-[100%] w-full flex-col items-center  ">
      <Toast ref={toast} />

      {json.length > 0 && toogleFunctionality && (
        <div
          className={`flex ${expandTableUi ? 'h-[6.56vh]' : 'h-full'}   w-[100%] flex-row items-center  justify-center`}
        >
          {builderChildren &&
            typeof builderChildren === 'function' &&
            builderChildren({
              children: ({ achildren }) => (
                <>
                  <div className="flex h-full flex-row items-center justify-center gap-2">
                    <Input
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      key={path + 'search'}
                      isClearable={false}
                      type="search"
                      startcontent={<CiSearch />}
                      // value={search}
                      placeholder="Search"
                      className={
                        'flex h-[3.98vh] w-[17.34vw] items-center justify-center rounded-md border border-gray-300 bg-[#F4F5FA] text-[0.72vw] text-black     placeholder:text-[0.72vw]  dark:border-[#212121] dark:bg-[#0F0F0F] dark:text-white'
                      }
                    />

                    <Popover
                      placement="right"
                      itemClasses={{
                        title: 'text-sm font-bold',
                      }}
                    >
                      <PopoverTrigger>
                        <div className="flex h-[3.98vh] w-[6.25vw] cursor-pointer items-center justify-center gap-2  rounded-md bg-[#F4F5FA] dark:bg-[#0F0F0F]">
                          <GrSplits className="text-[0.72vw] text-black dark:text-white" />
                          <p className="text-[0.72vw] font-light text-black dark:text-white">
                            Coloumns
                          </p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className={
                          ' h-[60%] rounded-sm p-1 text-sm  font-bold  text-gray-500 dark:bg-[#242424]  dark:text-white '
                        }
                        key="keys"
                        aria-label="Keys"
                        title="Add Keys"
                      >
                        <div className=" flex flex-row items-center justify-center ">
                          <TorusModularInput
                            key={'table' + path}
                            placeholder={'Enter Column Name'}
                            onChange={(e) => {
                              setNewkey(e);
                            }}
                            textSize={'text-[0.72vw]'}
                            endContent={
                              <div className="flex gap-1">
                                <button
                                  className={
                                    ' rounded-full bg-white p-1  dark:bg-transparent'
                                  }
                                  onClick={() => {
                                    handlekeyhead(newkey);
                                  }}
                                >
                                  <FaCheck
                                    size={16}
                                    color="#326FD1"
                                    className="hover:text-gray-500"
                                  />
                                </button>

                                <button
                                  className={
                                    ' rounded-full bg-white p-1  dark:bg-transparent'
                                  }
                                  onClick={() => {
                                    setNewkey('');
                                  }}
                                >
                                  <IoMdClose
                                    size={16}
                                    color="#326FD1"
                                    className="hover:text-gray-500"
                                  />
                                </button>
                              </div>
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <TorusDropDown
                      title={
                        <div className="flex w-full flex-row items-center justify-center gap-2">
                          <IoFilterOutline className="text-[0.72vw] text-black dark:text-white" />
                          <p className="text-[0.72vw] font-medium text-black dark:text-white">
                            Filter
                          </p>
                        </div>
                      }
                      classNames={{
                        buttonClassName:
                          'flex h-[3.98vh] w-[5vw] cursor-pointer items-center justify-center rounded-md bg-[#F4F5FA] dark:bg-[#0F0F0F]',
                      }}
                      selectionMode="multiple"
                      selected={selectedColumns}
                      setSelected={setSelectedColumns}
                      items={
                        uniqueColumns &&
                        uniqueColumns.length > 0 &&
                        uniqueColumns?.map((column) => {
                          return {
                            label: column,
                            value: column,
                            key: column,
                          };
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {children}
                    {achildren}
                  </div>
                </>
              ),
            })}
        </div>
      )}

      {json && uniqueColumns.length > 0 && (
        <div
          className={` 
               w-[97%]
              ${
                selectedColumns.length > 5
                  ? `${expandTableUi ? 'h-[75vh] w-[97%]  ' : 'h-[300vh] w-[60vw] '}`
                  : ``
              }
            `}
        >
          {/* 
            ${
              selectedColumns.length > 5
                ? `${expandTableUi ? "w-[90vw] overflow-x-scroll" : "h-[300vh] w-[60vw] overflow-y-hidden overflow-x-scroll"}`
                : ``
            }
          */}
          <div
            className={`" ${
              expandTableUi ? 'h-[75vh] w-[99%] ' : ' h-[50vh] w-[100%]'
            } 
              flex items-baseline justify-center`}
          >
            <table
              id="table"
              className={`mt-2 
                ${
                  expandTableUi
                    ? `${tableExWrapperHeightClass}`
                    : `${tableWrapperHeightClass}`
                }  gap-2 bg-white p-2 text-black dark:bg-[#161616] dark:text-white `}
            >
              <tr>
                {selectedColumns &&
                  selectedColumns.length > 0 &&
                  selectedColumns.map((ele, index) => {
                    if (ele !== 'path' && ele !== 'isHeader')
                      return (
                        <th
                          key={ele + index}
                          className=" h-[4.81vh] bg-[#F4F5FA] p-2  first:rounded-l-md dark:bg-[#0F0F0F] "
                          scope="col"
                        >
                          {showhead && selectedhead == ele + index ? (
                            <TorusModularInput
                              key={ele + index}
                              defaultValue={ele}
                              onChange={(e) => handlehead(e)}
                              otherMethod={{
                                onKeyDown: (e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handlekeyedit(e, headkey, ele);

                                    setSelectedhead(null);
                                  }
                                },
                                ref: modalRefs,
                              }}
                            />
                          ) : (
                            <div
                              className="  flex items-center  gap-1 overflow-hidden text-start "
                              onMouseEnter={(e) => {
                                e.preventDefault();
                                sethoverhead(ele);
                              }}
                              onMouseLeave={(e) => {
                                e.preventDefault();
                                sethoverhead(null);
                              }}
                            >
                              <span
                                className=" flex items-center  text-start text-[0.72vw] font-normal capitalize"
                                onClick={(e) => {
                                  setSelectedhead(ele + index);
                                  setShowhead(true);
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                {ele}
                              </span>
                              {keyJson &&
                                keyJson.hasOwnProperty(handlepath(ele)) && (
                                  <Tooltip
                                    key={path + '.' + ele}
                                    content={
                                      <RenderTooltip
                                        tooltip={keyJson[handlepath(ele)]}
                                      />
                                    }
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>
                                        <AiOutlineInfoCircle className="text-black dark:text-white" />
                                      </span>
                                    </div>
                                  </Tooltip>
                                )}
                              <span
                                className="flex cursor-pointer content-center"
                                title="Delete"
                                style={{
                                  visibility:
                                    hoverhead == ele ? 'visible' : 'hidden',
                                }}
                                htmlFor=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  setdleteKyes(ele);

                                  setDeletepop(true);
                                }}
                              >
                                <RiDeleteBin6Line className="text-black dark:text-white" />
                              </span>
                            </div>
                          )}
                        </th>
                      );
                  })}
                <th className="h-[4.81vh] rounded-r-md  bg-[#F4F5FA] p-2   dark:bg-[#0F0F0F]">
                  <TorusButton
                    onPress={() => {
                      if (json && uniqueColumns.length > 0) handlerow();
                    }}
                    Children={
                      <div className="flex h-[1.66vw] w-[1.66vw] items-center justify-center rounded border  border-black/15 bg-white dark:border-white/25 dark:bg-[#0F0F0F] ">
                        <p className="text-[1.5vw] font-light text-black dark:text-white">
                          +
                        </p>
                      </div>
                    }
                    buttonClassName="flex cursor-pointer items-center justify-center rounded bg-[#F4F5FA] dark:bg-[#0F0F0F] w-[3vw] h-[3.98vh]"
                  />
                </th>
              </tr>

              {items?.length > 0 ? (
                <tbody
                  className="h-full w-full   text-start"
                  style={{
                    width: '100%',
                    height: '90%',
                  }}
                >
                  {items?.length > 0 &&
                    items?.map((parentKey) => (
                      <tr
                        key={path + '.' + parentKey}
                        className={' transition duration-300 ease-in-out '}
                      >
                        {selectedColumns &&
                          selectedColumns.length > 0 &&
                          selectedColumns?.map((key, index) => {
                            if (
                              json[parentKey] &&
                              !json[parentKey].hasOwnProperty('QueryParams') &&
                              Object.keys(json[parentKey]).includes(key) &&
                              typeof json[parentKey][key] !== 'object'
                            ) {
                              return (
                                <td
                                  style={{
                                    width: 100 / selectedColumns.length + '%',
                                  }}
                                  key={path + '.' + parentKey + '.' + key}
                                  scope="row"
                                  className={` overflow-hidden whitespace-nowrap bg-white dark:bg-[#161616]
                                `}
                                >
                                  <TableInput
                                    path={path}
                                    keys={parentKey + '.' + key}
                                    json={json}
                                    editedValues={editedValues}
                                    setEditedValues={setEditedValues}
                                    modalRef={modalRef}
                                    placeholder={'Enter ' + key}
                                  />
                                </td>
                              );
                            }
                            if (
                              json[parentKey] &&
                              json[parentKey].hasOwnProperty('QueryParams') &&
                              Object.keys(json[parentKey]).includes(key) &&
                              typeof json[parentKey][key] !== 'object'
                            ) {
                              return (
                                <td
                                  style={{
                                    width: 100 / selectedColumns.length + '%',
                                  }}
                                  key={path + '.' + parentKey + '.' + key}
                                  scope="row"
                                  className={` overflow-hidden whitespace-nowrap bg-white dark:bg-[#161616] 
                                 `}
                                >
                                  <span
                                    className={` text-start text-[0.83vw] text-black  dark:text-white`}
                                    title={json[parentKey][key]}
                                  >
                                    {json[parentKey][key]}
                                  </span>
                                </td>
                              );
                            }
                            if (
                              json[parentKey] &&
                              Object.keys(json[parentKey]).includes(key) &&
                              typeof json[parentKey][key] == 'object'
                            ) {
                              return (
                                <td
                                  style={{
                                    width: 100 / selectedColumns.length + '%',
                                  }}
                                  key={path + '.' + parentKey + '.' + key}
                                  className={` overflow-hidden whitespace-nowrap bg-white dark:bg-[#161616] 
                                 `}
                                >
                                  <TableUidecider
                                    key={path + '.' + parentKey + '.' + key}
                                    keyJson={keyJson}
                                    data={json[parentKey][key]}
                                    path={path + '.' + parentKey + '.' + key}
                                  />
                                </td>
                              );
                            }
                            if (
                              json[parentKey] &&
                              !Object.keys(json[parentKey]).includes(key)
                            ) {
                              return (
                                <td
                                  style={{
                                    width: 100 / selectedColumns.length + '%',
                                  }}
                                  className={` overflow-hidden whitespace-nowrap  text-[0.83vw]
                                 text-black dark:text-white`}
                                >
                                  ---
                                </td>
                              );
                            }
                          })}

                        <td>
                          <TorusButton
                            isDisabled={json.length > 1 ? false : true}
                            onPress={() => {
                              handleRowDelete(parentKey);
                            }}
                            Children={
                              <p className="text-[0.72vw] font-light text-white dark:text-white">
                                DEL
                              </p>
                            }
                            buttonClassName={`${json.length > 1 ? 'bg-red-500' : 'bg-red-500/50 cursor-not-allowed'} flex cursor-pointer items-center justify-center rounded   w-[2vw] h-[3.98vh]`}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              ) : (
                <tr>
                  <th className="text-[0.72vw]">No items found</th>
                </tr>
              )}
            </table>
          </div>

          <Deletepop
            type=""
            id={deltekys}
            deletepop={deletepop}
            path={deltekys}
            setDeletepop={setDeletepop}
            deleteNode={handlekeyDelete}
          />
        </div>
      )}

      <div className="flex w-[100%] items-center justify-center border-t border-[#E5E9EB] py-[0.85vh] dark:border-[#212121]">
        {totalPages > 1 && (
          <div className="flex w-[80%] items-center justify-center ">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
