export const config_colorpolicy = {
  customTable: {
    Level1: '#4a90e2',
    Level2: '#f34f5e',
    Level3: '#f49f7a',
    Level4: '#e777ab',
    Level5: '#a774d4',
    Level6: '#413d74',
    Level7: '#fdda79',
    Level8: '#4ca68a',
    Level9: ' #92ffdd ',
    Level10: ' #796cf8',
  },
};

export const workflow_colorpolicy = {
  customTable: {
    Level1: '#4a90e2',
    Level2: '#f34f5e',
    Level3: '#f49f7a',
    Level4: '#e777ab',
    Level5: '#a774d4',
    Level6: '#413d74',
    Level7: '#fdda79',
    Level8: '#4ca68a',
    Level9: ' #92ffdd ',
    Level10: ' #796cf8',
  },
};

export const config_controlpolicy = {
  customTable: {
    Level1: ['array', 'object', 'string'],
    Level2: ['array', 'object', 'string', 'boolean', 'number', 'null'],
    Level3: ['array', 'object', 'string', 'boolean', 'number', 'null'],
    Level4: ['array', 'object', 'string'],
    Level5: ['array', 'object', 'string'],
    Level6: ['array', 'object', 'string'],
    Level7: ['array', 'object', 'string'],
    Level8: ['array', 'object', 'string'],
    Level9: ['array', 'object', 'string'],
    Level10: ['array', 'object', 'string'],
  },
};

export const workflow_controlpolicy = {
  customTable: {
    Level1: ['array', 'object', 'string'],
    Level2: ['array', 'object', 'string', 'boolean', 'number', 'null'],
    Level3: ['array', 'object', 'string', 'boolean', 'number', 'null'],
    Level4: ['array', 'object', 'string'],
    Level5: ['array', 'object', 'string'],
    Level6: ['array', 'object', 'string'],
    Level7: ['array', 'object', 'string'],
    Level8: ['array', 'object', 'string'],
    Level9: ['array', 'object', 'string'],
    Level10: ['array', 'object', 'string'],
  },
};

export const save_options = [
  {
    id: 1,
    tenant: 'TORUS',
    groups: [
      {
        id: 1,
        groupName: 'Group-1',
        applications: [
          { id: 'App1', applicationName: 'app1' },
          { id: 'App2', applicationName: 'app2' },
          { id: 'app3', applicationName: 'app2' },
        ],
      },
    ],
  },
  {
    id: 2,
    tenant: 'GSS',
    groups: [
      {
        id: 1,
        groupName: 'G2',
        applications: [
          { id: 'App1', applicationName: 'app1' },
          { id: 'App2', applicationName: 'app2' },
          { id: 'app3', applicationName: 'app2' },
        ],
      },
      {
        id: 2,
        groupName: 'G3',
        applications: [
          { id: 'App1', applicationName: 'app1' },
          { id: 'App2', applicationName: 'app2' },
          { id: 'app3', applicationName: 'app2' },
        ],
      },
    ],
  },
  {
    id: 3,
    tenant: 'tenantName-3',
    groups: [
      {
        id: 1,
        groupName: 'G2',
        applications: [
          { id: 'App1', applicationName: 'app1' },
          { id: 'App2', applicationName: 'app2' },
          { id: 'app3', applicationName: 'app2' },
        ],
      },
      {
        id: 2,
        groupName: 'G3',
        applications: [
          { id: 'App1', applicationName: 'app1' },
          { id: 'App2', applicationName: 'app2' },
          { id: 'app3', applicationName: 'app2' },
        ],
      },
    ],
  },
];

export const tenant_details = ['1', '2', '3', '4', '5', '6'];

export const roles = [
  { role: 'supervisor', color: '#aebbff' },
  { role: 'admin', color: '#92b2ff' },
  { role: 'testing', color: '#8ad3ff' },
];

export const app_pfd_path = './Tenant/App';

export const read_only = '100';
export const developer = '200';
export const admin = '300';

export const user_type = 'ADMIN';
