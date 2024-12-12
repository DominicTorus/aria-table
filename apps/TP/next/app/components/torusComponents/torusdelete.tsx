"use client"
import React, { useState } from 'react';
import TorusDialog from '../torusComponents/torusdialogmodal';
import { Button } from 'react-aria-components';
import { DeleteIcon, Multiply } from '../../constants/svgApplications';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/Store/store';
import { getCookie } from '../../../lib/utils/cookiemgmt';
import { text } from 'stream/consumers';

type ModalProps = {

    open?: boolean;
    title: string;
    message: string;
    status: string;
    cancelLabel: string;
    deleteLabel: string;
    onCancel: () => void;
    onDelete: () => void;
    icon?: React.ReactNode;
    triggerButton: React.ReactNode
    isDisabled?: boolean
    localTheme?: string
};

const DynamicModal = ({
    open = false,
    title,
    message,
    status,
    cancelLabel,
    deleteLabel,
    onCancel,
    onDelete,
    icon,
    triggerButton,
    isDisabled = false,
    localTheme
}: ModalProps) => {
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);


    return (
        <TorusDialog
            triggerElement={
                <Button isDisabled={isDisabled} className="outline-none flex items-center gap-[0.29vw] text-[0.69vw] leading-[2.22vh] rounded-md py-[0.1vw] cursor-pointer"
                    style={{ color: torusTheme["text"] }}>
                    {triggerButton}
                </Button>
            }
            classNames={{
                modalClassName: "flex items-center",
                dialogClassName: `w-[29.17vw] h-[28.90vh] bg-white rounded-lg outline-none`,

            }}
            styles={{ backgroundColor: torusTheme["bg"] }}
        >
            {({ close }: any) => (
                <div className="flex flex-col w-full h-full gap-[0.6vw]">
                    <div className="flex items-center justify-between mt-1 px-[0.87vw] py-[0.58vw]">
                        <div className='flex gap-[0.29vw] '>
                            <DeleteIcon fill='#F14336' width='1vw' height='1vw' />
                            <h2
                                className="text-[1vw] leading-[1.25vw] text-[#F14336] font-medium "
                            >
                                {title}
                            </h2>
                        </div>

                        <div className='flex cursor-pointer' onClick={close}>
                            <Multiply fill={torusTheme["text"]} width='0.83vw' height='0.83vw' />
                        </div>
                    </div>
                    <hr className="border-t-[1px] w-full"
                        style={{ borderColor: torusTheme["borderLine"] }} />
                    <div className="text-[1vw] leading-[1vw] font-medium px-[0.87vw]"
                        style={{ color: torusTheme["text"] }}>
                        {message}
                    </div>

                    <div className="text-[1.04vw] leading-[1.25vw]  text-[#000000]/50  break-words whitespace-normal px-[0.87vw] "
                        style={{ color: torusTheme["textOpacity/50"] }}>
                        {status}
                    </div>
                    <hr className="border-t-[1px] w-full mt-[0.55vw] "
                        style={{ borderColor: torusTheme["borderLine"] }} />
                    <div className="flex gap-[0.58vw] px-[0.58vw] py-[0.58vw] justify-end  ">
                        <Button className="text-[0.85vw] w-[6.19vw] h-[4.07vh] rounded-md "
                            style={{ backgroundColor: torusTheme["bg"], color: torusTheme["text"] }}
                            onPress={() => {
                                onCancel()
                                close()
                            }}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            className="bg-[#F14336] text-white text-[0.83vw]  leading-[1.25vw] w-[6.19vw] h-[4.07vh] rounded-md"
                            onPress={() => {
                                onDelete();
                                close();
                            }}
                        >
                            {deleteLabel}
                        </Button>
                    </div>
                </div>
            )}
        </TorusDialog>
    );
};
export default DynamicModal;


