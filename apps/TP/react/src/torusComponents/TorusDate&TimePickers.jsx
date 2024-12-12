import { useEffect, useState } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  TimeField,
} from 'react-aria-components';
import { BsClockHistory } from 'react-icons/bs';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { SlCalender } from 'react-icons/sl';

const defaultTropdownClassNames = {
  buttonClassName: `torus-pressed:animate-torusButtonActive 
  `,
  popoverClassName:
    'torus-entering:animate-torusPopOverOpen torus-exiting:animate-torusPopOverClose w-40',
  dialogClassName: 'outline-none w-full',
  listBoxClassName:
    'w-full bg-slate-200 border-2 border-gray-300 transition-all p-1 rounded-md gap-1 flex flex-col items-center',
  listBoxItemClassName:
    'p-1 w-full torus-focus:outline-none torus-hover:bg-blue-300 rounded-md cursor-pointer transition-colors duration-300',
};

const TorusCalendar = (props) => {
  return (
    <Calendar aria-label="Appointment date " className="w-[100%]">
      <header className="flex w-[100%] justify-center">
        <div className="flex w-[100%] justify-between gap-2">
          <Button
            slot="previous"
            className={
              'rounded-md bg-[#F4F5FA] p-[3px] torus-focus:border-transparent torus-pressed:border-transparent'
            }
          >
            <IoChevronBack size={15} color="#64748B" />
          </Button>
          <Heading className="text-center font-semibold" />
          <Button
            slot="next"
            className={
              'rounded-md bg-[#F4F5FA] p-[3px] torus-focus:border-transparent torus-pressed:border-transparent'
            }
          >
            <IoChevronForward size={15} color="#64748B" />
          </Button>
        </div>
      </header>

      <div className="mt-2 grid grid-cols-9 justify-between">
        <div className="  col-span-3 flex items-center justify-center ">
          <div className=" flex items-center justify-center whitespace-nowrap rounded-sm bg-[#F4F5FA] px-2 py-1 text-xs">
            3 months Ago
          </div>
        </div>
        <div className="  col-span-3 flex items-center justify-center ">
          <div className=" flex items-center justify-center whitespace-nowrap rounded-sm bg-[#F4F5FA] px-2 py-1 text-xs">
            6 months Ago
          </div>
        </div>
        <div className="  col-span-3 flex items-center justify-center ">
          <div className=" flex items-center justify-center whitespace-nowrap rounded-sm bg-[#F4F5FA] px-2 py-1 text-xs">
            1 year Ago
          </div>
        </div>
      </div>

      <hr className="mt-4" />

      <div className="mt-4 flex items-center justify-center">
        <CalendarGrid className="react-aria-CalendarGridHeader:font-thin">
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell
                className="text-sm font-light"
                children={day}
              />
            )}
          </CalendarGridHeader>
          <CalendarGridBody className="w-full">
            {(date) => (
              <CalendarCell
                className={`flex h-9 w-9 items-center  justify-center border-transparent p-2 
                  text-base
                  font-normal 
                  transition-all
              duration-300
               ease-in-out  
               data-[outside-visible-range]:text-[#D0D5DD]
             torus-hover:bg-blue-400 torus-focus:border-transparent torus-focus:bg-[#0736C4] torus-focus:text-white 
            torus-pressed:border-transparent torus-pressed:bg-blue-500
             `}
                style={{
                  borderRadius: '10%',
                }}
                date={date}
              />
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </Calendar>
  );
};

