"use client"
import React, { ChangeEvent, useEffect, useState } from 'react'
import { ArrowBackward, ArrowForward, TorusLogo } from '../../constants/svgApplications'
import Image from "next/image";
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/Store/store';
import DashBoard from "../../constants/Image.png";
import { Button, Input, Label } from 'react-aria-components';
import { AxiosService } from '../../../lib/utils/axiosService';
import { useRouter, useSearchParams } from 'next/navigation';
import OTPInput from '../otpComponent';
import TorusToast from '../torusComponents/torusToast';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [client, setClient] = useState<any>("");
    const [code, setCode] = useState('');
    const [email, setemail] = useState('');
    const [verifycode, setverifycode] = useState('');
    const [isTeam, setisTeam] = useState(true);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [wordLength, setWordLength] = useState(0);
    const [emailError, setEmailError] = useState('');
    const accentColor = useSelector((state: RootState) => state.main.accentColor);
    const searchParams = useSearchParams();
    const selectedOption = searchParams.get("t");
    const router = useRouter()
    const torusTheme = useSelector((state: RootState) => state.main.testTheme);
    const fontSize = useSelector((state: RootState) => state.main.fontSize);

    useEffect(() => {
        if (selectedOption === "Individual") {
            setisTeam(false);
        } else {
            setisTeam(true);
        }
    }, [selectedOption]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") {
            setemail(value);
        }
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            value
        } else {
            setEmailError("Please Enter a Valid Email")
        }
    }

    const handleCodeChange = (e: any) => {
        const newCode = e.target.value;
        setCode(newCode);
    };

    const handleVerifyCodeClick = async () => {
        try {
            const res = await AxiosService.post('/api/auth-sendResetOtp', {
                email: email,
                team: isTeam,
                clientCode: isTeam ? client : undefined
            });
            if (res.status === 201) {
                setverifycode(res.data.clientCode);
                setIsOtpVisible(true);
            }
        } catch (error: any) {
            const message = error?.response?.data?.error
                ? error?.response?.data?.errorDetails
                : "User Not Found";
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
    };

    return (
        <div style={{ backgroundColor: torusTheme["bgCard"] }} className="flex justify-between w-full h-screen overflow-hidden transition-colors duration-700 ease">
            <div style={{ backgroundColor: torusTheme["bg"] }} className='w-[30%]'>
                <div className="p-[1.0vw] flex items-center">
                    <TorusLogo />
                    <span style={{ color: torusTheme["text"] }}>TORUS</span>
                </div>
                <div className="flex flex-col items-center justify-center p-[5.85vw]">
                    {!isOtpVisible ? (
                        <>
                            <h1 style={{ color: torusTheme["text"], fontSize: `${fontSize * 2.08}vw` }} className="text-center font-semibold  leading-[2.52vw] self-start whitespace-nowrap mb-[1.17vw]">Forgot Password?</h1>
                            <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.83}vw` }} className="text-center leading-[0.93vw] self-start mb-[2.34vw]">No worries, we&apos;ll send you instructions</p>
                            <div className="flex flex-col gap-[0.87vw]">
                                <div className='flex flex-col gap-[1.17vw]'>
                                    {isTeam && (
                                        <div className="flex flex-col">
                                            <Label
                                                htmlFor="tenant"
                                                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                                                className="mb-1 font-medium leading-[1.7vh]"
                                            >
                                                Client
                                            </Label>
                                            <Input
                                                id="tenant"
                                                type="text"
                                                placeholder="Enter your clientCode"
                                                value={client}
                                                onChange={(e) => setClient(e.target.value)}
                                                style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                                                className="w-full p-2 rounded-lg  font-medium leading-[1.7vh] py-[1vw] mt-[0.58vw] focus:outline-none "
                                            />
                                        </div>
                                    )}
                                    <Label
                                        htmlFor="email"
                                        style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                                        className=" font-medium leading-[1.7vh]"
                                    >
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            type="email"
                                            placeholder="Enter your email"
                                            style={{ backgroundColor: torusTheme["bgCard"], color: torusTheme["text"], fontSize: `${fontSize * 0.8}vw` }}
                                            className="w-[16vw]  font-medium leading-[1.7vh] outline-none pl-[1.17vw] py-[1vw] rounded-md"
                                        />
                                        {emailError && <p style={{ fontSize: `${fontSize * 0.83}vw` }} className="text-[#F44336]  leading-[1.7vh]">{emailError}</p>}
                                        {/* <Input
                                            id="verificationCode"
                                            name="verificationCode"
                                            type="text"
                                            value={code}
                                            onChange={handleCodeChange}
                                            placeholder=''
                                            className="absolute right- mt-[0.58vw] bg-white text-black text-[0.83vw] p-1 leading-[1.7vh] rounded-md w-[5vw] h-6 outline-none"
                                        /> */}
                                    </div>
                                </div>
                                <Button style={{ backgroundColor: accentColor, fontSize: `${fontSize * 0.8}vw` }} className="outline-none  leading-[1.7vh] text-white font-medium rounded-md w-full py-[1vw] focus-outline-none"
                                    onPress={handleVerifyCodeClick}>
                                    Send Code
                                </Button>
                                <p style={{ color: torusTheme["textOpacity/35"], fontSize: `${fontSize * 0.72}vw` }} onClick={() => router.push('/login')} className="flex cursor-pointer items-center  font-medium leading-[1.5vh] focus-outline-none">
                                    <ArrowBackward fill={torusTheme["text"]} /> Back to log in
                                </p>
                            </div>
                        </>
                    ) : (
                        <OTPInput otp={otp} setOtp={setOtp} email={email} verifycode={verifycode} isTeam={isTeam} client={client} setverifycode={setverifycode} />
                    )}
                </div>
            </div>
            <div className="flex flex-col justify-between w-[70%] h-[100%] pt-[3vw] gap-[2vw] ml-[2.92vw]">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mr-[2.34vw]">
                        <div className="flex gap-1 items-center">
                            <span style={{ backgroundColor: accentColor }} className="w-[.46vw] h-[.46vw] rounded-full"></span>
                            <p style={{ color: accentColor, fontSize: `${fontSize * 0.93}vw` }} className=" leading-[2vh] font-bold">
                                What&apos;s New
                            </p>
                        </div>
                        <p style={{ color: accentColor, fontSize: `${fontSize * 0.72}vw` }} className="flex items-center font-medium leading-[1.5vh]">
                            View all changes <ArrowForward fill={accentColor} />
                        </p>
                    </div>
                    <p style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.8}vw` }} className="flex pt-[0.87vw]  font-bold leading-[3.92vh]">
                        Discover the New Torus 9
                    </p>
                    <p style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.93}vw` }} className=" leading-[2.31vh] w-[75%] mt-[1.17vw]">
                        Experience the all new Torus9 with an enhanced UI Intuitive
                        appflow, new screens, a refreshed home and our new brand new marketplace
                        and templates. Log in to explore the next level of productivity and
                        innovations.
                    </p>
                </div>
                <Image
                    className="w-[100%] mr-auto rounded-tl-[3.5%]"
                    src={DashBoard}
                    alt="bankmaster"
                />
            </div>
        </div>
    )
}

export default ForgotPassword;