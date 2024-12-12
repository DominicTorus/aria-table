import React, { useState, useRef } from "react";
import { Button, Input, Label } from "react-aria-components";
import { ArrowBackward, ClosePassword } from "../constants/svgApplications";
import { useRouter } from "next/navigation";
import { PiEye } from "react-icons/pi";
import { toast } from "react-toastify";
import TorusToast from "./torusComponents/torusToast";
import { AxiosService } from "../../lib/utils/axiosService";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";

const BlueTick = () => (
  <svg
    xmlns="
http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="blue"
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const OTPInput = ({
  otp,
  setOtp,
  email,
  verifycode,
  isTeam,
  client,
  setverifycode,
}: {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  email: string;
  verifycode: string;
  isTeam: boolean;
  client: string;
  setverifycode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification state
  const [newPassword, setNewPassword] = useState("");
  const [validation, setvalidation] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });
  const [wordLength, setWordLength] = useState(0);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    // Allow only numbers and limit to one character per input
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move to the next input field if available
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
      }
      // Automatically move to the next input field if the length is 1 and index is within range
      if (value.length === 1 && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      // Check if all inputs are filled to display success message
      if (newOtp.every((digit) => digit.length === 1)) {
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setvalidation(true);
    const value = e.target.value;
    if (value.length == 0) {
      setvalidation(false);
    }
    setNewPassword(value);
    setPasswordErrors({
      length: value.length >= 8,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
    });
    if (confirmPassword && Password !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleVerifyCodeClick = async () => {
    try {
      const res = await AxiosService.post("/api/auth-sendResetOtp", {
        email: email,
        team: isTeam,
        clientCode: isTeam ? client : undefined,
      });

      if (res.status === 201) {
        setverifycode(res.data.clientCode);
        setIsOtpVisible(true);
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: "Reset OTP sent successfully!",
            closeButton: false,
          } as any
        );
      }
    } catch (error) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: "Failed to send OTP. Please try again.",
          closeButton: false,
        } as any
      );
    }
  };

  const handleConfirmPasswordChange = (e: any) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    // Check if passwords match
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasswordReset = async () => {
    if (confirmPassword !== newPassword) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: `Password and confirm password does not match`,
          closeButton: false,
        } as any
      );
      return;
    }
    try {
      const res = await AxiosService.post("/api/auth-resetPassword", {
        email: email,
        password: newPassword,
        clientCode: verifycode,
      });
      if (res.status === 201) {
        setPassword(res.data);
      }
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "success",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Success",
          text: `Password changed successfully`,
          closeButton: false,
        } as any
      );
      router.push("/login");
    } catch (error: any) {
      const message = error?.response?.data?.error
        ? error?.response?.data?.errorDetails
        : "Failed to reset password. Please try again";
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

  const handleresetotp = async () => {
    try {
      const res = await AxiosService.post("/api/auth-valResetotp", {
        email: email,
        otp: otp.join(""), // Joins the OTP array into a single string
        clientCode: verifycode,
      });

      if (res.status === 201) {
        // Success Case
        setIsReset(res.data);
        setIsOtpVerified(true);
        setOtp(new Array(otp.length).fill("")); // Clear the OTP input
        toast(
          <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
          {
            type: "success",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            title: "Success",
            text: "OTP verified successfully!",
            closeButton: false,
          } as any
        );
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "error",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Error",
          text: "Invalid OTP, please try again.",
          closeButton: false,
        } as any
      );
    }
  };

  const passwordVisible = () => {
    setShowPassword(!showPassword);
  };

  const confirmPasswordVisible = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResendOtp = async () => {
    setOtp(new Array(otp.length).fill(""));
    handleVerifyCodeClick();
  };

  const getColor = (condition: any) => {
    return condition ? "#4a90e2" : "#F4F5FA"; // Blue if condition met, gray if not
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (pastedData.length === otp.length) {
      setOtp(pastedData.split("")); // Set OTP directly if the pasted data is valid
    }
    if (pastedData.length > otp.length) {
      setOtp(pastedData.slice(0, otp.length).split(""));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!isOtpVerified ? (
        <>
          <h1
            style={{
              color: torusTheme["text"],
              fontSize: `${fontSize * 2.08}vw`,
            }}
            className="text-center font-semibold leading-[2.52vw] mb-[1.17vw]"
          >
            Verification Code
          </h1>
          <div className="flex">
            <p
              style={{
                color: torusTheme["textOpacity/35"],
                fontSize: `${fontSize * 0.83}vw`,
              }}
              className="text-center  leading-[0.93vw] mb-[2.34vw]"
            >
              We have sent a code to
              <p style={{ color: torusTheme["text"] }}>{email}</p>
            </p>
          </div>

          <div className="flex gap-[0.58vw] mb-[1.17vw]">
            {otp.map((_, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index]}
                onPaste={handlePaste}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el) as any}
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  borderColor: torusTheme["border"],
                  color: torusTheme["text"],
                }}
                className={`w-10 h-10 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:text-[${accentColor}]`}
              />
            ))}
          </div>
          {/* {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>} */}

          <div className="flex flex-col items-center gap-[1.17vw]">
            <Button
              style={{
                backgroundColor: accentColor,
                fontSize: `${fontSize * 0.8}vw`,
              }}
              className="text-center  leading-[1.7vh] text-white font-medium rounded-md py-[0.87vw] px-28 focus:outline-none"
              onPress={handleresetotp}
            >
              Verify
            </Button>

            <p
              style={{
                color: torusTheme["textOpacity/35"],
                fontSize: `${fontSize * 0.72}vw`,
              }}
              className=" font-medium leading-[1.5vh]"
            >
              Didn&apos;t get a code?{" "}
              {/* <Button onPress={handleResendOtp} className="text-[#0736C4] dark:text-[#FFFFFF] underline">
                Click to resend
              </Button> */}
              <Button
                style={{ color: accentColor }}
                onPress={handleResendOtp}
                className="underline outline-none"
              >
                {isLoading ? "Resending..." : "Click to resend"}
              </Button>
              {/* {errorMessage && (
                <p className="text-red-500">
                  {errorMessage}
                </p>
              )} */}
              {isOtpVerified && (
                <p className="text-green-500">
                  OTP has been successfully resent.
                </p>
              )}
            </p>

            <p
              style={{
                color: torusTheme["textOpacity/35"],
                fontSize: `${fontSize * 0.72}vw`,
              }}
              onClick={() => router.push("/login")}
              className="flex items-center  font-medium leading-[1.5vh] cursor-pointer"
            >
              <ArrowBackward fill={torusTheme["text"]} /> Back to log in
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div>
              <h1
                style={{
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 2.08}vw`,
                }}
                className="text-center self-start whitespace-nowrap font-semibold  leading-[4.48vw] "
              >
                Set New Password
              </h1>
              <p
                style={{
                  color: torusTheme["textOpacity/35"],
                  fontSize: `${fontSize * 0.83}vw`,
                }}
                className="text-center  leading-[1.04vw]"
              >
                Your new password must be different from previous used passwords
              </p>
            </div>

            <div className="relative w-[20.83vw]">
              <Label
                style={{
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.83}vw`,
                }}
                htmlFor="password"
                className="self-start font-medium  leading-[1.04vw]"
              >
                Password
              </Label>
              <Input
                id="password"
                placeholder=""
                value={newPassword}
                onChange={handlePasswordChange}
                type={showPassword ? "text" : "password"}
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.83}vw`,
                }}
                className=" mt-[0.87vw] p-[0.58vw] w-[20.83vw] h-[3vw] leading-[1.04vw] rounded-md focus:outline-none"
              />
              <span
                className="absolute bottom-[0.8vw] right-[1.25vw] cursor-pointer"
                onClick={passwordVisible}
              >
                {showPassword ? (
                  <PiEye fill={torusTheme["text"]} size={16} />
                ) : (
                  <ClosePassword fill={torusTheme["text"]} />
                )}
              </span>
            </div>

            {Object.values(passwordErrors).includes(true) && (
              <div className="flex gap-[0.87vw]  mb-[1.17vw]">
                <div
                  style={{
                    backgroundColor: `${Object.values(passwordErrors).includes(true) ? accentColor : torusTheme["bgCard"]}`,
                  }}
                  className={`mt-[0.87vw] bottom-0 left-0 h-1 py-1 w-[6.24vw] rounded-sm`}
                />
                <div
                  style={{
                    backgroundColor: `${Object.values(passwordErrors).filter((val) => val == true).length >= 2 ? accentColor : torusTheme["bgCard"]}`,
                  }}
                  className={`mt-[0.87vw] bottom-0 left-0 h-1 py-1 w-[6.24vw] rounded-sm`}
                />
                <div
                  style={{
                    backgroundColor: `${Object.values(passwordErrors).filter((val) => val == true).length >= 4 ? accentColor : torusTheme["bgCard"]}`,
                  }}
                  className={`mt-[0.87vw] bottom-0 left-0 h-1 py-1 w-[6.24vw] rounded-sm`}
                />
              </div>
            )}

            {validation && (
              <div
                style={{ fontSize: `${fontSize * 0.83}vw` }}
                className="font-medium  leading-[1.04vw] mb-[1.17vw] self-start"
              >
                <div className="flex items-center gap-[0.29vw]">
                  <Input
                    type="checkbox"
                    style={{ accentColor, color: accentColor }}
                    checked={passwordErrors.length}
                    readOnly
                    className="form-checkbox rounded h-2 w-2"
                  />
                  <span style={{ color: torusTheme["textOpacity/35"] }}>
                    Must be at least 8 characters
                  </span>
                </div>

                <div
                  style={{ color: torusTheme["textOpacity/35"] }}
                  className="flex items-center font-medium gap-1"
                >
                  <Input
                    type="checkbox"
                    style={{ accentColor, color: accentColor }}
                    checked={passwordErrors.lowercase}
                    readOnly
                    className="form-checkbox rounded h-2 w-2"
                  />
                  <span style={{ color: torusTheme["textOpacity/35"] }}>
                    Should contain lowercase letters (a-z)
                  </span>
                </div>

                <div className="flex items-center gap-[0.29vw]">
                  <Input
                    type="checkbox"
                    style={{ accentColor, color: accentColor }}
                    checked={passwordErrors.uppercase}
                    readOnly
                    className="form-checkbox rounded h-2 w-2"
                  />
                  <span style={{ color: torusTheme["textOpacity/35"] }}>
                    Should contain uppercase letters (A-Z)
                  </span>
                </div>

                <div className="flex items-center gap-[0.29vw]">
                  <Input
                    type="checkbox"
                    style={{ accentColor, color: accentColor }}
                    checked={passwordErrors.number}
                    readOnly
                    className="form-checkbox rounded h-2 w-2"
                  />
                  <span style={{ color: torusTheme["textOpacity/35"] }}>
                    Should contain numbers (i.e., 0-9)
                  </span>
                </div>
              </div>
            )}
            <Label
              style={{
                color: torusTheme["text"],
                fontSize: `${fontSize * 0.83}vw`,
              }}
              htmlFor="confirmpassword"
              className="self-start font-medium mt-[0.58vw] leading-[1.04vw]"
            >
              Confirm Password
            </Label>
            <div className=" relative w-[20.83vw]">
              <Input
                id="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onBlur={handleConfirmPasswordChange}
                style={{
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.83}vw`,
                }}
                className="mt-[0.87vw] p-[0.58vw] w-[20.83vw] h-[3.29vw] leading-[1.04vw] rounded-md focus:outline-none"
              />

              <span
                className={`absolute ${passwordMatchError ? "bottom-[1.8vw]" : "bottom-[0.8vw]"} right-[1.25vw] cursor-pointer`}
                onClick={confirmPasswordVisible}
              >
                {showConfirmPassword ? (
                  <PiEye fill={torusTheme["text"]} />
                ) : (
                  <ClosePassword fill={torusTheme["text"]} />
                )}
              </span>
              {passwordMatchError && (
                <p
                  style={{ fontSize: `${fontSize * 0.75}vw` }}
                  className="text-[#F44336] "
                >
                  Passwords do not match
                </p>
              )}
            </div>

            {/* <div className='flex gap-[0.87vw]  mb-[1.17vw]'>
              <div className={`mt-[0.87vw] bottom-0 left-0 h-1 py-1 w-20 rounded-sm   ${Object.values(passwordErrors).includes(true) ? "bg-[#4a90e2]" : "bg-[#F4F5FA]"}`} />
              <div className={`mt-[0.87vw] bottom-0 left-0 h-1 py-1 w-20 rounded-sm ${Object.values(passwordErrors).filter((val) => val == true).length >= 2 ? "bg-[#4a90e2]" : "bg-[#F4F5FA]"} `} />
              <div className={`mt-[0.87vw] bottom-0 left-0 h-1 py-1 w-24 rounded-sm ${Object.values(passwordErrors).filter((val) => val == true).length >= 4 ? "bg-[#4a90e2]" : "bg-[#F4F5FA]"} `} />
            </div> */}
            <Button
              style={{
                backgroundColor: accentColor,
                fontSize: `${fontSize * 0.83}vw`,
              }}
              className="w-full mt-[1.46vw] text-white py-3 rounded-md focus-outline-none"
              onPress={handlePasswordReset}
              isDisabled={!Object.values(passwordErrors).every(Boolean)}
            >
              Reset Password
            </Button>
            <p
              style={{
                color: torusTheme["textOpacity/35"],
                fontSize: `${fontSize * 0.83}vw`,
              }}
              onClick={() => router.push("/login")}
              className="mt-[1.46vw] flex items-center  font-semibold cursor-pointer focus outline-none"
            >
              <ArrowBackward fill={torusTheme["text"]} /> Back to log in
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPInput;
