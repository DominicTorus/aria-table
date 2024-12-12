/*eslint-disable*/
import { useGSAP } from '@gsap/react';

import gsap from 'gsap';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import CatalogAccordian from './CatalogAccordian.jsx';
import {
  artifactList,
  deleteArifactGroup,
  deleteArtifact,
  exportTRLCacheToDB,
  getAllCatalogWithArtifactGroup,
  getDFOSchema,
  getJson,
  renameArtifact,
  saveAsPost,
  saveWorkFlow,
  versionList,
} from './commonComponents/api/fabricsApi';
import { TorusModellerContext } from './Layout';
import Builder from './pushToBuild.jsx';
import {
  AddIcon,
  ArtifactsEditIcon,
  BreadcrumbArrow,
  BreadcrumbHome,
  CloseIcon,
  DataOrchestrator,
  DeleteIcon,
  DFDFD,
  DFERD,
  DotIcon,
  FailureIcon,
  Folder,
  NavbarArrowDown,
  NavbarSavdIcon,
  Preview,
  Shared,
  SuccessIcon,
  TorusLogo,
} from './SVG_Application';
import TorusButton from './torusComponents/TorusButton.jsx';
import TorusDropDown from './torusComponents/TorusDropDown';
import TorusModel from './torusComponents/TorusModel.jsx';
import TorusModularInput from './torusComponents/TorusModularInput.jsx';
import TorusPopOver from './torusComponents/TorusPopOver.jsx';
import TorusSearch from './torusComponents/TorusSearch.jsx';
import TorusTab from './torusComponents/TorusTab.jsx';
import TorusTitle from './torusComponents/torusTitle.jsx';
import { isLightColor } from './asset/themes/useTheme.js';
import {
  dismissToast,
  flatenGrps,
  pendingToast,
  updateToast,
} from './utils/utils.js';

gsap.registerPlugin(useGSAP);
const SUBFABRICS = {
  DF: [
    { subFaric: 'DF-ERD', icon: DFERD },
    { subFaric: 'DF-DFD', icon: DFDFD },
  ],
  UF: [
    { subFaric: 'UF-UFW', icon: Folder },
    { subFaric: 'UF-UFM', icon: DFDFD },
    { subFaric: 'UF-UFD', icon: DFERD },
  ],
  PF: [
    { subFaric: 'PF-PFD', icon: Folder },
    // { subFaric: 'PFE', icon: Build },
  ],
};

