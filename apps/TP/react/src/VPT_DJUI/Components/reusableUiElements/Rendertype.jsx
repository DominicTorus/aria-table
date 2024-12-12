/* eslint-disable */
import { Textarea } from '@nextui-org/input';
import React, { memo, useCallback, useContext, useState } from 'react';

import { Input } from '@nextui-org/react';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';

import ReusableDropDown from '../../../commonComponents/reusableComponents/ReusableDropDown';
import { BuilderContext } from '../../builder';
const MultipleSelectDropdown = memo(({ data, path }) => {
  const { editedValues, setEditedValues } = useContext(BuilderContext);
  const { darkMode } = useContext(DarkmodeContext);
  const [selected, setSelected] = useState(null);

  return (
    <>
      {data && Object.keys(data).length > 0 && (
        <ReusableDropDown
          darkMode={darkMode}
          key={path}
          title={(
            editedValues[path + '.' + 'selectedValue'] ||
            selected ||
            data?.selectedValue || ['Select', '']
          ).join(',')}
          selectedKey={
            new Set(
              editedValues[path + '.' + 'selectedValue'] ||
                selected ||
                data?.selectedValue,
            )
          }
          handleSelectedKey={(e) => {
            setSelected(Array.from(e));
            setEditedValues((prev) => ({
              ...prev,
              [path + '.' + 'selectedValue']: Array.from(e),
            }));
          }}
          DropdownMenuClassName={
            data?.selectionList.length > 6 ? 'h-[200px] overflow-y-scroll' : ''
          }
          selectionMode="multiple"
          items={
            data && data?.selectionList.length > 0
              ? data?.selectionList?.map((item) => ({
                  label: item,
                  value: item,
                  key: item,
                }))
              : []
          }
        />
      )}
    </>
  );
});

