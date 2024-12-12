/* eslint-disable */
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { TorusModellerContext } from './Layout';
import { TorusAccordianArrow } from './SVG_Application';
import TorusTitle from './torusComponents/torusTitle';

const CatalogAccordion = memo(
  ({
    items,
    onSelectionChange,
    setCreateCatOrArt,
    setSelectedProject,
    setSelectedArtifactGroup,
    selectedArtifactGroup,
    setSelectedArtifact,
    setSelectedVersion,
    setNewArtifact,
    setCreateCatName,
    setCreateArtiName,
    setCreateArtiGrp,
  }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [open, setOpen] = useState(false);
    const panelRef = useRef([]);

    const handleSelectionChange = (id) => {
      if (id === selectedItem) {
        closeFn(id);
        setSelectedItem(null);
      } else {
        if (selectedItem !== null) closeFn(selectedItem);
        openFn(id);
        setSelectedItem(id);
        onSelectionChange(id);
      }
    };

    const openFn = (id) => {
      const panel = panelRef.current[id];
      if (panel) {
        const height = panel.scrollHeight;
        panel.style.height = '0px';
        panel.style.display = 'block';

        gsap.to(panel, {
          height: height + 'px',
          duration: 0.5,
          ease: 'power3.out',
        });
      }
    };

    const closeFn = (id) => {
      const panel = panelRef.current[id];
      if (panel) {
        gsap.to(panel, {
          height: '0px',
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            panel.style.display = 'none'; // Hide the panel after animation completes
          },
        });
      }
    };

    return (
      <div className="PX-[0.25vw] flex w-[100%] flex-col gap-0.5">
        {items &&
          items.map((item, index) => (
            <DisplayTkeys
              open={open}
              setOpen={setOpen}
              key={item.id}
              panelRef={panelRef}
              index={index}
              title={item.title}
              id={item.id}
              items={item.content}
              onSelectionChange={handleSelectionChange}
              selectedItem={selectedItem}
              setCreateCatOrArt={setCreateCatOrArt}
              setSelectedProject={setSelectedProject}
              setSelectedArtifact={setSelectedArtifact}
              setSelectedVersion={setSelectedVersion}
              setNewArtifact={setNewArtifact}
              setCreateCatName={setCreateCatName}
              setCreateArtiName={setCreateArtiName}
              setSelectedArtifactGroup={setSelectedArtifactGroup}
              setCreateArtiGrp={setCreateArtiGrp}
            />
          ))}
      </div>
    );
  },
);

