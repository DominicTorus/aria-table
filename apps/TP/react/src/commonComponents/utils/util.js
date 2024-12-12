import { MdOutlineEventNote } from 'react-icons/md';
import {
  CustomCode,
  Documents,
  ElementInfo,
  Enities,
  Enumeration,
  Execution,
  MapperIcon,
  ProcessObject,
  RulesIcon,
  Security,
  SourceIcon,
  Validation,
} from '../../asset/SvgsApplication';

export const nodeInfoTabs = {
  'PF-PFD': [
    {
      label: 'Data',
      icon: <SourceIcon />,
      modelOpen: 'data',
    },
    {
      label: 'Mapper',
      icon: <MapperIcon />,
      modelOpen: 'mapper',
    },
    {
      label: 'Rule',
      icon: <RulesIcon />,
      modelOpen: 'rule',
    },
    {
      label: 'CustomCode',
      icon: <CustomCode />,
      modelOpen: 'customCode',
    },
    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },
    {
      label: 'Security',
      icon: <Security />,
      modelOpen: 'security',
    },
    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'data',
    },
  ],
  'UF-UFW': [
    {
      label: 'ElementInfo',
      icon: <ElementInfo />,
      modelOpen: 'elementInfo',
    },
    {
      label: 'Datasource',
      icon: <SourceIcon />,
      modelOpen: 'config',
    },
    {
      label: 'Events',
      icon: <MdOutlineEventNote />,
      modelOpen: 'events',
    },

    {
      label: 'CustomCode',
      icon: <CustomCode />,
      modelOpen: 'customCode',
    },
    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },
    {
      label: 'Security',
      icon: <Security />,
      modelOpen: 'security',
    },
    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  'UF-UFM': [
    {
      label: 'ElementInfo',
      icon: <ElementInfo />,
      modelOpen: 'elementInfo',
    },
    {
      label: 'Datasource',
      icon: <SourceIcon />,
      modelOpen: 'config',
    },
    {
      label: 'Events',
      icon: <MdOutlineEventNote />,
      modelOpen: 'events',
    },

    {
      label: 'CustomCode',
      icon: <CustomCode />,
      modelOpen: 'customCode',
    },
    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },
    {
      label: 'Security',
      icon: <Security />,
      modelOpen: 'security',
    },
    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  'UF-UFD': [
    {
      label: 'ElementInfo',
      icon: <ElementInfo />,
      modelOpen: 'elementInfo',
    },
    {
      label: 'Datasource',
      icon: <SourceIcon />,
      modelOpen: 'config',
    },
    {
      label: 'Events',
      icon: <MdOutlineEventNote />,
      modelOpen: 'events',
    },

    {
      label: 'CustomCode',
      icon: <CustomCode />,
      modelOpen: 'customCode',
    },
    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },
    {
      label: 'Security',
      icon: <Security />,
      modelOpen: 'security',
    },
    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  'DF-DFD': [
    {
      label: 'Entities',
      icon: <Enities />,
      modelOpen: 'entities',
    },
    {
      label: 'DataSource',
      icon: <SourceIcon />,
      modelOpen: 'config',
    },
    {
      label: 'Enum',
      icon: <Enumeration />,
      modelOpen: 'mapper',
    },
    {
      label: 'ProcessObjects',
      icon: <ProcessObject />,
      modelOpen: 'processObj',
    },
    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },
    {
      label: 'Security',
      icon: <Security />,
      modelOpen: 'security',
    },
    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  SF: [
    {
      label: 'PF',
      icon: <Enities />,
      modelOpen: 'pf',
    },
    {
      label: 'DF',
      icon: <SourceIcon />,
      modelOpen: 'df',
    },
    {
      label: 'UF',
      icon: <Enumeration />,
      modelOpen: 'uf',
    },
    {
      label: 'Portel',
      icon: <ProcessObject />,
      modelOpen: 'portel',
    },
  ],
};

export const defaultInfoTabs = {
  'PF-PFD': [
    {
      label: 'Data',
      icon: <SourceIcon />,
      modelOpen: 'data',
    },

    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },

    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  'UF-UFW': [
    {
      label: 'ElementInfo',
      icon: <ElementInfo />,
      modelOpen: 'elementInfo',
    },
    {
      label: 'Datasource',
      icon: <SourceIcon />,
      modelOpen: 'config',
    },

    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },

    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  'UF-UFD': [
    {
      label: 'ElementInfo',
      icon: <ElementInfo />,
      modelOpen: 'elementInfo',
    },
    {
      label: 'Datasource',
      icon: <SourceIcon />,
      modelOpen: 'config',
    },

    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },

    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  'UF-UFM': [
    {
      label: 'ElementInfo',
      icon: <ElementInfo />,
      modelOpen: 'elementInfo',
    },
    {
      label: 'Datasource',
      icon: <SourceIcon />,
      modelOpen: 'config',
    },

    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },

    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
  'DF-DFD': [
    {
      label: 'Entities',
      icon: <Enities />,
      modelOpen: 'entities',
    },
    {
      label: 'DataSource',
      icon: <SourceIcon />,
      modelOpen: 'dataSource',
    },
    {
      label: 'Enum',
      icon: <Enumeration />,
      modelOpen: 'enum',
    },
    {
      label: 'ProcessObjects',
      icon: <ProcessObject />,
      modelOpen: 'processObjects',
    },
    {
      label: 'Validation',
      icon: <Validation />,
      modelOpen: 'validation',
    },

    {
      label: 'Execution',
      icon: <Execution />,
      modelOpen: 'execution',
    },
    {
      label: 'Documents',
      icon: <Documents />,
      modelOpen: 'documents',
    },
  ],
};
export const propertyData = [
  { label: 'm1', key: 'm1' },
  { label: 'm2', key: 'm2' },
  { label: 'm3', key: 'm3' },
  { label: 'm4', key: 'm4' },
];