const TorusDateField = (props) => {
  return (
    <DateInput
      className="flex w-full justify-around gap-[1%] text-[0.62vw] font-normal  torus-focus:outline-none  torus-focus:ring-1 torus-focus:ring-[#000000]/50
"
      slot={props.slot}
    >
      {(segment) => (
        <DateSegment
          className="torus-focus-within:border-transparent torus-focus:border-transparent torus-pressed:border-transparent"
          segment={segment}
        />
      )}
    </DateInput>
  );
};
export function TorusDatePicker({
  label,
  slot,
  openBtn,
  setValues,
  defaultValue,
  className,
}) {
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
    <DatePicker
      className={className}
      onChange={setValues}
      defaultValue={defaultValue}
    >
      <div className="flex h-full w-[100%] justify-start overflow-hidden">
        <div
          className="flex h-full w-full flex-col items-center
 justify-between gap-[1%] rounded-lg bg-white  "
        >
          <div className="flex h-1/2 w-full justify-start">
            <Label className="text-start text-[0.62vw] text-[#000000]/50">
              {label}
            </Label>
          </div>

          <Group className="flex h-1/2 w-full justify-between ">
            <div className="h-full w-[80%] border">
              <TorusDateField slot={slot} />
            </div>
            <div className="flex h-full w-[20%] justify-end">
              {openBtn && (
                <Button
                  className="flex h-full w-full items-center justify-center rounded-md bg-transparent p-[3px] text-black torus-focus:outline-none"
                  onClick={togglePopover}
                >
                  <SlCalender
                    size={'100%'}
                    color="black"
                    className={`bg-gray-200 transition-all duration-150 
                    ease-in-out torus-focus:border-transparent
                    torus-focus:bg-blue-700 torus-focus:text-white torus-pressed:border-transparent
                 `}
                  />
                </Button>
              )}
            </div>
          </Group>
        </div>
      </div>

      {isPopoverOpen && openBtn && (
        <Popover className="flex w-[20%] flex-col items-center justify-center rounded-md bg-[#FFFFFF] px-3 py-5 shadow-xl">
          <TorusCalendar />

          <div className="mt-4 flex w-[80%] justify-center">
            <div className="flex w-[100%] justify-center">
              <div className="flex w-[50%] items-center justify-center">
                <button className="flex w-[100%] items-center justify-center rounded-md bg-transparent p-[3px] font-semibold">
                  {' '}
                  Cancel
                </button>
              </div>

              <div className="flex w-[50%] items-center justify-center">
                <button className="flex w-[100%] items-center justify-center rounded-md bg-blue-600 p-[3px] text-white">
                  Save
                </button>
              </div>
            </div>
          </div>
        </Popover>
      )}
    </DatePicker>
  );
}

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

const TorusTimeField = ({ slot, openBtn, label }) => {
  return (
    <TimeField>
      <div className="flex w-full flex-col items-start justify-start">
        <DateInput className="flex w-full justify-around gap-2 px-[0.5rem] py-1">
          {(segment) => (
            <div className="flex w-full justify-around gap-2 px-[0.5rem] py-1">
              <DateSegment
                className={
                  "data-[type='dayPeriod']:rounded-md data-[type='hour']:rounded-md data-[type='minute']:rounded-md data-[type='dayPeriod']:data-[focused]:border-none data-[type='hour']:data-[focused]:border-transparent  data-[type='minute']:data-[focused]:border-transparent  data-[type='dayPeriod']:data-[focused]:bg-blue-500 data-[type='hour']:data-[focused]:bg-blue-500 data-[type='minute']:data-[focused]:bg-blue-500 data-[type='dayPeriod']:px-2 data-[type='dayPeriod']:py-1  data-[type='hour']:px-2  data-[type='hour']:py-1 data-[type='minute']:px-2 data-[type='minute']:py-1 data-[type='dayPeriod']:data-[focused]:text-white data-[type='hour']:data-[focused]:text-white  data-[type='minute']:data-[focused]:text-white  "
                }
                segment={segment}
              />
            </div>
          )}
        </DateInput>
      </div>
    </TimeField>
  );
};