const DisplayTkeys = memo(
  ({
    title,
    open,
    setOpen,
    id,
    index,
    panelRef,
    items,
    onSelectionChange,
    selectedItem,
    setCreateCatOrArt,
    setSelectedProject,
    setSelectedArtifact,
    setSelectedVersion,
    setNewArtifact,
    setCreateCatOrArtName,
    setCreateCatName,
    setCreateArtiName,
    setSelectedArtifactGroup,
    setCreateArtiGrp,
  }) => {
    const { selectedTkey, selectedTheme } = useContext(TorusModellerContext);

    // useEffect(() => {
    //   if (selectedTkey === id) {
    //     setOpen(true);
    //   }
    // }, [selectedTkey, id]);
    return (
      <div className="flex w-[100%] flex-col gap-0.5 ">
        <div
          onClick={() => {
            if (open === id) {
              setOpen(null);
              onSelectionChange && onSelectionChange({ tKey: '' });
            } else {
              setOpen(id);
              onSelectionChange && onSelectionChange({ tKey: id });
            }
            setCreateCatOrArt && setCreateCatOrArt('catalog');
            setSelectedProject && setSelectedProject(null);
            setSelectedArtifact && setSelectedArtifact(null);
            setSelectedArtifactGroup && setSelectedArtifactGroup(null);
            setSelectedVersion && setSelectedVersion(null);
            setNewArtifact && setNewArtifact(null);
            setCreateCatOrArtName && setCreateCatOrArtName('');
            setCreateCatName && setCreateCatName(null);
            setCreateArtiName && setCreateArtiName(null);
            setCreateArtiGrp && setCreateArtiGrp(false);
          }}
          className="mt-[0.25vw] flex w-full items-center justify-start gap-[0.25vw]"
        >
          <span
            className={`transition duration-300 ease-in-out ${
              open === id && items.length > 0
                ? 'rotate-[0deg]'
                : 'rotate-[-90deg]'
            }`}
          >
            <TorusAccordianArrow
              className="w-[0.5vw]"
              fill={`${selectedTheme?.text}`}
            />
          </span>
          <span
            className={`cursor-pointer select-none text-[0.72vw] font-medium `}
            style={{
              color: `${selectedTheme?.text}`,
            }}
          >
            {title}
          </span>
        </div>
        <div
          ref={(el) => (panelRef.current[id] = el)}
          className="overflow-hidden"
          style={{
            height: open ? 'auto' : '0px',
            display: open ? 'block' : 'none',
          }}
        >
          <div
            className="ml-1.5 flex max-h-[170px] flex-col gap-0.5 overflow-y-scroll border-l "
            style={{
              borderColor: `${selectedTheme?.border}`,
            }}
          >
            {open === id &&
              items &&
              items.map((item) => (
                <DisplayCatalog
                  key={item.catalog}
                  title={item.catalog}
                  id={{ tKey: id, catalog: item.catalog }}
                  items={item.artifactGroupList}
                  onSelectionChange={onSelectionChange}
                  selectedItem={selectedItem}
                  setCreateCatOrArt={setCreateCatOrArt}
                  setSelectedProject={setSelectedProject}
                  setSelectedArtifact={setSelectedArtifact}
                  setSelectedVersion={setSelectedVersion}
                  setNewArtifact={setNewArtifact}
                  setCreateCatName={setCreateCatName}
                  setCreateArtiName={setCreateArtiName}
                  setSelectedArtifactGroup={setSelectedArtifactGroup}
                  setCreateArtiGrp={setCreateArtiGrp}
                  selectedTheme={selectedTheme}
                />
              ))}
          </div>
        </div>
      </div>
    );
  },
);

