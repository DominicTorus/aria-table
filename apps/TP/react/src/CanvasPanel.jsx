/* eslint-disable */
import React, { useContext, useMemo } from 'react';
import { Panel, useReactFlow, useViewport } from 'reactflow';
import { TorusModellerContext } from './Layout';
import {
  Fitview,
  FullScreen,
  Help,
  Redo,
  Undo,
  ZoomIn,
  ZoomOut,
} from './SVG_Application';
import TorusButton from './torusComponents/TorusButton';

export default function CanvasPanel({ undo, redo, canUndo, canRedo }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercentage = useMemo(() => Math.round(zoom * 50), [zoom]);
  const { selectedTheme } = useContext(TorusModellerContext);

  const handleZoom = (type) => {
    if (type === 'In') {
      zoomIn();
    }
    if (type === 'Out') {
      zoomOut();
    }
  };

  const handleFullScreen = () => {
    const elem = document.documentElement;
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch((err) => {
          console.error(
            'Error attempting to enable full-screen mode:',
            err.message,
          );
        });
      } else {
        document.exitFullscreen();
      }
    } else {
      console.error('Fullscreen mode is not supported');
    }
  };

  return (
    <Panel
      position="bottom-right"
      className="flex h-[5%] w-[19%] justify-end bg-transparent "
    >
      <div className="flex  h-full  w-[100%] items-center justify-between rounded-lg">
        <div
          className="flex h-full w-[22%]  items-center justify-center rounded-[0.52vw] border "
          style={{
            backgroundColor: `${selectedTheme?.bg}`,
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          <TorusButton
            Children={
              <Undo
                className={'h-[1.24vw] w-[1.24vw]'}
                stroke={`${selectedTheme?.text}80`}
              />
            }
            key={'undo'}
            size={'xs'}
            radius={'lg'}
            color={'#ffffff'}
            gap={'py-[0.2rem] px-[0.2rem]'}
            height={'md'}
            borderColor={'3px solid #0736C4'}
            fontStyle={'text-sm font-medium text-[#FFFFFF]'}
            buttonClassName={`${!canUndo ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            isIconOnly={true}
            onPress={() => !canUndo && undo()}
          />

          <TorusButton
            Children={
              <Redo
                className={'h-[1.24vw] w-[1.24vw]'}
                stroke={`${selectedTheme?.text}80`}
              />
            }
            key={'redo'}
            size={'xs'}
            radius={'lg'}
            color={'#ffffff'}
            gap={'py-[0.2rem] px-[0.2rem]'}
            height={'md'}
            borderColor={'3px solid #0736C4'}
            fontStyle={'text-sm font-medium text-[#FFFFFF]'}
            buttonClassName={` ${!canRedo ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            isIconOnly={true}
            onPress={() => !canRedo && redo()}
          />
        </div>
        <div
          className="h-full w-[74%] items-center  rounded-[0.52vw]  border "
          style={{
            backgroundColor: `${selectedTheme?.bg}`,
            borderColor: `${selectedTheme?.border}`,
          }}
        >
          <div className="grid h-full w-full grid-cols-6 items-center justify-between gap-1">
            <TorusButton
              Children={
                <FullScreen
                  className={'h-[1.24vw] w-[1.24vw]'}
                  stroke={`${selectedTheme?.text}80`}
                />
              }
              size={'xs'}
              radius={'lg'}
              color={'#ffffff'}
              gap={'py-[0.2rem] px-[0.2rem]'}
              height={'md'}
              borderColor={'3px solid #0736C4'}
              fontStyle={'text-sm font-medium text-[#FFFFFF]'}
              isIconOnly={true}
              onPress={handleFullScreen}
              buttonClassName={'cursor-pointer flex items-center justify-center'}
            />

            {/* <TorusButton
              isIconOnly={true}
              key={'FullScreen'}
              Children={
                <div className="flex  h-[1.25vw]  w-[1.25vw] items-center justify-center   p-1">
                  <FullScreen
                    className={'h-[1.24vw] w-[1.24vw]'}
                    stroke={`${selectedTheme?.text}80`}
                  />
                </div>
              }
              onPress={handleFullScreen}
            /> */}
            <TorusButton
              Children={
                <Fitview
                  className={' h-[1.24vw] w-[1.24vw]'}
                  stroke={`${selectedTheme?.text}80`}
                />
              }
              size={'xs'}
              radius={'lg'}
              color={'#ffffff'}
              gap={'py-[0.2rem] px-[0.2rem]'}
              height={'md'}
              borderColor={'3px solid #0736C4'}
              fontStyle={'text-sm font-medium text-[#FFFFFF]'}
              isIconOnly={true}
              onPress={fitView}
              buttonClassName={'cursor-pointer flex items-center justify-center'}

            />
            {/* <TorusButton
              isIconOnly={true}
              key={'fitView'}
              Children={
                <div className="flex  h-[1.25vw]  w-[1.25vw] items-center justify-center   p-1">
                  <Fitview
                    className={' h-[1.24vw] w-[1.24vw]'}
                    stroke={`${selectedTheme?.text}80`}
                  />
                </div>
              }
              onPress={fitView}
            /> */}
            <TorusButton
              Children={
                <ZoomOut
                  className={'h-[1.24vw] w-[1.24vw]'}
                  stroke={`${selectedTheme?.text}80`}
                />
              }
              key={'zoomOut'}
              size={'xs'}
              radius={'lg'}
              color={'#ffffff'}
              gap={'py-[0.2rem] px-[0.2rem]'}
              height={'md'}
              borderColor={'3px solid #0736C4'}
              fontStyle={'text-sm font-medium text-[#FFFFFF]'}
              isIconOnly={true}
              onPress={() => handleZoom('Out')}
              buttonClassName={'cursor-pointer flex items-center justify-center'}

            />
            {/* <TorusButton
              isIconOnly={true}
              key={'zoomOut'}
              Children={
                <div className="flex  h-[1.25vw]  w-[1.25vw] items-center justify-center   p-1">
                  <ZoomOut
                    className={'h-[1.24vw] w-[1.24vw]'}
                    stroke={`${selectedTheme?.text}80`}
                  />
                </div>
              }
              onPress={() => handleZoom('Out')}
            /> */}
            <span
              className="font-inter flex items-center   justify-center p-1 text-[1.04vw] font-bold"
              style={{ color: `${selectedTheme?.text}80` }}
            >
              {Number(zoomPercentage)}%
            </span>

            <TorusButton
              Children={
                <ZoomIn
                  className={'h-[1.24vw] w-[1.24vw]'}
                  stroke={`${selectedTheme?.text}80`}
                />
              }
              key={'zoomIn'}
              size={'xs'}
              radius={'lg'}
              color={'#ffffff'}
              gap={'py-[0.2rem] px-[0.2rem]'}
              height={'md'}
              borderColor={'3px solid #0736C4'}
              fontStyle={'text-sm font-medium text-[#FFFFFF]'}
              isIconOnly={true}
              onPress={() => handleZoom('In')}
              buttonClassName={'cursor-pointer flex items-center justify-center'}

            />
            {/* <TorusButton
              isIconOnly={true}
              key={'zoomIn'}
              Children={
                <div className="flex  h-[1.25vw]   w-[1.25vw] items-center justify-center p-1">
                  <ZoomIn
                    className={'h-[1.24vw] w-[1.24vw]'}
                    stroke={`${selectedTheme?.text}80`}
                  />
                </div>
              }
              onPress={() => handleZoom('In')}
            /> */}

            <TorusButton
              Children={
                <Help
                    className={'h-[1.24vw] w-[1.24vw]'}
                    stroke={`${selectedTheme?.text}80`}
                  />
              }
              key={'zoomIn'}
              size={'xs'}
              radius={'lg'}
              color={'#ffffff'}
              gap={'py-[0.2rem] px-[0.2rem]'}
              height={'md'}
              borderColor={'3px solid #0736C4'}
              fontStyle={'text-sm font-medium text-[#FFFFFF]'}
              isIconOnly={true}
              onPress={() => alert('help')}
              buttonClassName={'cursor-pointer flex items-center justify-center'}

            />

            {/* <TorusButton
              isIconOnly={true}
              key={'help'}
              Children={
                <div className="flex  h-[1.25vw]   w-[1.25vw] items-center justify-center p-1">
                  <Help
                    className={'h-[1.24vw] w-[1.24vw]'}
                    stroke={`${selectedTheme?.text}80`}
                  />
                </div>
              }
              onPress={() => alert('help')}
            /> */}
          </div>
        </div>
      </div>
    </Panel>
  );
}