const AllMultipleSelectDropdown = memo(({ data, path }) => {
  const { editedValues, setEditedValues } = useContext(BuilderContext);
  const { darkMode } = useContext(DarkmodeContext);
  const [selected, setSelected] = useState(null);

  return (
    <>
      {data && Object.keys(data).length > 0 && (
        <ReusableDropDown
          darkMode={darkMode}
          key={path}
          title={(
            editedValues[path + '.' + 'selectedValue'] ||
            data?.selectedValue || ['Select', '']
          ).join(',')}
          selectedKey={
            new Set(
              editedValues[path + '.' + 'selectedValue'] ?? data?.selectedValue,
            )
          }
          closeOnSelect={false}
          handleSelectedKey={(e) => {
            setSelected(Array.from(e));
            setEditedValues((prev) => {
              if (Array.from(e).includes('*')) {
                if (!prev?.[path + '.' + 'selectedValue'].includes('*'))
                  return {
                    ...prev,
                    [path + '.' + 'selectedValue']: ['*'],
                  };
                else
                  return {
                    ...prev,
                    [path + '.' + 'selectedValue']: Array.from(e).filter(
                      (item) => item !== '*',
                    ),
                  };
              }
              if (
                !Array.from(e).includes('*') &&
                Array.from(e).length === data?.selectionList?.length - 1
              ) {
                return {
                  ...prev,
                  [path + '.' + 'selectedValue']: ['*'],
                };
              }
              return {
                ...prev,
                [path + '.' + 'selectedValue']: Array.from(e),
              };
            });
          }}
          DropdownMenuClassName={
            data?.selectionList.length > 6 ? 'h-[200px] overflow-y-scroll' : ''
          }
          selectionMode="multiple"
          items={
            data && data?.selectionList.length > 0
              ? data?.selectionList?.map((item) => ({
                  label: item,
                  value: item,
                  key: item,
                }))
              : []
          }
        />
      )}
    </>
  );
});
const SingleSelectDropdown = memo(({ data, path }) => {
  const { darkMode } = useContext(DarkmodeContext);
  const { editedValues, setEditedValues } = useContext(BuilderContext);
  const [selected, setSelected] = useState(null);

  return (
    <>
      {data && Object.keys(data).length > 0 && (
        <div className="bg-transparent">
          <ReusableDropDown
            darkMode={darkMode}
            key={path}
            title={
              editedValues[path + '.' + 'selectedValue'] ||
              selected ||
              data?.selectedValue ||
              'Select'
            }
            selectedKey={
              new Set([
                editedValues[path + '.' + 'selectedValue'] ||
                  selected ||
                  data?.selectedValue ||
                  '',
              ])
            }
            handleSelectedKey={(e) => {
              setSelected(Array.from(e)[0]);
              setEditedValues((prev) => ({
                ...prev,
                [path + '.' + 'selectedValue']: Array.from(e)[0],
              }));
            }}
            items={
              data && data.selectionList.length > 0
                ? data.selectionList?.map((item) => {
                    return {
                      label: item,
                      value: item,
                      key: item,
                    };
                  })
                : []
            }
          />
        </div>
      )}
    </>
  );
});
export const Rendertype = ({ isAdmin, key, keys, obj, setObj, path }) => {
  const { functionality, editedValues, setEditedValues } =
    useContext(BuilderContext);

  const [selectedradio, setSelectedradio] = useState(null);
  const [Selectedjsonarray, setSelectedarray] = useState([]);
  const [isopen, setisopen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [selectedkey, setSelectedkey] = useState(null);
  const [selectedvalue, setSelectedvalue] = useState(null);
  const [keyvalue, setKeyvalue] = useState(null);
  const [value, setValue] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const { darkMode } = useContext(DarkmodeContext);

  const handleCheckboxChange = (value, isChecked) => {
    if (isChecked) {
      const pu = [...Selectedjsonarray, value];

      setSelectedarray(pu);
      setEditedValues((prev) => ({
        ...prev,
        [path + '.' + 'selectedChoices']: pu,
      }));
    } else {
      const pu = Selectedjsonarray.filter((item) => item !== value);
      setSelectedarray(pu);
      setEditedValues((prev) => ({
        ...prev,
        [path + '.' + 'selectedChoices']: pu,
      }));
    }
  };

  const handleRadioChange = (e) => {
    setSelectedradio(e.target.id);
    setEditedValues((prev) => ({
      ...prev,
      [path + '.' + 'selectedRadioValue']: e.target.id,
    }));
  };

  const handlekey = (e) => {
    setKeyvalue(e.target.value);
  };

  const handlevalue = (e) => {
    setValue(e.target.value);
  };

  const handletextarea = (e) => {
    setValue(e.target.value);
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    setIsValid(!!value);
  };

  const cycleinput = useCallback(
    (obj, ele) => {
      if (obj[ele] == 'input') {
        return (
          <>
            {selectedkey ? (
              <>
                <div className="">
                  <div
                    className="edit-tname"
                    style={{ display: selectedkey ? 'block ' : 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        border: '1px solid #CCC',
                        borderRadius: '20px',
                        padding: '5px',
                      }}
                    >
                      <input
                        type="text"
                        defaultValue={keys}
                        onChange={(e) => {
                          handlekey(e);
                        }}
                        style={{
                          boxShadow: 'none',
                          border: 'none',
                          height: '18px',
                          padding: '5px',
                          marginBottom: '5px',
                          backgroundColor: 'transparent',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            functionality('edit', path, keyvalue);
                            setSelectedkey(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedkey(keys);
                  }}
                >
                  <b htmlFor="text">{keys}:</b>
                </span>
              </>
            )}

            {selectedvalue ? (
              <>
                <div className="">
                  <div
                    className="edit-tname"
                    style={{ display: selectedvalue ? 'block ' : 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        border: '1px solid #CCC',
                        borderRadius: '20px',
                        padding: '5px',
                      }}
                    >
                      <input
                        type="text"
                        defaultValue={obj.values}
                        onChange={(e) => {
                          handlevalue(e);
                        }}
                        style={{
                          boxShadow: 'none',
                          border: 'none',
                          height: '18px',
                          padding: '5px',
                          marginBottom: '5px',
                          backgroundColor: 'transparent',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (value) {
                              functionality('update', path + '.' + 'values', {
                                value: value,
                              });
                            }

                            setSelectedvalue(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedvalue(obj.values);
                  }}
                >
                  <input
                    className="h-full w-[25%] rounded-xl bg-transparent outline-none"
                    style={{
                      borderTop: 'none',
                      borderRight: 'none',
                      borderLeft: 'none',
                    }}
                    type="text"
                    value={obj.values}
                  />
                </span>
              </>
            )}
          </>
        );
      }
      if (obj[ele] == 'input' && obj?.required) {
        return (
          <>
            <b> {keys}:</b>
            <div className="">
              <div className="edit-tname">
                <div
                  style={{
                    display: 'flex',
                    border: isValid ? '1px solid #CCC' : '1px solid red',
                    borderRadius: '20px',
                    padding: '5px',
                  }}
                >
                  <input
                    type="text"
                    value={obj.values}
                    onChange={handleInput}
                    style={{
                      height: '18px',
                      padding: '5px',
                      marginBottom: '5px',
                      backgroundColor: 'transparent',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isValid) {
                          functionality('edit', path, keyvalue);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }
      if (obj[ele] == 'number') {
        return (
          <>
            {selectedkey ? (
              <div className="">
                <div
                  className="edit-tname"
                  style={{ display: selectedkey ? 'block ' : 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      border: '1px solid #CCC',
                      borderRadius: '20px',
                      padding: '5px',
                    }}
                  >
                    <input
                      type="text"
                      defaultValue={keys}
                      onChange={(e) => {
                        handlekey(e);
                      }}
                      style={{
                        boxShadow: 'none',
                        border: 'none',
                        height: '18px',
                        padding: '5px',
                        marginBottom: '5px',
                        backgroundColor: 'transparent',
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          functionality('edit', path, keyvalue);
                          setSelectedkey(null);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <span
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedkey(keys);
                  }}
                >
                  <b htmlFor="number">{keys}:</b>
                </span>
              </>
            )}

            {selectedvalue ? (
              <>
                <div className="">
                  <div
                    className="edit-tname"
                    style={{ display: selectedvalue ? 'block ' : 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        border: '1px solid #CCC',
                        borderRadius: '20px',
                        padding: '5px',
                      }}
                    >
                      <Input
                        type="number"
                        defaultValue={obj.values}
                        onChange={(e) => {
                          handlevalue(e);
                        }}
                        style={{
                          boxShadow: 'none',
                          border: 'none',
                          height: '18px',
                          padding: '5px',
                          marginBottom: '5px',
                          backgroundColor: 'transparent',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (value) {
                              functionality('update', path + '.' + 'values', {
                                value: value,
                              });
                            }

                            setSelectedvalue(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedvalue(obj.values);
                  }}
                >
                  <Input
                    type="number"
                    value={obj.values}
                    classNames={{
                      base: 'w-full',
                      input: darkMode
                        ? 'bg-transparent text-white'
                        : 'bg-transparent text-slate-700',
                      inputWrapper: darkMode
                        ? [
                            'bg-transparent',
                            'text-white',
                            'text-sm',
                            'placeholder:text-sm text-white',
                          ]
                        : [
                            'bg-transparent',
                            'text-slate-700',
                            'text-sm',
                            'placeholder:text-sm text-zinc-700',
                          ],
                      label: darkMode
                        ? [
                            'data-[focused=true]:border-none text-sm font-bold text-white',
                          ]
                        : [
                            'data-[focused=true]:border-none text-sm font-bold text-black',
                          ],
                      inputWrapper: darkMode
                        ? [
                            'h-[10px] rounded-md text-white bg-transparent hover:bg-[#D9DEE8] hover:text-slate-700 border border-slate-50/50  ',
                          ]
                        : [
                            'h-[10px] rounded-md text-slate-700 bg-transparent hover:bg-[#D9DEE8] hover:text-slate-700 border border-slate-500/50  ',
                          ],
                    }}
                  />
                </span>
              </>
            )}
          </>
        );
      }
      if (obj[ele] == 'textarea') {
        return (
          <>
            {selectedkey ? (
              <>
                <div className="">
                  <div
                    className="edit-tname"
                    style={{ display: selectedkey ? 'block ' : 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        border: '1px solid #CCC',
                        borderRadius: '20px',
                        padding: '5px',
                      }}
                    >
                      <input
                        type="text"
                        defaultValue={keys}
                        onChange={(e) => {
                          handlekey(e);
                        }}
                        style={{
                          boxShadow: 'none',
                          border: 'none',
                          height: '18px',
                          padding: '5px',
                          marginBottom: '5px',
                          backgroundColor: 'transparent',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            functionality('edit', path, keyvalue);
                            setSelectedkey(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <>
                  <span
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedkey(keys);
                    }}
                  >
                    <b htmlFor="Textarea">{keys}:</b>
                  </span>
                </>
              </>
            )}

            {selectedvalue ? (
              <>
                <div className="">
                  <div
                    className="edit-tname"
                    style={{ display: selectedvalue ? 'block ' : 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        border: '1px solid #CCC',
                        borderRadius: '20px',
                        padding: '5px',
                      }}
                    >
                      <input
                        type="text"
                        defaultValue={obj.values}
                        onChange={(e) => {
                          handlevalue(e);
                        }}
                        style={{
                          boxShadow: 'none',
                          border: 'none',
                          height: '18px',
                          padding: '5px',
                          marginBottom: '5px',
                          backgroundColor: 'transparent',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (value) {
                              functionality('update', path + '.' + 'values', {
                                value: value,
                              });
                            }

                            setSelectedvalue(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedvalue(obj.values);
                  }}
                >
                  <Textarea
                    style={{ border: 'none' }}
                    value={obj.values}
                    rows={2}
                    cols={30}
                    className="w-[40%]"
                  />
                </span>
              </>
            )}
          </>
        );
      }
      if (obj[ele] == 'singleSelect' || obj[ele] == 'dropdown') {
        return (
          <div
            className="flex items-center justify-start gap-2"
            key={keys + 'key' + path}
          >
            <div className="flex flex-col gap-2  ">
              <h8
                style={{
                  fontSize: '13px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {keys}:
              </h8>
              <div className="ml-2">
                <SingleSelectDropdown
                  data={obj}
                  functionality={functionality}
                  path={path}
                  key={keys + 'key' + path}
                />
              </div>
            </div>
          </div>
        );
      }

      if (obj[ele] == 'allMultipleSelect') {
        return (
          <div
            className="flex items-center justify-start gap-2"
            key={keys + 'key' + path}
          >
            <div className="flex flex-col gap-2  ">
              <h8
                style={{
                  fontSize: '13px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {keys}:
              </h8>
              <div className="ml-2">
                <AllMultipleSelectDropdown
                  data={obj}
                  functionality={functionality}
                  path={path}
                  key={keys + 'key' + path}
                />
              </div>
            </div>
          </div>
        );
      }

      if (obj[ele] == 'multipleSelect') {
        return (
          <div
            className="flex items-center justify-start gap-2"
            key={keys + 'key' + path}
          >
            <div className="flex flex-col gap-2  ">
              <h8
                style={{
                  fontSize: '13px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {keys}:
              </h8>
              <div className="ml-2">
                <MultipleSelectDropdown
                  data={obj}
                  functionality={functionality}
                  path={path}
                  key={keys + 'key' + path}
                />
              </div>
            </div>
          </div>
        );
      }
      if (obj[ele] == 'checkbox') {
        return (
          <>
            {!toggle && (
              <span>
                <h8
                  style={{
                    fontSize: '13px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {keys.toUpperCase()}
                </h8>
                :
                <div>
                  {obj?.selectionChoice &&
                    obj?.selectionChoice.length > 0 &&
                    obj?.selectionChoice?.map((value, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          id={value}
                          name={value}
                          checked={
                            editedValues[path + '.selectedChoices'].includes(
                              value,
                            ) ?? obj?.selectedChoices.includes(value)
                          }
                          onChange={(e) =>
                            handleCheckboxChange(value, e.target.checked)
                          }
                        />
                        {/* <Checkbox
                      id={value}
                      name={value}
                      checked={obj?.selectedChoices.includes(value)}
                      onChange={(e) =>
                        handleCheckboxChange(value, e.target.checked)
                      }
                      size="md"
                    /> */}

                        <b htmlFor={value}>{value}</b>
                      </div>
                    ))}
                </div>
              </span>
            )}
            <h7
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              {keys}
            </h7>
            :
            <span
              style={{
                color: '#F49F7A',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              {obj?.selectedChoices && obj?.selectedChoices.join(',')}
            </span>
          </>
        );
      }
      if (obj[ele] == 'radio') {
        return (
          <>
            {
              <span>
                <h8
                  style={{
                    fontSize: '13px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {keys.toUpperCase()}
                </h8>
                :
                <div>
                  {(obj?.selectionRadioList).length > 0 &&
                    obj?.selectionRadioList?.map((value, index) => (
                      <div key={index}>
                        <input
                          type="radio"
                          id={value}
                          name={value}
                          checked={
                            editedValues[path + '.selectedRadioValue'] ===
                              value ?? obj?.selectedRadioValue === value
                          }
                          onChange={handleRadioChange}
                        />

                        {/* <Radio
                      id={value}
                      checked={obj?.selectedRadioValue === value}
                      onChange={handleRadioChange}
                      name={value}
                      value={value}
                      color="primary"
                      size="xs"
                    /> */}

                        <label htmlFor={value}>{value}</label>
                      </div>
                    ))}
                </div>
              </span>
            }
            <h7
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              {keys}
            </h7>
            :
            <span
              style={{
                color: '#F49F7A',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              {obj?.selectedRadioValue}
            </span>
          </>
        );
      }
    },
    [obj, keys],
  );

  return (
    <div>
      {Object.keys(obj).length > 0 &&
        Object.keys(obj[keys])?.map((ele) => {
          if (typeof obj == 'object') {
            Object.keys(obj).length > 0 &&
              Object.keys(obj)?.map((key) => {
                return cycleinput(obj[key], key);
              });
          }
          return cycleinput(obj[keys], ele);
        })}
    </div>
  );
};
