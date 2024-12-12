/* eslint-disable */
import React, { memo, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getArtifactsGroups,
  getprojectLists,
} from './commonComponents/api/fabricsApi';
import { TorusModellerContext } from './Layout';
import { TorusAccordianArrow } from './SVG_Application';
import TorusAccordion from './torusComponents/TorusAccordian';
import TorusToast from './torusComponents/TorusToaster/TorusToast';

const ArtifactsSelector = memo(
  ({
    parent,
    items,
    onToggle,
    onContentToggle,
    onItemClick,
    toogle = false,
    onNestedItemClick,
    selectedContent,
  }) => {
    const {
      client,

      selectedTkey,

      selectedFabric,

      selectedProject,
    } = useContext(TorusModellerContext);

    const [openIndex, setOpenIndex] = useState(null);
    const [projectList, setProjectList] = useState([]);
    const [accordionItems, setAccordionItems] = useState(items);
    const [wordLength, setWordLength] = useState(0);
    const [artifactsGroup, setArtifactsGroup] = useState([]);

    const handleGetProjects = async (
      selectedTkey,
      client,
      selectedFabric,
      selectedProject,
    ) => {
      try {
        const response = await getprojectLists(
          JSON.stringify([client, selectedTkey, selectedFabric]),
        );

        if (response && response.status === 200) {
          setProjectList(response.data);
        }
      } catch (error) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: 'error',
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: true,
            title: 'Error',
            text: `Cannot save application details`,
            closeButton: false,
          },
        );
      }
    };

    const handleGetArtifactsGroup = async (
      selectedTkey,
      client,
      selectedFabric,
      selectedProject,
    ) => {
      try {
        const response = await getArtifactsGroups(
          JSON.stringify([
            client,
            selectedTkey,
            selectedFabric,
            projectList[0],
          ]),
        );
        if (response && response.status === 200) {
          setArtifactsGroup(response.data);
        }
      } catch (error) {
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: 'error',
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: true,
            title: 'Error',
            text: `Cannot save application details`,
            closeButton: false,
          },
        );
      }
    };

    const fetchCatelogues = async (
      selectedTkey,
      client,
      selectedFabric,
      selectedProject,
    ) => {};

    const fetchArtifactsGrp = async (catelogueId) => {
      // API call to fetch artifacts group
    };

    const fetchArtifacts = async (artifactGrpId) => {
      // API call to fetch artifacts
    };

    const handleItemClick = async (item) => {
      if (item.type === 'catelouge') {
        try {
          const artifactsGrp = await fetchArtifactsGrp(item.id);
          // Update the corresponding item with the fetched artifacts group
          setAccordionItems((prevItems) =>
            prevItems.map((prevItem) =>
              prevItem.id === item.id
                ? { ...prevItem, content: artifactsGrp }
                : prevItem,
            ),
          );
        } catch (error) {
          console.error('Error fetching artifacts group:', error);
        }
      } else if (item.type === 'ArtifactsGrp') {
        try {
          const artifacts = await fetchArtifacts(item.id);
          // Update the corresponding item with the fetched artifacts
          setAccordionItems((prevItems) =>
            prevItems.map((prevItem) =>
              prevItem.id === item.id
                ? { ...prevItem, content: artifacts }
                : prevItem,
            ),
          );
        } catch (error) {
          console.error('Error fetching artifacts:', error);
        }
      } else if (item.type === 'categery') {
        try {
          const catelogues = await fetchCatelogues(
            selectedTkey,
            client,
            selectedFabric,
            selectedProject,
          );
          if (catelogues) setProjectList(catelogues);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };

    const handleToggle = (index, tKey) => {
      const newIndex = openIndex === index ? null : index;
      setOpenIndex(newIndex);

      if (onToggle && !toogle) {
        onToggle(newIndex, tKey);
      }
    };

    const renderContent = (content, Imetiatdparent) => {
      if (Array.isArray(content)) {
        return content.length === 0
          ? null
          : content?.map((item, index) => (
              <div key={index} className="pl-[0.25rem]">
                {typeof item === 'object' ? (
                  <TorusAccordion
                    parent={Imetiatdparent}
                    items={[item]}
                    toogle={true}
                    onToggle={onToggle}
                    onContentToggle={onContentToggle}
                    onItemClick={onItemClick}
                    onNestedItemClick={onNestedItemClick}
                    selectedContent={selectedContent}
                  />
                ) : (
                  <p
                    onClick={() =>
                      handleItemClick({
                        tkey: parent,
                        catalouge: Imetiatdparent,
                        artifactgroup: item.id,
                      })
                    }
                    className="w-[100%] cursor-pointer text-sm text-black/35"
                  >
                    {item.title}
                  </p>
                )}
              </div>
            ));
      } else if (typeof content === 'object' && content !== null) {
        return Object.entries(content).map(([key, value], index) => (
          <div key={index} className="pl-[0.52rem]">
            <TorusAccordion
              items={[{ title: key, content: value }]}
              onToggle={onToggle}
              onContentToggle={onContentToggle}
              onItemClick={onItemClick}
              onNestedItemClick={onNestedItemClick}
              selectedContent={selectedContent}
            />
          </div>
        ));
      } else {
        return (
          <p
            onClick={() =>
              handleItemClick({
                tkey: parent,
                cataloge: Imetiatdparent,
                artigrp: content,
              })
            }
            className="w-[100%] cursor-pointer text-sm text-black/35"
          >
            {content}
          </p>
        );
      }
    };

    useEffect(() => {
      setAccordionItems(items);
    }, [items]);

    return (
      <div id="accordion-open" data-accordion="open">
        {accordionItems?.map((item, index) => {
          if (Array.isArray(item.content) && item.content.length === 0) {
            return (
              <div
                className="whitespace-nowrap py-[0.5rem] pl-[0.4rem] text-xs font-medium text-[#000000] hover:text-gray-900 dark:text-gray-300"
                key={index}
                onClick={() => handleItemClick(item)}
              >
                {item.title}
              </div>
            ); // Skip rendering accordion if content is empty
          }

          return (
            <div key={index}>
              <h2 id={`accordion-open-heading-${index}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 font-medium text-[#000000] hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-expanded={openIndex === index}
                  aria-controls={`accordion-open-body-${index}`}
                  onClick={() => handleToggle(index, item.id)}
                >
                  <div className="flex w-[100%] items-center justify-between py-1.5 pl-2.5">
                    <div className="flex w-[80%] items-center justify-start">
                      <div className="flex w-[20%] items-center justify-end">
                        <div className="flex w-[100%] justify-start">
                          <span
                            className={`transition duration-300 ease-in-out ${
                              openIndex === index
                                ? 'rotate-[0deg]'
                                : 'rotate-[-90deg]'
                            }`}
                          >
                            <TorusAccordianArrow />
                          </span>
                        </div>
                      </div>
                      <div className="flex w-[80%] items-center justify-start">
                        <div className="flex w-[100%] justify-start">
                          <p className="cursor-pointer whitespace-nowrap pl-[0.4rem] text-xs font-medium text-[#000000] hover:text-gray-900 dark:text-gray-300">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </h2>
              <div
                id={`accordion-open-body-${index}`}
                className={`border-gray-500 ${openIndex === index ? 'block' : 'hidden'}`}
                aria-labelledby={`accordion-open-heading-${index}`}
              >
                <div className="pl-[1.15rem]">
                  <div
                    className={`overflow-hidden border-b-0 border-l-1.5 border-r-0 border-t-0 border-[#00000026] px-1 py-2 pl-[0rem] transition-[max-height] duration-300 ease-in-out dark:border-gray-300 ${
                      openIndex === index
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                    style={{ maxHeight: openIndex === index ? '500px' : '0px' }}
                  >
                    {renderContent(item.content, item.id)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

export default ArtifactsSelector;
