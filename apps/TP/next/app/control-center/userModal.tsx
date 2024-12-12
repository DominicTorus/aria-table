import React, { useState } from 'react'
import { CameraIcon, Multiply } from '../constants/svgApplications'
import { RootState } from '../../lib/Store/store'
import { useSelector } from 'react-redux'
import { Button, FileTrigger, Input } from 'react-aria-components'
import DropDown from '../components/multiDropdownnew'
import SwitchComponent from './switchcomponent'
import { AxiosService } from '../../lib/utils/axiosService'
import { getCookie } from '../../lib/utils/cookiemgmt'
import { toast } from 'react-toastify'
import TorusToast from '../components/torusComponents/torusToast'
import { capitalize } from '../../lib/utils/utility'
import Image from 'next/image'

const UserModal = ({ setIsModalOpen, newUser, accessProfiles, setNewUser, data, setData,isTenantUser=false }: any) => {
    const torusTheme = useSelector((state: RootState) => state.main.testTheme)
    const fontSize = useSelector((state: RootState) => state.main.fontSize)
    const locale = useSelector((state: RootState) => state.main.locale);
    const client = getCookie("tp_cc");
    const accentColor = useSelector((state: RootState) => state.main.accentColor);
    const tenantCode = useSelector((state: RootState) => state.main.tenant);
    const [wordLength, setWordLength] = useState(0);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const emailDomain = getCookie("tp_em") ? getCookie("tp_em").split("@")[1] : null;

    const userAdditionDetails = [
        {
            heading: "Profile Photo",
            subHeading: "Upload your profile image",
            formData: [{
                type: "file",
                name: "logo",
                label: "logo"
            }]
        },
        {
            heading: "Full Name*",
            subHeading: "Enter the full name of the user.",
            formData: [
                {
                    type: "text",
                    name: "firstName",
                    label: "First Name",
                },
                {
                    type: "text",
                    name: "lastName",
                    label: "Last Name",
                },
            ]
        },
        {
            heading: "Username*",
            subHeading: "Enter the username of the user.",
            formData: [{
                type: "text",
                name: "loginId",
                label: "Username"
            }]
        },
        {
            heading: "Email Address*",
            subHeading: "Enter the email address of the user.",
            formData: [
                {
                    type: "text",
                    name: "email",
                    label: "Email Address",
                },
                {
                    type: "text",
                    name: "domain",
                    label: "",
                    readOnly: true
                }
            ]
        },
        {
            heading: "Access Profile*",
            subHeading: "Select the access profile of the user.",
            formData: [{
                type: "dropdown",
                name: "accessProfile",
                label: "Select from the list"
            }]
        },
        {
            heading: "Validity Period*",
            subHeading: "Select the validity period of the user.",
            formData: [{
                type: "text",
                name: "accessExpires",
                label: "Select date"
            }]
        },
        {
            heading: "Enable User License",
            subHeading: "Toggle to grant this user access to the application",
            formData: [{
                type: "switch",
                name: "status",
                label: "status"
            }]
        }
    ]

    const handleInputChange = (e: any) => {
        setError("");
        const { name, value } = e.target;
        setNewUser((prev: any) => ({ ...prev, [name]: value, }));
    };

    const handleToast = (type: "success" | "error" | "warning", message: string) => {
        toast(
            <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
            {
                type: type,
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
                title: capitalize(type),
                text: `${message}`,
                closeButton: false,
            } as any
        );
    }

    const handleAddUser = async (filename: string) => {
        let user = { ...newUser }
        if (selectedFile) {
            const data = new FormData();
            data.append("file", selectedFile);
            data.append("bucketFolderame", "torus9x");
            data.append(
                "folderPath",
                `tp/clientAssets/${client}/${newUser.loginId}`
            );

            const res = await AxiosService.post("image/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    filename: selectedFile.name ? selectedFile.name.replace(/\.[^/.]+$/, "") : filename,
                },
            });
            if (res.status === 201) {
                const responseData = res.data.imageUrl;
                user = { ...user, [filename]: responseData };
            }
        }

        if (newUser.firstName === "" || newUser.lastName === "" || newUser.firstName && newUser.lastName == "") {
            handleToast("error", "Please provide valid name");
            return;
        } else if (newUser.loginId === "") {
            handleToast("error", "Please provide valid username");
            return;
        } else if (data.some((val: any) => val.loginId === newUser.loginId)) {
            handleToast("error", "userName already exists");
            return;
        } else if (newUser.email === "") {
            handleToast("error", "Please provide valid email");
            return;
        } else if (newUser.email === "" || newUser.email.includes("@")) {
            handleToast("error", "Please provide valid email in the selected domain");
            return;
        } else if (data.some((val: any) => val.email.split("@")[0] === newUser.email)) {
            handleToast("error", "Email already exists");
            return;
        } else {
            try {
                const res = await AxiosService.post("/api/client-user-addition", {
                    clientCode: isTenantUser ? tenantCode: client,
                    data: { ...user, email: `${newUser.email}@${emailDomain}`, password: `${newUser.loginId}@123`, status: newUser.status ? "active" : "inactive" },
                    isTenantUser: isTenantUser? true :undefined
                });
                if (res.status == 201) {
                    const result = res.data.map((item: any, i: number) => ({
                        users:
                            item.firstName && item.lastName
                                ? item.firstName + " " + item.lastName
                                : item.loginId
                                    ? item.loginId
                                    : "",
                        email: item.email,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        loginId: item.loginId,
                        mobile: item.mobile,
                        accessProfile: item?.accessProfile ?? [],
                        accessExpires: item?.accessExpires,
                        lastActive: item?.lastActive ?? "june30 2024 00:00:00",
                        dateAdded: item?.dateAdded ?? "may 05 2024",
                        status: item?.status ?? "",
                    }));
                    setData(result);

                    setError("");
                    setIsModalOpen(false);
                    setNewUser({
                        firstName: "",
                        lastName: "",
                        loginId: "",
                        email: "",
                        mobile: "",
                        password: "",
                        status: true,
                        accessProfile: [],
                        accessExpires: "",
                        dateAdded: new Date(),
                        profile: ""
                    });
                }
            } catch (error: any) {
                const message = error?.response?.data?.error
                    ? error?.response?.data?.errorDetails
                    : "Error Occured While Adding User";
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
                );
            }
        }
    };

    const handleCloseModal = () => {
        setError("");
        setIsModalOpen(false);
        setNewUser({
            firstName: "",
            lastName: "",
            loginId: "",
            email: "",
            mobile: "",
            password: "",
            status: true,
            accessProfile: [],
            accessExpires: "",
            dateAdded: new Date(),
            profile: ""
        });
    }

    const handleFileSelect = (file: FileList, type: string) => {
        if (file.length > 0 && type == "profile") {
            setSelectedFile(file[0]);
        }
    }

    return (
        <div className='w-full h-full'>
            <div className='flex justify-between px-[0.87vw] py-[1.87vh]'>
                <h1
                    style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.04}vw` }}
                    className='font-medium leading-[2.22vh]'
                >
                    Add User
                </h1>
                <Button onPress={() => setIsModalOpen(false)} className="outline-none cursor-pointer">
                    <Multiply width='0.62vw' height='0.62vw' fill={torusTheme["text"]} />
                </Button>
            </div>

            <hr style={{ borderColor: torusTheme["borderLine"] }} className='w-full' />

            <div className='flex flex-col gap-[2.18vh] pl-[1.46vw] py-[1.87vh]'>
                {userAdditionDetails.map(
                    ({ heading, subHeading, formData }, index) => (
                        <div key={index} className='flex gap-[0.58vw]'>
                            <div className='flex flex-col gap-[0.62vh] w-[21vw]'>
                                <h1 style={{ fontSize: `${fontSize * 0.72}vw`, color: torusTheme["text"] }} className='font-semibold leading-[1.85vh]'>{heading}</h1>
                                <p style={{ fontSize: `${fontSize * 0.72}vw`, color: torusTheme["textOpacity/50"] }} className='leading-[1.85vh]'>{subHeading}</p>
                            </div>
                            {formData.map(({ type, name, label, readOnly }) => (
                                <div key={name}>
                                    {type == "file" && (
                                        <FileTrigger
                                            acceptedFileTypes={["image/png", "image/jpeg", "image/x-icon"]}
                                            onSelect={(e) => e && handleFileSelect(e, "profile")}
                                        >
                                            <Button
                                                id="previewImagebtnprofileforacc"
                                                className={"outline-none flex cursor-pointer items-center justify-center rounded-full w-[8.1vw] h-[8.1vw]"}
                                            >
                                                {selectedFile ? (
                                                    <Image
                                                        src={URL.createObjectURL(selectedFile)}
                                                        alt={"preview"}
                                                        className="w-[8.1vw] h-[8.1vw] rounded-full object-cover"
                                                        width={100}
                                                        height={100}
                                                    />
                                                ) : (
                                                    <span className="flex cursor-pointer items-center justify-center w-[8.1vw] h-[8.1vw] rounded-full"
                                                        style={{ backgroundColor: torusTheme["bgCard"] }}>
                                                        <CameraIcon fill={torusTheme["text"]} />
                                                    </span>
                                                )}
                                            </Button>
                                        </FileTrigger>
                                    )}
                                    {type == "text" && (
                                        <Input
                                            type={name == "accessExpires" ? "date" : "text"}
                                            placeholder={label}
                                            autoComplete="off"
                                            readOnly={readOnly}
                                            name={name}
                                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` }}
                                            className={`outline-none ${name == "accessExpires" || name == "loginId" ? "w-[20.88vw]" : "w-[10.18vw]"} px-[0.58vw] rounded-lg py-[1.24vh] leading-[2.22vh]`}
                                            onChange={handleInputChange}
                                            min={name === "accessExpires" ? new Date().toISOString().split("T")[0] : undefined}
                                            value={readOnly ? `@${emailDomain}` : newUser[name]}
                                        />
                                    )}
                                    {type == "dropdown" && (
                                        <DropDown
                                            multiple
                                            triggerButton={label}
                                            selectedKeys={newUser[name] ?? []}
                                            setSelectedKeys={(selectedKey) =>
                                                handleInputChange({
                                                    target: {
                                                        name: "accessProfile",
                                                        value: selectedKey,
                                                    },
                                                })
                                            }
                                            displaySelectedKeys={true}
                                            items={accessProfiles}
                                            classNames={{
                                                triggerButton: `w-[20.88vw] h-full rounded-md leading-[1.04vh] font-medium`,
                                                popover: `w-[9.42vw]`,
                                                listbox: `overflow-y-auto`,
                                                listboxItem: `flex leading-[2.22vh] justify-between`,
                                            }}
                                            styles={{
                                                triggerButton: { backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], borderColor: torusTheme["border"], fontSize: `${fontSize * 0.83}vw` },
                                                popover: { backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] },
                                                listbox: { borderColor: torusTheme["border"] },
                                                listboxItem: { fontSize: `${fontSize * 0.83}vw` },
                                            }}
                                            arrowFill={torusTheme["text"]}
                                        />
                                    )}
                                    {type == "switch" && (
                                        <SwitchComponent
                                            isSelected={newUser[name]}
                                            onChange={() => handleInputChange({ target: { name: name, value: !newUser[name] } })}
                                            localAccentColor={accentColor}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))
                }
            </div>

            <hr style={{ borderColor: torusTheme["borderLine"] }} className='w-full' />

            <div className="flex gap-[0.29vw] w-full justify-end px-[0.58vw] py-[1.24vh]">
                <Button onPress={handleCloseModal} style={{ fontSize: `${fontSize * 0.83}vw`, backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] }} className={`outline-none leading-[2.22vh] px-[1.17vw] py-[1.24vh] rounded-md`}>
                    Cancel
                </Button>
                <Button
                    onPress={() => handleAddUser("profile")}
                    style={{ fontSize: `${fontSize * 0.83}vw`, backgroundColor: accentColor }}
                    className={`outline-none leading-[2.22vh] text-white px-[1.46vw] py-[1.24vh] rounded-md`}
                >
                    Save
                </Button>
            </div>
        </div>
    )
}

export default UserModal