import { PiTextColumnsFill } from 'react-icons/pi';
import { TorusDatePicker } from '../../../torusComponents/TorusDate&TimePickers';
import _ from 'lodash';
import { merger } from '../../../utils/utils';
import TorusDropDown from '../../../torusComponents/TorusDropDown';
import TorusCheckBox from '../../../torusComponents/TorusCheckBox';
import TorusRadio from '../../../torusComponents/TorusRadio';
import TorusSwitch from '../../../torusComponents/TorusSwitch';
import TorusColumn from '../../../torusComponents/TorusColumn';
import { TorusListbox } from '../../../torusComponents/TorusListbox';
import { RiCollageFill } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { FaRegIdCard } from 'react-icons/fa';

export const Group = ({ grid, className, ...rest }) => {
  return (
    <div
      {...rest}
      style={{
        ...grid?.style,
        gridColumnStart: grid?.column?.start,
        gridColumnEnd: grid?.column?.end,
        gridRowStart: grid?.row?.start,
        gridRowEnd: grid?.row?.end,
      }}
      className={merger(
        'relative grid grid-cols-12   overflow-y-auto border  border-dashed border-black p-2 text-[0.72vw]',
        className,
      )}
    />
  );
};

export const Button = (props) => (
  <button
    {...props}
    style={{
      ...props?.grid?.style,
      gridColumnStart: props?.grid?.column?.start,
      gridColumnEnd: props?.grid?.column?.end,
      gridRowStart: props?.grid?.row?.start,
      gridRowEnd: props?.grid?.row?.end,
    }}
    className={
      'relative flex items-center justify-center border  border-black bg-violet-300 p-2 text-[0.72vw] italic transition-all hover:bg-violet-200/70 ' +
      props?.className
    }
  >
    <div className="  w-[4vw] truncate text-center   text-[0.72vw] italic">
      {props?.title || props?.type}
    </div>
  </button>
);
export const Textarea = (props) => {
  return (
    <textarea
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      value={props?.title || props?.type}
      className={
        'relative flex items-center justify-center border  border-black p-2 text-[0.72vw] italic ' +
        props?.className
      }
    />
  );
};

export const Radio = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusRadio
        content={[
          {
            values: props?.title || props?.type,
          },
        ]}
        orientation="horizontal"
      />
    </div>
  );
};
export const Radiobutton = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusRadio
        content={[
          {
            values: props?.title || props?.type,
          },
        ]}
        orientation="horizontal"
      />
    </div>
  );
};

export const Radiogroup = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black  text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusRadio
        content={[
          {
            values: props?.title || props?.type,
          },
          {
            values: 'radio',
          },
        ]}
        orientation="horizontal"
      />
    </div>
  );
};

export const Textinput = (props) => {
  return (
    <input
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      value={props?.title || props?.type}
      className={
        'relative flex items-center justify-center border  border-black p-2 text-[0.72vw] italic ' +
        props?.className
      }
    />
  );
};

export const Datepicker = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusDatePicker
        openBtn={true}
        label={props?.title || props?.type}
        className={'h-full w-full'}
      />
    </div>
  );
};

export const Dropdown = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusDropDown
        title={props?.title || props?.type}
        className={'h-full w-full'}
        classNames={{
          buttonClassName: 'text-[0.72vw] h-full w-full',
        }}
      />
    </div>
  );
};

export const Checkbox = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusCheckBox
        // label={props?.title || props?.type}
        content={[props?.title || props?.type]}
      />
    </div>
  );
};

export const Switch = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusSwitch
        label={props?.title || props?.type}
        switchClassName={'flex items-center gap-0'}
      />
    </div>
  );
};

export const Column = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusColumn
        label={[
          {
            id: 1,
            name: props?.title || props?.type,
          },
        ]}
        className={'mt-0 w-full'}
      />
    </div>
  );
};

export const List = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <TorusListbox
        label={[{ id: 2, name: props.title || props?.type }]}
        className={'mt-0 h-full w-full'}
      />
    </div>
  );
};
export const Icon = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <span className="flex items-center gap-1">
        <span>
          <RiCollageFill />
        </span>
        <span className="w-10 overflow-hidden  text-[0.72vw] ">
          {props?.title || props?.type}
        </span>
      </span>
    </div>
  );
};
export const Avatar = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <span className="flex items-center gap-1">
        <span>
          <CgProfile />
        </span>
        <span className="w-10 overflow-hidden  text-[0.72vw] ">
          {props?.title || props?.type}
        </span>
      </span>
    </div>
  );
};
export const Card = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props?.grid?.style,
        gridColumnStart: props?.grid?.column?.start,
        gridColumnEnd: props?.grid?.column?.end,
        gridRowStart: props?.grid?.row?.start,
        gridRowEnd: props?.grid?.row?.end,
      }}
      className={
        'relative flex w-full items-center justify-center overflow-auto border  border-black p-[0.1rem] text-[0.72vw] italic ' +
        props?.className
      }
    >
      <span className="flex items-center gap-1">
        <span>
          <FaRegIdCard />
        </span>
        <span className="w-10 overflow-hidden  text-[0.72vw] ">
          {props?.title || props?.type}
        </span>
      </span>
    </div>
  );
};
export const DefaultComponent = (props) => (
  <div
    {...props}
    style={{
      ...props?.grid?.style,
      gridColumnStart: props?.grid?.column?.start,
      gridColumnEnd: props?.grid?.column?.end,
      gridRowStart: props?.grid?.row?.start,
      gridRowEnd: props?.grid?.row?.end,
    }}
    className={
      'relative flex items-center justify-center border  border-black p-2 text-[0.72vw] italic ' +
      props?.className
    }
  >
    <div className="  w-[4vw] truncate text-center   text-[0.72vw] italic">
      {props?.title || props?.type}
    </div>
  </div>
);
