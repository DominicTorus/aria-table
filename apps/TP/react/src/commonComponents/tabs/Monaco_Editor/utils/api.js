import { AxiosService } from '../../../../utils/axiosService';

export const executeCode = async (key, nodeName, code) => {
  try {
    const response = await AxiosService.post(`tm/codeExecute`, {
      key: key,
      nodeName: nodeName,
      code: code,
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error(error, 'code execute error');
  }
};

export const codeObject = async (key, nodeName) => {
  try {
    const response = await AxiosService.post(`tm/customCodeObjects`, {
      key: key,
      nodeName: nodeName,
    });
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error(error, 'custom code object error');
  }
};