export const controlPolicy = {
  Level1: ['array', 'object', 'string'],
  Level2: [
    'array',
    'object',
    'string',
    'boolean',
    'number',
    'null',
    'dropdown',
  ],
  Level3: [
    'array',
    'object',
    'string',
    'boolean',
    'number',
    'null',
    'dropdown',
  ],
  Level4: ['array', 'object', 'string', 'dropdown'],
  Level5: ['array', 'object', 'string', 'dropdown'],
  Level6: ['array', 'object', 'string'],
  Level7: ['array', 'object', 'string'],
  Level8: ['array', 'object', 'string'],
  Level9: ['array', 'object', 'string'],
  Level10: ['array', 'object', 'string'],
};
export const colorPolicy = {
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
};

export const cardUIPolicy = {
  Level1: 'card',
  Level2: 'card',
  Level3: 'card',
  Level4: 'card',
  Level5: 'card',
  Level6: 'card',
  Level7: 'card',
  Level8: 'card',
  Level9: ' card ',
  Level10: ' card',
};

export const tableUIPolicy = {
  Level1: 'table',
  Level2: 'table',
  Level3: 'table',
  Level4: 'table',
  Level5: 'table',
  Level6: 'table',
  Level7: 'table',
  Level8: 'table',
  Level9: 'table',
  Level10: 'table',
};

export const nodeTypes = [
  'startNode',
  'decisionNode',
  'endNode',
  'defaultNdoe',
  'apiNode',
  'databaseNode',
  'kafkaNode',
  'postgresNode',
  'dockerNode',
  'inputNode',
  'outputNode',
  'customCode',
  'customTable',
  'NavBar',
  'Table',
  'Form',
  'Sidebarnav',
  'dropdown',
];

export const treeUiPolicy = {
  Level1: 'tree',
  Level2: 'card',
  Level3: 'card',
  Level4: 'card',
  Level5: 'card',
  Level6: 'card',
  Level7: 'card',
  Level8: 'card',
  Level9: ' card ',
  Level10: ' card',
};

export const tablejson = {
  elementInfo: {
    frameWork: 'GravityUI',
    version: '6.21.0',
    component: 'Table',
    groupLabel: 'Table',
    label: '',
    type: 'dynamic',
    tableName: '',
    primaryKey: '',
    parentTable: '',
    parentTableId: '',
    props: [
      {
        groupLabel: 'properties',
        name: 'tableSettings',
        label: 'tableSettings',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: 'true',
        enabled: true,
      },
      {
        name: 'tableSorting',
        label: 'tableSorting',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: 'true',
        enabled: true,
      },
      {
        name: 'setPrimarykeyValue',
        label: 'setPrimarykeyValue',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: 'true',
        enabled: true,
      },
      {
        name: 'tableSelection',
        label: 'tableSelection',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: 'true',
        enabled: true,
      },
      {
        name: 'pagination',
        label: 'pagination',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: '',
        apiName: '',
        enabled: true,
      },
      {
        name: 'search',
        label: 'search',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: 'true',
        searchColumn: '',
        enabled: true,
      },
      {
        name: 'tableActions',
        label: 'tableActions',
        type: 'string',
        default: 'edit',
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['*', 'edit', 'delete'],
        },
        value: 'true',
        enabled: true,
      },
      {
        name: 'needLocking',
        label: 'needLocking',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: 'true',
        enabled: true,
      },
      {
        name: 'isPivotTable',
        label: 'isPivotTable',
        type: 'boolean',
        default: false,
        enum: {
          label: 'enum',
          type: 'dropdown',
          mode: 'single',
          selectedValue: [],
          selectionList: ['true', 'false'],
        },
        value: 'true',
        enabled: true,
      },
    ],
    events: [
      {
        name: 'onSelectionChange',
        groupLabel: 'events',
        label: 'onSelectionChange',
        type: 'Group',
        enabled: 'true',
      },
      {
        name: 'onSaveAll',
        groupLabel: 'events',
        label: 'onSaveAll',
        type: 'Group',
        enabled: 'true',
      },
    ],
  },
};
