import React, { useEffect, useState } from 'react';
import { Input } from 'react-aria-components';
import { Domain, Global, Globe, Lock, Member, Multiply, Privacy, Threecircles } from '../../../constants/svgApplications';
import DropDown from '../../multiDropdownnew';
import TorusAvatar from "../../Avatar";
import { VscCheck } from "react-icons/vsc";
import { Button } from 'react-aria-components';
import { AxiosService } from '../../../../lib/utils/axiosService';
import { getCookie } from '../../../../lib/utils/cookiemgmt';
import { toast } from 'react-toastify';
import TorusToast from '../../torusComponents/torusToast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../lib/Store/store';
import { hexWithOpacity } from '../../../../lib/utils/utility';

const people = [
    { name: 'Balaji Eswar', email: 'balaji@torus.tech', role: 'FullAccess' },
    { name: 'Susan Andrews', email: 'susan@torus.tech', role: 'can View' },
    { name: 'James Williams', email: 'james@torus.tech', role: 'can View' },
    { name: 'Robert Francisco', email: 'robert@torus.tech', role: 'can Edit' },
];

const client = getCookie("tp_cc")

const accessOptions = [
    {
        id: 1,
        title: 'Privacy',
        description: 'Only users you choose can access',
        icon: Lock,
    },
    {
        id: 2,
        title: 'Public',
        description: 'Anyone with the link can access',
        icon: Globe,
    },
];

const userOptions = [
    {
        id: 1,
        title: 'Your Team',
        description: 'Only members of your team can access',
        icon: Member,
    },
    {
        id: 2,
        title: 'Anyone from Domain(s)',
        description: 'Only Users with your email domain can access',
        icon: Domain,
    },
];

