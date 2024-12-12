export const tenantProfileTemplate = {
  Code: '',
  Name: '',
  Logo: '',
  orgGrp: [
    {
      orgGrpName: '',
      orgGrpCode: '',
      org: [
        {
          orgCode: '',
          orgName: '',
          roleGrp: [
            {
              roleGrpName: '',
              roleGrpCode: '',
              roles: [
                {
                  roleCode: '',
                  roleName: '',
                  psGrp: [
                    {
                      psGrpCode: '',
                      psGrpName: '',
                      ps: [
                        {
                          psCode: '',
                          psName: '',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  AG: [
    {
      code: '',
      name: '',
      description: '',
      icon: '',
      APPS: [
      ],
    },
  ],
  ENV: [{
    code: '',
    HostName: '',
    HostIP: '',
    volumePath: '',
  }],
};

export const appGroupTemplate = {
  code: '',
  name: '',
  description: '',
  icon: '',
  APPS: [],
};

export const appTemplate = {
  code: '',
  name: '',
  description: '',
  icon: '',
};

export type group = 'role' | 'org' | 'ps' | 'all';

export const auth_secret =
  'HpZnm7V6YeshFDVbwACyOtx6oa6QSbraZoNyU9fwtGYUL1Rnc6PN5QUosu9BcqVBo5L6QeSs';

export type fabric = 'pf' | 'uf' | 'sf' | 'df';

export type artifactType = 'frk' | 'crk' | 'tpfrk';

export type sortOrderOfArtifacts =
  | 'Newest'
  | 'Oldest'
  | 'Recently Created'
  | 'Recently Modified';
