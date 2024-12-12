import axios from 'axios';

export const getDataPushToBuild = async (tok) => {
  try {
    const res = await axios.get(`${process.env.PUSH_TO_BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${tok}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

export const getTenantsData = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_PUSH_TO_BASE_URL}getClientTenant`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PUSH_TO_BUILD_TOKEN}`,
        },
      },
    );
    console.log(res, 'getit-->');
    if (res.status == 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch Tenant data');
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAppGroupData = async (tenant) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_PUSH_TO_BASE_URL}getappgrouplist?tenant=${tenant}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PUSH_TO_BUILD_TOKEN}`,
        },
      },
    );
    console.log(res, 'getit-->');
    if (res.status == 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch Tenant data');
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAppData = async (tenant, appGroup) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_PUSH_TO_BASE_URL}getapplist?tenant=${tenant}&appGroup=${appGroup}`,
    );
    console.log(res, 'getit-->');

    if (res.status == 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch App data');
    }
  } catch (error) {
    console.log(error);
  }
};

export const getVersionData = async (tenant, appGroup, app) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_PUSH_TO_BASE_URL}getAssemblerVersion?key=CK:TGA:FNGK:BLDC:FNK:DEV:CATK:${tenant}:AFGK:${appGroup}:AFK:${app}`,
    );
    console.log(res, 'getversionit-->');
    if (res.status == 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch Version data');
    }
  } catch (err) {
    console.log(err);
  }
};

export const postDataPushToBuild = async (data) => {
  try {
    console.log(data, 'dataonPUSHBUILD');
    const res = await fetch(
      `${process.env.REACT_APP_PUSH_TO_BASE_URL}pushArtifactBuild`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_PUSH_TO_BUILD_TOKEN}`,
        },
        body: JSON.stringify({
          artifactKeyPrefix: data.artifactKeyPrefix,
          loginId: data.loginId,
          tenant: data.tenant,
          appGrp: data.appGrp,
          app: data.app,
          version: data.version,
          client: data.client,
        }),
      },
    );
    if (res) {
      if (res.ok) {
        const data = await res.json();
        console.log(data, 'ResponseonPUSHBUILD');
        return data;
      } else {
        return 'error';
      }
    } else {
      return 'error';
    }
  } catch (error) {
    console.log(error);
  }
};