export default function Navbar({
  sendDataToFabrics,
  setUpIdKey = null,
  getDataFromFabrics,
  clientLoginId,
  nodesEdges,

  isAppOrArtifact,
  setIsAppOrArtifact,
  setShowNodeProperty,
  searchedValue,
  setSearchedValue,
}) {
  const {
    cataLogListWithArtifactGroup,
    setCataLogListWithArtifactGroup,
    client,

    selectedArtifactGroup,
    setSelectedArtifactGroup,
    selectedTkey,
    setSelectedTkey,
    handleTabChange,
    selectedFabric,
    selectedArtifact,
    setSelectedArtifact,
    selectedVersion,
    setSelectedVersion,
    selectedProject,
    setSelectedProject,
    artifactLockToggle,
    setArtifactLockToggle,
    handleArtifactLock,

    currentUpdation,
    setCurrentUpdation,

    setSelectedSubFlow,
    setNodes,
    selectedSubFlow,

    setRedispath,

    setEdges,
    fromSubFlow,
    setFromSubFlow,

    artifactsVersion,
    setArtifactsVersion,
    mainFabric,
    selectedTheme,
    selectedAccntColor,

    selectedTenant,
  } = useContext(TorusModellerContext);

  const [artifactsList, setArtifactsList] = useState([]);

  const [isDisabled, setIsDisabled] = useState(true);

  const [hovered, setHovered] = useState(false);

  const [inputchange, setInputchange] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [peModal, setPeModal] = useState('');
  const [peurlopen, setPeurlopen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [childNodeVisible, setChildNodeVisible] = useState(false);

  const [urls, setUrl] = useState('');
  const [newArtifactInputChange, setNewArtifactInputChange] = useState(false);
  const [wordLength, setWordLength] = useState(0);
  const [newArtifact, setNewArtifact] = useState(false);
  const [newArtifactValue, setNewArtifactValue] = useState('Untitled 1');
  const [newArtifactSaveasValue, setNewArtifactSaveasValue] =
    useState('Untitled 1');
  const [saveasInputValue, setSaveasInputValue] = useState('');

  const [newArtifactNameValidation, setNewArtifactNameValidation] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const spanRef = useRef(null);

  const [createCatOrArt, setCreateCatOrArt] = useState(null);
  const [createArtiGrp, setCreateArtiGrp] = useState(false);
  const [createCatName, setCreateCatName] = useState(null);
  const [createArtiName, setCreateArtiName] = useState(null);
  const [showSaveAsPopover, setShowSaveAsPopover] = useState(false);
  const [selectedPrevKeys, setSelectedPrevKeys] = useState({});
  const [showSaveasNewartifact, setShowSaveasNewartifact] = useState(false);

  useEffect(() => {
    if (!showSaveasNewartifact) {
      if (selectedArtifact && selectedArtifactGroup) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    } else if (showSaveasNewartifact) {
      if (selectedArtifactGroup) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [
    selectedArtifact,
    selectedArtifactGroup,
    showSaveasNewartifact,
    createCatOrArt,
  ]);

  const subfaricsData = useMemo(() => {
    try {
      return SUBFABRICS?.[mainFabric];
    } catch (error) {
      console.error(error);
    }
  }, [mainFabric]);

  const itemsForSubFabricTabs = useMemo(() => {
    try {
      if (subfaricsData && Array.isArray(subfaricsData)) {
        return subfaricsData.map((item) => {
          return {
            id: item.subFaric,
            content: ({ isSelected }) => (
              <div
                className={`flex h-[2.15vw] w-[2.15vw] items-center justify-center rounded`}
                style={{
                  backgroundColor: isSelected ? selectedTheme?.bgCard : '',
                }}
              >
                {React.createElement(item.icon, {
                  className: 'h-[1.25vw] w-[1.25vw]',
                  strokeColor: !isSelected
                    ? '#A59E92'
                    : `${selectedTheme?.text}`,
                })}
              </div>
            ),
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [subfaricsData]);

  useGSAP(() => {
    gsap.fromTo(
      spanRef.current,
      { autoAlpha: 0, x: 20 },
      { autoAlpha: 1, x: 0, duration: 1 },
    );
  }, [isOpen]);

  const handleSearchChange = (value) => {
    try {
      setSearchedValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredArtifactList = useMemo(() => {
    try {
      if (!artifactsList || !Array.isArray(artifactsList)) return [];

      if (!searchedValue) return artifactsList;

      return artifactsList.filter((item) => {
        return item?.toLowerCase().includes(searchedValue.toLowerCase());
      });
    } catch (error) {
      console.error(error);
    }
  }, [artifactsList, searchedValue, selectedArtifactGroup, selectedArtifact]);

  useEffect(() => {
    try {
      if (nodesEdges && nodesEdges?.nodes?.length === 0) {
        setChildNodeVisible(true);
      } else {
        setChildNodeVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [nodesEdges]);

  const handleNewArtifact = () => {
    try {
      setNewArtifactValue('Untitled ' + artifactsList.length);
      setNewArtifact(!newArtifact);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportTRL = async () => {
    const data = {
      CK: 'TRL',
      FNGK: 'AFR',
    };
    try {
      const result = await exportTRLCacheToDB(data);
      if (result) {
        toast(<TorusToast />, {
          type: 'success',
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          title: 'Success',
          text: `success on export TRL cache`,
          closeButton: false,
        });
      }
    } catch (error) {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: `Failed to export TRL cache`,
        closeButton: false,
      });
    }
  };

  const handleNewSaveasArtifact = () => {
    try {
      setNewArtifactSaveasValue('Untitled ' + artifactsList.length);
      setNewArtifact(!newArtifact);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProcessEngine = async () => {
    try {
      const version = [...selectedVersion][0];
      const artifact = [...selectedArtifact][0];
      await fetch(`${process.env.REACT_APP_API_URL}pe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          role: 'Admin',
        },
        body: JSON.stringify({
          key: `${selectedTkey}:${client}:${selectedProject}:${selectedFabric}:${artifact}:${version}:`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.url && Object.keys(data.url).length) {
            const { key, upId, nodeId, nodeName, url, mode } = data.url;

            window.open(url, '_blank');
            setPeModal(
              `${url}?key=${key}&upId=${upId}&nodeId=${nodeId}&nodeName=${nodeName}&mode=${mode}`,
            );

            setPeurlopen(true);

            toast(<TorusToast />, {
              type: 'success',
              position: 'bottom-right',
              autoClose: 2000,
              hideProgressBar: true,
              title: 'Success',
              text: `data send to process engine`,
              closeButton: false,
            });
          } else if (data && data.data) {
            toast(<TorusToast />, {
              type: 'error',
              position: 'bottom-right',
              autoClose: 2000,
              hideProgressBar: true,
              title: 'Error',
              text: `Error while sending data`,
              closeButton: false,
            });
          }
        })
        .catch((err) => {
          toast(<TorusToast />, {
            type: 'error',
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: true,
            title: 'Error',
            text: `Error sending key to process engine`,
            closeButton: false,
          });
        });
    } catch (error) {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: `Error sending key to process engine`,
        closeButton: false,
      });
    }
  };
  const handleDebug = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}pe/debugExecution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          role: 'Admin',
        },
        body: JSON.stringify({
          key: `${client}:${'AF'}:${'PF-PFD'}:${'domain'}:${'pgrp'}:${selectedArtifact}:${selectedVersion}`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            toast(<TorusToast />, {
              type: 'success',
              position: 'bottom-right',
              autoClose: 2000,
              hideProgressBar: true,
              title: 'Success',
              text: `upId found in process engine - ${data.formjson.url}`,
              closeButton: false,
            });
            const { key, upId, nodeId, nodeName, url, mode } = data.formjson;
            setUrl(
              `${url}?key=${key}&upId=${upId}&nodeId=${nodeId}&nodeName=${nodeName}&mode=${mode}`,
            );
            setUpIdKey(data.formjson.upId);
            setUrlOpen(true);
          } else if (data.hasOwnProperty('err')) {
            toast(<TorusToast />, {
              type: 'success',
              position: 'bottom-right',
              autoClose: 2000,
              hideProgressBar: true,
              title: 'Success',
              text: `Error found in process engine - ${data.err}`,
              closeButton: false,
            });
          }
        })
        .catch((err) => {
          toast(<TorusToast />, {
            type: 'error',
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: true,
            title: 'Error',
            text: `Error in process engine`,
            closeButton: false,
          });
        });
    } catch (error) {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: `Error sending key to process engine`,
        closeButton: false,
      });
    }
  };

  const handleArtifactsChange = async (e) => {
    try {
      if (selectedVersion) {
        await handleArtifactLock(false);
      }
      setSelectedVersion(null);
      setCreateCatOrArt(null);

      const versions = await versionList(
        e,
        JSON.stringify([
          client,
          selectedTkey,
          selectedFabric,
          selectedProject,
          selectedArtifactGroup,
        ]),
      );
      setArtifactsVersion(versions.data);
      setSelectedVersion(versions.data[0]);
      getProcessFlowApi(e, versions.data[0]);

      sendDataToFabrics({});
      setSelectedArtifact(e);
    } catch (err) {
      console.error(err);
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: `Cannot get artifacts details: ${err.message}`,
        closeButton: false,
      });
    }
  };

  {
    /*Toast implementation*/
  }
  const handleArtifactsNameChange = async (oldName, newName) => {
    if (!newName.trim()) {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: 'Artifact name cannot be empty.',
        closeButton: false,
      });
      return;
    }

    if (oldName === newName.trim()) {
      toast(<TorusToast />, {
        type: 'info',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Info',
        text: 'No changes detected. The artifact name is already the same.',
        closeButton: false,
      });
      return;
    }

    const pattern = /[^a-zA-Z0-9_]/;
    if (pattern.test(newName.trim())) {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: 'Artifact name cannot contain special characters.',
        closeButton: false,
      });
      return;
    }

    let toastId = pendingToast(
      `Renaming artifact from ${oldName} to ${newName.trim()}`,
    );
    try {
      const response = await renameArtifact(
        [
          client,
          selectedTkey,
          selectedFabric,
          selectedProject,
          selectedArtifactGroup,
          oldName,
        ],
        [
          client,
          selectedTkey,
          selectedFabric,
          selectedProject,
          selectedArtifactGroup,
          newName.trim(),
        ],
      );

      if (response?.status === 200) {
        setSelectedArtifact(newName.trim());
        const updatedList = response?.data?.filter((item) => item !== '');
        setArtifactsList(updatedList || []);

        updateToast(
          toastId,
          'success',
          `Artifact renamed successfully to ${newName.trim()}`,
        );
      } else {
        throw new Error('Failed to rename artifact. Please try again.');
      }
    } catch (error) {
      updateToast(
        toastId,
        'error',
        error.message || 'An error occurred during renaming.',
      );
    } finally {
      setInputchange(null);
    }
  };

  const flatten = flatenGrps(cataLogListWithArtifactGroup, selectedTkey);

  const flatting = useMemo(
    () =>
      flatenGrps(cataLogListWithArtifactGroup, selectedTkey, selectedProject),
    [
      cataLogListWithArtifactGroup,
      selectedTkey,
      selectedProject,
      newArtifact,
      cataLogListWithArtifactGroup,
    ],
  );
  console.log(flatting, 'flatten');

  {
    /*Toast implementation*/
  }
  const handleCreateCatalogueOrArtifactsGroup = async () => {
    let toastId;
    try {
      if (newArtifact) {
        console.error('Invalid input: Cannot create an empty artifact');
        return;
      }
      console.log(cataLogListWithArtifactGroup, 'Grps--000');

      const isCatalog = createCatOrArt === 'catalog';
      const isArtifactGroup = createCatOrArt === 'artifactGroup';

      const name = isCatalog ? createCatName : createArtiName;

      if (
        (isCatalog && flatten?.catalogue?.includes(name)) ||
        (isArtifactGroup && flatting?.artifactGroup?.includes(name))
      ) {
        showToast(
          ` ${isCatalog ? 'Catalog' : 'Artifact group'} name already exists`,
          'error',
        );

        return;
      }

      if (!name || name.trim() === '') {
        showToast('Name cannot be empty', 'error');

        return;
      }

      toastId = pendingToast('creating catelogue or artifact group');

      const payload = {
        redisKey: [
          client,
          selectedTkey,
          selectedFabric,
          isCatalog ? name : selectedProject,
          isCatalog ? 'untitled-grp-1' : name,
        ],
        flow: { ...getDataFromFabrics },
        userId: clientLoginId,
        project: isCatalog ? name : selectedProject,
        artifact: 'untitled-Artifact',
      };

      const response = await saveWorkFlow(
        payload,
        'create',
        'v1',
        client,
        selectedFabric,
      );

      if (!response) {
        updateToast(
          toastId,
          'error',
          `${isCatalog ? 'Catalog' : 'Artifact group'} creation failed`,
        );
        return;
      }

      await handleIntialLoad(
        selectedTkey,
        client,
        selectedFabric,
        isCatalog ? name : selectedProject,
        isCatalog ? 'untitled-grp-1' : name,
      );

      if (isCatalog) {
        setSelectedProject(name);
        setSelectedArtifactGroup('untitled-grp-1');
      } else {
        setSelectedArtifactGroup(name);
      }
      setSelectedArtifact('untitled-Artifact');
      setSelectedVersion('v1');

      const allCatArtifactResponse = await getAllCatalogWithArtifactGroup(
        selectedFabric,
        client,
      );

      if (allCatArtifactResponse?.status === 200) {
        setCataLogListWithArtifactGroup(allCatArtifactResponse.data);
      } else {
        console.error('Failed to fetch catalog with artifact group');
      }

      resetForm();

      updateToast(
        toastId,
        'success',
        `${isCatalog ? 'Catalog' : 'Artifact group'} created successfully`,
      );
    } catch (error) {
      console.error('Error during the workflow creation process:', error);
      updateToast(toastId, 'error', 'An unexpected error occurred');
    }
  };

  const showToast = (message, type) => {
    toast(<TorusToast />, {
      type,
      title: type === 'success' ? 'Success' : 'Error',
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      text: message,
      closeButton: false,
    });
  };

  const resetForm = () => {
    setCreateCatOrArt(null);
    setCreateCatName(null);
    setCreateArtiName(null);
    setCreateArtiGrp(false);
  };

  const handleArtifactsDelete = (name) => {
    if (version === null || version === 'new version') {
      try {
        deleteArtifact(
          JSON.stringify([
            client,
            selectedTkey,
            selectedFabric,
            selectedProject,
            selectedArtifactGroup,
            name,
          ]),
        )
          .then((data) => {
            if (data && data?.status === 200) {
              setSelectedArtifact('');
              setSelectedVersion('');

              handleIntialLoad(
                selectedTkey,
                client,
                selectedFabric,
                selectedProject,
                selectedArtifactGroup,
              );

              toast(<TorusToast />, {
                type: 'success',
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: true,
                title: 'Success',
                text: `Artifact ${name} with those versions deleted successfully`,
                closeButton: false,
              });
            }
          })
          .catch((error) => console.error(error))
          .finally(() => {
            setInputchange(null);
          });
      } catch (err) {
        toast(<TorusToast />, {
          type: 'error',
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          title: 'Error',
          text: `Cannot delete artifacts `,
          closeButton: false,
        });
      }
    }
  };

  {
    /*Toast implementation*/
  }
  const handleArtifactsVersionDelete = async (name, version) => {
    const isDeletingAllVersions = !version || version === 'new version';

    const payload = JSON.stringify([
      client,
      selectedTkey,
      selectedFabric,
      selectedProject,
      selectedArtifactGroup,
      name,
      ...(isDeletingAllVersions ? [] : [version]),
    ]);

    const toastMessage = isDeletingAllVersions
      ? `Please wait for the deletion of all versions for ${selectedArtifact}`
      : `Please wait for the deletion of ${selectedArtifact} with version ${version}`;

    let toastId;
    try {
      toastId = pendingToast(toastMessage);

      const response = await deleteArtifact(payload);

      if (response?.status === 200) {
        setSelectedArtifact('');
        setSelectedVersion('');
        await handleIntialLoad(
          selectedTkey,
          client,
          selectedFabric,
          selectedProject,
          selectedArtifactGroup,
        );

        const successMessage = isDeletingAllVersions
          ? `Artifact ${name} with all versions deleted successfully`
          : `Artifact ${name} with version ${version} deleted successfully`;

        updateToast(toastId, 'success', successMessage);
      } else {
        throw new Error(response?.message || 'Deletion failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      updateToast(toastId, 'error', errorMessage);
    } finally {
      setInputchange(null);
    }
  };

  const handleArtifactGroupDelete = async (name) => {
    let toastId;
    try {
      toastId = pendingToast(
        `Please wait for the deletion of Artifact-Group ${name} from ${selectedArtifactGroup} `,
      );
      const data = await deleteArifactGroup(
        JSON.stringify([
          client,
          selectedTkey,
          selectedFabric,
          selectedProject,
          name,
        ]),
        client,
      );

      if (data && data.status === 200) {
        setSelectedArtifact('');
        setSelectedVersion('');
        selectedProject && setSelectedProject('');
        selectedArtifactGroup && setSelectedArtifactGroup('');
        let gettersData = data.data;

        console.log(data, 'when DLT');

        setCataLogListWithArtifactGroup(gettersData);

        handleIntialLoad(
          selectedTkey,
          client,
          selectedFabric,
          selectedProject,
          selectedArtifactGroup,
        );
        selectedArtifactGroup && setSelectedArtifactGroup('');
        updateToast(toastId, 'success', 'Artifact group deleted successfully');
      } else {
        updateToast(
          toastId,
          'error',
          'Failed to delete artifact group' || data.message,
        );
      }
    } catch (error) {
      console.error(error);
      updateToast(toastId, 'error', 'Failed to delete artifact group');
      toast.dismiss(toastId);
    }
  };

  {
    /*Toast implementation*/
  }
  const handleCatelogueDelete = async (name) => {
    let toastId;
    try {
      toastId = pendingToast(
        `Please wait for the deletion of catelogue ${name}`,
      );
      const data = await deleteArifactGroup(
        JSON.stringify([client, selectedTkey, selectedFabric, name]),
        client,
      );
      if (data && data.status === 200) {
        setSelectedArtifact('');
        setSelectedVersion('');
        selectedProject && setSelectedProject('');

        let gettersData = data.data;
        setCataLogListWithArtifactGroup(gettersData);
        updateToast(
          toastId,
          'success',
          `Catalogue ${name} deleted successfully`,
        );
      } else {
        throw new Error('Failed to delete artifact group');
      }
    } catch (error) {
      console.error(error);
      updateToast(toastId, 'error', 'Failed to delete catalogue');
    }
  };

  const handleApplicationName = async (item) => {
    try {
      setSelectedArtifact('');
      setSelectedVersion('');

      if (item?.tKey !== selectedTkey) {
        setSelectedTkey(item?.tKey);
        setSelectedProject('');
        setSelectedArtifactGroup('');
      }

      if (item?.catalog) {
        if (item?.catalog !== selectedProject) {
          setSelectedProject(item?.catalog);
          setSelectedArtifactGroup('');
        }

        if (item?.artifactGroup) {
          setSelectedArtifactGroup(item?.artifactGroup);

          const retunsFn = () =>
            isAppOrArtifact === 'apps' ? selectedTenant : client;

          await handleIntialLoad(
            item?.tKey,
            client,
            selectedFabric,
            item?.catalog,
            item?.artifactGroup,
          );
        } else {
          setSelectedArtifactGroup('');
        }
      } else {
        setSelectedProject('');
      }
    } catch (err) {
      console.error(err);
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: `Cannot set selected Application`,
        closeButton: false,
      });
    }
  };

  // const handleUpdateIfo = async (allNodes, securityTarget) => {
  //   try {
  //     let res = await updateTargetIFoOnEvents(allNodes, securityTarget);

  //     return res;
  //   } catch (error) {

  //   }
  // };

  // const handleVersionList = async () => {

  //   try {
  //     const redisKey = JSON.stringify([
  //       client,
  //       selectedTkey,
  //       selectedFabric,
  //       applications,
  //       selectedArtifactGroup,
  //     ]);

  //     const response = await AxiosService.get(`modeller/afvk`, {
  //       params: {
  //         artifact: selectedArtifact,
  //         redisKey: redisKey,
  //       },
  //     });

  //     if (response.status == 200) {
  //       return response.data;
  //     } else {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     // Display error toast

  //     console.error(error);
  //   }
  // };

  const handleIntialLoad = async (
    selectedTkey,
    client,
    selectedFabric,
    applications,
    selectedArtifactGroup,
  ) => {
    // Check if all fields are provided

    try {
      const response = await artifactList(
        selectedFabric,
        JSON.stringify([
          client,
          selectedTkey,
          selectedFabric,
          applications,
          selectedArtifactGroup,
        ]),
        false,
      );

      if (response && response.status === 200) {
        setArtifactsList(response.data);
      }
    } catch (error) {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: `Found error in initial load: ${error.message || error}`,
        closeButton: false,
      });
    }
  };

  useEffect(() => {
    if (urlOpen) {
      window.open(urls, '_blank');
    }
  }, [urlOpen, urls]);

  useEffect(() => {
    if (peurlopen) {
      window.open(peModal, '_blank');
    }
  }, [peurlopen, peModal]);

  const getProcessFlowApi = useCallback(
    async (artiFact, version) => {
      try {
        if (version && version !== 'new version') {
          setRedispath([
            selectedTkey,
            selectedFabric,
            selectedProject,
            selectedArtifactGroup,
            artiFact,
            version,
          ]);
          if (selectedVersion) handleArtifactLock(false);
          setSelectedArtifact(artiFact);
          if (version) {
            setSelectedVersion(version);

            const response = await getJson(
              selectedFabric,
              JSON.stringify([
                client,
                selectedTkey,
                selectedFabric,
                selectedProject,
                selectedArtifactGroup,
                artiFact,
                version,
              ]),
            );

            if (response && typeof response === 'object' && response) {
              sendDataToFabrics({
                ...response.data,
              });
              setArtifactLockToggle(response?.data?.isLocked);
              setCurrentUpdation(response?.data?.currentUpdation);
            } else {
              toast(<TorusToast />, {
                position: 'bottom-right',
                type: 'error',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                title: 'ERROR',
                text: `Cannot load Flow details`,
              });
            }
          } else {
            setSelectedVersion('');
            sendDataToFabrics({
              nodes: [],
              nodesEdges: [],
            });
          }
        }

        if (version === 'new version') {
          setSelectedVersion(version);
        }
      } catch (error) {
        toast(<TorusToast />, {
          position: 'bottom-right',
          type: 'error',
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: false,
          title: 'ERROR',
          text: `Cannot load Flow details`,
        });
      }
    },
    [selectedFabric, client, selectedProject, sendDataToFabrics, selectedTkey],
  );

  useEffect(() => {
    if (fromSubFlow) {
      getProcessFlowApi(selectedArtifact, selectedVersion);
      setFromSubFlow(false);
    }
  }, [fromSubFlow]);

  const handleAccordionContentToggle = (item) => {
    try {
      if (selectedVersion) handleArtifactLock(false);

      handleApplicationName(item);
    } catch (error) {
      console.error(error);
    }
  };

  const artifactsAccordionItems = useMemo(() => {
    try {
      if (!cataLogListWithArtifactGroup) return [];

      if (isAppOrArtifact === 'apps') {
        return [
          {
            title: 'My Builds',
            type: 'category',
            id: 'AFC',
            content: cataLogListWithArtifactGroup['AFC'] ?? [],
          },
        ];
      } else {
        return [
          {
            title: 'My Artifacts',
            type: 'category',
            id: 'AF',
            content: cataLogListWithArtifactGroup['AF'] ?? [],
          },
          {
            title: 'Defaults',
            type: 'category',
            id: 'AFR',
            content: cataLogListWithArtifactGroup['AFR'] ?? [],
          },
          {
            title: 'Shared with me',
            type: 'category',
            id: '',
            content: [],
          },
          {
            title: 'Purchased',
            type: 'category',
            id: '',
            content: [],
          },
        ];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [cataLogListWithArtifactGroup, isAppOrArtifact]);

  const saveProcessFlow = async (
    type,
    selectedApplictionNames,
    selectedArtifactss,
    selectedVerisonss,
    erDatas,
  ) => {
    try {
      if (
        selectedTkey &&
        selectedFabric &&
        selectedProject &&
        selectedArtifactGroup &&
        type &&
        selectedApplictionNames &&
        selectedArtifactss &&
        selectedVerisonss
      ) {
        const payload = {
          redisKey: [
            client,
            selectedTkey,
            selectedFabric,
            selectedProject,
            selectedArtifactGroup,
          ],
          flow: { ...erDatas },
          userId: clientLoginId,
          project: selectedApplictionNames,

          artifact: selectedArtifactss,
        };

        const response = await saveWorkFlow(
          payload,
          type,
          selectedVerisonss,
          client,
          selectedFabric,
        );
        if (response?.currentUpdation) {
          setCurrentUpdation(response?.currentUpdation);
        }
        console.log(
          response,
          payload,
          type,
          selectedVerisonss,
          client,
          selectedFabric,
          'saveres',
        );

        if (response && response.status === 200) {
          if (type === 'create') {
            await handleIntialLoad(
              selectedTkey,
              client,
              selectedFabric,
              selectedApplictionNames || selectedProject,
              selectedArtifactGroup,
            );

            setSelectedProject(selectedApplictionNames);
            setSelectedArtifact(selectedArtifactss);

            handleIntialLoad(
              selectedTkey,
              client,
              selectedFabric,
              selectedApplictionNames,
              selectedArtifactGroup,
            );
            setSelectedVersion(response.data[response.data.length - 1]);
            setArtifactsVersion(response.data);

            if (selectedFabric === 'DF-DFD') {
              const getRediskey = payload?.redisKey;
              const getArtifact = payload?.artifact;
              const nodes = payload?.flow?.nodes;
              if (nodes && nodes.length > 0) {
                let pending = pendingToast(
                  'Please wait for the creation of DFO',
                );
                let rediskey = `CK:${getRediskey[0]}:FNGK:${getRediskey[1]}:FNK:DF-DFD:CATK:${getRediskey[3]}:AFGK:${getRediskey[4]}:AFK:${getArtifact}:AFVK:${selectedVerisonss}`;

                const DFOschema = await getDFOSchema(rediskey);

                if (DFOschema?.errorInfo || DFOschema?.error) {
                  updateToast(
                    pending,
                    'error',
                    `For ${selectedFabric} DFO schema may not created `,
                  );
                }
                if (DFOschema?.statusCode) {
                  updateToast(
                    pending,
                    'success',
                    `For ${selectedFabric} DFO schema created`,
                  );
                }
              }
            }
          }
        } else if (response && response.status === 201) {
          if (type === 'update') {
            setSelectedProject(selectedApplictionNames);
            setSelectedArtifact(selectedArtifactss);

            if (selectedFabric === 'DF-DFD') {
              const getRediskey = payload?.redisKey;
              const getArtifact = payload?.artifact;
              const nodes = payload?.flow?.nodes;

              if (nodes && nodes.length > 0) {
                let rediskey = `CK:${getRediskey[0]}:FNGK:${getRediskey[1]}:FNK:DF-DFD:CATK:${getRediskey[3]}:AFGK:${getRediskey[4]}:AFK:${getArtifact}:AFVK:${selectedVerisonss}`;
                let pending = pendingToast('Please wait for the update');

                const DFOschema = await getDFOSchema(rediskey);

                console.log(DFOschema, 'DFOschema---->>>>');

                if (DFOschema?.errorInfo || DFOschema?.error) {
                  updateToast(
                    pending,
                    'error',
                    `For ${selectedFabric} DFO schema may not created `,
                  );
                }
                if (DFOschema?.statusCode) {
                  updateToast(
                    pending,
                    'success',
                    `For ${selectedFabric} DFO schema created`,
                  );
                }
              }
            }
          }
        } else if (
          !response ||
          response.status !== 200 ||
          response.status !== 201
        ) {
          updateToast(
            pending,
            'error',
            `${selectedFabric} couldnt save  Fabric`,
          );
        }

        return response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const mappedTeamItems = [
    {
      artifactName: 'bankmaster',
      artifactKeyPrefix: 'TLC:AF:UF:domain:pgrp:bankmaster:v2',
      buildKeyPrefix: 'TGA:ABKUF:BUILD:GSS:testApp:bankmaster:v2',
      version: 'v2',
      loginId: 'test',
      timestamp: '2024-08-05T13:23:40.195Z',
    },
    {
      artifactName: 'bankmaster',
      artifactKeyPrefix: 'TLC:AF:UF:domain:pgrp:bankmaster:v2',
      buildKeyPrefix: 'TGA:ABKUF:BUILD:GSS:testApp:bankmaster:v2',
      version: 'v2',
      loginId: 'test',
      timestamp: '2024-08-05T13:25:19.117Z',
    },
    {
      artifactName: 'bankmaster',
      artifactKeyPrefix: 'TLC:AF:UF:domain:pgrp:bankmaster:v2',
      buildKeyPrefix: 'TGA:ABKUF:BUILD:ABC:ME:bankmaster:v2',
      version: 'v2',
      loginId: 'test',
      timestamp: '2024-08-05T14:22:12.040Z',
    },
    {
      artifactName: 'bankmaster',
      artifactKeyPrefix: 'TLC:AF:UF:domain:pgrp:bankmaster:v2',
      buildKeyPrefix: 'TGA:ABKUF:BUILD:ABC:ME:bankmaster:v2',
      version: 'v2',
      loginId: 'test',
      timestamp: '2024-08-05T14:26:43.661Z',
    },
    {
      artifactName: 'bankmaster',
      artifactKeyPrefix: 'TLC:AF:UF:domain:pgrp:bankmaster:v2',
      buildKeyPrefix: 'TGA:ABKUF:BUILD:ABC:ME:bankmaster:v2',
      version: 'v2',
      loginId: 'test',
      timestamp: '2024-08-05T14:26:44.489Z',
    },
    {
      artifactName: 'bankmaster',
      artifactKeyPrefix: 'TLC:AF:UF:domain:pgrp:bankmaster:v2',
      buildKeyPrefix: 'TGA:ABKUF:BUILD:GSS:testApp:bankmaster:v2',
      version: 'v2',
      loginId: 'test',
      timestamp: '2024-08-06T04:17:38.810Z',
    },
    {
      artifactName: 'bankmaster',
      artifactKeyPrefix: 'TLC:AF:UF:domain:pgrp:bankmaster:v2',
      buildKeyPrefix: 'TGA:ABKUF:BUILD:ABC:ME:bankmaster:v2',
      version: 'v2',
      loginId: 'test',
      timestamp: '2024-08-06T04:18:07.534Z',
    },
  ];

  const handleNewArtifactValidation = (version, artiver) => {
    const lengthWithoutNewVersion = artiver.filter(
      (version) => version !== 'new version',
    ).length;
    if (version) {
      try {
        if (version === 'new version') {
          saveProcessFlow(
            'create',
            selectedProject,
            selectedArtifact,
            `v1`,
            getDataFromFabrics,
          )
            .then(() => {
              setNewArtifactValue('');
              setNewArtifact(false);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          setShowSaveAsPopover(true);
          setSelectedPrevKeys({
            selectedProject: selectedProject,
            selectedArtifactGroup: selectedArtifactGroup,
            selectedArtifact: selectedArtifact,
            selectedVersion: selectedVersion,
          });
          setSelectedProject('');
          setSelectedArtifactGroup('');
          setSelectedArtifact('');
          setSelectedVersion('');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Success',
        text: `Please select Version `,
        closeButton: false,
      });
    }
  };

  const handleCancelFromSaveas = () => {
    setSelectedProject(selectedPrevKeys.selectedProject);
    setSelectedArtifactGroup(selectedPrevKeys.selectedArtifactGroup);
    setSelectedArtifact(selectedPrevKeys.selectedArtifact);
    setSelectedVersion(selectedPrevKeys.selectedVersion);
  };

  {
    /* toast implemented*/
  }
  const handlingsaveThings = async (version) => {
    const toastId = pendingToast('please wait for few seconds');
    try {
      console.log('version', version);
      if (version === 'new version') {
        await saveProcessFlow(
          'create',
          selectedProject,
          selectedArtifact,
          'v1',
          getDataFromFabrics,
        )
          .then(() => {
            updateToast(toastId, 'success', 'Artifact created successfully.');
          })
          .catch((error) => {
            updateToast(
              toastId,
              'error',
              error.message ||
                'An unexpected error occurred. Please try again.',
            );
          });

        resetState();
      } else if (newArtifact && !selectedArtifact) {
        await saveProcessFlow(
          'create',
          selectedProject,
          newArtifactValue,
          'v1',
          getDataFromFabrics,
        )
          .then(() => {
            updateToast(toastId, 'success', 'Artifact created successfully.');
          })
          .catch((error) => {
            updateToast(
              toastId,
              'error',
              error.message ||
                'An unexpected error occurred. Please try again.',
            );
          });

        resetState();
      } else {
        if (
          selectedProject &&
          selectedArtifact &&
          selectedVersion &&
          getDataFromFabrics
        ) {
          await saveProcessFlow(
            'update',
            selectedProject,
            selectedArtifact,
            selectedVersion,
            getDataFromFabrics,
          )
            .then(() => {
              updateToast(toastId, 'success', 'Artifact updated successfully.');
            })
            .catch((error) => {
              updateToast(
                toastId,
                'error',
                error.message ||
                  'An unexpected error occurred. Please try again.',
              );
            });
        }
      }
    } catch (error) {
      console.error(error);
      updateToast(
        toastId,
        'error',
        error.message || 'An unexpected error occurred. Please try again.',
      );
    }
  };

  const resetState = () => {
    setNewArtifactValue('');
    setNewArtifact(false);
    handleIntialLoad(
      selectedTkey,
      client,
      selectedFabric,
      selectedProject,
      selectedArtifactGroup,
    );
    if (createArtiGrp) setCreateArtiGrp(false);
  };

  {
    /* toast implemented*/
  }
  const handleSaveVariousPath = async () => {
    if (
      !selectedTkey ||
      !selectedFabric ||
      !selectedProject ||
      !selectedArtifactGroup ||
      !selectedPrevKeys
    ) {
      console.error('Required keys are missing!');
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: 'Required keys are missing!',
        closeButton: false,
      });
      return;
    }

    let toastId;
    const newArtifactValue = (() => {
      if (showSaveasNewartifact && saveasInputValue.trim() !== '') {
        return saveasInputValue.trim();
      } else if (!showSaveasNewartifact && selectedArtifact) {
        return selectedArtifact;
      }
      return '';
    })();

    if (!newArtifactValue) {
      toast(<TorusToast />, {
        type: 'error',
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        title: 'Error',
        text: 'Invalid artifact name!',
        closeButton: false,
      });
      return;
    }

    try {
      const versionValue = showSaveasNewartifact
        ? 'v1'
        : await (async () => {
            const response = await versionList(
              selectedArtifact,
              JSON.stringify([
                client,
                selectedTkey,
                selectedFabric,
                selectedProject,
                selectedArtifactGroup,
              ]),
            );
            const versions = response.data || [];
            return `v${versions.length + 1}`;
          })();

      if (!versionValue) {
        throw new Error('Invalid version value');
      }

      const values = {
        SOURCE: 'redis',
        TARGET: 'redis',
        sourceKey: [
          client,
          selectedTkey,
          selectedFabric,
          selectedPrevKeys.selectedProject,
          selectedPrevKeys.selectedArtifactGroup,
          selectedPrevKeys.selectedArtifact,
          selectedPrevKeys.selectedVersion,
        ],
        destinationKey: [
          client,
          selectedTkey,
          selectedFabric,
          selectedProject,
          selectedArtifactGroup,
          newArtifactValue,
          versionValue,
        ],
        loginId: clientLoginId,
      };

      toastId = pendingToast(
        `Saving artifact: ${selectedPrevKeys.selectedArtifact} -> ${newArtifactValue} (Version: ${versionValue})`,
      );

      const responseSaveAs = await saveAsPost(values);

      if (responseSaveAs?.status === 201) {
        await handleIntialLoad(
          selectedTkey,
          client,
          selectedFabric,
          selectedProject,
          selectedArtifactGroup,
        );

        setSelectedArtifact(newArtifactValue);
        setSelectedVersion(versionValue);
        setShowSaveAsPopover(false);
        setNewArtifact(false);

        updateToast(toastId, 'success', 'Artifact saved successfully!');
      } else {
        throw new Error('Save As operation failed.');
      }
    } catch (error) {
      const errorMessage =
        error.message || 'An unexpected error occurred during save as';
      updateToast(toastId, 'error', errorMessage);
    }
  };

  const versionFinder = useCallback(
    async (artifacts) => {
      if (artifacts) {
        const versions = await versionList(
          artifacts,
          JSON.stringify([
            client,
            selectedTkey,
            selectedFabric,
            selectedProject,
            selectedArtifactGroup,
          ]),
        );

        setArtifactsVersion(versions.data);
        if (versions?.data?.length > 0) {
          getProcessFlowApi(artifacts, versions.data[versions.data.length - 1]);
        }
      }
    },
    [selectedTkey, selectedFabric, selectedProject, selectedArtifactGroup],
  );

  const handleNewArtifactChange = () => {
    try {
      setNewArtifactInputChange(!newArtifactInputChange);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubflow = () => {
    try {
      setNodes([]);
      setEdges([]);
      selectedFabric && selectedFabric.startsWith('UF')
        ? setSelectedSubFlow('UO')
        : selectedFabric == 'PF-PFD'
          ? setSelectedSubFlow('PO')
          : selectedFabric === 'DF-DFD' && setSelectedSubFlow('DO');
    } catch (error) {
      console.error(error);
    }
  };

  const handleselectionChange = (key) => {
    const newSelected = new Set(selected);

    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelected(newSelected);
  };

  const handleSideTabChange = async (subfabric) => {
    handleTabChange(subfabric);
  };

  const handleTopTabChange = async (selectedTab) => {
    if (selectedTab === 'apps') {
      setIsAppOrArtifact('apps');
      setArtifactsList([]);

      // setArtifactstTabValue({
      //   selectedProject: selectedProject,
      //   selectedArtifactGroup: selectedArtifactGroup,
      //   selectedArtifact: selectedArtifact,
      //   selectedVersion: selectedVersion,
      // });

      // setSelectedProject(AppstTabValue?.selectedProject || '');
      // setSelectedArtifactGroup(AppstTabValue?.selectedArtifactGroup || '');
      // setSelectedArtifact(AppstTabValue?.selectedArtifact || '');
      // setSelectedVersion(AppstTabValue?.selectedVersion || '');
    } else if (selectedTab === 'artifacts') {
      setIsAppOrArtifact('artifacts');

      // setSelectedProject(ArtifactstTabValue?.selectedProject || '');
      // setSelectedArtifactGroup(ArtifactstTabValue?.selectedArtifactGroup || '');
      // setSelectedArtifact(ArtifactstTabValue?.selectedArtifact || '');
      // setSelectedVersion(ArtifactstTabValue?.selectedVersion || '');

      // setAppstTabValue({
      //   selectedProject: selectedProject,
      //   selectedArtifactGroup: selectedArtifactGroup,
      //   selectedArtifact: selectedArtifact,
      //   selectedVersion: selectedVersion,
      // });
    }
  };

  return (
    <div
      className={`flex h-full w-full items-center justify-center  
         `}
      style={{
        background: selectedTheme && selectedTheme?.bg,
        borderBottom: `1px solid ${selectedTheme && selectedTheme?.border}`,
      }}
    >
      <div className="flex h-[90%] w-[100%] flex-col items-center justify-center">
        <div className="flex h-[80%]  w-[99%] flex-row items-center">
          <div className="flex w-1/3 justify-start ">
            <div
              className="flex h-full w-[7vw] cursor-pointer items-center justify-center"
              onClick={() => handleTabChange('Home')}
            >
              <TorusLogo className={'h-[2.66vh] w-[2.38vw]'} />
              <span
                className={`font-Neue Montreal text-[1.25vw] font-medium leading-[2.66vh] text-[${selectedTheme?.text}]`}
              >
                TORUS
              </span>
            </div>
          </div>

          {mainFabric !== 'Home' && (
            <>
              <div className=" flex h-full w-1/3 items-center justify-center gap-2 rounded-md bg-transparent ">
                <div className="flex h-full w-[100%] items-center justify-center">
                  {mainFabric !== 'Home' && (
                    <>
                      <TorusPopOver
                        parentHeading={
                          <div
                            className="grid grid-cols-3 grid-rows-1 gap-[0.255vh]"
                            onClick={() => {
                              setShowNodeProperty(false);
                            }}
                          >
                            <div className="col-span-2 flex flex-col items-start justify-center gap-[0.255vh]">
                              <div
                                title={
                                  (selectedArtifact && selectedArtifact) ||
                                  'Select Artifacts'
                                }
                                className="flex w-[100%] items-center justify-start"
                              >
                                <span
                                  className={`w-[94%]  ${selectedArtifact ? 'truncate text-center' : 'whitespace-nowrap text-start'}  text-[0.83vw] font-semibold  `}
                                  style={{
                                    color: selectedTheme && selectedTheme?.text,
                                  }}
                                >
                                  {(selectedArtifact && selectedArtifact) ||
                                    'Select Artifacts'}
                                </span>
                              </div>
                              {selectedVersion && (
                                <div className="flex h-[100%] w-[100%] items-center justify-start pt-[0.55vh] text-start  ">
                                  {currentUpdation && (
                                    <>
                                      <div
                                        className={`w-[80%] whitespace-nowrap text-right text-[0.52vw] font-semibold leading-[1.12vh]  tracking-tighter  text-opacity-60`}
                                        style={{
                                          color: selectedTheme?.text,
                                        }}
                                      >
                                        {'Edited ' + currentUpdation}
                                      </div>
                                      <div className="flex h-[100%] w-[20%] items-center justify-center ">
                                        <DotIcon
                                          className={'h-[0.3vw] w-[0.3vw]'}
                                          fill={`${selectedTheme?.text}`}
                                          opacity={0.6}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="col-span-1 items-center justify-center">
                              <div className="flex items-center justify-start gap-[0.255vh]">
                                <div
                                  className={`flex items-center justify-center rounded-xl 
                                    ${selectedVersion ? 'h-[2vh] w-[1.51vw]' : 'h-[2vh] w-[1.51vw]'}
                                    text-xs `}
                                  style={{
                                    backgroundColor:
                                      selectedAccntColor && selectedAccntColor,
                                  }}
                                >
                                  <span
                                    className={`text-[0.52vw]  ${!selectedVersion ? 'pt-[0.55vh]' : ''}`}
                                    style={{
                                      color: '#ffffff',
                                    }}
                                  >
                                    {(selectedVersion &&
                                      `${selectedVersion === 'new version' ? 'N' : selectedVersion}`) ||
                                      '*'}
                                  </span>
                                </div>
                                <div className="">
                                  <NavbarArrowDown
                                    className={`h-[0.83vw] w-[0.83vw]  `}
                                    stroke={`${selectedTheme?.text}`}
                                  />
                                </div>
                              </div>
                              {selectedVersion && (
                                <div
                                  style={{
                                    visibility: currentUpdation
                                      ? 'visible'
                                      : 'hidden',
                                  }}
                                  className="flex h-[88%] items-center justify-start gap-[0.255vh]"
                                >
                                  <span>
                                    <NavbarSavdIcon
                                      className={'h-[0.62vw] w-[0.62vw]'}
                                      stroke={`${selectedTheme?.text}`}
                                      opacity={0.6}
                                    />
                                  </span>
                                  <span
                                    className={`text-[0.52vw] font-semibold leading-[1.12vh]  text-opacity-60`}
                                    style={{
                                      color: selectedTheme?.text,
                                    }}
                                  >
                                    Saved
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                        fontStyle={`${
                          !currentUpdation ? 'w-[9.85vw]' : 'w-[10.55vw]'
                        }`}
                        popbuttonClassNames={`transition-all duration-300 ease-in-300 ease-out-500
                           ${
                             !currentUpdation
                               ? 'w-[9.5vw] h-[2.5vh]'
                               : 'w-[9.25vw] h-[100%]'
                           }`}
                        isDisabled={selectedSubFlow ? true : false}
                        children={({ close }) => (
                          <>
                            <div
                              className={`${selectedFabric === 'events' ? 'h-[60vh] w-[28.17vw]' : 'h-[65.46vh]  w-[36.20vw] '} mt-[4.5%] flex flex-col justify-between rounded-lg   `}
                              style={{
                                backgroundColor: `${selectedTheme?.bg}`,
                                borderColor: `${selectedTheme?.border}`,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                              }}
                            >
                              <>
                                <div
                                  className={`flex h-[10%] w-[100%] flex-row p-[0.55vw]`}
                                  style={{
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                    borderBottom: `${selectedTheme?.border}`,
                                    borderBottomWidth: '1px',
                                    borderBottomStyle: 'solid',
                                  }}
                                >
                                  <div className="flex  items-center justify-start">
                                    <p
                                      className={`whitespace-nowrap px-2 text-start text-[0.83vw] font-semibold text-[${selectedTheme?.text}/90]`}
                                      style={{
                                        color: `${selectedTheme?.['textOpacity/50']}`,
                                      }}
                                    >
                                      {showSaveAsPopover
                                        ? 'Save As'
                                        : 'Library'}
                                    </p>
                                  </div>
                                  <div className="flex w-full items-center justify-center">
                                    <div className="flex w-[21.56vw] items-center justify-center">
                                      <TorusSearch
                                        height="sm"
                                        placeholder="Search"
                                        radius="sm"
                                        textStyle={`text-[${selectedTheme?.text}]  text-[0.83vw] font-normal leading-[2.22vh] tracking-normal pl-[0.5vw]`}
                                        borderColor={`${selectedTheme?.border}`}
                                        bgColor={`${selectedTheme?.bgCard}`}
                                        strokeColor={`${selectedTheme?.text}`}
                                        placeholderStyle={
                                          'placeholder:text-[#1C274C] dark:placeholder:text-[#FFFFFF]/35 text-start  placeholder-opacity-75 placeholder:text-[0.72vw]  dark:placeholder-[#3f3f3f]'
                                        }
                                        onChange={handleSearchChange}
                                        type="text"
                                        value={searchedValue}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex  flex-row  items-center justify-end gap-2 ">
                                    <span
                                      className="flex cursor-pointer items-center justify-center rounded-md  transition-all duration-200  "
                                      onClick={() => {
                                        close();
                                        setNewArtifactValue('');
                                        setNewArtifactNameValidation(
                                          !newArtifactNameValidation,
                                        );
                                      }}
                                    >
                                      <CloseIcon
                                        strokeColor={selectedTheme?.text}
                                        className="h-[0.65vw] w-[0.65vw]"
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div className=" flex h-[71%] w-full items-center  justify-center">
                                  {!showSaveAsPopover && (
                                    <div
                                      className="h-full  w-[3.33vw] border-r   dark:border-[#212121]"
                                      style={{
                                        borderColor: `${selectedTheme?.border}`,
                                      }}
                                    >
                                      <div className="flex h-[97%] w-[100%] flex-col items-center justify-start gap-1">
                                        <div className="flex h-full w-[100%] flex-col items-center  justify-start  pt-1 ">
                                          <TorusTab
                                            key="TorusTab"
                                            orientation="vertical"
                                            classNames={{
                                              tabs: 'cursor-pointer ',
                                              tabList:
                                                'w-full h-[100%]  flex justify-center items-center gap-[1vh] transition-all duration-200',
                                              tab: `h-[3.33vh] w-full flex justify-center items-center torus-pressed:outline-none torus-focus:outline-none  `,
                                            }}
                                            defaultSelectedKey={selectedFabric}
                                            tabs={itemsForSubFabricTabs}
                                            onSelectionChange={
                                              handleSideTabChange
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div
                                    className="flex h-full w-[13.55vw] flex-col items-center justify-center gap-1 border-r border-[#E5E9EB] dark:border-[#212121]"
                                    style={{
                                      borderColor: `${selectedTheme?.border}`,
                                    }}
                                  >
                                    <div className="flex h-[50vh] w-[100%] flex-col items-start justify-start gap-[1.55vh]">
                                      {!showSaveAsPopover && (
                                        <div className="flex w-[100%] justify-center pt-[0.15vw] ">
                                          <TorusTab
                                            key="TorusTab"
                                            orientation="horizontal"
                                            tabsbgcolor={selectedTheme?.bgCard}
                                            classNames={{
                                              tabs: `cursor-pointer bg-[${selectedTheme?.bgCard}] w-[94%] py-[0.185vw]`,
                                              tabList:
                                                'w-full h-[100%]  flex justify-center items-center gap-[1vh] transition-all duration-200',
                                              tab: `h-full w-full flex justify-center items-center torus-pressed:outline-none torus-focus:outline-none  `,
                                            }}
                                            defaultSelectedKey={isAppOrArtifact}
                                            tabs={[
                                              {
                                                id: 'apps',
                                                content: ({ isSelected }) => (
                                                  <span
                                                    className={`flex h-full rounded-sm duration-150 ease-in-out transition-background 
                                                      ${
                                                        isSelected
                                                          ? ` px-[0.25vw] py-[0.55vh] font-[600] `
                                                          : 'font-[500]'
                                                      } w-full items-center justify-center truncate text-[0.63vw]  `}
                                                    style={{
                                                      backgroundColor: `${isSelected ? selectedTheme?.bg : ''}`,
                                                      color: `${isSelected ? selectedTheme?.text : '#A59E92'}`,
                                                    }}
                                                  >
                                                    Apps
                                                  </span>
                                                ),
                                              },
                                              {
                                                id: 'artifacts',
                                                content: ({ isSelected }) => (
                                                  <span
                                                    className={`flex h-full rounded-sm duration-150 ease-in-out transition-background 
                                                      ${
                                                        isSelected
                                                          ? ` px-[0.25vw] py-[0.55vh] font-[600] `
                                                          : 'font-[500]'
                                                      } w-full items-center justify-center truncate text-[0.63vw]  `}
                                                    style={{
                                                      backgroundColor: `${isSelected ? selectedTheme?.bg : ''}`,
                                                      color: `${isSelected ? selectedTheme?.text : '#A59E92'}`,
                                                    }}
                                                  >
                                                    Artifacts
                                                  </span>
                                                ),
                                              },
                                            ]}
                                            onSelectionChange={
                                              handleTopTabChange
                                            }
                                          />
                                        </div>
                                      )}
                                      {isAppOrArtifact === 'apps' ? (
                                        <CatalogAccordian
                                          items={artifactsAccordionItems}
                                          onSelectionChange={
                                            handleAccordionContentToggle
                                          }
                                          setCreateCatOrArt={setCreateCatOrArt}
                                          setSelectedProject={
                                            setSelectedProject
                                          }
                                          setSelectedArtifactGroup={
                                            setSelectedArtifactGroup
                                          }
                                          setSelectedArtifact={
                                            setSelectedArtifact
                                          }
                                          setSelectedVersion={
                                            setSelectedVersion
                                          }
                                          setNewArtifact={setNewArtifact}
                                          setCreateCatName={setCreateCatName}
                                          setCreateArtiName={setCreateArtiName}
                                          setCreateArtiGrp={setCreateArtiGrp}
                                        />
                                      ) : (
                                        <>
                                          <CatalogAccordian
                                            items={artifactsAccordionItems}
                                            onSelectionChange={
                                              handleAccordionContentToggle
                                            }
                                            setCreateCatOrArt={
                                              setCreateCatOrArt
                                            }
                                            setSelectedProject={
                                              setSelectedProject
                                            }
                                            setSelectedArtifactGroup={
                                              setSelectedArtifactGroup
                                            }
                                            setSelectedArtifact={
                                              setSelectedArtifact
                                            }
                                            setSelectedVersion={
                                              setSelectedVersion
                                            }
                                            setNewArtifact={setNewArtifact}
                                            setCreateCatName={setCreateCatName}
                                            setCreateArtiName={
                                              setCreateArtiName
                                            }
                                            setCreateArtiGrp={setCreateArtiGrp}
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex h-[100%] w-[29.4vw] scroll-m-1  flex-col items-center justify-start gap-1 ">
                                    <div
                                      className={`mt-[1.5vh] w-full ${selectedProject ? 'pl-[0vw] ' : 'pl-[0vw] '} flex h-[2.22vh]  items-center justify-start`}
                                    >
                                      <BreadcrumbsComponent
                                        client={client}
                                        selectedProject={selectedProject}
                                        selectedArtifactGroup={
                                          selectedArtifactGroup
                                        }
                                        selectedArtifact={selectedArtifact}
                                        selectedTheme={selectedTheme}
                                      />
                                    </div>

                                    {selectedProject && (
                                      <div className="flex h-[50vh]  w-full flex-col items-center justify-start  transition-all duration-300 ">
                                        {!showSaveAsPopover ? (
                                          <div
                                            className={`flex h-[42vh]  w-[100%]  flex-col  items-center justify-start overflow-y-scroll scroll-smooth pt-[0.55vh]   scrollbar-default `}
                                          >
                                            {selectedProject &&
                                            selectedArtifactGroup &&
                                            filteredArtifactList &&
                                            filteredArtifactList.length > 0 ? (
                                              <div className="flex w-full flex-col items-start justify-center ">
                                                {filteredArtifactList.map(
                                                  (item, index) => {
                                                    return (
                                                      <div
                                                        className={`flex justify-center h-[${filteredArtifactList.length / 100}%]  w-[100%] items-center gap-3 py-[0.25vh] pl-[0.25vw] `}
                                                      >
                                                        <>
                                                          {inputchange !==
                                                          index ? (
                                                            <div
                                                              onClick={() => {
                                                                if (
                                                                  !showSaveAsPopover &&
                                                                  selectedArtifact !==
                                                                    item
                                                                ) {
                                                                  handleArtifactsChange(
                                                                    item,
                                                                  );
                                                                  setNewArtifact(
                                                                    false,
                                                                  );
                                                                  setShowNodeProperty(
                                                                    false,
                                                                  );
                                                                  setInputValue(
                                                                    item,
                                                                  );
                                                                }
                                                              }}
                                                              className={`w-[100%] transition-all duration-75 ease-in-out
                                                                  ${
                                                                    selectedArtifact ===
                                                                      item &&
                                                                    !showSaveAsPopover
                                                                      ? `rounded border border-transparent   px-[0.35vw] py-[0.55vh] font-[600] text-[#0736c4]`
                                                                      : 'border border-transparent bg-transparent'
                                                                  } 
                                                                   flex w-[100%] cursor-pointer flex-row items-center justify-start rounded  px-[0.25rem]`}
                                                              style={{
                                                                backgroundColor: `${
                                                                  selectedArtifact ===
                                                                    item &&
                                                                  !showSaveAsPopover
                                                                    ? selectedTheme[
                                                                        'bgCard'
                                                                      ]
                                                                    : ''
                                                                }`,
                                                                color: `${
                                                                  selectedArtifact ===
                                                                    item &&
                                                                  !showSaveAsPopover
                                                                    ? selectedTheme[
                                                                        'text'
                                                                      ]
                                                                    : selectedTheme[
                                                                        'textOpacity/50'
                                                                      ]
                                                                }`,
                                                              }}
                                                            >
                                                              <span className="flex h-full w-full items-center justify-start truncate py-[0.55vh] text-[0.83vw]">
                                                                {/* <span  >{returnedVal(item)[0]}</span>
                                                                  <span  className='text-[#0736c4] font-bold'>{searchedValue}</span>
                                                                  <span>{returnedVal(item)[1]}</span> */}
                                                                <span>
                                                                  {item}
                                                                </span>
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            <p>
                                                              Length is too
                                                              short
                                                            </p>
                                                          )}
                                                        </>

                                                        <div
                                                          className={`${selectedVersion && selectedArtifact === item ? 'h-full w-[0.25vw] rounded-full' : 'border border-transparent'} flex  items-center justify-center text-[0.83vw]`}
                                                          style={{
                                                            backgroundColor: `${selectedVersion && selectedArtifact === item ? `${selectedAccntColor}80` : ''}`,
                                                          }}
                                                        >
                                                          {}
                                                        </div>
                                                      </div>
                                                    );
                                                  },
                                                )}
                                              </div>
                                            ) : (
                                              <div
                                                className="flex h-full w-full items-center justify-center text-[12px]"
                                                style={{
                                                  color: `${selectedTheme?.text}80`,
                                                }}
                                              >
                                                no artifacts
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <>
                                            {showSaveasNewartifact ? (
                                              <div className="flex h-full w-[100%] items-center justify-center">
                                                <span className="text-[0.72vw] italic text-slate-600">
                                                  Insert artifact metadata
                                                </span>
                                              </div>
                                            ) : (
                                              <div
                                                className={`flex h-[48vh] w-[100%]  flex-col  items-center justify-start overflow-y-scroll scroll-smooth pt-[0.55vh] scrollbar-default `}
                                              >
                                                {filteredArtifactList &&
                                                filteredArtifactList.length >
                                                  0 ? (
                                                  <div className="flex w-full flex-col items-start justify-center ">
                                                    {filteredArtifactList.map(
                                                      (item, index) => {
                                                        return (
                                                          <div
                                                            className={`flex justify-center h-[${filteredArtifactList.length / 100}%]  w-[100%] items-center gap-3 py-[0.25vh] pl-[0.25vw] `}
                                                          >
                                                            <>
                                                              {inputchange !==
                                                              index ? (
                                                                <div
                                                                  className={`w-[100%] transition-all duration-100 ease-soft-spring ${selectedArtifact === item ? 'rounded border border-transparent  bg-[#e3e8ff] px-[0.35vw] py-[0.55vh] font-[600] text-[#0736c4]' : 'border border-transparent bg-transparent'} flex h-[3.14vh]  w-[100%] cursor-pointer flex-row items-center justify-start rounded bg-transparent px-[0.35rem]   dark:bg-[#0F0F0F]`}
                                                                >
                                                                  <div className="flex h-full w-full items-center justify-start truncate text-[0.83vw] ">
                                                                    {item}
                                                                  </div>
                                                                </div>
                                                              ) : (
                                                                <p>
                                                                  Length is too
                                                                  short
                                                                </p>
                                                              )}
                                                            </>

                                                            <div
                                                              className={`${selectedVersion && selectedArtifact === item ? 'rounded border border-[#0736C4]' : 'border border-transparent'} flex  items-center justify-center text-[0.83vw]`}
                                                            >
                                                              {}
                                                            </div>
                                                          </div>
                                                        );
                                                      },
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div
                                                    className="flex h-full w-full items-center justify-center text-[12px]"
                                                    style={{
                                                      color: `${selectedTheme?.text}80`,
                                                    }}
                                                  >
                                                    no artifacts
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </>
                                        )}
                                        {/* {showSaveAsPopover &&
                                            !showSaveasNewartifact ? (
                                              <span>New artifacts</span>
                                            ):()} */}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`flex h-[19%] w-[100%] flex-col  items-center justify-between border-t  duration-150 ease-soft-spring transition-height `}
                                  style={{
                                    borderColor: `${selectedTheme?.border}`,
                                  }}
                                >
                                  {}
                                  <>
                                    <div
                                      className="flex h-[50%] w-[100%] items-center justify-between gap-[0.65vw] border-b  px-[0.55vw] py-[0.55vh] "
                                      style={{
                                        borderColor: `${selectedTheme?.border}`,
                                      }}
                                    >
                                      <div className="flex w-[100%] items-center justify-start">
                                        {!showSaveAsPopover && (
                                          <>
                                            {!newArtifact ? (
                                              <>
                                                {!newArtifact &&
                                                  createCatOrArt !== null &&
                                                  !selectedArtifact &&
                                                  !selectedArtifactGroup &&
                                                  !createArtiGrp && (
                                                    <TorusModularInput
                                                      isRequired={true}
                                                      type="text"
                                                      value={
                                                        selectedProject
                                                          ? selectedProject
                                                          : selectedTkey
                                                            ? selectedTkey
                                                            : ''
                                                      }
                                                      placeholder={`Enter  here`}
                                                      bgColor={`${selectedTheme?.bgCard}`}
                                                      textColor={`text-[${selectedTheme?.text}]`}
                                                      labelColor="text-black dark:text-white/35 "
                                                      outlineColor="#cbd5e1"
                                                      labelSize={
                                                        'text-[0.62vw] pl-[0.25vw]'
                                                      }
                                                      radius="sm"
                                                      size=""
                                                      isReadOnly={false}
                                                      isDisabled={true}
                                                      errorShown={false}
                                                      isClearable={false}
                                                      onChange={(e) => {
                                                        if (
                                                          createCatOrArt ===
                                                          'catalog'
                                                        ) {
                                                          setCreateCatName(e);
                                                        }
                                                        if (
                                                          createCatOrArt ===
                                                          'artifactGroup'
                                                        ) {
                                                          setCreateArtiName(e);
                                                        }
                                                      }}
                                                      textSize={'text-[0.83vw]'}
                                                      inputClassName={
                                                        'px-[0.25vw] py-[0.55vh]'
                                                      }
                                                      wrapperClass={
                                                        'px-[0.25vw] py-[0.55vh]'
                                                      }
                                                      endContent={
                                                        <span
                                                          onClick={() => {
                                                            setIsDisabled(
                                                              false,
                                                            );
                                                          }}
                                                          onMouseEnter={() => {
                                                            setHovered(true);
                                                          }}
                                                          onMouseLeave={() => {
                                                            setHovered(false);
                                                          }}
                                                          className={`flex h-[1.55vw] w-[1.55vw]   ${isDisabled ? 'hidden' : 'cursor-pointer'} items-center justify-center rounded-full duration-100 ease-linear transition-background hover:bg-[#0736C4] dark:hover:bg-[#0736C4]`}
                                                        >
                                                          <ArtifactsEditIcon
                                                            className={`h-[0.83vw] w-[0.83vw] ${hovered ? 'stroke-white' : 'stroke-black'} stroke-[#000000]  dark:stroke-[#FFFFFF]`}
                                                          />
                                                        </span>
                                                      }
                                                    />
                                                  )}

                                                {createArtiGrp && (
                                                  <TorusModularInput
                                                    isRequired={true}
                                                    type="text"
                                                    value={
                                                      createCatOrArt &&
                                                      createCatOrArt ===
                                                        'catalog'
                                                        ? createCatName
                                                        : createCatOrArt &&
                                                            createCatOrArt ===
                                                              'artifactGroup'
                                                          ? createArtiName
                                                          : ''
                                                    }
                                                    placeholder={`Enter ${createCatOrArt !== null ? createCatOrArt : ''}  here`}
                                                    bgColor={`${selectedTheme?.bgCard}`}
                                                    textColor={`text-[${selectedTheme?.text}]`}
                                                    outlineColor="#cbd5e1"
                                                    labelSize={
                                                      'text-[0.62vw] pl-[0.25vw]'
                                                    }
                                                    radius="sm"
                                                    size=""
                                                    isReadOnly={false}
                                                    errorShown={false}
                                                    isClearable={false}
                                                    backgroundColor={`transtition-all duration-300 ease-in-out ${createCatOrArt === null ? 'hidden' : 'bg-gray-300/25 dark:bg-[#0F0F0F]'} `}
                                                    onChange={(e) => {
                                                      if (
                                                        createCatOrArt ===
                                                        'catalog'
                                                      ) {
                                                        setCreateCatName(e);
                                                      }
                                                      if (
                                                        createCatOrArt ===
                                                        'artifactGroup'
                                                      ) {
                                                        setCreateArtiName(e);
                                                      }
                                                    }}
                                                    textSize={'text-[0.83vw]'}
                                                    inputClassName={
                                                      'px-[0.25vw] py-[0.55vh]'
                                                    }
                                                    wrapperClass={
                                                      'px-[0.25vw] py-[0.55vh]'
                                                    }
                                                    endContent={
                                                      <span
                                                        onClick={() => {
                                                          setIsDisabled(false);
                                                        }}
                                                        onMouseEnter={() => {
                                                          setHovered(true);
                                                        }}
                                                        onMouseLeave={() => {
                                                          setHovered(false);
                                                        }}
                                                        className={`flex h-[1.55vw] w-[1.55vw]  ${isDisabled ? 'hidden' : 'cursor-pointer'} items-center justify-center rounded-full duration-100 ease-linear transition-background hover:bg-[#0736C4] dark:hover:bg-[#0736C4]`}
                                                      >
                                                        <ArtifactsEditIcon
                                                          className={`h-[0.83vw] w-[0.83vw] ${hovered ? 'stroke-white' : 'stroke-black'} stroke-[#000000]  dark:stroke-[#FFFFFF]`}
                                                        />
                                                      </span>
                                                    }
                                                  />
                                                )}
                                                {!newArtifact &&
                                                  createCatOrArt == null && (
                                                    <>
                                                      {selectedArtifactGroup &&
                                                        !selectedArtifact && (
                                                          <TorusModularInput
                                                            otherMethod={{
                                                              onkeydown: (
                                                                e,
                                                              ) => {
                                                                if (
                                                                  !showSaveasNewartifact
                                                                ) {
                                                                  if (
                                                                    e.key ===
                                                                    'Enter'
                                                                  ) {
                                                                    handleArtifactsNameChange(
                                                                      selectedArtifact,
                                                                      inputValue,
                                                                    );
                                                                  }
                                                                }
                                                              },
                                                            }}
                                                            isRequired={true}
                                                            type="text"
                                                            value={
                                                              selectedArtifactGroup
                                                                ? selectedArtifactGroup
                                                                : ''
                                                            }
                                                            placeholder={`Enter here`}
                                                            labelColor="text-black dark:text-white/35 "
                                                            outlineColor="#cbd5e1"
                                                            labelSize={
                                                              'text-[0.62vw] pl-[0.25vw]'
                                                            }
                                                            bgColor={`${selectedTheme?.bgCard}`}
                                                            textColor={`text-[${selectedTheme?.text}]`}
                                                            radius="sm"
                                                            size=""
                                                            isReadOnly={false}
                                                            isDisabled={
                                                              isDisabled
                                                                ? true
                                                                : false
                                                            }
                                                            errorShown={false}
                                                            isClearable={false}
                                                            onChange={(e) => {
                                                              setInputValue(e);
                                                              if (
                                                                createCatOrArt !==
                                                                null
                                                              ) {
                                                                setCreateCatOrArtName(
                                                                  e,
                                                                );
                                                              }
                                                            }}
                                                            textSize={
                                                              'text-[0.83vw]'
                                                            }
                                                            inputClassName={
                                                              'px-[0.25vw] py-[0.55vh]'
                                                            }
                                                            wrapperClass={
                                                              'px-[0.25vw] py-[0.55vh]'
                                                            }
                                                            endContent={
                                                              <span
                                                                onClick={() => {
                                                                  setIsDisabled(
                                                                    false,
                                                                  );
                                                                }}
                                                                onMouseEnter={() => {
                                                                  setHovered(
                                                                    true,
                                                                  );
                                                                }}
                                                                onMouseLeave={() => {
                                                                  setHovered(
                                                                    false,
                                                                  );
                                                                }}
                                                                className={`flex h-[1.55vw] w-[1.55vw]  ${isDisabled ? 'hidden' : 'cursor-pointer'} items-center justify-center rounded-full duration-100 ease-linear transition-background hover:bg-[#0736C4] dark:hover:bg-[#0736C4]`}
                                                              >
                                                                <ArtifactsEditIcon
                                                                  className={`h-[0.83vw] w-[0.83vw] ${hovered ? 'stroke-white' : 'stroke-black'} stroke-[#000000]  dark:stroke-[#FFFFFF]`}
                                                                />
                                                              </span>
                                                            }
                                                          />
                                                        )}
                                                      {!selectedArtifactGroup &&
                                                        !selectedArtifact && (
                                                          <TorusModularInput
                                                            otherMethod={{
                                                              onkeydown: (
                                                                e,
                                                              ) => {
                                                                if (
                                                                  !showSaveAsPopover
                                                                ) {
                                                                  if (
                                                                    e.key ===
                                                                    'Enter'
                                                                  ) {
                                                                    handleArtifactsNameChange(
                                                                      selectedArtifact,
                                                                      inputValue,
                                                                    );
                                                                  }
                                                                }
                                                              },
                                                            }}
                                                            isRequired={true}
                                                            type="text"
                                                            placeholder={`Enter here`}
                                                            bgColor={`${selectedTheme?.bgCard}`}
                                                            textColor={`text-[${selectedTheme?.text}]`}
                                                            labelColor="text-black dark:text-white/35 "
                                                            outlineColor="#cbd5e1"
                                                            labelSize={
                                                              'text-[0.62vw] pl-[0.25vw]'
                                                            }
                                                            radius="sm"
                                                            size=""
                                                            isReadOnly={false}
                                                            isDisabled={true}
                                                            errorShown={false}
                                                            isClearable={false}
                                                            backgroundColor={
                                                              'bg-gray-300/25 dark:bg-[#0F0F0F]'
                                                            }
                                                            onChange={(e) => {
                                                              setInputValue(e);
                                                              if (
                                                                createCatOrArt !==
                                                                null
                                                              ) {
                                                                setCreateCatOrArtName(
                                                                  e,
                                                                );
                                                              }
                                                            }}
                                                            textSize={
                                                              'text-[0.83vw]'
                                                            }
                                                            inputClassName={
                                                              'px-[0.25vw] py-[0.55vh]'
                                                            }
                                                            wrapperClass={
                                                              'px-[0.25vw] py-[0.55vh]'
                                                            }
                                                            endContent={
                                                              <span
                                                                onClick={() => {
                                                                  setIsDisabled(
                                                                    false,
                                                                  );
                                                                }}
                                                                onMouseEnter={() => {
                                                                  setHovered(
                                                                    true,
                                                                  );
                                                                }}
                                                                onMouseLeave={() => {
                                                                  setHovered(
                                                                    false,
                                                                  );
                                                                }}
                                                                className={`flex h-[1.55vw] w-[1.55vw]  ${isDisabled ? 'hidden' : 'cursor-pointer'} items-center justify-center rounded-full duration-100 ease-linear transition-background hover:bg-[#0736C4] dark:hover:bg-[#0736C4]`}
                                                              >
                                                                <ArtifactsEditIcon
                                                                  className={`h-[0.83vw] w-[0.83vw] ${hovered ? 'stroke-white' : 'stroke-black'} stroke-[#000000]  dark:stroke-[#FFFFFF]`}
                                                                />
                                                              </span>
                                                            }
                                                          />
                                                        )}
                                                      {selectedArtifactGroup &&
                                                        selectedArtifact && (
                                                          <TorusModularInput
                                                            otherMethod={{
                                                              onkeydown: (
                                                                e,
                                                              ) => {
                                                                if (
                                                                  !showSaveAsPopover
                                                                ) {
                                                                  if (
                                                                    e.key ===
                                                                    'Enter'
                                                                  ) {
                                                                    handleArtifactsNameChange(
                                                                      selectedArtifact,
                                                                      inputValue,
                                                                    );
                                                                  }
                                                                }
                                                              },
                                                            }}
                                                            isRequired={true}
                                                            type="text"
                                                            value={
                                                              selectedArtifact
                                                                ? selectedArtifact
                                                                : ''
                                                            }
                                                            placeholder={`Enter here`}
                                                            bgColor={`${selectedTheme?.bgCard}`}
                                                            textColor={`text-[${selectedTheme?.text}]`}
                                                            labelColor="text-black dark:text-white/35 "
                                                            outlineColor="#cbd5e1"
                                                            labelSize={
                                                              'text-[0.62vw] pl-[0.25vw]'
                                                            }
                                                            radius="sm"
                                                            size=""
                                                            isReadOnly={false}
                                                            isDisabled={
                                                              isDisabled
                                                                ? true
                                                                : false
                                                            }
                                                            errorShown={false}
                                                            isClearable={false}
                                                            backgroundColor={
                                                              'bg-gray-300/25 dark:bg-[#0F0F0F]'
                                                            }
                                                            onChange={(e) => {
                                                              setInputValue(e);
                                                              if (
                                                                createCatOrArt !==
                                                                null
                                                              ) {
                                                                setCreateCatOrArtName(
                                                                  e,
                                                                );
                                                              }
                                                            }}
                                                            // defaultValue={value}
                                                            textSize={
                                                              'text-[0.83vw]'
                                                            }
                                                            inputClassName={
                                                              'px-[0.25vw] py-[0.55vh]'
                                                            }
                                                            wrapperClass={
                                                              'px-[0.25vw] py-[0.55vh]'
                                                            }
                                                            endContent={
                                                              <span
                                                                onClick={() => {
                                                                  setIsDisabled(
                                                                    false,
                                                                  );
                                                                }}
                                                                onMouseEnter={() => {
                                                                  setHovered(
                                                                    true,
                                                                  );
                                                                }}
                                                                onMouseLeave={() => {
                                                                  setHovered(
                                                                    false,
                                                                  );
                                                                }}
                                                                className={`flex h-[1.55vw] w-[1.55vw]  ${isDisabled ? 'hidden' : 'cursor-pointer'} items-center justify-center rounded-full duration-100 ease-linear transition-background hover:bg-[#0736C4] dark:hover:bg-[#0736C4]`}
                                                              >
                                                                <ArtifactsEditIcon
                                                                  className={`h-[0.83vw] w-[0.83vw]`}
                                                                  stroke={
                                                                    hovered
                                                                      ? `${selectedTheme?.text}`
                                                                      : `${selectedTheme?.text}`
                                                                  }
                                                                />
                                                              </span>
                                                            }
                                                          />
                                                        )}
                                                    </>
                                                  )}

                                                {!showSaveAsPopover && (
                                                  <div className="flex w-[30%] items-center justify-end">
                                                    <TorusDropDown
                                                      onPress={() => {
                                                        setInputchange(false);
                                                      }}
                                                      isDisabled={
                                                        createCatOrArt !==
                                                          null ||
                                                        !selectedArtifact
                                                          ? true
                                                          : false
                                                      }
                                                      listBoxBackground={`${selectedTheme && selectedTheme?.bg}`}
                                                      btncolor={`${selectedTheme?.bgCard}`}
                                                      listItemColor={`${selectedTheme && selectedTheme?.text}`}
                                                      title={
                                                        <div className="flex w-[100%] items-center justify-between ">
                                                          <div
                                                            className={`${selectedVersion === 'new version' ? 'whitespace-nowrap text-[0.73vw]' : ''}`}
                                                            style={{
                                                              color: `${selectedTheme?.text}`,
                                                            }}
                                                          >
                                                            {selectedVersion &&
                                                            selectedVersion !==
                                                              'undefined'
                                                              ? selectedVersion
                                                              : 'v'}
                                                          </div>
                                                          <div>
                                                            <IoIosArrowDown
                                                              className=""
                                                              size={'0.83vw'}
                                                              color={`${selectedTheme?.text}`}
                                                            />
                                                          </div>
                                                        </div>
                                                      }
                                                      selectionMode="single"
                                                      selected={
                                                        selectedArtifact &&
                                                        new Set([
                                                          selectedVersion,
                                                        ])
                                                      }
                                                      setSelected={(e) => {
                                                        getProcessFlowApi(
                                                          selectedArtifact,
                                                          Array.from(e)[0],
                                                        );
                                                      }}
                                                      items={
                                                        artifactsVersion &&
                                                        artifactsVersion.length >
                                                          0 && [
                                                          ...artifactsVersion?.map(
                                                            (item) => ({
                                                              label: item,
                                                              key: item,
                                                            }),
                                                          ),
                                                          {
                                                            label:
                                                              'new version',
                                                            key: 'new version',
                                                          },
                                                        ]
                                                      }
                                                      classNames={{
                                                        buttonClassName:
                                                          '  px-2 h-[4.85vh] w-[97%] text-[0.83vw] font-mediumtext-start dark:text-white',
                                                        popoverClassName:
                                                          'flex item-center justify-center w-[4.27vw] text-[0.83vw]',
                                                        listBoxClassName: `overflow-y-auto w-[8.27vw]  `,
                                                        listBoxItemClassName: `flex w-[3.50vw] items-center justify-center text-md `,
                                                      }}
                                                    />
                                                  </div>
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <TorusModularInput
                                                  otherMethod={{
                                                    onkeydown: (e) => {
                                                      if (e.key === 'Enter') {
                                                        handleNewArtifactChange();
                                                      }
                                                    },
                                                  }}
                                                  isRequired={true}
                                                  type="text"
                                                  value={newArtifactValue}
                                                  placeholder="Enter new artifact name"
                                                  bgColor={`${selectedTheme?.bgCard}`}
                                                  textColor={`text-[${selectedTheme?.text}]`}
                                                  borderColor={`${selectedTheme?.border}`}
                                                  outlineColor="#cbd5e1"
                                                  labelSize={
                                                    'text-[0.62vw] pl-[0.25vw]'
                                                  }
                                                  radius="sm"
                                                  size=""
                                                  isReadOnly={false}
                                                  isDisabled={false}
                                                  errorShown={false}
                                                  isClearable={false}
                                                  onChange={(e) => {
                                                    setNewArtifactValue(e);
                                                    newArtifactNameValidation &&
                                                      setNewArtifactNameValidation(
                                                        false,
                                                      );
                                                  }}
                                                  textSize={'text-[0.83vw]'}
                                                  inputClassName={
                                                    'px-[0.25vw] py-[0.55vh]'
                                                  }
                                                  wrapperClass={
                                                    'px-[0.25vw] py-[0.55vh] w-full'
                                                  }
                                                  endContent={
                                                    <ArtifactsEditIcon
                                                      className={`h-[0.83vw] w-[0.83vw]`}
                                                      stroke={
                                                        hovered
                                                          ? `${selectedTheme?.text}`
                                                          : `${selectedTheme?.text}`
                                                      }
                                                    />
                                                  }
                                                />
                                              </>
                                            )}
                                          </>
                                        )}

                                        {showSaveAsPopover && (
                                          <TorusModularInput
                                            otherMethod={{
                                              onkeydown: (e) => {
                                                if (!showSaveAsPopover) {
                                                  if (e.key === 'Enter') {
                                                    handleArtifactsNameChange(
                                                      selectedArtifact,
                                                      inputValue,
                                                    );
                                                  }
                                                }
                                              },
                                            }}
                                            isRequired={true}
                                            type="text"
                                            value={newArtifactSaveasValue}
                                            placeholder={'Enter here'}
                                            bgColor={`${selectedTheme?.bgCard}`}
                                            textColor={`text-[${selectedTheme?.text}]`}
                                            outlineColor="#cbd5e1"
                                            labelSize={
                                              'text-[0.62vw] pl-[0.25vw]'
                                            }
                                            radius="sm"
                                            size=""
                                            isReadOnly={false}
                                            isDisabled={
                                              isDisabled ? true : false
                                            }
                                            errorShown={false}
                                            isClearable={false}
                                            onChange={(e) => {
                                              setSaveasInputValue(e);
                                            }}
                                            textSize={'text-[0.83vw]'}
                                            inputClassName={
                                              'px-[0.25vw] py-[0.55vh]'
                                            }
                                            wrapperClass={
                                              'px-[0.25vw] py-[0.55vh]'
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </>

                                  <div className="flex h-[50%] w-[100%] items-center justify-center px-[0.55vw] py-[0.95vh]">
                                    {!showSaveAsPopover && (
                                      <div className="flex w-1/3 items-center justify-start">
                                        {selectedProject &&
                                          selectedArtifactGroup && (
                                            <TorusButton
                                              isDisabled={
                                                selectedProject ? false : true
                                              }
                                              btncolor={`${
                                                selectedTheme?.bgCard
                                              }`}
                                              onPress={() => {
                                                handleNewArtifact();
                                                setNewArtifactNameValidation(
                                                  false,
                                                );
                                                setSelectedArtifact(null);
                                                setNewArtifact(true);
                                              }}
                                              isIconOnly={true}
                                              buttonClassName={`text-black w-[2.29vw]  h-[2.29vw]   rounded-md flex justify-center items-center`}
                                              Children={
                                                <div
                                                  className={`${selectedProject ? '  cursor-pointer' : '  cursor-not-allowed'} flex h-full w-[100%] flex-row items-center justify-center gap-1`}
                                                >
                                                  <AddIcon
                                                    className={`h-[0.83vw] w-[0.83vw]  `}
                                                    strokeColor={
                                                      selectedTheme[
                                                        'textOpacity/50'
                                                      ]
                                                    }
                                                  />
                                                </div>
                                              }
                                            />
                                          )}

                                        {!selectedArtifact &&
                                          !selectedArtifactGroup &&
                                          !showSaveAsPopover &&
                                          (createCatOrArt === 'catalog' ||
                                            'artifactGroup') && (
                                            <TorusButton
                                              isDisabled={
                                                selectedTkey ? false : true
                                              }
                                              btncolor={`${
                                                selectedTheme?.bgCard
                                              }`}
                                              onPress={() => {
                                                if (
                                                  createCatOrArt ===
                                                    'catalog' ||
                                                  'artifactGroup'
                                                ) {
                                                  setCreateArtiGrp(true);
                                                }
                                              }}
                                              isIconOnly={true}
                                              buttonClassName={`text-black dark:text-white  w-[2.29vw]  h-[2.29vw]   rounded-md flex justify-center items-center`}
                                              Children={
                                                <div
                                                  className={`${selectedProject || selectedTkey ? '  cursor-pointer' : '  cursor-not-allowed'} flex h-full w-[100%] flex-row items-center justify-center gap-1`}
                                                >
                                                  <AddIcon
                                                    className={`h-[0.83vw] w-[0.83vw]  `}
                                                    strokeColor={
                                                      selectedTheme[
                                                        'textOpacity/50'
                                                      ]
                                                    }
                                                  />
                                                </div>
                                              }
                                            />
                                          )}
                                      </div>
                                    )}

                                    {!showSaveAsPopover && (
                                      <div className="flex w-2/3 items-center justify-end gap-[0.55vw]">
                                        {!showSaveAsPopover && (
                                          <>
                                            {selectedArtifact && (
                                              <TorusModel
                                                triggerButton={
                                                  <TorusTitle
                                                    bgColor={`${selectedTkey === 'AFR' ? '#F14336' : selectedAccntColor}`}
                                                    text={`${
                                                      selectedTkey === 'AFR'
                                                        ? `${selectedArtifact ? `Delete Artifact not valid for ${selectedTkey} ` : `Delete not valid for ${selectedTkey} `} `
                                                        : `${selectedArtifact ? 'Delete Artifact' : 'Delete'}`
                                                    } `}
                                                    color={`${isLightColor(selectedAccntColor) === 'light' ? 'black' : 'white'}`}
                                                    position="bottom"
                                                  >
                                                    <TorusButton
                                                      buttonClassName={`
                                                          ${
                                                            selectedTkey !==
                                                            'AFR'
                                                              ? `
                                                               ${newArtifact ? 'cursor-not-allowed' : 'cursor-pointer'} 
                                                      ${
                                                        !selectedArtifact &&
                                                        selectedVersion !==
                                                          'new version'
                                                          ? 'cursor-not-allowed bg-[#F14336]/[0.12] text-[#F14336]'
                                                          : 'cursor-pointer bg-[#F14336] text-white'
                                                      }
                                                            `
                                                              : `   ${newArtifact ? 'cursor-not-allowed' : 'cursor-pointer'} 
                                                      ${
                                                        !selectedArtifact &&
                                                        selectedVersion !==
                                                          'new version'
                                                          ? 'cursor-not-allowed bg-[#F14336]/[0.12] text-[#F14336]'
                                                          : 'cursor-not-allowed bg-[#F14336]/[0.12] text-[#F14336]'
                                                      }`
                                                          }
                                                          
                                                          
                                                         its-null   w-[5.36vw] h-[4.07vh] rounded-md text-[0.83vw]  flex justify-center items-center`}
                                                      Children={'Delete'}
                                                      isDisabled={true}
                                                      // btncolor={`${
                                                      //   !selectedArtifact &&
                                                      //   selectedVersion !==
                                                      //     'new version'
                                                      //     ? '#F14336'
                                                      //     : '#F14336'
                                                      // } `}
                                                    />
                                                  </TorusTitle>
                                                }
                                                isDisabled={
                                                  !selectedArtifact ||
                                                  selectedVersion ===
                                                    'new version' ||
                                                  selectedTkey === 'AFR'
                                                    ? true
                                                    : false
                                                }
                                                modelBackgroundColor={`${selectedTheme?.bg}`}
                                                modelBarderColor={`${selectedTheme?.bgCard}`}
                                                title={
                                                  <div className="flex w-[100%] items-center justify-between">
                                                    <div className="flex w-[100%] justify-start">
                                                      <div className="flex w-[80%] justify-between">
                                                        <div className="flex w-[10%] items-center justify-start">
                                                          <DeleteIcon
                                                            className={`h-[0.83vw] w-[0.83vw] stroke-[#F14336] dark:stroke-[#F14336] `}
                                                          />
                                                        </div>
                                                        <div className="flex w-[90%] items-center justify-start">
                                                          <span className="whitespace-nowrap text-[#F14336]">
                                                            {`Delete Artifact ${selectedVersion === null ? 'for all versions' : selectedVersion === 'new version' ? '' : `specific version ${selectedVersion}`} `}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                }
                                                body={`Are you sure you want to delete this ${selectedArtifact} Artifact ?`}
                                                description={
                                                  <span
                                                    className="whitespace-break-spaces text-[0.73vw]"
                                                    style={{
                                                      color: `${selectedTheme?.text}`,
                                                    }}
                                                  >
                                                    Deleting the{' '}
                                                    <span className="font-bold">
                                                      {selectedArtifact}
                                                    </span>{' '}
                                                    artifact will remove
                                                    permanently from{' '}
                                                    <span className="font-bold">
                                                      {selectedProject}
                                                    </span>{' '}
                                                    /{' '}
                                                    <span className="w-[90%] truncate font-bold">
                                                      {selectedArtifactGroup}
                                                    </span>
                                                    .
                                                  </span>
                                                }
                                                cancelButtonText="Cancel"
                                                confirmButtonText="Delete"
                                                confirmButtonStyle={
                                                  'bg-[#F14336] text-white'
                                                }
                                                bodyStyle={`text-[0.83vw] text-[${selectedTheme?.text}] `}
                                                descriptionStyle={
                                                  'text-[0.73vw] whitespace-nowrap'
                                                }
                                                onConfirm={() => {
                                                  handleArtifactsVersionDelete(
                                                    selectedArtifact,
                                                    selectedVersion,
                                                  );
                                                }}
                                              />
                                            )}
                                            {/* please dont delete */}
                                            {/* {client === 'TRL' && (
                                                <div className="flex w-1/3 justify-start">
                                                  <TorusButton
                                                    title="Export TRL from cache to DB"
                                                    buttonClassName={`flex h-[0.35vw] w-[0.35vw] justify-end items-center  border-l-transparent   transition-transform ease-in-out duration-300 w-[100%] bg-white dark:bg-[#161616] `}
                                                    onPress={() => {
                                                      handleExportTRL();
                                                    }}
                                                    Children={
                                                      <Back
                                                        className={`h-[1.25vw] w-[1.25vw] rotate-90`}
                                                        color={'#F14336'}
                                                      />
                                                    }
                                                    isIconOnly={true}
                                                  />
                                                </div>
                                              )} */}
                                            {!selectedArtifact && (
                                              <TorusModel
                                                triggerButton={
                                                  <TorusTitle
                                                    bgColor={`${selectedTkey === 'AFR' ? '#F14336' : selectedAccntColor}`}
                                                    text={`${
                                                      selectedTkey === 'AFR'
                                                        ? `${selectedProject && !selectedArtifactGroup ? `Delete Catalog not valid for ${selectedTkey} ` : selectedArtifactGroup ? `Delete Artifact Group not valid for ${selectedTkey} ` : `Delete not valid for ${selectedTkey} `} `
                                                        : `${selectedProject && !selectedArtifactGroup ? 'Delete Catalog' : selectedArtifactGroup ? 'Delete Artifact Group' : 'Delete'}`
                                                    } `}
                                                    color={`${isLightColor(selectedAccntColor) === 'light' ? 'black' : 'white'}`}
                                                    position="bottom"
                                                  >
                                                    <TorusButton
                                                      buttonClassName={` 
                                                          ${
                                                            selectedTkey ===
                                                            'AFR'
                                                              ? `bg-[#F14336]/[0.12] text-[#F14336] cursor-not-allowed`
                                                              : `${
                                                                  selectedProject &&
                                                                  !selectedArtifactGroup
                                                                    ? 'cursor-pointer bg-[#F14336] text-white'
                                                                    : selectedArtifactGroup
                                                                      ? 'cursor-pointer bg-[#F14336] text-white'
                                                                      : 'bg-[#F14336]/[0.12] text-[#F14336] cursor-not-allowed'
                                                                }`
                                                          }
                                                           not-null w-[5.36vw] h-[4.07vh] rounded-md text-[0.83vw] flex justify-center items-center
                                                        `}
                                                      Children={`Delete`}
                                                      isDisabled={true}
                                                    />
                                                  </TorusTitle>
                                                }
                                                modelBackgroundColor={`${selectedTheme?.bg}`}
                                                modelBarderColor={`${selectedTheme?.bgCard}`}
                                                isDisabled={
                                                  selectedTkey === 'AFR'
                                                    ? true
                                                    : false
                                                }
                                                title={
                                                  <div className="flex w-[100%] items-center justify-between">
                                                    <div className="flex w-[100%] justify-start">
                                                      <div className="flex w-[50%] justify-between">
                                                        <div className="flex w-[20%] items-center justify-center">
                                                          <DeleteIcon
                                                            className={`h-[0.83vw] w-[0.83vw] stroke-[#F14336] dark:stroke-[#F14336] `}
                                                          />
                                                        </div>
                                                        <div className="flex w-[80%] items-center justify-center">
                                                          <span className="whitespace-nowrap text-[#F14336] ">
                                                            Delete{' '}
                                                            {selectedProject &&
                                                            !selectedArtifactGroup
                                                              ? ' catalogue'
                                                              : ' Artifact Group'}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="flex w-[50%] justify-end"></div>
                                                  </div>
                                                }
                                                body={`Are you sure you want to delete this ${selectedProject && !selectedArtifactGroup ? selectedProject : selectedArtifactGroup} ${selectedProject && !selectedArtifactGroup ? 'catelogue' : 'artifact group'} ?`}
                                                description={
                                                  <span
                                                    className="whitespace-break-spaces text-[0.73vw]"
                                                    style={{
                                                      color: `${selectedTheme?.text}`,
                                                    }}
                                                  >
                                                    Deleting the{' '}
                                                    <strong>
                                                      {selectedProject &&
                                                      !selectedArtifactGroup
                                                        ? selectedProject
                                                        : selectedArtifactGroup}
                                                    </strong>
                                                    {selectedProject &&
                                                    !selectedArtifactGroup
                                                      ? ' catalogue'
                                                      : ' artifact group'}{' '}
                                                    will remove permanently from{' '}
                                                    <strong>
                                                      {selectedProject &&
                                                      !selectedArtifactGroup
                                                        ? selectedTkey
                                                        : selectedProject}
                                                    </strong>
                                                    .
                                                  </span>
                                                }
                                                cancelButtonText="Cancel"
                                                confirmButtonText="Delete"
                                                confirmButtonStyle={
                                                  'bg-[#F14336] text-white'
                                                }
                                                bodyStyle={'text-[0.83vw]'}
                                                descriptionStyle={
                                                  'text-[0.73vw] whitespace-nowrap'
                                                }
                                                onConfirm={() => {
                                                  if (
                                                    selectedProject &&
                                                    !selectedArtifactGroup
                                                  ) {
                                                    handleCatelogueDelete(
                                                      selectedProject,
                                                    );
                                                  } else if (
                                                    selectedProject &&
                                                    selectedArtifactGroup
                                                  ) {
                                                    handleArtifactGroupDelete(
                                                      selectedArtifactGroup,
                                                    );
                                                  }
                                                }}
                                              />
                                            )}

                                            {createCatOrArt === null ? (
                                              <>
                                                {!newArtifact ? (
                                                  <TorusTitle
                                                    bgColor={`${selectedAccntColor}`}
                                                    text={'save'}
                                                    color={`${isLightColor(selectedAccntColor) === 'light' ? '#000' : '#fff'}`}
                                                    position="bottom"
                                                  >
                                                    <TorusButton
                                                      btncolor={`${selectedAccntColor}50`}
                                                      buttonClassName={`node-Update
                                                      bg-[#0736C4]/15 text-[#0736C4] w-[5.36vw] h-[4.07vh] rounded-md text-[0.83vw]  flex justify-center items-center`}
                                                      onPress={() => {
                                                        handlingsaveThings(
                                                          selectedVersion,
                                                        );
                                                      }}
                                                      Children={
                                                        <>
                                                          <span
                                                            style={{
                                                              color: `${selectedAccntColor}`,
                                                            }}
                                                          >
                                                            Save
                                                          </span>
                                                        </>
                                                      }
                                                      isDisabled={
                                                        !selectedArtifact
                                                          ? true
                                                          : false
                                                      }
                                                    />
                                                  </TorusTitle>
                                                ) : (
                                                  <TorusTitle
                                                    bgColor={`${selectedAccntColor}`}
                                                    text={'save'}
                                                    color={`${isLightColor(selectedAccntColor) === 'light' ? '#000' : '#fff'}`}
                                                    position="bottom"
                                                  >
                                                    <TorusButton
                                                      btncolor={`${selectedAccntColor}50`}
                                                      buttonClassName={`new-Artifact-Update 
                                                  ${!newArtifact ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                  
                                                  bg-[#0736C4]/15 text-[#0736C4] w-[5.36vw] h-[4.07vh] rounded-md text-[0.83vw]  flex justify-center items-center`}
                                                      onPress={() => {
                                                        handlingsaveThings(
                                                          selectedVersion,
                                                        );
                                                      }}
                                                      Children={
                                                        <>
                                                          <span
                                                            style={{
                                                              color: `${selectedAccntColor}`,
                                                            }}
                                                          >
                                                            Save
                                                          </span>
                                                        </>
                                                      }
                                                      isDisabled={
                                                        !newArtifact
                                                          ? true
                                                          : false
                                                      }
                                                    />
                                                  </TorusTitle>
                                                )}
                                              </>
                                            ) : (
                                              <TorusTitle
                                                bgColor={`${selectedAccntColor}`}
                                                text={'save'}
                                                color={`${isLightColor(selectedAccntColor) === 'light' ? '#000' : '#fff'}`}
                                                position="bottom"
                                              >
                                                <TorusButton
                                                  btncolor={`${
                                                    createArtiName ||
                                                    createCatName
                                                      ? `${selectedAccntColor}50`
                                                      : `${selectedAccntColor}50`
                                                  }`}
                                                  buttonClassName={`
                                                    arti-cat-Save ${
                                                      createArtiName ||
                                                      createCatName
                                                        ? 'cursor-pointer bg-[#0738C3]/15 '
                                                        : 'cursor-not-allowed bg-[#0738C3]/15 opacity-50'
                                                    }   
                                                    text-[#0736C4] dark:text-[#3063FF] w-[5.36vw] h-[4.07vh] rounded-md text-[0.83vw]  flex justify-center items-center`}
                                                  onPress={() => {
                                                    handleCreateCatalogueOrArtifactsGroup();
                                                  }}
                                                  Children={
                                                    <>
                                                      <span
                                                        style={{
                                                          color: `${selectedAccntColor}`,
                                                        }}
                                                      >
                                                        Save
                                                      </span>
                                                    </>
                                                  }
                                                  isDisabled={
                                                    !(
                                                      createArtiName ||
                                                      createCatName
                                                    )
                                                      ? true
                                                      : false
                                                  }
                                                />
                                              </TorusTitle>
                                            )}
                                            <TorusTitle
                                              position="bottom"
                                              bgColor={`${
                                                selectedFabric &&
                                                !selectedFabric.startsWith('UF')
                                                  ? `#F14336`
                                                  : `${selectedAccntColor}`
                                              }`}
                                              text={`${
                                                selectedFabric &&
                                                !selectedFabric.startsWith('UF')
                                                  ? `Save as not allowed for ${selectedFabric}`
                                                  : 'Save as'
                                              }`}
                                            >
                                              <TorusButton
                                                // isDisabled={newArtifact ? false : true}
                                                btncolor={`${
                                                  !newArtifact &&
                                                  (!selectedVersion ||
                                                    selectedVersion ===
                                                      'new version')
                                                    ? `${selectedAccntColor}50`
                                                    : `${selectedAccntColor}`
                                                }`}
                                                buttonClassName={`   dark:text-[#3063FF] ${
                                                  !newArtifact &&
                                                  (!selectedVersion ||
                                                    selectedVersion ===
                                                      'new version')
                                                    ? 'cursor-not-allowed bg-[#0736C4]/15 text-[#0736C4]'
                                                    : 'cursor-pointer bg-[#0736C4] text-white'
                                                }  
                                                  text-white  w-[6.61vw] h-[4.07vh] rounded-md text-[0.83vw] font-normal  flex justify-center items-center`}
                                                Children={
                                                  <>
                                                    <span
                                                      style={{
                                                        color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`,
                                                      }}
                                                    >
                                                      Save as
                                                    </span>
                                                  </>
                                                }
                                                onPress={() => {
                                                  handleNewArtifactValidation(
                                                    selectedVersion,
                                                    artifactsVersion,
                                                  );
                                                  setShowSaveasNewartifact(
                                                    true,
                                                  );
                                                }}
                                                isDisabled={
                                                  selectedProject &&
                                                  selectedArtifactGroup &&
                                                  selectedArtifact &&
                                                  selectedVersion &&
                                                  !newArtifact &&
                                                  selectedVersion !==
                                                    'new version' &&
                                                  selectedFabric &&
                                                  selectedFabric.startsWith(
                                                    'UF',
                                                  )
                                                    ? false
                                                    : true
                                                }
                                              />
                                            </TorusTitle>
                                          </>
                                        )}
                                      </div>
                                    )}

                                    {showSaveAsPopover && (
                                      <div className="flex w-full justify-end">
                                        <div className="flex w-[50%] justify-end gap-[0.55vw]">
                                          <TorusButton
                                            buttonClassName={`text-[${selectedTheme?.text}] w-[5.36vw] h-[4.07vh] rounded-md text-[0.83vw]  flex justify-center items-center`}
                                            onPress={() => {
                                              setShowSaveAsPopover(false);
                                              handleCancelFromSaveas();
                                              setShowSaveasNewartifact(false);
                                              setNewArtifact(false);
                                            }}
                                            Children={'cancel'}
                                            btncolor={`${selectedTheme?.bgCard}`}
                                            borderColor={`${selectedTheme?.border}`}
                                          />

                                          <TorusButton
                                            buttonClassName={` text-[${selectedTheme?.text}] dark:text-[#3063FF] cursor-pointer w-[5.36vw] h-[4.07vh] rounded-md text-[0.83vw]  flex justify-center items-center`}
                                            onPress={() => {
                                              handleSaveVariousPath();
                                            }}
                                            Children={
                                              <span
                                                style={{
                                                  color: `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`,
                                                }}
                                              >
                                                Save
                                              </span>
                                            }
                                            btncolor={`${selectedAccntColor}`}
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Update is chnaged into save , Save is changed into Save as */}
                                  </div>
                                </div>
                              </>
                            </div>
                          </>
                        )}
                      />
                      {selectedVersion && (
                        <TorusButton
                          onPress={() => {
                            handleArtifactLock(!artifactLockToggle);
                          }}
                          Children={
                            artifactLockToggle ? (
                              <div
                                key="locked"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.5 }}
                              >
                                <FaLock size={10} color={selectedTheme?.text} />
                              </div>
                            ) : (
                              <div
                                key="unlocked"
                                initial={{ opacity: 0, rotate: 90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: -90 }}
                                transition={{ duration: 0.5 }}
                              >
                                <FaLockOpen
                                  size={10}
                                  color={selectedTheme?.text}
                                />
                              </div>
                            )
                          }
                          buttonClassName="flex w-[27px] cursor-pointer items-center justify-center rounded-md p-[5px]"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex h-full w-1/3 items-center justify-end gap-3 bg-transparent ">
                <div className=" col-span-4 flex items-center justify-center">
                  <div className="flex items-center justify-around gap-[0.65vw] ">
                    <div className="flex w-[30%] items-center justify-center">
                      <TorusTitle
                        text={`${
                          selectedSubFlow !== `PO` ||
                          selectedSubFlow !== 'DO' ||
                          selectedSubFlow !== 'UO' ||
                          selectedSubFlow !== 'events'
                            ? `${
                                selectedVersion
                                  ? ` ${
                                      selectedSubFlow ||
                                      selectedVersion === 'new version'
                                        ? `Orchestrator allowed for specified version`
                                        : `Orchestrator allowed for ${selectedVersion}`
                                    }`
                                  : `Orchestrator not allowed without version`
                              }`
                            : ``
                        }   `}
                        color={`${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? `${isLightColor(`${selectedTheme?.bgCard}`) === 'light' ? '#000' : '#fff'}`
                                  : `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`
                              }`
                            : `${`${isLightColor(`${selectedTheme?.bg}`) === 'light' ? '#000' : '#fff'}`}`
                        }`}
                        position="bottom"
                        bgColor={`${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? `${selectedTheme?.bgCard}`
                                  : `${selectedAccntColor}`
                              }`
                            : `${selectedTheme?.bg}`
                        } `}
                        borderColor={`${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? `${selectedTheme?.text}`
                                  : `transparent`
                              }`
                            : `${selectedTheme?.borderLine}`
                        } `}
                      >
                        <TorusButton
                          // title={'orchestrator'}
                          isDisabled={
                            !newArtifact &&
                            selectedVersion &&
                            selectedVersion !== 'new version' &&
                            selectedFabric &&
                            selectedFabric !== 'DF-ERD' &&
                            !selectedSubFlow
                              ? false
                              : true
                          }
                          onPress={() => {
                            selectedVersion && handleSubflow();

                            setShowNodeProperty(false);
                          }}
                          Children={
                            <div
                              className={`flex h-[2.31vw]  w-[2.31vw] items-center justify-center ${selectedVersion ? 'text-white' : 'text-white '} `}
                            >
                              <DataOrchestrator
                                className={' h-[1.25vw] w-[1.25vw]'}
                                strokeColor={
                                  // selectedVersion
                                  //   ? ` ${selectedSubFlow || selectedVersion === 'new version' ? `white` : 'white'}`
                                  //   : `${selectedTheme?.text} `
                                  ` ${
                                    selectedVersion
                                      ? ` ${
                                          selectedSubFlow ||
                                          selectedVersion === 'new version'
                                            ? `${isLightColor(`${selectedTheme?.bgCard}`) === 'light' ? '#000' : '#fff'} `
                                            : `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`
                                        }`
                                      : `${isLightColor(`${selectedTheme?.bg}`) === 'light' ? '#000' : '#fff'}`
                                  }`
                                }
                              />
                            </div>
                          }
                          buttonClassName={`${
                            newArtifact
                              ? ` ${selectedSubFlow || selectedVersion === 'new version' ? 'cursor-not-allowed' : ''} `
                              : 'cursor-pointer'
                          } 
                        ${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? ` `
                                  : ` `
                              }  cursor-pointer`
                            : `cursor-not-allowed`
                        } 
                          flex  items-center justify-center rounded-md w-[2.13vw] h-[2.13vw]`}
                          btncolor={`${
                            selectedVersion
                              ? ` ${
                                  selectedSubFlow ||
                                  selectedVersion === 'new version'
                                    ? `${selectedTheme?.bgCard}`
                                    : `${selectedAccntColor}`
                                }`
                              : `${selectedTheme?.bg}`
                          } `}
                          borderColor={`${
                            selectedVersion
                              ? ` ${
                                  selectedSubFlow ||
                                  selectedVersion === 'new version'
                                    ? `${selectedTheme?.borderLine}`
                                    : `transparent`
                                }`
                              : `${selectedTheme?.borderLine}`
                          } `}
                        />
                      </TorusTitle>
                    </div>

                    <div className="flex w-[30%] items-center justify-center">
                      <TorusTitle
                        text={`Preview ${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? `allowed for specified version`
                                  : `allowed for ${selectedVersion}`
                              }`
                            : `not allowed without version`
                        } `}
                        color={`${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? `${isLightColor(`${selectedTheme?.bgCard}`) === 'light' ? '#000' : '#fff'}`
                                  : `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`
                              }`
                            : `${`${isLightColor(`${selectedTheme?.bg}`) === 'light' ? '#000' : '#fff'}`}`
                        }`}
                        position="bottom"
                        bgColor={`${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? `${selectedTheme?.bgCard}`
                                  : `${selectedAccntColor}`
                              }`
                            : `${selectedTheme?.bg}`
                        } `}
                        borderColor={`${
                          selectedVersion
                            ? ` ${
                                selectedSubFlow ||
                                selectedVersion === 'new version'
                                  ? `${selectedTheme?.text}`
                                  : `transparent`
                              }`
                            : `${selectedTheme?.borderLine}`
                        } `}
                        alignment={'ml-[-2.5vw]'}
                      >
                        <TorusButton
                          isDisabled={
                            !newArtifact &&
                            selectedVersion &&
                            selectedVersion !== 'new version' &&
                            selectedFabric &&
                            !selectedSubFlow
                              ? false
                              : true
                          }
                          Children={
                            <div
                              className={`flex h-[2.35vw]  w-[2.35vw] items-center justify-center ${selectedVersion ? 'text-white' : 'text-white '} `}
                            >
                              <Preview
                                className={`h-[1.25vw] w-[1.25vw]  
                            
                                      
                            `}
                                strokeColor={` ${
                                  selectedVersion
                                    ? ` ${
                                        selectedSubFlow ||
                                        selectedVersion === 'new version'
                                          ? `${isLightColor(`${selectedTheme?.bgCard}`) === 'light' ? '#000' : '#fff'} `
                                          : `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`
                                      }`
                                    : `${isLightColor(`${selectedTheme?.bg}`) === 'light' ? '#000' : '#fff'}`
                                }`}
                              />
                            </div>
                          }
                          buttonClassName={`${
                            newArtifact
                              ? ` ${selectedSubFlow || selectedVersion === 'new version' ? 'cursor-not-allowed' : ''} `
                              : 'cursor-pointer'
                          } ${
                            selectedVersion
                              ? ` ${selectedSubFlow || selectedVersion === 'new version' ? `` : ``}  cursor-pointer`
                              : ' cursor-not-allowed '
                          } flex  items-center justify-center rounded-md   w-[2.13vw] h-[2.13vw]`}
                          btncolor={`${
                            selectedVersion
                              ? ` ${
                                  selectedSubFlow ||
                                  selectedVersion === 'new version'
                                    ? `${selectedTheme?.bgCard}`
                                    : `${selectedAccntColor}`
                                }`
                              : `${selectedTheme?.bg}`
                          } `}
                          borderColor={`${
                            selectedVersion
                              ? ` ${
                                  selectedSubFlow ||
                                  selectedVersion === 'new version'
                                    ? `${selectedTheme?.borderLine}`
                                    : `transparent`
                                }`
                              : `${selectedTheme?.borderLine}`
                          } `}
                        />
                      </TorusTitle>
                    </div>

                    <div className="flex w-[30%] items-center justify-center">
                      <TorusPopOver
                        parentHeading={
                          <TorusTitle
                            text={`${
                              selectedFabric && selectedFabric.startsWith('UF')
                                ? `${
                                    selectedVersion
                                      ? ` ${
                                          selectedSubFlow ||
                                          selectedVersion === 'new version'
                                            ? `Push to build allowed for specified version`
                                            : `Push to build allowed for ${selectedVersion}`
                                        }`
                                      : `Push to build not allowed without version`
                                  }`
                                : `Push to build not allowed for ${selectedFabric}`
                            }   `}
                            color={`${
                              selectedVersion
                                ? ` ${
                                    selectedSubFlow ||
                                    selectedVersion === 'new version'
                                      ? `${isLightColor(`${selectedTheme?.bgCard}`) === 'light' ? '#000' : '#fff'}`
                                      : `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`
                                  }`
                                : `${`${isLightColor(`${selectedTheme?.bg}`) === 'light' ? '#000' : '#fff'}`}`
                            }`}
                            position="bottom"
                            bgColor={`${
                              selectedVersion
                                ? ` ${
                                    selectedSubFlow ||
                                    selectedVersion === 'new version'
                                      ? `${selectedTheme?.bgCard}`
                                      : `${selectedAccntColor}`
                                  }`
                                : `${selectedTheme?.bg}`
                            } `}
                            borderColor={`${
                              selectedVersion
                                ? ` ${
                                    selectedSubFlow ||
                                    selectedVersion === 'new version'
                                      ? `${selectedTheme?.text}`
                                      : `transparent`
                                  }`
                                : `${selectedTheme?.borderLine}`
                            } `}
                            alignment={'ml-[-5.5vw]'}
                          >
                            <TorusButton
                              isDisabled={
                                !newArtifact &&
                                selectedVersion &&
                                selectedVersion !== 'new version' &&
                                selectedFabric &&
                                !selectedSubFlow &&
                                selectedFabric &&
                                selectedFabric.startsWith('UF')
                                  ? false
                                  : true
                              }
                              Children={
                                <div className="flex w-[100%] flex-row items-center justify-center gap-2">
                                  <Shared
                                    className={`h-[1.25vw] w-[1.25vw] `}
                                    strokecolor={` ${
                                      selectedVersion
                                        ? ` ${
                                            selectedSubFlow ||
                                            selectedVersion === 'new version'
                                              ? `${isLightColor(`${selectedTheme?.bgCard}`) === 'light' ? '#000' : '#fff'} `
                                              : `${isLightColor(`${selectedAccntColor}`) === 'light' ? '#000' : '#fff'}`
                                          }`
                                        : `${isLightColor(`${selectedTheme?.bg}`) === 'light' ? '#000' : '#fff'}`
                                    }`}
                                  />
                                </div>
                              }
                              buttonClassName={`${
                                selectedTenant &&
                                nodesEdges?.nodes?.length > 0 &&
                                selectedFabric &&
                                selectedFabric.startsWith('UF')
                                  ? `cursor-pointer  `
                                  : ' cursor-not-allowed '
                              } flex  items-center justify-center rounded-md   w-[2.13vw] h-[2.13vw]`}
                              btncolor={`${
                                selectedTenant &&
                                nodesEdges?.nodes?.length > 0 &&
                                selectedFabric &&
                                selectedFabric.startsWith('UF')
                                  ? `${selectedAccntColor}`
                                  : `${selectedTheme?.bgCard}`
                              } `}
                              borderColor={`${
                                selectedTenant &&
                                nodesEdges?.nodes?.length > 0 &&
                                selectedFabric &&
                                selectedFabric.startsWith('UF')
                                  ? `${selectedTheme?.borderLine}`
                                  : `${selectedTheme?.borderLine}`
                              }`}
                            />
                          </TorusTitle>
                        }
                        children={({ close }) => (
                          <div
                            className={`h-[49.47vh] w-[34vw] ${
                              selectedFabric && !selectedFabric.startsWith('UF')
                                ? 'hidden'
                                : 'block'
                            } mt-[2vh] flex flex-col items-center justify-center rounded-lg border  dark:border-[#212121] dark:bg-[#161616] `}
                            style={{
                              backgroundColor: `${selectedTheme?.bg}`,
                              borderColor: `${selectedTheme?.border}`,
                            }}
                          >
                            {selectedTenant && (
                              <>
                                {nodesEdges?.nodes?.length > 0 && (
                                  <>
                                    {selectedFabric &&
                                      selectedFabric.startsWith('UF') && (
                                        <Builder
                                          mappedTeamItems={mappedTeamItems}
                                          clientLoginId={clientLoginId}
                                          close={close}
                                        />
                                      )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        isDisabled={
                          !newArtifact &&
                          selectedVersion &&
                          selectedVersion !== 'new version' &&
                          selectedFabric &&
                          selectedFabric &&
                          selectedFabric.startsWith('UF') &&
                          !selectedSubFlow
                            ? false
                            : true
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const AnimatedButton = ({
  onClick,
  label,
  setSucessBtn,
  setFailureBtn,
  sucessBtn,
  failureBtn,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showFailuer, setShowFailuer] = useState(false);

  const handleClick = () => {
    try {
      setShowSuccess(false);
      setShowSpinner(true);

      onClick();
      setTimeout(() => {
        setShowSpinner(false);
        setShowSuccess(true);
        setSucessBtn(true);
        setTimeout(() => {
          setSucessBtn(false);
          setShowSuccess(true);
        }, 1500);
      }, 300);
    } catch (error) {
      setShowSuccess(false);
      setShowSpinner(true);

      onClick();
      setTimeout(() => {
        setShowSpinner(false);
        setShowFailuer(true);
        setFailureBtn(true);
        setTimeout(() => {
          setFailureBtn(false);
          setShowFailuer(true);
          setShowSuccess(true);
        }, 1000);
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '0.85vw 0.85vw',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        width: 'auto',
        height: '1.5vw',
        gap: '0.5vw',
      }}
      className={`bg-transparent  `}
    >
      {showSuccess && !showSpinner && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SuccessIcon
            className={`h-[0.93vw] w-[0.93vw] fill-[#ffffff] ${
              failureBtn || sucessBtn ? 'fill-white' : 'fill-white'
            }  `}
          />
        </div>
      )}

      {showSpinner && !showSuccess && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SuccessIcon
            className={`h-[0.93vw] w-[0.93vw] fill-[#ffffff] ${
              failureBtn || sucessBtn ? 'fill-white' : 'fill-white'
            }  `}
          />
        </div>
      )}

      {showFailuer && !showSpinner && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FailureIcon
            className={`h-[0.93vw] w-[0.93vw] fill-[#ffff] ${
              failureBtn || sucessBtn ? 'fill-white' : 'fill-white'
            }  `}
          />
        </div>
      )}

      {label && (
        <span
          className={` ${
            sucessBtn && !failureBtn
              ? 'text-white'
              : !sucessBtn && failureBtn
                ? 'text-white'
                : !sucessBtn && !failureBtn
                  ? 'opacity-100'
                  : ''
          } text-[0.83vw] font-[600]`}
        >
          {label}
        </span>
      )}
    </button>
  );
};

const BreadcrumbsComponent = ({
  client,
  selectedProject,
  selectedArtifactGroup,
  selectedArtifact,
  selectedTheme,
}) => {
  return (
    <div className="flex flex-row items-center gap-[0.25vw] pl-[0.55vw]">
      {client && (
        <>
          <div className=" max-w-20 items-center justify-center">
            <div className="flex items-center">
              <BreadcrumbHome
                className="h-[0.83vw] w-[0.83vw]"
                strokeColor={`${selectedTheme && selectedTheme?.text}`}
              />
              <TorusTitle text={client} color={'#ffffff'}>
                <p
                  className={`ml-[0.15vw] whitespace-nowrap text-[0.72vw] ${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                >
                  {client}
                </p>
              </TorusTitle>
              {selectedProject && (
                <span>
                  <BreadcrumbArrow
                    className="h-[0.83vw] w-[0.83vw]"
                    fill={`${selectedTheme && selectedTheme?.text}`}
                  />
                </span>
              )}
            </div>
          </div>

          {selectedProject && (
            <div className="flex max-w-20 justify-start">
              <TorusTitle text={selectedProject} color={'#ffffff'}>
                <div className="flex w-full items-center justify-start">
                  <p
                    className={`ml-[0.15vw] text-[0.72vw] ${
                      selectedArtifactGroup ? 'max-w-16 truncate' : ''
                    } whitespace-nowrap ${selectedTheme && `text-[${selectedTheme?.text}]`} `}
                  >
                    {selectedProject}
                  </p>
                  {selectedArtifactGroup && (
                    <span>
                      <BreadcrumbArrow
                        className="h-[0.83vw] w-[0.83vw]"
                        fill={`${selectedTheme && selectedTheme?.text}`}
                      />
                    </span>
                  )}
                </div>
              </TorusTitle>
            </div>
          )}

          {selectedArtifactGroup && (
            <div className="flex max-w-20 justify-start">
              <TorusTitle text={selectedArtifactGroup} color={'#ffffff'}>
                <div className="flex w-full items-center justify-start gap-[0.15vw]">
                  <p
                    className={`ml-[-0.15vw] text-[0.72vw] ${
                      selectedArtifact ? 'max-w-16 truncate' : ''
                    } whitespace-nowrap ${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                  >
                    {selectedArtifactGroup}
                  </p>
                  {selectedArtifact && (
                    <span>
                      <BreadcrumbArrow
                        className="h-[0.83vw] w-[0.83vw]"
                        fill={`${selectedTheme && selectedTheme?.text}`}
                      />
                    </span>
                  )}
                </div>
              </TorusTitle>
            </div>
          )}

          {selectedArtifact && (
            <div className="flex max-w-16 justify-start">
              <TorusTitle text={selectedArtifact} color={'#ffffff'}>
                <p
                  className={`ml-[-0.15vw] max-w-[5vw] truncate whitespace-nowrap text-[0.72vw]  `}
                  style={{
                    color: `${selectedTheme?.text}`,
                  }}
                >
                  {selectedArtifact}
                </p>
              </TorusTitle>
            </div>
          )}
        </>
      )}
    </div>
  );
};