const TorusTimePicker = ({ label }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    hour: '06',
    minute: '28',
    second: '55',
    period: 'PM',
  });

  const [visibleHours, setVisibleHours] = useState(8);
  const [visibleMinutes, setVisibleMinutes] = useState(8);
  const [visibleSeconds, setVisibleSeconds] = useState(8);

  const togglePopover = () => {
    setIsPopoverOpen((prevIsPopoverOpen) => !prevIsPopoverOpen);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const handleTimeSelect = (type, value) => {
    setSelectedTime((prev) => ({ ...prev, [type]: value }));
  };

  const handleScroll = (e, type) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      if (type === 'hour') setVisibleHours((prev) => Math.min(prev + 3, 12));
      else if (type === 'minute')
        setVisibleMinutes((prev) => Math.min(prev + 3, 60));
      else if (type === 'second')
        setVisibleSeconds((prev) => Math.min(prev + 3, 60));
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0'),
  );
  const seconds = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0'),
  );
  const meridiem = ['AM', 'PM'];

  useEffect(() => {
    if (isPopoverOpen) {
      const hoursContainer = document.getElementById('hoursContainer');
      const minutesContainer = document.getElementById('minutesContainer');
      const secondsContainer = document.getElementById('secondsContainer');

      if (hoursContainer) {
        const selectedIndex = hours.indexOf(selectedTime.hour);
        const centerPosition = selectedIndex * 36;
        hoursContainer.scrollTop =
          centerPosition - hoursContainer.clientHeight / 2 + 18;
      }
      if (minutesContainer) {
        const selectedIndex = minutes.indexOf(selectedTime.minute);
        const centerPosition = selectedIndex * 36;
        minutesContainer.scrollTop =
          centerPosition - minutesContainer.clientHeight / 2 + 18;
      }
      if (secondsContainer) {
        const selectedIndex = seconds.indexOf(selectedTime.second);
        const centerPosition = selectedIndex * 36;
        secondsContainer.scrollTop =
          centerPosition - secondsContainer.clientHeight / 2 + 18;
      }
    }
  }, [isPopoverOpen, selectedTime, hours, minutes, seconds]);

  return (
    <div className="flex flex-col items-start">
      <label className="mb-2">{label}</label>
      <div className="relative">
        <button
          className="flex w-full items-center justify-center rounded border bg-blue-600 p-2 text-white"
          onClick={togglePopover}
        >
          <BsClockHistory size={18} />
        </button>
        {isPopoverOpen && (
          <div className="absolute z-10 mt-2 w-80 rounded border bg-white shadow-lg">
            <div className="p-4">
              <p className="mb-4 text-center font-semibold">Select Time</p>
              <div className="grid grid-cols-4 gap-2">
                <div
                  className="h-40 overflow-y-scroll scrollbar-hide"
                  id="hoursContainer"
                  onScroll={(e) => handleScroll(e, 'hour')}
                >
                  {hours.slice(0, visibleHours).map((hr) => (
                    <div
                      key={hr}
                      className={`cursor-pointer py-1 text-center ${
                        hr === selectedTime.hour ? 'bg-blue-200' : ''
                      }`}
                      onClick={() => handleTimeSelect('hour', hr)}
                    >
                      {hr}
                    </div>
                  ))}
                </div>
                <div class="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 transform border border-blue-600"></div>
                <div class="pointer-events-none absolute left-0 right-0 top-1/3 -translate-y-1/2 transform border border-blue-600"></div>
                <div
                  className="relative h-40 overflow-y-scroll scrollbar-hide"
                  id="minutesContainer"
                  onScroll={(e) => handleScroll(e, 'minute')}
                >
                  {minutes.slice(0, visibleMinutes).map((min) => (
                    <div
                      key={min}
                      className={`cursor-pointer py-1 text-center ${
                        min === selectedTime.minute ? 'bg-blue-200' : ''
                      }`}
                      onClick={() => handleTimeSelect('minute', min)}
                    >
                      {min}
                    </div>
                  ))}
                </div>

                <div
                  className="relative h-40 overflow-y-scroll scrollbar-hide"
                  id="secondsContainer"
                  onScroll={(e) => handleScroll(e, 'second')}
                >
                  {seconds.slice(0, visibleSeconds).map((sec) => (
                    <div
                      key={sec}
                      className={`cursor-pointer py-1 text-center ${
                        sec === selectedTime.second ? 'bg-blue-200' : ''
                      }`}
                      onClick={() => handleTimeSelect('second', sec)}
                    >
                      {sec}
                    </div>
                  ))}
                </div>

                <div className="h-40 overflow-y-scroll scrollbar-hide">
                  {meridiem.map((md) => (
                    <div
                      key={md}
                      className={`cursor-pointer py-1 text-center ${
                        md === selectedTime.period ? 'bg-blue-200' : ''
                      }`}
                      onClick={() => handleTimeSelect('period', md)}
                    >
                      {md}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                  onClick={closePopover}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TorusTimePicker;
