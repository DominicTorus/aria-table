import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/Store/store';
import { GreaterthanArrow, LessthenArrow } from '../../constants/svgApplications';

const CalenderPage = ({ close, actualrange, setActualRange }: { close: () => void, actualrange: { start: string | null; end: string | null }, setActualRange: React.Dispatch<React.SetStateAction<{ start: string | null; end: string | null }>> }) => {
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const accentColor = useSelector((state: RootState) => state.main.accentColor);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [range, setRange] = useState<{ start: string | null; end: string | null }>(actualrange);
    const [isHover, setIsHover] = useState(false);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const week = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const formatDate = (day: number, month: number, year: number) =>
        new Date(year, month, day).toISOString().split('T')[0];

    const handleDateClick = (day: number, month: number) => {
        const year = currentDate.getFullYear();
        const selectedDate = new Date(year, month, day);

        if (selectedDate > new Date()) {
            return;
        }
        if (!range.start || (range.start && range.end)) {
            setRange({ start: selectedDate.toISOString().split('T')[0], end: null });
        } else {
            setRange({ start: range.start, end: selectedDate.toISOString().split('T')[0] });
        }
    };

    const isInRange = (day: number, month: number) => {
        if (!range.start || !range.end) return false;

        const year = currentDate.getFullYear();
        const date = formatDate(day, month, year);

        return new Date(date) >= new Date(range.start) && new Date(date) <= new Date(range.end);
    };

    const renderDays = (month: number) => {
        const year = currentDate.getFullYear();
        const firstDay = firstDayOfMonth(month, year);
        const totalDays = daysInMonth(month, year);
        const today = new Date().toISOString().split('T')[0];

        let daysArray = [];
        for (let i = 0; i < firstDay; i++) {
            daysArray.push(<div key={`empty-${month}-${i}`}></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const isSelected = isInRange(day, month);
            const isFutureDate = new Date(year, month, day) > new Date();
            const dateClass = isFutureDate ? 'cursor-default' : 'cursor-pointer';

            daysArray.push(
                <div
                    key={`day-${month}-${day}`}
                    style={{ fontSize: `${fontSize * 0.83}vw`, backgroundColor: isSelected ? accentColor : isHover ? torusTheme['border'] : "", color: isFutureDate ? torusTheme["textOpacity/50"] : torusTheme["text"] }}
                    className={`leading-[2.22vh] rounded-lg px-[0.29vw] py-[0.62vh] hover:bg-red-400 ${dateClass}`}
                    onClick={() => !isFutureDate && handleDateClick(day, month)}
                >
                    {day}
                </div>
            );
        }

        return daysArray;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const shiftMonths = (months: number) => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - months)));
    };

    const getMonthYearString = (offset: number) => {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() + offset);
        return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };

    const handleSaveDateRange = () => {
        setActualRange(range);
        close();
    };

    return (
        <div style={{ backgroundColor: torusTheme['bgCard'] }} className="w-full max-w-3xl shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-[0.62vh] px-[1.17vw] py-[2.49vh]">
                <button onClick={handlePrevMonth}>
                    <LessthenArrow />
                </button>
                <div className="flex gap-[9.37vw]">
                    <span style={{ color: torusTheme['text'], fontSize: `${fontSize * 0.83}vw` }} className="leading-[2.02vh] font-semibold">
                        {getMonthYearString(0)}
                    </span>
                    <span style={{ color: torusTheme['text'], fontSize: `${fontSize * 0.83}vw` }} className="leading-[2.02vh] font-semibold">
                        {getMonthYearString(1)}
                    </span>
                </div>
                <button onClick={handleNextMonth}>
                    <GreaterthanArrow />
                </button>
            </div>

            <div className="flex justify-around mb-[2.49vh]">
                <button style={{ color: torusTheme['textOpacity/50'], backgroundColor: torusTheme['bg'], fontSize: `${fontSize * 0.78}vw` }} onClick={() => shiftMonths(3)} className="leading-[1.82vh] px-[0.58vw] py-[0.62vh]">
                    3 months ago
                </button>
                <button style={{ color: torusTheme['textOpacity/50'], backgroundColor: torusTheme['bg'], fontSize: `${fontSize * 0.78}vw` }} onClick={() => shiftMonths(6)} className="leading-[1.82vh] px-[0.58vw] py-[0.62vh]">
                    6 months ago
                </button>
                <button style={{ color: torusTheme['textOpacity/50'], backgroundColor: torusTheme['bg'], fontSize: `${fontSize * 0.78}vw` }} onClick={() => shiftMonths(12)} className="leading-[1.82vh] px-[0.58vw] py-[0.62vh]">
                    1 year ago
                </button>
            </div>

            <hr style={{ borderColor: torusTheme['border'] }} className='w-[90%] ml-[1.46vw]' />

            <div className="flex gap-[1.75vw] px-[1.17vw] py-[2.49vh]">
                <div className="w-1/2">
                    <div className="grid grid-cols-7 gap-[1.24vh] text-center font-semibold">
                        {week.map((ele, index) => (
                            <div key={index} style={{ color: torusTheme['text'], fontSize: `${fontSize * 0.78}vw` }} className="leading-[1.90vh] font-[300]">
                                {ele}
                            </div>
                        ))}
                    </div>
                    <div style={{ color: torusTheme['text'] }} className="grid grid-cols-7 gap-[1.24vh] mt-[1.24vh]">{renderDays(currentDate.getMonth())}</div>
                </div>

                <div className="w-1/2">
                    <div className="grid grid-cols-7 gap-[1.24vh] text-center font-semibold">
                        {week.map((ele, index) => (
                            <div key={index} style={{ color: torusTheme['text'], fontSize: `${fontSize * 0.78}vw` }} className="leading-[1.90vh] font-[300]">
                                {ele}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-[1.24vh] mt-[1.24vh]">{renderDays(currentDate.getMonth() + 1)}</div>
                </div>
            </div>
            <hr style={{ borderColor: torusTheme['border'] }} className="w-full" />

            <div className="flex gap-[0.58vw] justify-end py-[1.87vh] pr-[0.29vw]">
                <button style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.78}vw`, }} onClick={close} className="leading-[1.82vh] px-[1.17vw] py-[1.24vh] rounded-lg">
                    Cancel
                </button>
                <button onClick={handleSaveDateRange} style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.78}vw`, }} className="text-white leading-[1.82vh] px-[1.46vw] py-[1.24vh] rounded-lg">
                    Save
                </button>
            </div>
        </div>
    );
};

export default CalenderPage;

