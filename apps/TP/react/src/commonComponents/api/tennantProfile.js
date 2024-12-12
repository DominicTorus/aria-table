import { AxiosService } from '../../utils/axiosService';

export const getClientTenantsData = async (clientCode) => {
  try {
    const res = await AxiosService.get(
      `api/getClient?clientCode=${clientCode}`,
    );
    if (res.status == 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch Tenant data');
    }
  } catch (error) {
    console.error(error);
  }
};
