import React, { useContext } from 'react';
import { Cell, TableBody } from 'react-aria-components';
import TorusDropDown from '../../torusComponents/TorusDropDown';
import { handlNestedObj } from '../../utils/utils';
import SecurityTree from './SecurityTree';
import {
  TorusColumn,
  TorusDoTable,
  TorusRow,
  TorusTableHeader,
} from './TorusDoTable';
import { TorusModellerContext } from '../../Layout';

function SecurityTable({
  data,
  securityData,
  searchValue,
  visibleColumns,
  dropDownDownData,
  setSelectedDropDownValue,
  selectedActionName,
}) {
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);
  const RenderTableCell = (item, column) => {
    switch (column?.id) {
      case 'accessProfile':
        return (
          <div
            className="text-[0.83vw] font-medium "
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {item.accessProfile}
          </div>
        );
      case 'orgGrp':
        console.log('orgGrp comes here...');

        return <SecurityTree organizationData={item?.orgGrp} />;
      case 'Number of users':
        return <>{item['no.ofusers']}</>;
      case 'Access Rules':
        return (
          <TorusDropDown
            btncolor={selectedTheme?.bgCard}
            title={
              <>
                {(
                  <span style={{ color: `${selectedTheme?.text}`,fontWeight:"400" }} >
                    {handlNestedObj(
                      'get',
                      '',
                      'SIFlag.selectedValue',
                      selectedActionName && selectedActionName.length === 1
                        ? ['accessProfile', 'resource']
                        : selectedActionName && selectedActionName.length === 2
                          ? ['accessProfile', 'resource', 'resourceId']
                          : selectedActionName &&
                            selectedActionName.length === 3 && [
                              'accessProfile',
                              'resource',
                              'resourceId',
                              'resourceId',
                            ],
                      selectedActionName && [
                        item.accessProfile,
                        ...selectedActionName,
                      ],
                      securityData.accessProfile,
                    ) ??"Select Access Rule"}
                  </span>
                ) }
              </>
            }
            
            
            fontStyle="text-[0.83vw] font-medium whitespace-nowrap"
            selectionMode="single"
            setSelected={(data) => {
              setSelectedDropDownValue(
                {
                  accessProfile: item.accessProfile,
                  uiType: 'dropdown',
                  selectedValue: Array.from(data)[0],
                  selectionList:
                    dropDownDownData &&
                    dropDownDownData.map((item) => item.key),
                },
                selectedActionName,
              );
            }}
            items={
              securityData?.accessProfile &&
              securityData?.accessProfile.some(
                (cc) =>
                  item.accessProfile === cc?.accessProfile &&
                  cc.security.artifact.SIFlag.selectedValue === 'BA',
              ) &&
              selectedActionName.length == 2
                ? [
                    { key: 'BTO', label: 'Block This Only' },
                    { key: 'BA', label: 'Block All' },
                  ]
                : securityData?.accessProfile &&
                    securityData?.accessProfile.some(
                      (cc) =>
                        item.accessProfile === cc?.accessProfile &&
                        cc.security.artifact.SIFlag.selectedValue === 'BA',
                    ) &&
                    selectedActionName.length == 3
                  ? [{ key: 'BTO', label: 'Block This Only' }]
                  : dropDownDownData
            }
            borderColor={selectedTheme?.border}
            listBoxBackground={selectedTheme?.bg}
            listItemColor={selectedTheme?.text}
            secbuttonClassName="w-[70%]"
            isDropDown={true}
            classNames={{
              buttonClassName:
                'rounded flex items-center justify-center px-2 outline-none  h-[4.87vh] border w-[13.33vw] text-[0.83vw] font-medium text-start',
              popoverClassName:
                'flex item-center justify-center w-[13.33vw] text-[0.83vw]',
              listBoxClassName:
                'overflow-y-auto border',
              listBoxItemClassName: 'flex  justify-between text-md',
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full gap-5">
      <div
        className=" h-full w-[100%]"
        style={{
          backgroundColor: `${selectedTheme?.bg}`,
        }}
      >
        <TorusDoTable
          primaryColumn="accessProfile"
          tableData={data}
          visibleColumns={visibleColumns}
          isSkeleton={true}
          searchValue={searchValue}
          SecurityTableHeight="max-h-[calc(100vh-12.5rem)]"
          rowsPerPage={1}
        >
          {({ selectedKeys, filterColmns, sortedItems, primaryColumn }) => (
            <>
              {console.log(filterColmns, visibleColumns, 'filterColmns')}

              <TorusTableHeader
                className="rounded-none"
                selectedKeys={selectedKeys}
                columns={[
                  ...filterColmns,
                  {
                    id: 'Number of users',
                    name: 'Number of users',
                    allowsSorting: false,
                    isRowHeader: false,
                  },
                  {
                    id: 'Access Rules',
                    name: 'Access Rules',
                    allowsSorting: false,
                    isRowHeader: false,
                  },
                ]}
              >
                {({ columns }) => (
                  <>
                    {console.log(columns, 'filterColmnscolumns')}
                    {columns.map((column, i) => (
                      <TorusColumn
                        key={column.id}
                        id={column.id}
                        allowsSorting={column.allowsSorting}
                        isRowHeader={column.isRowHeader}
                        columnBgColor={`${selectedTheme?.bgCard}`}
                        textColor={`${selectedTheme?.text}`}
                        className={`cursor-pointer  text-[0.72vw] font-medium leading-[2.22vh] ${
                          i == 0
                            ? 'rounded-bl-xl rounded-tl-xl'
                            : i == columns.length - 1
                              ? 'rounded-br-xl rounded-tr-xl '
                              : i == columns.length - 2
                                ? 'w-[30%]border-b flex items-center justify-start border-transparent '
                                : ''
                        }`}
                      >
                        {column.name === 'orgGrp'
                          ? 'Organizational Matrix'
                          : visibleColumns.includes(column.name)
                            ? column.name
                            : ''}
                      </TorusColumn>
                    ))}
                  </>
                )}
              </TorusTableHeader>
              <TableBody
                className={'overflow-y-auto dark:bg-[#161616]'}
                renderEmptyState={() => (
                  <div className="overflow-y-auto text-center"
                  style={{
                    backgroundColor: `${selectedTheme?.bgCard}`,
                    color: `${selectedTheme?.text}`,
                  }}
                  >
                    {' '}
                    No Data{' '}
                  </div>
                )}
              >
                {sortedItems.map((item, index) => (
                  <TorusRow
                    key={index}
                    item={item}
                    id={index}
                    index={item[primaryColumn]}
                    columns={[
                      ...filterColmns,
                      {
                        id: 'Number of users',
                        name: 'Number of users',
                        allowsSorting: false,
                        isRowHeader: false,
                      },
                      {
                        id: 'Access Rules',
                        name: 'Access Rules',
                        allowsSorting: false,
                        isRowHeader: false,
                      },
                    ]}
                    selectedKeys={selectedKeys}
                    className={`
                outline-none hover:cursor-pointer`}
                    // onAction={handleRowAction}
                  >
                    {({ columns, index, item }) => (
                      <>
                        {columns.map((column, i) => (
                          <Cell
                            key={i}
                            className={`border-b border-transparent ${
                              i == 0
                                ? ' rounded-bl-2xl rounded-tl-2xl'
                                : i == columns.length - 1
                                  ? ' rounded-br-2xl rounded-tr-2xl'
                                  : i == columns.length - 2
                                    ? ''
                                    : ''
                            }`}
                          >
                            {
                              <div className="flex h-[100%]  w-[95%] flex-col items-center justify-start pb-[1vh] pt-[0.85vh] text-xs "
                              style={{
                                color: `${selectedTheme?.text}`,
                              }}
                              >
                                {RenderTableCell(
                                  item,
                                  visibleColumns.includes(column.name)
                                    ? column
                                    : '',
                                )}
                              </div>
                            }
                          </Cell>
                        ))}
                      </>
                    )}
                  </TorusRow>
                ))}
              </TableBody>
            </>
          )}
        </TorusDoTable>
      </div>
    </div>
  );
}

export default SecurityTable;
