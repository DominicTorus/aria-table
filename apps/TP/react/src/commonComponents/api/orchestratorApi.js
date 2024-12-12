import { AxiosService } from '../../utils/axiosService';

export const getSubflow = async (redisKey, subflow) => {
  try {
    const response = await AxiosService.get(`orchestrator`, {
      params: {
        redisKey: redisKey,
        subflow: subflow,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const getInitialEvents = async (redisKey) => {
  try {
    const response = await AxiosService.get(`orchestrator/initiate`, {
      params: {
        redisKey: redisKey,
        subflow: 'events',
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const saveSubflow = async (data, redisKey, subflow, sessionToken) => {
  try {
    const body = {
      data: data,
      redisKey: redisKey,
      subflow: subflow,
      sessionToken: sessionToken,
    };

    const response = await AxiosService.post(`orchestrator`, body);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error handling events:', error);
  }
};

export const getdfo = async (redisKey, subflow) => {
  try {
    const response = await AxiosService.get(`orchestrator/getdfo`, {
      params: {
        redisKey: redisKey,
        subflow: subflow,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getEvents = async (redisKey) => {
  try {
    const response = await AxiosService.patch(`orchestrator/mappedtoevents`, {
      redisKey: redisKey,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const eventSummaryAndNodeProperty = async (nodes, oldSummary) => {
  try {
    const response = await AxiosService.patch(
      'orchestrator/eventSummaryAndNodeProperty',
      {
        nodes: nodes,
        oldSummary: oldSummary,
      },
    );

    if (response.status === 200) {
      return response.data;
    } else throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error(error);
  }
};

export const updateTargetKeyOnEvents = async (poEdges, securityTarget) => {
  try {
    const response = await AxiosService.patch(
      'orchestrator/updatetargetkeyevents',
      {
        poEdges: poEdges,
        securityTarget: securityTarget,
      },
    );

    if (response.status === 200) {
      return response.data;
    } else throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error(error);
  }
};

export const updateTargetIFoOnEvents = async (allNodes, securityTarget) => {
  try {
    const response = await AxiosService.patch(
      'orchestrator/updatetargetifoevents',
      {
        allNodes: allNodes,
        securityTarget: securityTarget,
      },
    );

    if (response.status === 200) {
      return response.data;
    } else throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error(error);
  }
};

export const getUfoHandler = async (key, componentName) => {
  console.log(key, componentName, 'kcp');
  try {
    const response = await AxiosService.post('api/prepareHLRSchema', {
      key: key + ':',
      componentName,
    });
    if (response.status === 201) {
      return response.data;
    } else throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error(error);
  }
};

export const getSecurityAccessProfile = async (tenant) => {
  try {
    const response = await AxiosService.get('api/getSecurityTemplateData', {
      params: {
        tenant: tenant,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error(error);
  }
};

export const getDFAPI = async (key, token) => {
  try {
    const response = await AxiosService.post(
      'te/df',
      {
        key: key + ':',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.status === 201) {
      return response.data;
    } else throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error(error);
  }
};

export const poEventsEjs = async (key) => {
  try {
    const response = await AxiosService.post('api/ejs', {
      key: key,
    });

    if (response.status === 201) {
      return response.data;
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error(error);
  }
};
