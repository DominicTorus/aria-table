import { AiOutlineApi, AiOutlineUser } from 'react-icons/ai';
import { BiLogoPostgresql } from 'react-icons/bi';
import { BsSignpost, BsTextareaResize } from 'react-icons/bs';
import { CgCalendarDates, CgCalendarNext } from 'react-icons/cg';
import { CiCircleList, CiViewTable } from 'react-icons/ci';
import {
  FaRegFile,
  FaRegListAlt,
  FaRegStopCircle,
  FaUsersCog,
} from 'react-icons/fa';
import { FaBarsProgress, FaWpforms } from 'react-icons/fa6';
import { GiHumanPyramid } from 'react-icons/gi';
import { GrMysql } from 'react-icons/gr';
import { IoIosSwitch } from 'react-icons/io';
import { LuFormInput, LuMonitorUp } from 'react-icons/lu';
import { MdLabelImportant, MdOutlinePhonelink } from 'react-icons/md';
import {
  PiDatabaseDuotone,
  PiRadioButtonDuotone,
  PiSidebarDuotone,
  PiTextColumnsFill,
  PiTreeStructure,
} from 'react-icons/pi';
import { RiCheckboxBlankFill, RiTimerFlashLine } from 'react-icons/ri';
import { RxAvatar, RxInput } from 'react-icons/rx';
import { SiApachekafka, SiDocker, SiVisualstudiocode } from 'react-icons/si';
import {
  TbLayoutNavbar,
  TbSettingsAutomation,
  TbUserSquare,
} from 'react-icons/tb';
import { VscDebugStart } from 'react-icons/vsc';

