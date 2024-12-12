import React, { useContext } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { OrchestratorContext } from '../App';

export const DragDropGallery = ({
  handleDragOver,
  handleDrop,

  setShowLogicCenter,
}) => {
  const {
    source,
    target,
    sourceDraggable,
    targetDraggable,
    setSourceIndex,
    setTargetIndex,
  } = useContext(OrchestratorContext);

  return (
    <div className=" h-[95%] w-1/3 rounded-lg border border-slate-300 bg-white   dark:border-[#212121] dark:bg-[#161616]">
      <div className="flex min-h-[6.8%] w-full cursor-pointer items-center justify-center border-b text-sm font-semibold">
        Mapping
      </div>
      <div className="my-4 flex h-[80%] justify-center overflow-y-scroll">
        <div className="w-[60%]">
          <div className="flex w-[100%] flex-col items-center gap-4">
            {source &&
              source.length > 0 &&
              source.map((item, index) => {
                return (
                  <div className="flex w-[80%] justify-between">
                    <div
                      key={index}
                      className="flex h-[30px] w-[70%] items-center justify-center rounded-lg border bg-[#F4F5FA]  text-xs  dark:border-[#575656]  dark:bg-[#161616]"
                      onDragOver={(e) => {
                        sourceDraggable && handleDragOver(e);
                        setSourceIndex(index);
                      }}
                      onDrop={handleDrop}
                    >
                      {item !== ' ' ? item.value : 'Drop Source...'}
                    </div>
                    <div
                      className="flex w-[17%] items-center justify-center"
                      // onClick={() => setShowCodeiumEditor(true)}
                    >
                      <FaArrowRightLong color="#0736C4" size={12} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="w-[40%]">
          <div className="flex w-[100%] flex-col items-start gap-5">
            {target &&
              target.length > 0 &&
              target.map((item, index) => {
                return (
                  <div className="flex w-[85%] justify-start rounded-lg border bg-[#F4F5FA] dark:border-[#575656] dark:bg-[#161616]">
                    <div
                      className="flex h-[30px] w-full items-center justify-center text-xs"
                      key={item.id}
                      onDragOver={(e) => {
                        targetDraggable && handleDragOver(e);
                        setTargetIndex(index);
                      }}
                      onDrop={handleDrop}
                    >
                      {item !== ' ' ? item.value : 'Drop Target...'}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div
        className="flex w-full cursor-pointer justify-center"
        onClick={() => setShowLogicCenter(true)}
      >
        <span className=" rounded bg-[#0736c4] px-2 py-1 text-xs text-white dark:bg-[#0F0F0F]">
          {' '}
          Logic center{' '}
        </span>
      </div>
    </div>
  );
};