const DisplayCatalog = memo(
  ({
    title,
    id,
    items,
    onSelectionChange,
    selectedItem,
    setCreateCatOrArt,
    setSelectedProject,
    setSelectedArtifact,
    setSelectedVersion,
    setNewArtifact,
    setCreateCatName,
    setCreateArtiName,
    setSelectedArtifactGroup,
    setCreateArtiGrp,
    selectedTheme,
  }) => {
    const [open, setOpen] = useState(false);
    const { selectedTkey, selectedProject, selectedArtifactGroup } =
      useContext(TorusModellerContext);
    const [titleLength, setTitleLength] = useState(0);
    useEffect(() => {
      if (selectedProject === id?.catalog && selectedTkey === id?.tKey) {
        setOpen(true);
      }
    }, [selectedProject, selectedTkey, id]);

    useEffect(() => {
      if (title) setTitleLength(title.length);
    }, []);

    return (
      <div className="flex w-[9.85vw] flex-col gap-0.5 rounded-md  px-[0.25vw] py-[0.25vh]">
        <div
          onClick={() => {
            onSelectionChange && !open && onSelectionChange(id);
            setOpen(!open);
            setCreateCatOrArt && setCreateCatOrArt('artifactGroup');
            setSelectedArtifactGroup && setSelectedArtifactGroup(null);
            setSelectedArtifact && setSelectedArtifact(null);
            setSelectedVersion && setSelectedVersion(null);
            setNewArtifact && setNewArtifact(null);
            setCreateCatName && setCreateCatName(null);
            setCreateArtiName && setCreateArtiName(null);
            setCreateArtiGrp && setCreateArtiGrp(false);
          }}
          onContextMenu={(e) => e.preventDefault()}
          className="ml-[-0.25vw] flex w-full items-center justify-start gap-[0.15vw]"
        >
          <span
            className={`transition duration-300 ease-in-out ${
              open ? 'rotate-[0deg]' : 'rotate-[-90deg]'
            }`}
          >
            <TorusAccordianArrow fill={selectedTheme?.text} />
          </span>
          <TitleComponent title={title}>
            <p
              className={`catelogue-text m-0
           ml-[0.25vw] w-[8.25vw] cursor-pointer 
            select-none
            truncate text-[0.72vw] 
             font-medium text-[${selectedTheme?.text}] transition-[padding] duration-75 ease-in-out`}
            >
              {title}
            </p>
          </TitleComponent>
        </div>
        <div
          className="ml-[0.25vw]  flex w-[100%] flex-col gap-[0.25vw] border-l "
          style={{
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          {open &&
            items &&
            items.map((item) => (
              <DisplayContent
                key={item}
                title={item}
                id={{ ...id, artifactGroup: item }}
                onSelectionChange={onSelectionChange}
                isSelected={
                  selectedTkey == id?.tKey &&
                  selectedProject === id?.catalog &&
                  item === selectedArtifactGroup
                    ? true
                    : false
                }
                setCreateCatName={setCreateCatName}
                setCreateArtiName={setCreateArtiName}
                setCreateCatOrArt={setCreateCatOrArt}
                setCreateArtiGrp={setCreateArtiGrp}
                selectedItem={selectedItem}
                selectedArtifactGroup={selectedArtifactGroup}
                selectedProject={selectedProject}
                selectedTheme={selectedTheme}
              />
            ))}
        </div>
      </div>
    );
  },
);

const DisplayContent = memo(
  ({
    title,
    id,
    onSelectionChange,
    isSelected,
    setCreateCatName,
    setCreateArtiName,
    setCreateCatOrArt,
    setCreateArtiGrp,
    selectedItem,
    selectedArtifactGroup,
    selectedProject,
    selectedTheme,
  }) => {
    const [titleLength, setTitleLength] = useState(0);

    useEffect(() => {
      setTitleLength(title.length);
    }, [title]);

    return (
      <div
        className={`fade-in-out flex w-[100%] cursor-pointer flex-col gap-0.5 rounded-md font-medium transition-all  duration-150  
        ${
          isSelected &&
          selectedArtifactGroup &&
          selectedItem.artifactGroup === title
            ? `w-[100%] rounded-sm  px-[0.25vw]  py-[0.25vh] text-[0.72vw]  `
            : 'px-[0.25vw] py-[0.25vh] text-[0.72vw] '
        }
        
        `}
        style={{
          backgroundColor: `${
            isSelected &&
            selectedArtifactGroup &&
            selectedItem.artifactGroup === title
              ? `${selectedTheme && selectedTheme?.bgCard}`
              : ''
          }`,
          color: `${
            isSelected &&
            selectedArtifactGroup &&
            selectedItem.artifactGroup === title
              ? `${selectedTheme && selectedTheme?.text}`
              : `${selectedTheme && selectedTheme?.['textOpacity/50']}`
          }`,
        }}
        onClick={() => {
          onSelectionChange(id);
          setCreateCatName && setCreateCatName(null);
          setCreateArtiName && setCreateArtiName(null);
          setCreateCatOrArt && setCreateCatOrArt(null);
          setCreateArtiGrp && setCreateArtiGrp(false);
        }}
      >
        <TitleComponent title={title}>
          <p
            className={`content m-0
            my-[0.10vw] ml-[0.55vw] w-[7.85vw] 
           truncate
            transition-[padding] duration-75 ease-in-out  `}
          >
            {title}
          </p>
        </TitleComponent>
      </div>
    );
  },
);

export default CatalogAccordion;

const TitleComponent = ({ title, children }) => {
  const titleLength = title.length;

  return (
    <div>
      {titleLength > 18 ? (
        <TorusTitle text={title} bgColor="#0736c4" color="white" position="top">
          {children}
        </TorusTitle>
      ) : (
        children
      )}
    </div>
  );
};
