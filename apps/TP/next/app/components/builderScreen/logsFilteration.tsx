import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogTrigger, Input, Popover } from 'react-aria-components'
import CalenderPage from './calender'
import { CalenderIcon, Checked, FilterIcon, Multiply, SearchIcon, UnChecked } from '../../constants/svgApplications'
import { useSelector } from 'react-redux'
import { RootState } from '../../../lib/Store/store'
import { sortingConditions } from '../../constants/MenuItemTree'
import FilterItems from '../filterItems'
import { AxiosService } from '../../../lib/utils/axiosService'
import TorusAvatar from '../Avatar'
import DropDown from '../multiDropdownnew'

interface filterationProps {
    closeModal: () => void,
    range: { start: string | null; end: string | null },
    setRange: React.Dispatch<React.SetStateAction<{ start: string | null; end: string | null }>>,
    fabrics: Set<string>,
    setFabrics: React.Dispatch<React.SetStateAction<Set<string>>>,
    users: Set<string>,
    setUsers: React.Dispatch<React.SetStateAction<Set<string>>>,
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>
    logsAppGrp: any[],
    handleLogsAppGrp: (e: any) => void
    appGrpList: string[]
    logsApp: any[]
    setLogsApp: React.Dispatch<React.SetStateAction<any[]>>
    appList: string[]
    selectAppGroup: string
}