const ArtifactSharingModal = ({ close, artifactDetails }: any) => {
    const [Share, setShare] = React.useState(true);
    const [Private, setPrivate] = React.useState(false);
    const [isSelected, setIsSelected] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectOption, setSelectOption] = useState(null)
    const [inputValue, setInputValue] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [popoverContent, setPopoverContent] = useState<{ loginId: any; email: any; }[]>([]);
    const [searchTerm, setSearchTerm] = useState([])
    const [userList, setUserList] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const { artifactType, fabric, catalog, artifactGrp, artifactName, version, createdBy, sharingInfo } = artifactDetails;
    const [selectedPermission, setSelectedPermission] = useState<string>("can view");
    const [wordLength, setWordLength] = useState(0);
    const [selectedKeys, setSelectedKeys] = useState(sharingInfo ? sharingInfo?.map((person: any) => (person?.accessType)) : null);
    const [sharingInfoList, setSharingInfoList] = useState(sharingInfo ? sharingInfo : null);
    const [usersSelectedOption, setUsersSelectedOption] = useState(null);
    const [linkAccessSelectedOption, setLinkAccessSelectedOption] = useState(null);
    const accentColor = useSelector((state: RootState) => state.main.accentColor);
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);

    // Function to handle when a new key is selected
    const handleSelectedKeys = (newKey: any, index: number) => {
        handleShare(newKey, sharingInfoList[index].sharedTo);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosService.get(`/api/getUserList?client=${getCookie("tp_cc")}&type=c`);
                setUserList(response.data);
            } catch (error) {
                console.error("Error fetching user list", error);
            }
        };
        fetchData();
    }, []);

    const handleShare = async (accessType: string = "Can View", user?: any) => {
        try {
            const response = await AxiosService.post("/api/shareArtifact", {
                loginId: getCookie("tp_lid"),
                functionGroup: "AF",
                fabric,
                catalog,
                artifactGrp,
                artifactName,
                version,
                shareTo: user ? user : selectedUser,
                accessType,
                client
            })
            if (response.status == 201) {
                setSharingInfoList(response.data)
                if (!user) toast(
                    <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                    {
                        type: "success",
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        title: "Success",
                        text: `Artifact shared successfully`,
                        closeButton: false,
                    } as any
                )
                // close();
            } else {
                toast(
                    <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                    {
                        type: "error",
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        title: "Error",
                        text: `Something went wrong`,
                        closeButton: false,
                    } as any
                )
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.error ? error?.response?.data?.errorDetails :
                    "Error Occured While Sharing Artifact";
            toast(
                <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                {
                    type: "error",
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    title: "Error",
                    text: `${message}`,
                    closeButton: false,
                } as any
            )
        }
    }

    const handleshare = () => {
        setShare(true);
        setPrivate(false);
    };

    const handlepriv = () => {
        setPrivate(true);
        setShare(false);
    };

    const handleToggle = (id: any) => {
        setIsSelected(isSelected === id ? null : id);
        setSelectedOption(id);
        setSelectOption(id)
    };

    const handleInputChange = (event: any) => {
        const value = event.target.value;
        if (!value) {
            setIsPopoverOpen(false)
        }
        else {
            setIsPopoverOpen(true)
        }
        setInputValue(value);
        setSearchTerm(event.target.value)
        if (value) {
            const filteredData = userList.filter(item =>
                item.loginId.toLowerCase().includes(value.toLowerCase()) ||
                item.email.toLowerCase().includes(value.toLowerCase())
            );
            const content = filteredData.map(item => ({ loginId: item.loginId, email: item.email }));
            setPopoverContent(content);
        } else {
            setPopoverContent([]);
        }
    };

    const handleselectUser = (user: any) => {
        setSelectedUser(user)
        setIsPopoverOpen(false)
    }

    const handleLinkAccessToggle = (id: any) => {
        setLinkAccessSelectedOption((prevSelected) => (prevSelected === id ? null : id));
    };

    const handleUsersToggle = (id: any) => {
        setUsersSelectedOption((prevSelected) => (prevSelected === id ? null : id));
    };

    return (
        <div style={{ backgroundColor: torusTheme["bg"] }} className='w-[37.25vw] rounded p-[0.2vw]'>
            {/* <div className="flex justify-between w-full p-2"> */}
            <div className="flex ml-[0.86vw] gap-[1.46vw] p-[0.58vw] items-center ">
                <Button
                    style={{ color: Share ? torusTheme["text"] : hexWithOpacity(torusTheme["text"], 0.35), fontSize: `${fontSize * 0.93}vw` }}
                    className={`flex outline-none gap-[0.87vw] font-semibold  leading-[1.25vw] items-center`}
                    onPress={handleshare}>
                    <Threecircles fill={`${Share ? torusTheme["text"] : hexWithOpacity(torusTheme["text"], 0.35)}`} />
                    Share
                </Button>

                <Button
                    style={{ color: Private ? torusTheme["text"] : hexWithOpacity(torusTheme["text"], 0.35), fontSize: `${fontSize * 0.93}vw` }}
                    className={`flex outline-none gap-[0.58vw]  leading-[1.25vw] items-center`}
                    onPress={handlepriv}>
                    <Privacy fill={`${Private ? torusTheme["text"] : hexWithOpacity(torusTheme["text"], 0.35)}`} />
                    Privacy
                </Button>

                <Button className='outline-none border-none ml-[20.12vw]' onPress={close}>
                    <Multiply fill={torusTheme["text"]} width='0.72vw' height='0.72vw' />
                </Button>
            </div>
            {/* </div> */}

            <hr style={{ borderColor: torusTheme["borderLine"] }} className='w-[100%] mt-[0.58vw]' />

            {Share && (
                <div>
                    <div className="mt-[1.17vw] mx-[0.87vw] ">
                        <label style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className=" font-semibold leading-[1.25vw] mb-[0.87vw] block">Share with people and teams</label>
                        <div className="relative">
                            <div className='flex justify-between gap-[0.29vw]'>
                                {selectedUser ?
                                    <div
                                        style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
                                        className='flex w-full justify-between px-[0.87vw] items-center  leading-[1.25vw] rounded-md'
                                    >
                                        <span>
                                            {selectedUser.loginId}
                                        </span>
                                        <span className='cursor-pointer' onClick={() => { setSelectedUser(null) }}>
                                            <Multiply fill={torusTheme["text"]} width='0.72vw' height='0.72vw' />
                                        </span>
                                    </div> :
                                    <Input
                                        type="text"
                                        placeholder="Enter people,teams or email address"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                                        className="flex w-[28.11vw] p-[0.58vw]  leading-[1.25vw] focus:outline-none rounded"
                                    />}
                                <Button
                                    isDisabled={selectedUser ? false : true}
                                    onPress={() => { handleShare() }}
                                    style={{ backgroundColor: `${accentColor}`, fontSize: `${fontSize * 0.83}vw` }}
                                    className="p-[0.58vw] px-[2vw] self-end text-[#FFFFFF]  leading-[1.25vw] rounded-md"
                                >
                                    Share
                                </Button>

                            </div>
                            {isPopoverOpen && (
                                <div style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"] }} className="absolute mt-[0.58vw] left-0 border w-[380px] rounded-md p-[0.58vw] max-h-40 overflow-auto">
                                    <div className="flex flex-col">
                                        {popoverContent.length > 0 ? (
                                            popoverContent.map((item: any) => (
                                                <div key={item.email} className={`flex p-[0.58vw] hover:bg-[${torusTheme["border"]}]`} onClick={() => handleselectUser(item)}>
                                                    <div className="flex">
                                                        <TorusAvatar borderColor={torusTheme["border"]} color={torusTheme["text"]} radius="full" size="lg" />
                                                    </div>
                                                    <div className="flex flex-col ml-[0.58vw]">
                                                        <p style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.02}vw` }} className=" font-medium">{item.loginId}</p>
                                                        <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 1.02}vw` }} className="">{item.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.02}vw` }} className="">No results found</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr style={{ borderColor: torusTheme["borderLine"] }} className='w-[100%] mt-[0.58vw]' />

                    <div className="mt-[0.29vw] mx-[0.14vw]">
                        <h3 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className="font-semibold  leading-[1.25vw] mx-[0.87vw]">People with Access</h3>
                        <div className="mt-[0.58vw] mx-[0.21vw]">
                            <div className="flex justify-between items-center">
                                <div className='flex gap-[0.87vw] items-center'>
                                    <TorusAvatar borderColor={torusTheme["border"]} color={torusTheme["text"]} radius="full" size="w-[1.7vw] h-[1.7vw]" />
                                    <div className='flex flex-col mb-[0.58vw]'>
                                        <p style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }} className=" leading-[1.85vh] font-medium mt-[0.48vw]">{createdBy}</p>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.62}vw` }} className='border rounded-lg p-[0.43vw] px-[2.5vw]  mt-[0.58vw] leading-[1.25vw]'>Owner
                                </div>
                            </div>
                            {sharingInfoList ? sharingInfoList.map((person: any, i: any) => (
                                <div key={person?.sharedTo?.email} className="flex justify-between items-center py-[0.29vw]">
                                    <div className='flex gap-[0.58vw] items-center'>
                                        <TorusAvatar borderColor={torusTheme["border"]} color={torusTheme["text"]} radius="full" size="w-[1.7vw] h-[1.7vw]" />
                                        <div className='flex flex-col'>
                                            <p style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }} className="leading-[1.85vh] font-medium">{person?.sharedTo?.loginId}</p>
                                            <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.62}vw` }} className="leading-[1.85vh]">{person?.sharedTo?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <DropDown
                                            triggerButton=""
                                            selectedKeys={person?.accessType}
                                            setSelectedKeys={(e) => handleSelectedKeys(e, i)}
                                            items={["Full Access", "Can View", "Can Edit"]}
                                            classNames={{
                                                triggerButton:
                                                    `w-[7vw] h-[2.5vw] flex items-center justify-center gap-[0.58vw] whitespace-nowrap rounded-lg  leading-[1.25vw]  mt-[0.58vw]`,
                                                popover: `w-40 `,
                                                listbox: `overflow-y-auto border-[${torusTheme["border"]}]`,
                                                listboxItem: "flex  leading-[1.25vw] justify-between",
                                            }}
                                            styles={{
                                                triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.62}vw` },
                                                popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
                                                listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                                                listbox: { borderColor: torusTheme["border"] },
                                            }}
                                            arrowFill={torusTheme["text"]}
                                        />
                                    </div>
                                </div>
                            )) : <></>}
                        </div>
                    </div>
                </div>
            )}
            {Private && (
                <div className='w-full'>
                    <div className="p-[0.86vw] h-[51.2vh]">
                        <h3 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className="font-semibold  leading-[1.25vw]">Link Access</h3>
                        {accessOptions.map((option) => (
                            <div
                                key={option.id}
                                style={{ backgroundColor: torusTheme["bgCard"] }}
                                className={`flex gap-[0.87vw] rounded-md py-[0.87vw] px-[0.87vw] mb-[0.87vw] items-center cursor-pointer ${linkAccessSelectedOption === option.id ? '' : ''}`}
                                onClick={() => handleLinkAccessToggle(option.id)}
                            >
                                <span className="flex items-center ">
                                    <span style={{ backgroundColor: torusTheme["bg"] }} className='p-[0.29vw] flex items-center justify-center rounded-full'><option.icon fill={torusTheme["text"]} /></span>
                                </span>
                                <div style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.85}vw` }} className="flex flex-col font-medium  leading-[1.06vw] ">
                                    {option.title}
                                    <div style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.62}vw` }} className=' leading-[1.25vw]'>{option.description}</div>
                                </div>

                                <div className="ml-auto cursor-pointer">
                                    <span
                                        style={{ backgroundColor: linkAccessSelectedOption === option.id ? accentColor : "", borderColor: linkAccessSelectedOption === option.id ? "" : torusTheme["border"] }}
                                        className={`p-[0.29vw] flex items-center justify-center rounded-full border`}
                                    >
                                        {linkAccessSelectedOption === option.id && (
                                            <VscCheck className="text-white w-[0.62vw] h-[1.11vh]" />
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <hr style={{ borderColor: torusTheme["borderLine"] }} className="w-full mt-[0.58vw]" />

                        <h3 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className="font-semibold  mt-[0.64vh] leading-[1.25vw]">Users</h3>
                        {userOptions.map((option) => (
                            <div
                                key={option.id}
                                style={{ backgroundColor: torusTheme["bgCard"] }}
                                className={`flex gap-[0.87vw] rounded-md py-[0.87vw] px-[0.87vw] mb-[0.87vw] items-center cursor-pointer ${usersSelectedOption === option.id ? '' : ''}`}
                                onClick={() => handleUsersToggle(option.id)}
                            >
                                <span className="flex items-center">
                                    <span style={{ backgroundColor: torusTheme["bg"] }} className='p-[0.29vw] flex items-center justify-center rounded-full'><option.icon /></span>
                                </span>
                                <div style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.85}vw` }} className="flex flex-col  font-medium leading-[1.06vw]">
                                    {option.title}
                                    <div style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.62}vw` }} className=' leading-[1.25vw]'>{option.description}</div>
                                </div>
                                <div className="ml-auto cursor-pointer">
                                    <span
                                        style={{ backgroundColor: usersSelectedOption === option.id ? accentColor : "", borderColor: usersSelectedOption === option.id ? "" : torusTheme["border"] }}
                                        className={`p-[0.29vw] flex items-center justify-center rounded-full border`}
                                    >
                                        {usersSelectedOption === option.id && (
                                            <VscCheck className="text-white w-[0.62vw] h-[1.11vh]" />
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <hr style={{ borderColor: torusTheme["borderLine"] }} className="w-full mt-[0.58vw]" />
            {Share && (
                <div style={{ backgroundColor: torusTheme["bgCard"] }} className="flex items-center w-full rounded-b-md p-[0.29vw]">
                    <div className='ml-[0.58vw]'>
                        <Global fill={torusTheme["text"]} />
                    </div>
                    <div style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }} className="flex-1 flex items-center p-[0.58vw] leading-[1.25vw]">
                        <span style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.83}vw` }} className="whitespace-normal  linear-[1.25vw]">Anyone with the link</span>
                        <DropDown
                            triggerButton={selectedPermission}
                            selectedKeys={selectedPermission}
                            setSelectedKeys={setSelectedPermission}
                            items={["can View", "can Edit"]}
                            classNames={{
                                triggerButton: `w-35 gap-[0.29vw]  leading-[1.25vw] font-semibold `,
                                popover: `w-23 z-50`,
                                listbox: `overflow-y-auto`,
                                listboxItem: "flex leading-[1.25vw] justify-between",
                            }}
                            styles={{
                                triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.83}vw` },
                                popover: { color: torusTheme["text"], backgroundColor: torusTheme["bg"], fontSize: `${fontSize * 0.83}vw` },
                                listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                                listbox: { borderColor: torusTheme["border"] },
                            }}
                            arrowFill={torusTheme["text"]}
                        />
                    </div>
                    <Button style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.83}vw` }} className="p-[0.29vw] px-[1.46vw]  text-white leading-[1.25vw] rounded-md">
                        Copy Link
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ArtifactSharingModal;

