import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'
import { Button, Input, Label, ListBoxItem } from 'react-aria-components'
import { ClosePassword, DownArrow, Gitbutton, Googlebutton } from '../../constants/svgApplications'
import { PiEye } from "react-icons/pi";
import DropDown from '../multiDropdownnew';
import { countryList } from '../../constants/MenuItemTree';
import { IoIosCheckmark } from 'react-icons/io';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/Store/store';
import { AxiosService } from '../../../lib/utils/axiosService';
import TorusToast from '../torusComponents/torusToast';
import { toast } from 'react-toastify';
import { hexWithOpacity } from '../../../lib/utils/utility';

const RegistrationForm = ({ individualRegister, teamRegister }: any) => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState(
        { clientName: "", firstName: "", lastName: "", username: "", email: "", mobileNumber: "", password: "", confirmPassword: "" }
    );
    const [otpInputShow, setOtpInputShow] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countryList[0])
    const [wordLength, setWordLength] = useState(0);
    const [notEditable, setNotEditable] = useState(false);
    const [show, setShow] = useState(false);
    const accentColor = useSelector((state: RootState) => state.main.accentColor);
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);
    const [error, setError] = useState({ clientName: "", firstName: "", lastName: "", username: "", email: "", mobileNumber: "", password: "", confirmPassword: "" });

    const clientRegister = async () => {
        const { clientName, firstName, lastName, email, username, mobileNumber, password, confirmPassword } = formData
        try {
            if (!password || !confirmPassword || !firstName || !lastName || !email || !username || !mobileNumber) {
                toast(
                    <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                    {
                        type: "error",
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        title: "Error",
                        text: `Please fill all the fields`,
                        closeButton: false,
                    } as any
                )
                return
            } else if (teamRegister && !clientName) {
                toast(
                    <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                    {
                        type: "error",
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        title: "Error",
                        text: `Please fill all the fields`,
                        closeButton: false,
                    } as any
                )
            } else if (password !== confirmPassword) {
                toast(
                    <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                    {
                        type: "error",
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        title: "Error",
                        text: `Passwords do not match`,
                        closeButton: false,
                    } as any
                )
                return
            } else if (error.clientName || error.firstName || error.lastName || error.email || error.username || error.mobileNumber || error.password || error.confirmPassword) {
                toast(
                    <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                    {
                        type: "error",
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        title: "Error",
                        text: `Please fill all the fields Correctly`,
                        closeButton: false,
                    } as any
                )
                return
            }
            const res = await AxiosService.post(`/api/auth-clientRegister`, {
                clientName: teamRegister ? clientName : undefined,
                firstName: firstName,
                lastName: lastName,
                email: email,
                userName: username,
                mobile: mobileNumber,
                password: password,
                team: teamRegister ? true : false
            })
            if (res.status == 201) {
                toast(
                    <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                    {
                        type: "success",
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        title: "Success",
                        text: `Client registration successful`,
                        closeButton: false,
                    } as any
                );
                router.push("/login")
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.error ? error?.response?.data?.errorDetails :
                    "Error Occured While Registering Client";
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

    const passwordVisible = () => {
        setShowPassword(!showPassword)
    }

    const confirmPasswordVisible = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "firstName":
                setFormData((prev) => ({ ...prev, [name]: value.replace(/[0-9]+/g, "") }));
                break;
            case "lastName":
                setFormData((prev) => ({ ...prev, [name]: value.replace(/[0-9]+/g, "") }));
                break;
            case "mobileNumber":
                setFormData((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
                break;
            default:
                setFormData((prev) => ({ ...prev, [name]: value }));
                break;
        }
        setError((prev) => ({ ...prev, [name]: "" }));
    };

    const handleVerifyCode = async () => {
        if ( formData.firstName && formData.lastName && formData.username && formData.mobileNumber && formData.email) {
            setNotEditable(true)
            try {
                if (error.email || error.mobileNumber || error.firstName || error.lastName) {
                    setNotEditable(false)
                    toast(
                        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                        {
                            type: "error",
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            title: "Error",
                            text: `Please fill all the fields correctly`,
                            closeButton: false,
                        } as any
                    );
                    return
                }
                const res = await AxiosService.post(`/api/auth-send-verification-otp`, {
                    email: formData.email,
                    team: teamRegister ? true : false
                })
                if (res.status == 201) {
                    setOtpInputShow(true)
                    toast(
                        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                        {
                            type: "success",
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            title: "Success",
                            text: `OTP sent successfully`,
                            closeButton: false,
                        } as any
                    );
                } else {
                    setNotEditable(false)
                    setOtpInputShow(false)
                    toast(
                        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                        {
                            type: "error",
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            title: "Error",
                            text: `OTP sending failed`,
                            closeButton: false,
                        } as any
                    );
                }
            } catch (error: any) {
                setNotEditable(false)
                setOtpInputShow(false)
                const message =
                    error?.response?.data?.error ? error?.response?.data?.errorDetails :
                        "Error Occured While Sending Otp";
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
    }

    const handleSelectCountry = (value: any) => {
        setSelectedCountry(value)
        setFormData((prev) => ({ ...prev, mobileNumber: "" }));
    }

    const renderOption = (item: any, close: () => void, handleSelectionChange: (selectedItem: any, close: () => void) => void, setOpen: (open: boolean) => void, selected: boolean | any) => (
        <ListBoxItem
            key={item.code}
            textValue={item.code}
            onAction={() => handleSelectionChange(item, close)}
            style={{ fontSize: `${fontSize * 0.8}vw` }}
            className={`p-1 cursor-pointer focus:outline-none flex justify-between`}
        >
            {`${item.country}(${item.code}) `}
            {selected ? (
                <IoIosCheckmark size={20} fill="blue" />
            ) : (
                ""
            )}
        </ListBoxItem>
    );

    const handleOtpChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setNotEditable(true)
        let otpValue = e.target.value.replace(/\D/g, '');
        e.target.value = otpValue;
        try {
            if (otpValue.length === 6) {
                const res = await AxiosService.post(`/api/auth-verify-otp`, {
                    email: formData.email,
                    otp: otpValue
                })
                if (res.status == 201) {
                    setOtpInputShow(false)
                    setShow(true)
                    toast(
                        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                        {
                            type: "success",
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            title: "Success",
                            text: `OTP verified successfully`,
                            closeButton: false,
                        } as any
                    );
                } else {
                    toast(
                        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
                        {
                            type: "error",
                            position: "bottom-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            title: "Error",
                            text: `OTP verification failed`,
                            closeButton: false,
                        } as any
                    );
                }
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.error ? error?.response?.data?.errorDetails :
                    "Error Verifying OTP";
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

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        switch (name) {
            case "clientName":
                if (value.length >= 4) {
                    value
                } else {
                    setError((prev) => ({ ...prev, clientName: "Please Enter Valid Company Name" }))
                }
                break;
            case "firstName":
                if (value.match(/^[a-zA-Z '-]+$/) && value.length >= 4) {
                    value
                } else {
                    setError((prev) => ({ ...prev, firstName: "Please Enter Valid Name" }))
                }
                break;
            case "lastName":
                if (value.match(/^[a-zA-Z]+$/)) {
                    value
                } else {
                    setError((prev) => ({ ...prev, lastName: "Please Enter Valid Name" }))
                }
                break;
            case "username":
                if (value.length >= 4 && value.length <= 10) {
                    value
                } else {
                    setError((prev) => ({ ...prev, username: "Please Enter Valid Username" }))
                    if (value.length > 10) {
                        setError((prev) => ({ ...prev, username: "Username should be less than 10 characters" }))
                    }
                }
                break;
            case "email":
                if (value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    value
                } else {
                    setError((prev) => ({ ...prev, email: "Please Enter Valid Email" }))
                }
                break;
            case "mobileNumber":
                if (selectedCountry.mobile_number_length == value.length) {
                    value
                } else {
                    setError((prev) => ({ ...prev, mobileNumber: "Please Enter Valid Mobile Number" }))
                }
                break;
            case "password":
                if (value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
                    value
                } else {
                    if (value.length == 0) {
                        setError((prev) => ({ ...prev, password: "Please Enter Valid Password" }))
                    } else if (!value.match(/^(?=.*[a-z])/)) {
                        setError((prev) => ({ ...prev, password: "Password should contain lowercase letters" }))
                    } else if (!value.match(/^(?=.*[A-Z])/)) {
                        setError((prev) => ({ ...prev, password: "Password should contain uppercase letters" }))
                    } else if (!value.match(/^(?=.*\d)/)) {
                        setError((prev) => ({ ...prev, password: "Password should contain numbers" }))
                    } else if (value.length < 8) {
                        setError((prev) => ({ ...prev, password: "Password must be atleast 8 characters" }))
                    }
                }
                break;
            case "confirmPassword":
                if (value === formData.password) {
                    value
                } else {
                    setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
                }
                break;
            default:
                break;
        }
    }

    return (
        <div className='flex flex-col gap-3 ml-16 h-[84.16vh] w-[25vw]'>
            <div className='flex flex-col gap-[0.29vw]'>
                {individualRegister ?
                    <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 2}vw` }} className='font-semibold leading-[4.48vh]'>Create an account</h1>
                    : teamRegister &&
                    <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 2}vw` }} className='font-semibold leading-[4.48vh]'>Create a new Workspace</h1>
                }
                <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.83}vw` }} className='leading-[2.31vh] font-medium'>Enter your details to create an account</p>
            </div>
            {teamRegister &&
                <div className='flex flex-col'>
                    <Label
                        htmlFor="Client Name"
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                        className="mb-[0.58vw] font-medium leading-[1.7vh]"
                    >
                        Company or Team
                    </Label>
                    <Input
                        id="clientName"
                        name='clientName'
                        value={formData.clientName}
                        type="text"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder='Company or Team Name'
                        style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                        className="w-[25vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md"
                    />
                    {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.clientName}</p>}
                </div>
            }
            <div className='flex flex-col gap-[1vw]'>
                <div className='flex gap-[1.17vw]'>
                    <div className='flex flex-col'>
                        <Label
                            htmlFor="First Name"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                            className="mb-[0.58vw] font-medium leading-[1.7vh]"
                        >
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            name='firstName'
                            value={formData.firstName}
                            type="text"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Enter your first name"
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                            className="w-[12vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md"
                        />
                        {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.firstName}</p>}
                    </div>
                    <div className='flex flex-col'>
                        <Label
                            htmlFor="Last Name"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                            className="mb-[0.58vw] font-medium leading-[1.7vh]"
                        >
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="Enter your last name"
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                            className="w-[12vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md"
                        />
                        {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.lastName}</p>}
                    </div>
                </div>
                <div className='flex gap-[1.17vw]'>
                    <div className='flex flex-col'>
                        <Label
                            htmlFor="Username"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                            className="mb-[0.58vw] font-medium leading-[1.7vh]"
                        >
                            Username
                        </Label>
                        <Input
                            readOnly={notEditable}
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="Enter a username"
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                            className="w-[12vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md"
                        />
                        {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.username}</p>}
                    </div>
                    <div className='flex flex-col'>
                        <Label
                            htmlFor="First Name"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                            className="mb-[0.58vw] font-medium leading-[1.7vh]"
                        >
                            Email Address
                        </Label>
                        <Input
                            readOnly={notEditable}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="Enter your email address"
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                            className="w-[12vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md"
                        />
                        {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.email}</p>}
                    </div>
                </div>
                <div className='relative flex flex-col'>
                    <Label
                        htmlFor="First Name"
                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                        className="mb-[0.58vw] font-medium leading-[1.7vh]"
                    >
                        Mobile Number
                    </Label>
                    <div style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"] }} className='flex items-center'>
                        <Input
                            type='text'
                            readOnly value={selectedCountry?.code}
                            style={{ fontSize: `${fontSize * 0.8}vw` }}
                            className={`outline-none bg-transparent w-[2vw] ml-[4vw]`}
                        />
                        <Input
                            readOnly={notEditable}
                            value={formData?.mobileNumber}
                            id="mobileNumber"
                            name="mobileNumber"
                            type='text'
                            maxLength={selectedCountry.mobile_number_length}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                            className="w-[13vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md"
                        />
                        <DropDown
                            triggerButton={<div className='flex items-center gap-2 ml-1'>{selectedCountry ? <Image src={selectedCountry["flag_image"]} alt="dvdf" className='w-[1.5vw]' width={16} height={16} /> : ""}
                                <DownArrow fill={torusTheme["text"]} /></div>}
                            selectedKeys={selectedCountry}
                            setSelectedKeys={handleSelectCountry}
                            items={countryList}
                            classNames={{
                                triggerButton:
                                    `w-[4vw] absolute font-medium leading-[1.7vh]`,
                                popover: `w-[8%] rounded-lg `,
                                listbox: "border-none outline-none",
                                listboxItem: "text-center",
                            }}
                            styles={{
                                triggerButton: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"], fontSize: `${fontSize * 0.8}vw` },
                                popover: { color: torusTheme["text"], backgroundColor: torusTheme["bgCard"] },
                                listboxItem: { fontSize: `${fontSize * 0.8}vw` }
                            }}
                            renderOption={renderOption}
                            displaySelectedKeys={false}
                        />
                        {otpInputShow ?
                            <div>
                                <Input
                                    type='text'
                                    style={{ color: torusTheme["text"], backgroundColor: torusTheme["bg"], fontSize: `${fontSize * 0.83}vw` }}
                                    placeholder="Enter OTP"
                                    className={"p-1 leading-[1.7vh] rounded-md w-[5vw] outline-none"}
                                    onChange={handleOtpChange}
                                    maxLength={6}
                                />
                            </div> :
                            <span
                                onClick={() => show ? null : handleVerifyCode()}
                                style={{ color: accentColor, fontSize: `${fontSize * 0.83}vw` }}
                                className={`absolute mb-[0.2vw] leading-[1.7vh] bottom-[0.8vw] right-[1.25vw] ${show ? "cursor-default" : "cursor-pointer"}`}
                            >{show ? "Code Verified" : "Verify Code"}
                            </span>
                        }
                    </div>
                </div>
                {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.mobileNumber}</p>}
                <div className='flex gap-[1.17vw]'>
                    <div className="flex flex-col">
                        <Label
                            htmlFor="Password"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                            className="mb-[0.58vw] font-medium leading-[1.7vh]"
                        >
                            Password
                        </Label>
                        <div style={{ backgroundColor: torusTheme["bgCard"] }} className='flex items-center w-[12vw] rounded'>
                            <Input
                                id="password"
                                disabled={!show}
                                value={formData.password}
                                name="password"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                                className={`w-[10vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md`}
                            />
                            <span
                                className="cursor-pointer mr-4"
                                onClick={passwordVisible}
                            >
                                {showPassword ? (
                                    <PiEye fill={torusTheme["text"]} />
                                ) : (
                                    <ClosePassword fill={torusTheme["text"]} />
                                )}
                            </span>
                        </div>
                        {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.password}</p>}
                    </div>
                    <div className="flex flex-col">
                        <Label
                            htmlFor="Confirm Password"
                            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                            className="mb-[0.58vw] font-medium leading-[1.7vh]"
                        >
                            Confirm Password
                        </Label>
                        <div style={{ backgroundColor: torusTheme["bgCard"] }} className='flex items-center w-[12vw] rounded'>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                disabled={!show}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                                className="w-[10vw] font-medium leading-[1.7vh] outline-none pl-[0.87vw] py-[1vw] rounded-md"
                            />
                            <span
                                className={`bottom-[0.8vw] leading-[1.7vh} right-[1.25vw] cursor-pointer`}
                                style={{ fontSize: `${fontSize * 0.83}vw` }}
                                onClick={confirmPasswordVisible}
                            >
                                {showConfirmPassword ? (
                                    <PiEye size={16} fill={torusTheme["text"]} />
                                ) : (
                                    <ClosePassword fill={torusTheme["text"]} />
                                )}
                            </span>
                        </div>
                        {error && <p style={{ fontSize: `${fontSize * 0.72}vw` }} className="text-[#F44336] leading-[2.22vh]">{error.confirmPassword}</p>}
                    </div>
                </div>
                <Button
                    style={{ backgroundColor: `${show ? accentColor : hexWithOpacity(accentColor, 0.35)}`, fontSize: `${fontSize * 0.83}vw` }}
                    isDisabled={!show}
                    className={`w-[25vw] outline-none rounded-md p-[1.17vw] leading-[1.7vh] font-semibold text-white`}
                    onPress={clientRegister}
                >
                    Sign Up
                </Button>
            </div>

            {individualRegister &&
                <div className='flex flex-col gap-[0.87vw]'>
                    <div style={{ color: torusTheme["text"] }} className="flex items-center justify-center w-full">
                        <span style={{ backgroundColor: torusTheme["textOpacity/15"] }} className="h-px w-[50%]"></span>
                        <span style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }} className="px-2 leading-[1.7vh]">
                            Or
                        </span>
                        <span style={{ backgroundColor: torusTheme["textOpacity/15"] }} className="h-px w-[50%]"></span>
                    </div>
                    <div className="flex gap-[1.17vw]">
                        <Button
                            // onPress={() => handlesociallogin("github")}
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                            className="w-[12vw] py-[1vw] font-medium leading-[1.7vh] px-6 flex items-center justify-cnter focus:outline-none rounded-lg"
                        >
                            <Gitbutton fill={torusTheme["text"]} />
                            GitHub
                        </Button>
                        <Button
                            // onPress={() => handlesociallogin("google")}
                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                            className="w-[12vw] py-[1vw] font-medium leading-[1.7vh] px-6 flex items-center justify-center focus:outline-none rounded-lg"
                        >
                            <Googlebutton />
                            Google
                        </Button>
                    </div>
                </div>
            }
            <div className="flex h-[10vh] items-end justify-center leading-[1.7vh]">
                <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.8}vw` }}>
                    Already have an account? {" "}
                    <a style={{ color: torusTheme["text"] }} onClick={() => router.push("/login")} className="cursor-pointer font-bold">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )
}

export default RegistrationForm