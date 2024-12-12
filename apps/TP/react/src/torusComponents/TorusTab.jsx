/* eslint-disable */
import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { merger } from '../commonComponents/utils/utils';

const defaultTabsClassNames = {
  tabs: 'w-full ',
  tablist: '',
  tab: 'w-full flex justify-center items-center',
};

export default function TorusTab({
  tabs,
  panels,
  orientation = 'vertical',
  ariaLabel,
  classNames,
  defaultSelectedKey,
  selectedKey,
  onSelectionChange,
  tabsbgcolor = 'transparent',
  isDisabled = false,
  borderColor,
  selectedId='1'
}) {
  return (
    <>
      <Tabs
        orientation={orientation}
        keyboardActivation="automatic"
        className={merger(defaultTabsClassNames.tabs, classNames?.tabs)}
        defaultSelectedKey={defaultSelectedKey}
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
        isDisabled={isDisabled}
        key={`uniqueIds-${defaultSelectedKey}`}
        
      >
        <TabList
          aria-label={ariaLabel}
          className={`${merger(defaultTabsClassNames.tablist, classNames?.tabList)} flex  ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}  rounded-md items-start justify-between px-[0.25vw] py-[0.25vh]`}
          style={{
            backgroundColor: `${tabsbgcolor ? tabsbgcolor : ''}`,
          
            borderRadius: '5px',
          }}
        >
          {tabs &&
            tabs.map((tab, index) => (
              <>
                {tab && (
                  <Tab
                    className={merger(
                      defaultTabsClassNames.tab,
                      classNames?.tab,
                    )}
                    style={{
                      borderLeft: ` ${selectedId === tab.id ? `3px solid ${borderColor ? borderColor : 'blue'}` : 'none'}`,
                    }}
                   
                    key={tab.id + index}
                    id={tab.id}
                  >
                    
                    {tab.content}
                  </Tab>
                )}
              </>
            ))}
        </TabList>
        {panels &&
          panels.map((panel, index) => (
            <TabPanel key={panel.id + index} id={panel.id}>
              {panel.content}
            </TabPanel>
          ))}
      </Tabs>
    </>
  );
}

export const UFTab = ({
  tabs,
  panels,
  orientation = 'horizontal',
  ariaLabel,
  classNames = {},
  defaultSelectedKey,
  onSelectionChange,
  tabDisplayLimit = 5,
  tabsbgcolor = 'white',
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState(defaultSelectedKey);

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
    onSelectionChange && onSelectionChange(tabId);
  };

  const handleNext = () => {
    const nextIndex = startIndex + 1;
    if (nextIndex + tabDisplayLimit <= tabs.length) {
      setStartIndex(nextIndex);
      setSelectedTab(null);
    }
  };

  const handlePrev = () => {
    const prevIndex = startIndex - 1;
    if (prevIndex >= 0) {
      setStartIndex(prevIndex);
      setSelectedTab(null);
    }
  };

  const visibleTabs = tabs.slice(startIndex, startIndex + tabDisplayLimit);

  return (
    <Tabs
      orientation={orientation}
      keyboardActivation="automatic"
      className={merger(defaultTabsClassNames.tabs, classNames.tabs)}
      selectedKey={selectedTab}
      onSelectionChange={handleTabClick}
    >
      {' '}
      <TabList
        aria-label={ariaLabel}
        className={merger(
          `flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} rounded-md items-start justify-between gap-[0.958vw] px-[0.25vw] py-[1.55vh]`,
          classNames.tablist,
        )}
        style={{
          backgroundColor: `${tabsbgcolor ? tabsbgcolor : ''}`,
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            className={merger(defaultTabsClassNames.tab, classNames.tab)}
            key={tab.id + index}
            id={tab.id}
          >
            {tab.content}
          </Tab>
        ))}
      </TabList>
      {/* <div className="flex items-center justify-around">
        <div
          className={`flex ${startIndex + tabDisplayLimit >= tabs.length ? "cursor-not-allowed opacity-50" : "opacity-100"} h-[1.25vw] w-[1.25vw] items-center justify-center rounded-full bg-gray-400/40 transition-all fade-in-5 fade-out-10  hover:border hover:border-gray-700/35 hover:bg-gray-300/35`}
        >
          <button
            onClick={handlePrev}
            className={merger(
              defaultTabsClassNames.navButton,
              classNames.navButton,
            )}
            disabled={startIndex === 0}
          >
            <PrevIcon className={"h-[0.55vw] w-[0.55vw]"} />
          </button>
        </div>

        <div
          className={`flex ${startIndex + tabDisplayLimit >= tabs.length ? "cursor-not-allowed opacity-50" : "opacity-100"} h-[1.25vw] w-[1.25vw] items-center justify-center rounded-full bg-gray-400/40 transition-all fade-in-5 fade-out-10  hover:border hover:border-gray-700/35 hover:bg-gray-300/35`}
        >
          <button
            onClick={handleNext}
            className={merger(
              defaultTabsClassNames.navButton,
              classNames.navButton,
            )}
            disabled={startIndex + tabDisplayLimit >= tabs.length}
          >
            <NextIcon className={"h-[0.55vw] w-[0.55vw]"} />
          </button>
        </div>
      </div> */}
      {panels &&
        panels.map((panel, index) => (
          <TabPanel key={panel.id + index} id={panel.id}>
            {panel.content}
          </TabPanel>
        ))}
    </Tabs>
  );
};