export const EnvSideData = {
  'PF-PFD': [
    {
      icon: VscDebugStart,
      label: 'Start',
      nodeType: 'startnode',
      description:
        "  startNode is the initial node in a diagram or workflow, representing the starting point of a process or data flow within the application's graphical user interface",
    },
    {
      icon: AiOutlineApi,
      label: 'Api',
      nodeType: 'apinode',
      description: ' apiNode is a node that interfaces with an external API.',
    },
    {
      icon: PiTreeStructure,
      label: 'Decision',
      nodeType: 'decisionnode',
      description:
        'decisionNode is a type of node that represents a branching point where the flow can diverge based on certain conditions or inputs.',
    },
    {
      icon: GiHumanPyramid,
      label: 'human task node',
      nodeType: 'humantasknode',
      description: 'lorem',
    },
    {
      icon: RiTimerFlashLine,
      label: 'schedulerNode',
      nodeType: 'schedulernode',
      description: 'schedulernode',
    },
    {
      icon: TbSettingsAutomation,
      label: 'auomationNode',
      nodeType: 'automationnode',
      description: 'automationnode',
    },
    {
      label: 'DB',
      nodeType: 'dbnode',
      icon: PiDatabaseDuotone,
      description:
        ' Posts can serve various purposes, including sharing information or promoting products or services.',
    },
    {
      label: 'Stream',
      nodeType: 'streamnode',
      icon: MdOutlinePhonelink,
      description:
        ' Roles help establish hierarchy, streamline workflows, and ensure efficient collaboration by clearly outlining expectations.',
    },
    {
      label: 'File',
      nodeType: 'filenode',
      icon: FaRegFile,
      description:
        ' Lorem ipsum dolor sit amet, ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      icon: FaRegStopCircle,
      label: 'End',
      nodeType: 'endnode',
      description:
        'endNode is the final node in a process or workflow. It signifies the conclusion of the workflow or the point at which all operations or data transformations within the workflow have been completed',
    },
  ],
  'DF-ERD': [
    {
      label: 'User',
      nodeType: 'customTable',
      icon: AiOutlineUser,
      description:
        'Users play a crucial role in shaping the design and functionality of digital products, often providing feedback that drives improvements and enhancements.',
    },
    {
      label: 'Post',
      nodeType: 'customTable',
      icon: BsSignpost,
      description:
        ' Posts can serve various purposes, including sharing information or promoting products or services.',
    },
    {
      label: 'Role',
      nodeType: 'customTable',
      icon: FaUsersCog,
      description:
        ' Roles help establish hierarchy, streamline workflows, and ensure efficient collaboration by clearly outlining expectations.',
    },
    {
      label: 'Department',
      nodeType: 'customTable',
      icon: CiViewTable,
      description:
        ' Lorem ipsum dolor sit amet, ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      label: 'Course',
      nodeType: 'customTable',
      icon: CiViewTable,
      description:
        ' Lorem ipsum dolor sit amet, ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ],
  'UF-UFW': [
    {
      icon: PiSidebarDuotone,
      label: 'Group',
      name: 'Group',
      nodeType: 'group',
      description:
        'This feature allows you to visually group related nodes together, making your flow diagrams more organized which can group and ungroupable.',
    },
    {
      icon: PiSidebarDuotone,
      label: 'Input',
      name: 'Input',
      nodeType: 'input',
      description:
        'Input is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiSidebarDuotone,
      label: 'Button',
      name: 'Button',
      nodeType: 'button',
      description:
        'Button is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: TbLayoutNavbar,
      label: 'Navbar',
      name: 'Navbar',
      nodeType: 'navbar',
      description:
        ' Navbar is An essential UI element positioned at the top of webpages, facilitating seamless navigation by offering links to various sections and features.',
    },
    {
      icon: CiViewTable,
      label: 'Table',
      name: 'Table',
      nodeType: 'table',
      description:
        ' Table is a structured display format used to organize and present data in rows and columns. ',
    },

    {
      icon: PiSidebarDuotone,
      label: 'single',
      name: 'single',
      nodeType: 'single',
      description:
        'SINGLE is a navigational interface element positioned vertically along the side of a webpage or application',
    },

    {
      icon: CiCircleList,
      label: 'radiogroup',
      name: 'radiogroup',
      nodeType: 'radiogroup',
      description:
        'radioGroup is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CiCircleList,
      label: 'checkbox',
      name: 'checkbox',
      nodeType: 'checkbox',
      description:
        'checkbox is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CiCircleList,
      label: 'card',
      name: 'card',
      nodeType: 'card',
      description:
        'card is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: BsTextareaResize,
      label: 'textarea',
      name: 'textarea',
      nodeType: 'textarea',
      description:
        'textarea is a navigational interface element positioned vertically along the side of a webpage or application',
    },

    {
      icon: LuFormInput,
      label: 'time',
      name: 'time',
      nodeType: 'time',
      description:
        'timeinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarDates,
      label: 'datepicker',
      name: 'datepicker',
      nodeType: 'datepicker',
      description:
        'dateinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarDates,
      label: 'dropdown',
      name: 'dropdown',
      nodeType: 'dropdown',
      description:
        'dropdown is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: RxAvatar,
      label: 'avatar',
      name: 'avatar',
      nodeType: 'avatar',
      description:
        'avatar is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: TbUserSquare,
      label: 'icon',
      name: 'icon',
      nodeType: 'icon',
      description:
        'icon is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: MdLabelImportant,
      label: 'label',
      name: 'label',
      nodeType: 'label',
      description:
        'label is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: FaRegListAlt,
      label: 'list',
      name: 'list',
      nodeType: 'list',
      description:
        'list is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarNext,
      label: 'pagination',
      name: 'pagination',
      nodeType: 'pagination',
      description:
        'pagination is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: LuFormInput,
      label: 'pininput',
      name: 'pininput',
      nodeType: 'pininput',
      description:
        'pininput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: FaBarsProgress,
      label: 'progress',
      name: 'progress',
      nodeType: 'progress',
      description:
        'progress is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiRadioButtonDuotone,
      label: 'radiobutton',
      name: 'radiobutton',
      nodeType: 'radiobutton',
      description:
        'radiobutton is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: IoIosSwitch,
      label: 'switch',
      name: 'switch',
      nodeType: 'switch',
      description:
        'switch is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiTextColumnsFill,
      label: 'column',
      name: 'column',
      nodeType: 'column',
      description:
        'column is a navigational interface element positioned vertically along the side of a webpage or application',
    },
  ],
  'UF-UFM': [
    {
      icon: PiSidebarDuotone,
      label: 'Group',
      name: 'Group',
      nodeType: 'group',
      description:
        'This feature allows you to visually group related nodes together, making your flow diagrams more organized which can group and ungroupable.',
    },
    {
      icon: PiSidebarDuotone,
      label: 'Input',
      name: 'Input',
      nodeType: 'input',
      description:
        'Input is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiSidebarDuotone,
      label: 'Button',
      name: 'Button',
      nodeType: 'button',
      description:
        'Button is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: TbLayoutNavbar,
      label: 'Navbar',
      name: 'Navbar',
      nodeType: 'navbar',
      description:
        ' Navbar is An essential UI element positioned at the top of webpages, facilitating seamless navigation by offering links to various sections and features.',
    },
    {
      icon: CiViewTable,
      label: 'Table',
      name: 'Table',
      nodeType: 'table',
      description:
        ' Table is a structured display format used to organize and present data in rows and columns. ',
    },

    {
      icon: PiSidebarDuotone,
      label: 'single',
      name: 'single',
      nodeType: 'single',
      description:
        'SINGLE is a navigational interface element positioned vertically along the side of a webpage or application',
    },

    {
      icon: CiCircleList,
      label: 'radiogroup',
      name: 'radiogroup',
      nodeType: 'radiogroup',
      description:
        'radioGroup is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CiCircleList,
      label: 'checkbox',
      name: 'checkbox',
      nodeType: 'checkbox',
      description:
        'checkbox is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CiCircleList,
      label: 'card',
      name: 'card',
      nodeType: 'card',
      description:
        'card is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: BsTextareaResize,
      label: 'textarea',
      name: 'textarea',
      nodeType: 'textarea',
      description:
        'textarea is a navigational interface element positioned vertically along the side of a webpage or application',
    },

    {
      icon: LuFormInput,
      label: 'time',
      name: 'time',
      nodeType: 'time',
      description:
        'timeinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarDates,
      label: 'datepicker',
      name: 'datepicker',
      nodeType: 'datepicker',
      description:
        'dateinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarDates,
      label: 'dropdown',
      name: 'dropdown',
      nodeType: 'dropdown',
      description:
        'dropdown is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: RxAvatar,
      label: 'avatar',
      name: 'avatar',
      nodeType: 'avatar',
      description:
        'avatar is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: TbUserSquare,
      label: 'icon',
      name: 'icon',
      nodeType: 'icon',
      description:
        'icon is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: MdLabelImportant,
      label: 'label',
      name: 'label',
      nodeType: 'label',
      description:
        'label is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: FaRegListAlt,
      label: 'list',
      name: 'list',
      nodeType: 'list',
      description:
        'list is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarNext,
      label: 'pagination',
      name: 'pagination',
      nodeType: 'pagination',
      description:
        'pagination is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: LuFormInput,
      label: 'pininput',
      name: 'pininput',
      nodeType: 'pininput',
      description:
        'pininput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: FaBarsProgress,
      label: 'progress',
      name: 'progress',
      nodeType: 'progress',
      description:
        'progress is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiRadioButtonDuotone,
      label: 'radiobutton',
      name: 'radiobutton',
      nodeType: 'radiobutton',
      description:
        'radiobutton is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: IoIosSwitch,
      label: 'switch',
      name: 'switch',
      nodeType: 'switch',
      description:
        'switch is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiTextColumnsFill,
      label: 'column',
      name: 'column',
      nodeType: 'column',
      description:
        'column is a navigational interface element positioned vertically along the side of a webpage or application',
    },
  ],
  'UF-UFD': [
    {
      icon: PiSidebarDuotone,
      label: 'Group',
      name: 'Group',
      nodeType: 'group',
      description:
        'This feature allows you to visually group related nodes together, making your flow diagrams more organized which can group and ungroupable.',
    },
    {
      icon: PiSidebarDuotone,
      label: 'Input',
      name: 'Input',
      nodeType: 'input',
      description:
        'Input is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiSidebarDuotone,
      label: 'Button',
      name: 'Button',
      nodeType: 'button',
      description:
        'Button is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: TbLayoutNavbar,
      label: 'Navbar',
      name: 'Navbar',
      nodeType: 'navbar',
      description:
        ' Navbar is An essential UI element positioned at the top of webpages, facilitating seamless navigation by offering links to various sections and features.',
    },
    {
      icon: CiViewTable,
      label: 'Table',
      name: 'Table',
      nodeType: 'table',
      description:
        ' Table is a structured display format used to organize and present data in rows and columns. ',
    },

    {
      icon: PiSidebarDuotone,
      label: 'single',
      name: 'single',
      nodeType: 'single',
      description:
        'SINGLE is a navigational interface element positioned vertically along the side of a webpage or application',
    },

    {
      icon: CiCircleList,
      label: 'radiogroup',
      name: 'radiogroup',
      nodeType: 'radiogroup',
      description:
        'radioGroup is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CiCircleList,
      label: 'checkbox',
      name: 'checkbox',
      nodeType: 'checkbox',
      description:
        'checkbox is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CiCircleList,
      label: 'card',
      name: 'card',
      nodeType: 'card',
      description:
        'card is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: BsTextareaResize,
      label: 'textarea',
      name: 'textarea',
      nodeType: 'textarea',
      description:
        'textarea is a navigational interface element positioned vertically along the side of a webpage or application',
    },

    {
      icon: LuFormInput,
      label: 'time',
      name: 'time',
      nodeType: 'time',
      description:
        'timeinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarDates,
      label: 'datepicker',
      name: 'datepicker',
      nodeType: 'datepicker',
      description:
        'dateinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarDates,
      label: 'dropdown',
      name: 'dropdown',
      nodeType: 'dropdown',
      description:
        'dropdown is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: RxAvatar,
      label: 'avatar',
      name: 'avatar',
      nodeType: 'avatar',
      description:
        'avatar is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: TbUserSquare,
      label: 'icon',
      name: 'icon',
      nodeType: 'icon',
      description:
        'icon is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: MdLabelImportant,
      label: 'label',
      name: 'label',
      nodeType: 'label',
      description:
        'label is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: FaRegListAlt,
      label: 'list',
      name: 'list',
      nodeType: 'list',
      description:
        'list is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: CgCalendarNext,
      label: 'pagination',
      name: 'pagination',
      nodeType: 'pagination',
      description:
        'pagination is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: LuFormInput,
      label: 'pininput',
      name: 'pininput',
      nodeType: 'pininput',
      description:
        'pininput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: FaBarsProgress,
      label: 'progress',
      name: 'progress',
      nodeType: 'progress',
      description:
        'progress is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiRadioButtonDuotone,
      label: 'radiobutton',
      name: 'radiobutton',
      nodeType: 'radiobutton',
      description:
        'radiobutton is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: IoIosSwitch,
      label: 'switch',
      name: 'switch',
      nodeType: 'switch',
      description:
        'switch is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      icon: PiTextColumnsFill,
      label: 'column',
      name: 'column',
      nodeType: 'column',
      description:
        'column is a navigational interface element positioned vertically along the side of a webpage or application',
    },
  ],
  PFD: [
    {
      icon: VscDebugStart,
      label: 'Start',
      nodeType: 'startnode',
      description:
        "  startNode is the initial node in a diagram or workflow, representing the starting point of a process or data flow within the application's graphical user interface",
    },
    {
      icon: AiOutlineApi,
      label: 'Api',
      nodeType: 'apinode',
      description: ' apiNode is a node that interfaces with an external API.',
    },
    {
      icon: PiTreeStructure,
      label: 'Decision',
      nodeType: 'decisionnode',
      description:
        'decisionNode is a type of node that represents a branching point where the flow can diverge based on certain conditions or inputs.',
    },
    {
      icon: GrMysql,
      label: 'Mysql',
      nodeType: 'databasenode',
      description:
        'databaseNode is to symbolize the point in the workflow where data is either being persisted to a database, retrieved from it, or updated.',
    },
    {
      icon: SiApachekafka,
      label: 'kafka',
      nodeType: 'kafkanode',
      description:
        'kafkaNode would handle tasks related to producing or consuming messages from Kafka topics within the workflow',
    },
    {
      icon: BiLogoPostgresql,
      label: 'postgres',
      nodeType: 'postgresnode',
      description:
        'postgresNode  symbolize an action like querying a PostgreSQL database, inserting data into it, updating it, or establishing a connection to it.',
    },
    {
      icon: SiDocker,
      label: 'docker',
      nodeType: 'dockernode',
      description:
        'dockerNode handle tasks related to managing Docker containers within the workflow',
    },
    {
      icon: RxInput,
      label: 'input',
      nodeType: 'inputnode',
      description:
        'inputNode is designed to capture or receive input data. This could be the starting point in a workflow or data processing pipeline, where data enters the system from an external source, user input, or another upstream process.',
    },
    {
      icon: LuMonitorUp,
      label: 'output',
      nodeType: 'outputnode',
      description:
        'outputNode  represents the end point or a node that outputs data from the workflow or process.',
    },
    {
      icon: SiVisualstudiocode,
      label: 'Code',
      nodeType: 'customcode',
      description:
        'customCode allows developers to execute custom code within the workflow or diagram.',
    },
    {
      icon: GiHumanPyramid,
      label: 'human task node',
      nodeType: 'humantasknode',
      description: 'lorem',
    },
    {
      icon: FaRegStopCircle,
      label: 'End',
      nodeType: 'endnode',
      description:
        'endNode is the final node in a process or workflow. It signifies the conclusion of the workflow or the point at which all operations or data transformations within the workflow have been completed',
    },
  ],
  'DF-DFD': [
    {
      icon: VscDebugStart,
      label: 'Start',
      nodeType: 'startnode',
      description:
        "  startNode is the initial node in a diagram or workflow, representing the starting point of a process or data flow within the application's graphical user interface",
    },
    {
      icon: AiOutlineApi,
      label: 'Api',
      nodeType: 'apinode',
      description: ' apiNode is a node that interfaces with an external API.',
    },
    {
      icon: PiTreeStructure,
      label: 'Decision',
      nodeType: 'decisionnode',
      description:
        'decisionNode is a type of node that represents a branching point where the flow can diverge based on certain conditions or inputs.',
    },
    {
      icon: GiHumanPyramid,
      label: 'human task node',
      nodeType: 'humantasknode',
      description: 'lorem',
    },
    {
      icon: RiTimerFlashLine,
      label: 'schedulerNode',
      nodeType: 'schedulernode',
      description: 'schedulernode',
    },
    {
      icon: TbSettingsAutomation,
      label: 'auomationNode',
      nodeType: 'automationnode',
      description: 'automationnode',
    },
    {
      label: 'DB',
      nodeType: 'dbnode',
      icon: PiDatabaseDuotone,
      description:
        ' Posts can serve various purposes, including sharing information or promoting products or services.',
    },
    {
      label: 'Stream',
      nodeType: 'streamnode',
      icon: MdOutlinePhonelink,
      description:
        ' Roles help establish hierarchy, streamline workflows, and ensure efficient collaboration by clearly outlining expectations.',
    },
    {
      label: 'File',
      nodeType: 'filenode',
      icon: FaRegFile,
      description:
        ' Lorem ipsum dolor sit amet, ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      icon: FaRegStopCircle,
      label: 'End',
      nodeType: 'endnode',
      description:
        'endNode is the final node in a process or workflow. It signifies the conclusion of the workflow or the point at which all operations or data transformations within the workflow have been completed',
    },
  ],
  UFD: [
    {
      flow: 'UF-UFD',
      label: 'navbar',
      icon: TbLayoutNavbar,
      name: 'navbar',
      nodeType: 'navbar',
      description:
        "navigation bar, or navbar, is a horizontal or vertical menu that provides links to different pages or sections within a website or application, facilitating easy and intuitive access to the site's content.",
    },

    {
      flow: 'UF-UFD',
      icon: CiViewTable,
      label: 'Table',
      name: 'Table',
      nodeType: 'table',
      description:
        'A table is a structured arrangement of data organized into rows and columns, used to display information in a clear and concise manner, allowing for easy comparison, analysis, and reference',
    },
    {
      flow: 'UF-UFD',
      icon: FaWpforms,
      label: 'Form',
      name: 'Form',
      nodeType: 'form',
      description:
        'A form is an interactive component on a webpage or application that collects information from users through various fields such as text boxes, checkboxes, and dropdown menus, typically used for registrations, logins, and data submission.',
    },
    {
      flow: 'UF-UFD',
      icon: PiSidebarDuotone,
      label: 'Sidebarnav',
      name: 'Sidebarnav',
      nodeType: 'sidebarnav',
      description:
        'A Sidebarnav, or sidebar navigation, is a vertical menu located alongside the main content of a webpage or application, providing easy access to different sections, features, or functionalities, often used to improve user navigation and organize content hierarchically.',
    },
    {
      flow: 'UF-UFD',
      icon: PiSidebarDuotone,
      label: 'Button',
      name: 'Button',
      nodeType: 'button',
      description:
        'A Button, or sidebar navigation, is a vertical menu located alongside the main content of a webpage or application, providing easy access to different sections, features, or functionalities, often used to improve user navigation and organize content hierarchically.',
    },
    {
      flow: 'UF-UFD',
      icon: PiSidebarDuotone,
      label: 'Input',
      name: 'Input',
      nodeType: 'input',
      description:
        'A Input, or sidebar navigation, is a vertical menu located alongside the main content of a webpage or application, providing easy access to different sections, features, or functionalities, often used to improve user navigation and organize content hierarchically.',
    },

    {
      flow: 'UF-UFD',
      icon: PiSidebarDuotone,
      label: 'group',
      name: 'group',
      nodeType: 'group',
      description:
        'GROUP is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      flow: 'UF-UFD',
      icon: CiCircleList,
      label: 'radiogroup',
      name: 'radiogroup',
      nodeType: 'radiogroup',
      description:
        'radiogroup is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      flow: 'UF-UFD',
      icon: BsTextareaResize,
      label: 'textarea',
      name: 'textarea',
      nodeType: 'textarea',
      description:
        'textarea is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      flow: 'UF-UFD',
      icon: LuFormInput,
      label: 'time',
      name: 'time',
      nodeType: 'time',
      description:
        'timeinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      flow: 'UF-UFD',
      icon: CgCalendarDates,
      label: 'datePicker',
      name: 'datePicker',
      nodeType: 'datePicker',
      description:
        'dateinput is a navigational interface element positioned vertically along the side of a webpage or application',
    },
    {
      flow: 'UF-UFD',
      icon: CgCalendarDates,
      label: 'dropdown',
      name: 'dropdown',
      nodeType: 'dropdown',
      description:
        'dropdown is a navigational interface element positioned vertically along the side of a webpage or application',
    },
  ],
};