const logsFilteration = ({
    closeModal,
    range,
    setRange,
    fabrics,
    setFabrics,
    users,
    setUsers,
    setRefetch,
    logsAppGrp,
    handleLogsAppGrp,
    appGrpList,
    logsApp,
    setLogsApp,
    appList,
    selectAppGroup
}: filterationProps) => {
    const torusTheme = useSelector((state: RootState) => state.main.testTheme)
    const accentColor = useSelector((state: RootState) => state.main.accentColor)
    const fontSize = useSelector((state: RootState) => state.main.fontSize)
    const [selectedSortButton, setSelectedSortButton] = useState<sortingConditions>("Newest");
    const locale = useSelector((state: RootState) => state.main.locale);
    const [userList, setUserList] = useState<any[]>([]);
    const tenant = useSelector((state: RootState) => state.main.tenant);
    const [userSearchInput, setUserSearchInput] = useState<string>("")

    const sortbutton: sortingConditions[] = [
        "Newest",
        "Oldest",
        "Recently Modified",
        "Recently Created",
    ]

    const fabricList = [
        { key: "DF", label: locale["Data Fabric"] },
        { key: "UF", label: locale["UI Fabric"] },
        { key: "PF", label: locale["Process Fabric"] },
    ];

    const fetchUserList = async () => {
        try {
            const response = await AxiosService.get(
                `/api/getUserList?client=${tenant}`
            );
            if (response.status == 200 && Array.isArray(response.data)) {
                setUserList(response.data);
            }
        } catch (error) {
            console.error("Error fetching user list", error);
        }
    };

    const handleUserSelection = (user: any) => {
        const selectedUserData = structuredClone(users)
        if (selectedUserData.has(user.loginId)) {
            selectedUserData.delete(user.loginId)
        } else {
            selectedUserData.add(user.loginId)
        }
        setUsers(selectedUserData)
    }

    const saveFilterationChanges = () => {
        setRefetch(prev => !prev)
        closeModal()
    }
    function formatDate(dateString: string | null) {
        if (dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
            const day = String(date.getDate()).padStart(2, "0");
            return `${day}-${month}-${year}`;
        } else {
            return undefined;
        }
    }

    useEffect(() => {
        fetchUserList();
    }, []);

    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex w-full items-center justify-between px-[0.58vw] py-[1.24vh]'>
                <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.04}vw` }} className='flex gap-[0.58vw] leading-[2.22vh] font-medium'>
                    <FilterIcon fill={torusTheme["text"]} />
                    Filter
                </h1>
                <Button className={"outline-none border-none"} onPress={closeModal}>
                    <Multiply width='0.72vw' height='0.72vw' fill={torusTheme["text"]} />
                </Button>
            </div>

            <hr style={{ borderColor: torusTheme["border"] }} className='w-full h-[0.64vh]' />

            <div className='flex flex-col gap-[1.24vh] px-[0.58vw] py-[1.24vh]'>
                <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }} className='leading-[2.22vh] font-medium'>Sort BY</h1>
                <div className="flex gap-[0.58vw] flex-wrap text-nowrap">
                    {sortbutton.map((item) => (
                        <Button
                            onPress={() => setSelectedSortButton(item)}
                            key={item}
                            style={{ backgroundColor: selectedSortButton == item ? accentColor : torusTheme["bg"], borderColor: torusTheme["border"], color: selectedSortButton == item ? "white" : torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }}
                            className={`flex outline-none px-[0.29vw] py-[0.62vh] leading-[2.22vh] border rounded-md`}
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            </div>

            <div className='flex flex-col gap-[1.24vh] px-[0.58vw] py-[1.24vh]'>
                <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }} className='leading-[2.22vh] font-medium'>SORT BY DATE</h1>
                <DialogTrigger>
                    <Button
                        style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.69}vw` }}
                        className={`flex flex-col w-[11.82vw] leading-[2.22vh] border rounded-md px-[0.8vw] py-[0.62vh] cursor-pointer outline-none`}
                    >
                        Select Date
                        <span style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }} className='flex gap-[0.58vw] items-center leading-[2.22vh]'>
                            {range.start ? `${formatDate(range.start)}- ${formatDate(range.end)}` : "dd/mm/yyyy - dd/mm/yyyy"}
                            <CalenderIcon fill={torusTheme["text"]} />
                        </span>
                    </Button>

                    <Popover className="flex ml-[20vw] mt-[8vh] w-[30.93vw] h-[37.59vh] items-center justify-center" placement="bottom">
                        <Dialog className="flex focus:outline-none rounded-md">
                            {({ close }) => (
                                <CalenderPage close={close} actualrange={range} setActualRange={setRange} />
                            )}
                        </Dialog>
                    </Popover>
                </DialogTrigger>
            </div>

            <div className='flex flex-col px-[0.58vw] py-[1.24vh]'>
                <FilterItems
                    items={fabricList}
                    title='Fabrics'
                    selectedKeys={fabrics}
                    setSelectedKeys={setFabrics}
                    classNames={{
                        container: "flex flex-col gap-[0.58vh]",
                        listbox: "flex flex-col gap-[0.58vh]",
                    }}
                    isSearchNeeded={false}
                />
            </div>

            <div className='flex flex-col px-[0.58vw] py-[1.24vh]'>
                <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }} className='leading-[2.22vh] font-medium'>SORT BY APPS</h1>
                <div className="flex gap-[0.58vw]">
                    <DropDown
                        triggerButton={locale["App Group"]}
                        selectedKeys={logsAppGrp}
                        multiple
                        setSelectedKeys={handleLogsAppGrp}
                        items={appGrpList}
                        classNames={{
                            triggerButton: `text-nowrap w-48 ${tenant
                                ? `min-w-48 pressed:animate-torusButtonActive rounded-lg leading-[2.22vh] mt-[0.58vw]`
                                : `backdrop-blur-3xl min-w-48 rounded-lg mt-[0.58vw]`
                                }`,
                            popover: `w-40 ${appGrpList.length > 4 ? "h-[20%]" : ""} overflow-y-auto`,
                            listboxItem: "flex leading-[2.22vh] justify-between",
                        }}
                        displaySelectedKeys={logsAppGrp?.length > 1 ? false : true}
                        styles={{
                            triggerButton: {
                                fontSize: `${fontSize * 0.83}vw`,
                                backgroundColor: torusTheme["bgCard"],
                                color: torusTheme["text"],
                            },
                            listbox: {
                                backgroundColor: torusTheme["bg"],
                                color: torusTheme["text"],
                                borderColor: torusTheme["border"],
                            },
                            listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                        }}
                    />

                    <DropDown
                        triggerButton={locale["App"]}
                        selectedKeys={logsApp}
                        setSelectedKeys={setLogsApp}
                        items={appList}
                        multiple
                        classNames={{
                            triggerButton: `text-nowrap w-40 ${selectAppGroup
                                ? `min-w-40 pressed:animate-torusButtonActive rounded-lg leading-[2.22vh] mt-[0.58vw]`
                                : `backdrop-blur-3xl min-w-40 rounded-lg mt-[0.58vw]`
                                }`,
                            popover: `w-40 ${appList.length > 4 ? "h-[20%]" : ""} overflow-y-auto`,
                            listboxItem: `flex leading-[2.22vh] justify-between`,
                        }}
                        displaySelectedKeys={logsApp?.length > 1 ? false : true}
                        styles={{
                            triggerButton: {
                                fontSize: `${fontSize * 0.83}vw`,
                                backgroundColor: torusTheme["bgCard"],
                                color: torusTheme["text"],
                            },
                            listbox: {
                                backgroundColor: torusTheme["bg"],
                                color: torusTheme["text"],
                                borderColor: torusTheme["border"],
                            },
                            listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                        }}
                    />
                </div>
            </div>

            <div className='flex flex-col gap-[1.24vh] px-[0.58vw] py-[1.24vh]'>
                <div className='flex justify-between items-center'>
                    <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.62}vw` }} className='leading-[2.22vh] font-medium'>USERS</h1>
                    <Button
                        className={`outline-none leading-[2.22vh] font-medium`}
                        style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.52}vw` }}
                    >
                        Clear All
                    </Button>
                </div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center px-[0.58vw] py-[1.24vh] h-[1.85vw] w-[2.18vw]">
                        <SearchIcon
                            fill={torusTheme["text"]}
                            height="0.83vw"
                            width="0.83vw"
                        />
                    </span>
                    <Input
                        type="text"
                        placeholder="Search"
                        value={userSearchInput}
                        onChange={(e) => setUserSearchInput(e.target.value)}
                        style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                        className="flex w-[29.11vw] pl-[2vw] px-[0.29vw] py-[0.62vh] leading-[1.25vw] focus:outline-none rounded"
                    />
                </div>

                {userList
                    .filter((user) => user?.loginId?.toLowerCase().includes(userSearchInput.toLowerCase()) ||
                        user?.email?.toLowerCase().includes(userSearchInput.toLowerCase())).slice(0, 3)
                    .map((user) => (
                        <div key={user.loginId} onClick={() => handleUserSelection(user)} className="flex gap-[0.58vw] items-center ml-[0.3vw]">
                            {users.has(user.loginId) ? <Checked fill={accentColor} /> : <UnChecked />}
                            <div className="flex">
                                <TorusAvatar borderColor={torusTheme["border"]} color={torusTheme["text"]} radius="full" size="md" />
                            </div>
                            <div className='flex flex-col gap-[0.4vh]'>
                                <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }} className='leading-[1.85vh] font-medium'>{user.loginId}</h1>
                                <h6 style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.62}vw` }} className='leading-[1.85vh] font-normal'>{user.email}</h6>
                            </div>
                        </div>
                    ))}
            </div>
            <hr style={{ borderColor: torusTheme["border"] }} className='w-full' />

            <div className="flex gap-[0.58vw] justify-end py-[1.87vh] pr-[0.58vw]">
                <button style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.78}vw` }} onClick={() => closeModal()} className="leading-[1.82vh] px-[1.17vw] py-[1.24vh] rounded-lg">
                    Cancel
                </button>
                <button onClick={saveFilterationChanges} style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.78}vw` }} className="text-white leading-[1.82vh] px-[1.46vw] py-[1.24vh] rounded-lg">
                    Save
                </button>
            </div>
        </div>
    )
}

export default logsFilteration
