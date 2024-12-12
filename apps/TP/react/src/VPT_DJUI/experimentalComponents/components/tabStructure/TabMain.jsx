/* eslint-disable */

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import {
  cardUIPolicy,
  colorPolicy,
  controlPolicy,
} from '../../../../commonComponents/utils/util';
import Builder from '../../../builder';

export default function TabMain({
  data,
  setjson,
  path,
  setSelectedpath,
  selectedpath,
}) {
  const [jsondata, setJsondata] = useState(null);
  const [tabs, setTabs] = useState([]);

  const [selectedTab, setSelectedTab] = useState({});

  const handleMainjsUpdate = (data) => {
    const js = structuredClone(jsondata);
    let path = selectedTab.path.split('.');
    path.shift();
    path.join('.');
    _.set(js, path, data);
    console.log(js, selectedTab.path, data, 'updateTabs');
    setjson(js);
    setSelectedTab({
      data: data,
      path: selectedTab.path,
      title: selectedTab.title,
    });
    setTabs((prev) => {
      return (
        prev &&
        prev.map((tab) => {
          if (tab.path === selectedTab.path) {
            return {
              data: data,
              path: selectedTab.path,
              title: selectedTab.title,
            };
          }
          return tab;
        })
      );
    });
  };
  useEffect(() => {
    if (_.isEqual(jsondata, data)) return;
    const jsClone = structuredClone(data);
    setJsondata(jsClone);
  }, [data]);

  const handleClick = (p) => {
    setSelectedpath((prev) => {
      return prev.filter((item) => item.path !== p);
    });
  };

  useEffect(() => {
    if (jsondata && selectedpath) {
      let seleTab = [];

      selectedpath.forEach((path) => {
        let pathArr = path.path.split('.');
        pathArr.shift();
        pathArr.join('.');
        if (pathArr.title === 'main') {
          seleTab.push({
            data: jsondata,
            path: path.path,
            title: path.title,
          });
        }
        seleTab.push({
          data: _.get(jsondata, pathArr),
          path: path.path,
          title: path.title,
        });
      });

      setTabs(seleTab);
      if ((selectedTab && selectedTab.length === 0) || !selectedTab)
        setSelectedTab(seleTab[seleTab.length - 1]);

      if (seleTab.length === 0) setSelectedTab({});
    }
  }, [jsondata, selectedpath, selectedTab]);
  console.log(data, 'selectedTab');
  return (
    <div className="flex h-full  flex-col ">
      <div className="flex  h-[5%] cursor-pointer">
        {tabs &&
          tabs?.length > 0 &&
          tabs?.map((tab, index) => {
            return (
              <div
                className={
                  selectedTab?.path === tab.path
                    ? 'flex h-full cursor-pointer gap-2 border-t-2  border-slate-300 border-t-blue-500 bg-slate-200 p-1 '
                    : 'flex h-full cursor-pointer select-none gap-2 border-1 border-slate-300 p-1'
                }
                onClick={() => setSelectedTab(tab)}
              >
                <span>{tab.title}</span>
                <span
                  className="mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(tab.path);
                  }}
                >
                  <MdClose alt="close" color="#000" />
                </span>
              </div>
            );
          })}
      </div>
      <div className="h-[90%] overflow-y-scroll border-t">
        <Builder
          key={selectedTab?.path}
          uiPolicy={cardUIPolicy}
          isAdmin={{
            canAdd: true,
            canDelete: true,
            canEdit: true,
          }}
          colorPolicy={colorPolicy}
          controlPolicy={controlPolicy}
          type={''}
          updatedNodeConfig={handleMainjsUpdate}
          defaultJSOn={selectedTab?.data}
        />
      </div>
    </div>
  );
}
