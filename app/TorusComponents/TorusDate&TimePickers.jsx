import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateField,
  DateInput,
  DatePicker,
  DateRangePicker,
  DateSegment,
  Dialog,
  DialogTrigger,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  TimeField,
} from "react-aria-components";
import { GrCaretPrevious } from "react-icons/gr";
import { GrCaretNext } from "react-icons/gr";
import { FaCaretDown } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";

const TorusCalendar = (props) => {
  return (
    <Calendar aria-label="Appointment date w-[100%]">
      <header className="flex justify-center w-[100%]">
        <div className="flex justify-around gap-2">
          <Button slot="previous" className={"bg-blue-600 p-[3px] rounded-md"}>
            <GrCaretPrevious size={15} color="white" />
          </Button>
          <Heading />
          <Button slot="next" className={"bg-blue-600 p-[3px] rounded-md"}>
            <GrCaretNext size={15} color="white" />
          </Button>
        </div>
      </header>
      <CalendarGrid>
        {(date) => (
          <CalendarCell
            className={`w-7 h-7 flex text-sm items-center justify-center p-2 
              torus-pressed:bg-blue-500 
              torus-hover:bg-blue-400 torus-hover:rounded-full
              torus-focus:border-transparent
               torus-focus:bg-blue-700  torus-focus:rounded-full
               torus-focus:text-white
             transition-all ease-in-out duration-300 data-[outside-visible-range]:bg-slate-300/70  data-[outside-visible-range]:text-slate-500/20
            `}
            style={{
              borderRadius: "50%",
            }}
            date={date}
          />
        )}
      </CalendarGrid>
    </Calendar>
  );
};

const TorusDateField = ({ slot }) => {
  return (
    <DateInput className="flex justify-around gap-2 w-full" slot={slot}>
      {(segment) => (
        <DateSegment
          className="torus-focus-within:border-transparent torus-focus:border-transparent torus-pressed:border-transparent"
          segment={segment}
        />
      )}
    </DateInput>
  );
};

const TorusDateRange = () => {
  return (
    <DateRangePicker>
      <div>
        <TorusDatePicker slot="start" />
        <TorusDatePicker slot="end" />
      </div>
    </DateRangePicker>
  );
};

const TorusDatePicker = ({props}) => {
  const [rotate, setRotate] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
    setRotate(!rotate);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
    setRotate(false);
  };

  return (
    <DatePicker>
      <div className="flex justify-start w-[100%]">
        <div className="w-full flex flex-col justify-between gap-2 items-center">
          <div className="w-full flex justify-start pl-[20px]">
            <Label className="text-start">{props.label}</Label>
          </div>
          <Group className="flex justify-around gap-2 w-full">
            <TorusDateField slot={props.slot} />
            {props.openBtn && (
              <Button
                className="w-6 h-6 bg-blue-600 p-[3px] rounded-md"
                onClick={togglePopover}
              >
                <FaCaretDown  
                  size={15}
                  color="white"
                  className={`transition-all ease-in-out duration-150 
                    torus-pressed:border-transparent torus-focus:border-transparent
                    torus-focus:bg-blue-700 torus-focus:text-white
                 `}
                />
              </Button>
            )}
          </Group>
        </div>
      </div>

      {isPopoverOpen && props.openBtn && (
        <Popover className="py-5 flex-col items-center w-[25%] bg-slate-100 rounded-md shadow-xl flex justify-center pl-3">
          <div className="w-full flex justify-end pr-6 items-center">
            <Button onClick={closePopover} autoFocus>
              <IoIosCloseCircleOutline
                size={20}
                color="red"
                className="torus-focus-within:border-transparent torus-focus:border-transparent torus-pressed:border-transparent"
              />
            </Button>
          </div>
          <TorusCalendar />
        </Popover>
      )}
    </DatePicker>
  );
};

const TorusDateRangePicker = () => {
  return (
    <DateRangePicker>
      <Label>Trip dates</Label>
      <Group>
        <TorusDateRange />
        <Button>▼</Button>
      </Group>
      <Popover>
        <Dialog>
          <TorusCalendar />
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
};

const TorusRangeCalender = () => {
  return (
    <RangeCalendar aria-label="Trip dates">
      <header>
        <Button slot="previous">◀</Button>
        <Heading />
        <Button slot="next">▶</Button>
      </header>
      <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
    </RangeCalendar>
  );
};

const TorusTimeField = () => {
  return (
    <TimeField>
      <Label>Event time</Label>
      <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
    </TimeField>
  );
};

export default function TorusDateTimePickers(props) {
  return (
    <div className={`${props.marginT}`}>
      <TorusDatePicker props={props} />
    </div>
  );
}
