import React from 'react'
import { Button, Dialog, Modal, ModalOverlay } from 'react-aria-components'
import { Multiply } from '../constants/svgApplications'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '../../lib/Store/store'
import { twMerge } from 'tailwind-merge'

const ImagePreviewModal = ({ isOpen, selectedFile, setIsOpen, handleUploads, setSelectedFile, handlechange }:
    {
        isOpen: string | null,
        selectedFile?: File | null,
        setIsOpen: React.Dispatch<React.SetStateAction<string | null>>
        handleUploads: (file: any, fileName: string) => void
        setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
        handlechange: () => void
    }) => {
    const torusTheme = useSelector((state: RootState) => state.main.testTheme)
    const fontSize = useSelector((state: RootState) => state.main.fontSize)
    const locale = useSelector((state: RootState) => state.main.locale)
    const accentColor = useSelector((state: RootState) => state.main.accentColor)

    return (
        <ModalOverlay isOpen={isOpen ? true : false} isDismissable
            className={twMerge(
                "fixed z-[100] top-0 left-0 w-screen h-screen bg-transparent/45 flex items-center justify-center outline-none"
            )}>
            <Modal isDismissable className={"outline-none w-[35vw] h-[30vh]"}>
                <Dialog className='outline-none border rounded-lg' style={{ backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"] }}>
                    <div className='flex flex-col gap-[1.24vh]'>
                        <div className='flex items-center justify-between py-[1.86vh]'>
                            <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.17}vw` }} className='leading-[2.22vh] font-semibold ml-[13vw]'>Upload Image</h1>
                            <Button onPress={() => setIsOpen(null)} className={"outline-none pr-[0.87vw]"}>
                                <Multiply fill={torusTheme["text"]} width='0.82vw' height='0.82vw' />
                            </Button>
                        </div>
                        <div className='flex items-center justify-center'>
                            {selectedFile &&
                                <Image
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Preview"
                                    className={`${isOpen == "coverimg" ? "h-[20vh] w-[30vw]" : "w-[8.1vw] h-[8.1vw] rounded-full"} object-cover`}
                                    width={100}
                                    height={100}
                                />
                            }
                        </div>
                        <div className="flex self-end gap-[0.58vw] py-[0.87vw]">
                            <Button
                                onPress={handlechange}
                                className="outline-none text-white leading-[1vw] px-[0.3vw] py-[1.24vh] rounded"
                                style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.72}vw` }}
                            >
                                {locale["Change Image"]}
                            </Button>
                            <Button
                                onPress={() => {
                                    handleUploads(selectedFile, isOpen as string);
                                    setIsOpen(null);
                                    setSelectedFile(null)
                                }}
                                className="outline-none text-white leading-[1vw] px-[0.26vw] py-[1.24vh] rounded mr-[0.58vw]"
                                style={{ fontSize: `${fontSize * 0.72}vw`, backgroundColor: accentColor }}
                            >
                                {locale["Confirm Upload"]}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    )
}

export default ImagePreviewModal
