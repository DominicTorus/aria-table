import axios from 'axios';
import { AxiosService } from '../../utils/axiosService';
import TorusToast from '../../torusComponents/TorusToaster/TorusToast';

export const getJson = async (fabrics, redisKey) => {
  try {
    const response = await AxiosService.get(`/modeller/nodeinfo`, {
      params: {
        redisKey: redisKey,
        fabrics: fabrics,
      },
    });

    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const saveWorkFlow = async (
  resquestBody,
  type,
  version,
  client,
  fabrics,
) => {
  console.log(
    resquestBody,
    type,
    version,
    client,
    fabrics,
    'SaveprocessFlow-resquestBody----->>>>',
  );

  try {
    const response = await AxiosService.post(
      `/modeller/nodeinfo`,
      resquestBody,
      {
        params: {
          type: type,
          version: version,
          client: client,
          fabrics: fabrics,
        },
      },
    );

    if (response.status == 201) {
      console.log(response, 'SaveprocessFlow-response.data----->>>>');
      return response.data;
    } else {
      return response;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const artifactList = async (
  fabrics,
  redisKey,
  wantVersionList = false,
) => {
  try {
    const response = await AxiosService.get(
      `/modeller/${wantVersionList ? 'afkwithafvk' : 'afk'}`,
      {
        params: {
          redisKey: redisKey,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
   throw new Error(error);
  }
};




export const getprojectLists = async (redisKey) => {
  try {
    const response = await AxiosService.get(`tm/catelogue`, {
      params: {
        redisKey: redisKey,
      },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const getArtifactsGroups = async (redisKey) => {
  try {
    const response = await AxiosService.get(`tm/artifactsGroup`, {
      params: {
        redisKey: redisKey,
      },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const applicationLists = async (redisKey) => {
  try {
    const response = await AxiosService.get(`tm/applicationList`, {
      params: {
        redisKey: redisKey,
      },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const getLatestVersion = async (source, domain, fabrics, artifact) => {
  try {
    const BASE_URL = `${process.env.REACT_APP_API_URL}tm`;
    const response = await fetch(
      `${BASE_URL}/defaultVersion?source=${source}&domain=${domain}&fabrics=${fabrics}&artifact=${artifact}`,
      {
        method: 'GET',
      },
    );

    const data = await response.json();
    // toast.dismiss(loadingToastId);

    if (response.ok && data) {
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Display error toast

    throw new Error(error)
  }
};

export const versionList = async (artifact, redisKey) => {
  console.log('<<----Versions---->>');
  try {
    const response = await AxiosService.get(`modeller/afvk`, {
      params: {
        artifact: artifact,
        redisKey: redisKey,
      },
    });

    console.log(response, '<<----Versions---->>');
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const deleteCatelogue = async (redisKey, ctk) => {
  try {
    const response = await AxiosService.delete(`tm/catk`, {
      params: {
        redisKey: redisKey,
        ctk: ctk,
      },
    });

    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const deleteArifactGroup = async (redisKey, ctk) => {
  console.log(redisKey, 'deleteArtifact<<-->>>');
  try {
    const response = await AxiosService.delete(`tm/agk`, {
      params: {
        redisKey: redisKey,
        ctk: ctk,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteArtifact = async (redisKey) => {
  console.log(redisKey, 'deleteArtifact<<-->>>');
  try {
    const response = await AxiosService.delete(`tm/afk`, {
      params: {
        redisKey: redisKey,
      },
    });

    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const getWholeVersion = async (
  tKey,
  client,
  project,
  version,
  artifacts,
) => {
  try {
    const BASE_URL = `${process.env.REACT_APP_API_URL}events`;
    const response = await fetch(
      `${BASE_URL}/?tKey=${tKey}&client=${client}&app=${project}&artifact=${artifacts}&version=${version}&events`,
      {
        method: 'GET',
      },
    );

    const data = await response.json();
    // toast.dismiss(loadingToastId);

    if (response.ok && data) {
      return data;
    } else {
      //throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    //Display error toast

    throw new Error(error)
  }
};

export const saveWholeVersion = async (
  tKey,
  client,
  project,
  version,
  artifacts,
) => {
  try {
    const BASE_URL = `${process.env.REACT_APP_API_URL}events/wholeVersion`;
    const response = await fetch(
      `${BASE_URL}/?tKey=${tKey}&client=${client}&app=${project}&artifact=${artifacts}&version=${version}&events`,
      {
        method: 'POST',
      },
    );

    const data = await response.json();
    // toast.dismiss(loadingToastId);

    if (response.ok && data) {
      return data;
    } else {
      //throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    //Display error toast

    throw new Error(error)
  }
};

export const getNodeList = async (fabrics, redisKey) => {
  try {
    const response = await AxiosService.get(`tm/getNodeList`, {
      params: {
        redisKey: redisKey,
        fabrics: fabrics,
      },
    });

    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const renameArtifact = async (oldKey, newKey) => {
  try {
    const response = await AxiosService.patch(`tm/renamekeys`, {
      oldKey,
      newKey,
    });
    if (response.status == 200 || response.status == 201) {
      console.log(response, 'Renamesthingsss---->>>>');
      return response?.data;
    }

    // const BASE_URL = `${process.env.REACT_APP_API_URL}tm`;
    // const response = await fetch(`${BASE_URL}/renamekeys`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ oldKey, newKey }),
    // });
    // const data = await response.json();
    // if (response.ok && data) {
    //   return data;
    // } else {
    //   //throw new Error(`HTTP error! status: ${response.status}`);
    // }
  } catch (error) {
    throw new Error(error)
  }
};

export const changeArtifactLock = async (data) => {
  try {
    const response = await AxiosService.patch(`tm/changeArtifactLock`, data);
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const getCatelogueList = async (data) => {
  try {
    const response = await AxiosService.post(`tm/allkeys`, data);
    if (response.status == 201) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const getAllCatalogWithArtifactGroup = async (fabric, client) => {
  try {
    const response = await AxiosService.get(`tm/catkwithafgk`, {
      params: {
        fabric: fabric,
        clientCode: client,
      },
    });
    if (response.status == 200) {
      console.log(response, 'during---->>>');
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const getCrkNodeData = async (redisKey) => {
  try {
    const response = await AxiosService.get(`tm/afrgallery`, {
      params: {
        redisKey: redisKey,
      },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const getDsSchema = async (key, nodeName) => {
  try {
    const response = await AxiosService.post('api/getdsSchema', {
      key: key,
      nodeName: nodeName,
    });
    console.log(response, key, nodeName, 'api');
    if (response.status == 201) return response?.data?.result;
  } catch (error) {
    throw new Error(error)
  }
};

export const getDfdSchema = async (key, nodeName) => {
  try {
    const response = await AxiosService.post('api/getDFdsSchema', {
      key: key,
      nodeName: nodeName,
    });
    console.log(response, key, nodeName, 'api');
    if (response.status == 201) return response?.data?.result;
  } catch (error) {
   console.error(error);
  }
};

export const getDFOSchema = async (key) => {
  try {
    console.log(key, 'savereskey');
    const response = await AxiosService.post(`api/prepareDFOSchema`, {
      key: key + ':',
    });

    if (response) {
      console.log(response, 'savereskeyrsposnse');
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const getUfSchema = async (key) => {
  try {
    const response = await AxiosService.post('UF/elementsFilter', {
      key: key,
    });
    if (response.status == 201) return response?.data;
  } catch (error) {
    throw new Error(error)
  }
};

export const saveAsPost = async (data) => {
  try {
    const response = await AxiosService.post(`api/copyData`, data);

    console.log(response, 'reponseSaveas--->>>>');
    if (response.status == 200 || response.status == 201) {
      return response;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const importTRLDBToCache = async (data) => {
  try {
    const response = await AxiosService.post(`api/redisAfr`, data);
    if (response.status == 201) {
      return true;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};

export const exportTRLCacheToDB = async (data) => {
  try {
    const response = await AxiosService.post(`api/mongoAfr`, data);
    if (response.status == 201) {
      return true;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error)
  }
};
