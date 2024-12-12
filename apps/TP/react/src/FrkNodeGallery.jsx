/* eslint-disable */
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FaRegUser } from 'react-icons/fa6';
import { IoIosArrowDown, IoIosArrowUp, IoIosCheckmark } from 'react-icons/io';
import {
  getAllCatalogWithArtifactGroup,
  getCatelogueList,
  importTRLDBToCache,
} from './commonComponents/api/fabricsApi';
import { TorusModellerContext } from './Layout';
import TorusButton from './torusComponents/TorusButton';
import TorusDropDown from './torusComponents/TorusDropDown';
gsap.registerPlugin(useGSAP);
export default function FrkNodeGallery() {
  const {
    selectedFabric,
    client,
    setCataLogListWithArtifactGroup,
    selectedTheme,
  } = useContext(TorusModellerContext);
  const [fabricData, setFabricData] = useState([]);
  const [fallback, setFallback] = useState(false);
  const divRef = useRef(null);
  const handleCatalogWithArtifactGroup = useCallback(async (fabric, client) => {
    try {
      return await getAllCatalogWithArtifactGroup(fabric, client)
        .then((res) => res?.data)
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  });
  useGSAP(() => {
    gsap.fromTo(
      divRef.current,
      { opacity: 0, x: -25, duration: 0.5, ease: 'power1.inOut' },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power1.inOut' },
    );
  }, []);

  const catelogueList = () => {
    try {
      setFallback(false);
      getCatelogueList({
        redisKey: ['TRL', 'AFR', selectedFabric],
      })
        .then((response) => {
          if (response && response.status === 200) {
            setFabricData(response.data);
          }
          setFallback(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    catelogueList();
  }, [selectedFabric]);

  const importFromDb = () => {
    importTRLDBToCache({
      CK: 'TRL',
      FNGK: 'AFR',
    }).then((r) => {
      catelogueList();
      if (r) {
        catelogueList();
        handleCatalogWithArtifactGroup(selectedFabric, 'TRL')
          .then((res) => {
            setCataLogListWithArtifactGroup((data) => ({
              ...data,
              AFR: res?.AFR,
            }));
          })
          .catch((error) => console.error(error));
      }
    });
  };

  return (
    <div className="h-full w-full overflow-y-scroll" ref={divRef}>
      {fallback ? (
        <>
          {fabricData && fabricData.length > 0 ? (
            <CatelogueList Datas={fabricData} selectedTheme={selectedTheme} />
          ) : (
            <div className="flex min-h-full w-full flex-col items-center justify-between gap-[0.5vw] text-center text-[0.73vw] italic">
              <span>No node resource found in cache.</span>
              Do you want to import node resource from DB?
              <TorusButton
                buttonClassName={
                  'bg-[#0736c4] dark:bg-[#252525] h-[1.45vw] w-[2.5vw]'
                }
                onPress={importFromDb}
                fontStyle={'flex items-center justify-center'}
                title={'Import'}
                Children={<IoIosCheckmark size={20} color={'white'} />}
              />
            </div>
          )}
        </>
      ) : (
        <div
          className="flex min-h-full w-full items-center justify-center text-center text-[0.73vw] italic"
          style={{
            color: `${selectedTheme?.text}80`,
          }}
        >
          loading...
        </div>
      )}
    </div>
  );
}

const CatelogueList = ({ Datas, selectedTheme }) => {
  return (
    <>
      {Datas.map((data, index) => (
        <div key={index}>
          <ArtifactGroupList
            title={data.catalog}
            Datas={data.artifactGroupList}
            selectedTheme={selectedTheme}
          />
        </div>
      ))}
    </>
  );
};
const ArtifactGroupList = ({ title, Datas, selectedTheme }) => {
  const [open, setOpen] = useState(true);
  const divRef = useRef(null);
  useGSAP(() => {
    gsap.fromTo(
      divRef.current,
      { opacity: 0, duration: 0.4, ease: 'power1.inOut' },
      { opacity: 1, duration: 0.4, ease: 'power1.inOut' },
    );
  }, []);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div
        onClick={() => {
          handleOpen();
        }}
        className={`flex h-[3.70vh] w-full cursor-pointer flex-row items-center justify-between p-[0.87vw]  text-base font-medium`}
      >
        <span
          className={`text-[0.72vw] font-medium text-[${selectedTheme?.text}] capitalize leading-[2.22vh]`}
        >
          {title}
        </span>
        <span className="flex items-center justify-center ">
          {!open ? (
            <IoIosArrowDown
              size={'0.83vw'}
              color={selectedTheme && selectedTheme?.['textOpacity/15']}
            />
          ) : (
            <IoIosArrowUp
              size={'0.83vw'}
              color={selectedTheme && selectedTheme?.['textOpacity/15']}
            />
          )}
        </span>
      </div>
      <div ref={divRef}>
        {open &&
          Datas.map((data, index) => (
            <div key={index}>
              <ArtifactList
                title={data.artifactGroup}
                Datas={data.artifactList}
                selectedTheme={selectedTheme}
              />
            </div>
          ))}
      </div>
    </>
  );
};

const ArtifactList = ({ title, Datas, selectedTheme }) => {
  const [open, setOpen] = useState(true);
  const divRef = useRef(null);
  useGSAP(() => {
    gsap.fromTo(
      divRef.current,
      { opacity: 0, duration: 0.3, ease: 'power1.inOut' },
      { opacity: 1, duration: 0.3, ease: 'power1.inOut' },
    );
  }, []);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div
        onClick={() => {
          handleOpen();
        }}
        className="flex h-[3.70vh] w-full cursor-pointer flex-row items-center justify-between  p-[0.87vw] font-medium"
      >
        <span
          className={`text-[0.72vw] font-medium capitalize leading-[2.22vh] text-[${selectedTheme?.text}] `}
        >
          {title}
        </span>
        <span>
          <IoIosArrowDown
            size={'0.83vw'}
            color={selectedTheme && selectedTheme?.['textOpacity/15']}
            className={`transition-all duration-75 ease-in-out ${open ? 'rotate-[-90deg]' : 'rotate-[0deg]'}`}
          />
        </span>
      </div>
      <div ref={divRef} className="w-full">
        {open &&
          Datas.map((data, index) => (
            <div key={index}>
              <Artifact
                title={data.artifact}
                Datas={data.versionList}
                selectedTheme={selectedTheme}
              />
            </div>
          ))}
      </div>
    </>
  );
};
const Artifact = ({ title, Datas, selectedTheme }) => {
  const [selectedRedisKey, setSelectedRedisKey] = useState(
    Datas?.[Datas?.length - 1]?.redisKey,
  );
  const { selectedAccntColor } = useContext(TorusModellerContext);

  const divRef = useRef(null);
  useGSAP(() => {
    gsap.fromTo(
      divRef.current,
      { opacity: 0, duration: 0.25, ease: 'power1.inOut' },
      { opacity: 1, duration: 0.25, ease: 'power1.inOut' },
    );
  }, []);
  const onDragStart = (event, nodeType, key) => {
    if (key) {
      event.dataTransfer.setData('application/key', key);
      event.dataTransfer.setData('application/nodeType', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  return (
    <div
      ref={divRef}
      className={`${selectedRedisKey ? 'cursor-grab' : ' cursor-not-allowed '} flex w-full  items-center justify-between gap-1 rounded px-[0.58vw] py-[0.52vh] ${selectedTheme && selectedTheme?.['textOpacity/15'] && `hover:bg-[${selectedTheme && selectedTheme?.['textOpacity/15']}]`}  `}
      onDragStart={(event) => onDragStart(event, title, selectedRedisKey)}
      draggable={selectedRedisKey ? true : false}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          selectedTheme && selectedTheme?.['textOpacity/15'];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span
        className={` flex  h-[1.25vw]  w-[1.25vw] cursor-grab items-center justify-center rounded border`}
        style={{
          backgroundColor: `${selectedAccntColor}50`,
          borderColor: `${selectedAccntColor}70`,
        }}
      >
        <FaRegUser size="0.83vw" color={selectedAccntColor} />
      </span>

      <span
        className={`w-[5.55vw] select-none text-[${selectedTheme?.text}] truncate whitespace-nowrap text-[0.72vw] font-normal leading-[2.22vh] tracking-normal`}
        // onClick={() => setOpen(!open)}
      >
        {title}
      </span>

      <TorusDropDown
        // onChange={() => setOpen(index)}
        // key={index}
        title={
          selectedRedisKey
            ? Datas.filter((data) => data.redisKey === selectedRedisKey)[0]
                ?.verion
            : 'v'
        }
        selectionMode="single"
        setSelected={(id) => {
          setSelectedRedisKey(Array.from(id)[0]);
        }}
        selected={new Set([selectedRedisKey])}
        items={
          Datas &&
          Datas?.map((item) => ({
            label: item.verion,
            key: item.redisKey,
          }))
        }
        classNames={{
          buttonClassName: ` h-[1.56vw] w-[1.56vw] text-[0.72vw] rounded-[0.43vw]  bg-[${selectedTheme?.bgCard}] font-normal text-[${selectedTheme?.text}]   text-center`,
          popoverClassName: 'w-[3vw] text-[0.72vw] font-normal ',
          listBoxClassName: `overflow-y-auto flex items-center justify-center bg-[${selectedTheme?.bgCard}] `,
          listBoxItemClassName: `flex w-[1.50vw] items-center justify-between text-[0.72vw] font-normal hover:bg-[${selectedTheme && selectedTheme?.['textOpacity/50']}]`,
          label: `text-[0.72vw] font-normal text-[${selectedTheme?.text}]   `,
        }}
        size={'0.83vw'}
      />
    </div>
  );
};
