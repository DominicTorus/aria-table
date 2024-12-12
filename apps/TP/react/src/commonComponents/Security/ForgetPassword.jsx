import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { IoEyeOffOutline } from 'react-icons/io5';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiArrowGoBackLine } from 'react-icons/ri';
import logo from '../../asset/favicon.ico';
import {
  forgetPass,
  getAllRealmOnDatabase,
  otpCheck,
  resetPasswordOnDatabase,
} from '../api/keyCloakAuth';

const ForgetPassword = ({ setisReset }) => {
  const [checkDetails, setCheckDetails] = useState(false);
  const [realmList, setRealmList] = useState([]);
  const [steps, setSteps] = useState('0');
  const [isVisible, setIsVisible] = React.useState(false);
  const [isVisibility, setIsVisibility] = React.useState(false);
  const [error, setError] = useState();
  const [errTenant, setErrTenant] = useState();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisible = () => setIsVisibility(!isVisibility);
  const [data, setData] = useState({
    realm: '',
    realmId: '',
    email: '',
    otp: '',
  });
  const [resetPassword, setResetPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: '',
    password: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllRealmOnDatabase();
        setRealmList(res);
      } catch (error) {
        console.error('error');
        setRealmList([]);
      }
    })();
  }, []);

  /**
   * Updates the state of the component with the new value of a form field.
   *
   * @param {Object} e - The event object containing the name and value of the form field.
   * @return {void} This function does not return anything.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError('');
  };

  /**
   * A description of the entire function.
   *
   * @param {Object} e - The event object containing the name and value of the form field.
   * @return {void} This function does not return anything.
   */
  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setResetPassword({ ...resetPassword, [name]: value });
    if (name === 'confirmPassword') {
      setResetPasswordData({ ...resetPasswordData, password: value });
    }
  };

  /**
   * Updates the state with the selected realm data and clears the error message for the tenant.
   *
   * @param {Object} datas - The selected realm data object containing the id and name of the realm.
   * @return {Promise<void>} A promise that resolves when the state has been updated.
   */
  const handleSelectRealm = async (datas) => {
    setData({ ...data, realmId: datas.id, realm: datas.name });
    setErrTenant('');
  };

  /**
   * Handles the forget password process by calling the forgetPass function with the provided data.
   * If the response data is "Email sent", sets the steps to "1".
   * Otherwise, checks if the email or realm is missing and sets the corresponding error message.
   * Finally, sets the checkDetails flag to true.
   *
   * @return {Promise<void>} A promise that resolves when the forget password process is complete.
   */
  const handleForgetPass = async () => {
    await forgetPass(data)
      .then((res) => {
        if (res.data === 'Email sent') {
          setSteps('1');
        } else {
          if (!data.email) {
            setError('Please Provide Email id');
          }
          if (!data.realm) {
            setErrTenant('please select tenant');
          }
          setCheckDetails(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * Asynchronously checks if the OTP is valid by calling the otpCheck function with the provided data.
   * If the response contains a userId, sets the resetPasswordData state with the userId and sets the steps state to "2".
   * Otherwise, sets the error state to "Enter OTP".
   *
   * @return {Promise<void>} A promise that resolves when the OTP check is complete.
   */
  const isOtpValid = async () => {
    await otpCheck(data).then((res) => {
      if (res.userId) {
        setResetPasswordData({ ...resetPasswordData, userId: res.userId });
        setSteps('2');
      } else setError('Enter OTP');
    });
  };

  /**
   * Asynchronously handles the change of password.
   *
   * Checks if the password and confirmPassword fields are filled in. If not, sets the error state to "Enter Password".
   * If the password and confirmPassword match and are not empty, calls the resetPasswordOnDatabase function with the resetPasswordData.
   * If the response from the function is "password updated", sets the isReset state to false.
   * If the password and confirmPassword do not match, sets the error state to "Password not matched".
   *
   * @return {Promise<void>} A promise that resolves when the password change is complete.
   */
  const handleChangePassword = async () => {
    if (!resetPassword.password || !resetPassword.confirmPassword) {
      setError('Enter Password');
    } else if (
      resetPassword.password === resetPassword.confirmPassword &&
      resetPassword.password
    ) {
      resetPasswordOnDatabase(resetPasswordData).then((res) => {
        if (res.data === 'password updated') {
          setisReset(false);
        }
      });
    } else {
      setError('Password not matched');
    }
  };

  //Returning the JSX
  return (
    <div
      style={{
        background:
          'linear-gradient(90deg, rgba(17,15,18,1) 0%, rgba(110,68,139,1) 45%, rgba(117,59,94,1) 55%, rgba(24,24,23,1) 100%)',
      }}
      className="flex h-screen  w-full flex-col items-center justify-center gap-2 overflow-y-auto"
    >
      {steps === '0' && (
        <div className=" absolute left-2 top-2">
          <button onClick={() => setisReset(false)}>
            <RiArrowGoBackLine size={30} fill="white" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <img className=" my-3 h-12 w-12 transition-all" src={logo} alt=""></img>

        <h2 className="my-3 text-center text-4xl font-bold text-white">
          Torus
        </h2>
      </div>
      {(() => {
        switch (steps) {
          case '0':
            return (
              <div className="flex h-[40%] w-[40%] flex-col items-center justify-center gap-3 rounded-lg bg-slate-800/70 text-center text-white ">
                <Dropdown className="border border-[#20252B]  p-0 ">
                  <DropdownTrigger>
                    <Button
                      size="lg"
                      variant="bordered"
                      className={`mx-44 border-2 border-[#323B45]  ${
                        checkDetails && !data.realm
                          ? 'text-red-400'
                          : 'text-white'
                      }`}
                    >
                      {data.realm ? data.realm : 'Select Tenant'}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Link Actions"
                    className=" h-[250px] overflow-y-auto rounded-sm text-white scrollbar-hide"
                    variant="light"
                    classNames={{
                      base: 'bg-[#33304F]',
                    }}
                  >
                    {realmList &&
                      realmList.length > 0 &&
                      realmList.map((realm, id) => (
                        <DropdownItem
                          className=" text-white hover:bg-slate-200"
                          key={id}
                          onClick={() => handleSelectRealm(realm)}
                        >
                          {realm.name}
                        </DropdownItem>
                      ))}
                  </DropdownMenu>
                </Dropdown>
                {errTenant && (
                  <p className="text-center text-sm text-red-500">
                    {errTenant}
                  </p>
                )}
                <Input
                  className="w-[90%] bg-transparent text-white"
                  name="email"
                  label="Email"
                  labelPlacement="outside"
                  color={`${checkDetails ? 'danger' : 'primary'}`}
                  onChange={handleChange}
                  classNames={{
                    base: ' w-full h-6 my-2',
                    label: ['text-xs text-white focus-within:text-white'],

                    inputWrapper: [
                      'border border-slate-500/50',
                      'text-white',
                      'bg-transparent',
                      'data-[hover=true]:bg-[#282551]',
                      'data-[hover=true]:border-[#4435CF]',
                      'focus-within:!bg-[#282551]',
                      'focus-within:border-[#4435CF] border-2',
                    ],
                    innerWrapper: ['bg-transparent', 'boder-2 border-blue-100'],
                  }}
                ></Input>
                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  onClick={() => {
                    handleForgetPass();
                  }}
                  color="primary"
                  className=" w-[90%] text-end"
                  type="submit"
                >
                  submit
                </Button>
              </div>
            );
          case '1':
            return (
              <div className="flex h-[35%] w-[40%] flex-col items-center justify-center gap-3 bg-slate-800/70 text-center text-white">
                <Input
                  className="w-[90%] bg-transparent text-white"
                  name="otp"
                  label="Enter Otp"
                  labelPlacement="outside"
                  color={`${checkDetails ? 'danger' : 'primary'}`}
                  onChange={handleChange}
                  classNames={{
                    base: ' w-full',
                    label: ['text-xs text-white focus-within:text-white'],

                    inputWrapper: [
                      'border border-slate-500/50',
                      'text-white',
                      'bg-transparent',
                      'data-[hover=true]:bg-[#282551]',
                      'data-[hover=true]:border-[#4435CF]',
                      'focus-within:!bg-[#282551]',
                      'focus-within:border-[#4435CF] border-2',
                    ],
                    innerWrapper: ['bg-transparent', 'boder-2 border-blue-100'],
                  }}
                ></Input>
                {error && <p className="my-4 text-sm text-red-500">{error}</p>}

                <Button
                  onClick={() => isOtpValid()}
                  color="primary"
                  className="w-[90%] text-end"
                  type="submit"
                >
                  submit
                </Button>
              </div>
            );
          case '2':
            return (
              <div className="my-4 flex w-[42%] flex-col gap-4 rounded-xl border-2 border-[#323B45] bg-slate-800/70 p-4  text-white shadow-md">
                <h2 className="text-center text-lg text-blue-500">
                  Reset password
                </h2>
                <Input
                  type={isVisible ? 'text' : 'password'}
                  label="password"
                  labelPlacement="outside"
                  color={`${checkDetails ? 'danger' : 'primary'}`}
                  name="password"
                  value={resetPassword.password}
                  onChange={handlePassChange}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <IoEyeOffOutline className="pointer-events-none text-2xl text-default-400" />
                      ) : (
                        <MdOutlineRemoveRedEye className="pointer-events-none text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  classNames={{
                    base: ' w-full h-6 my-2 ',
                    label: ['text-xs  text-white focus-within:text-white'],

                    inputWrapper: [
                      'border border-slate-500/50',
                      'text-white',
                      'bg-transparent',
                      'data-[hover=true]:bg-[#282551]',
                      'data-[hover=true]:border-[#4435CF]',
                      'focus-within:!bg-[#282551]',
                      'focus-within:border-[#4435CF] border-2',
                    ],
                    innerWrapper: ['bg-transparent', 'boder-2 border-blue-100'],
                  }}
                ></Input>
                <Input
                  type={isVisibility ? 'text' : 'password'}
                  label="ConfirmPassword"
                  name="confirmPassword"
                  labelPlacement="outside"
                  color={`${checkDetails ? 'danger' : 'primary'}`}
                  value={resetPassword.confirmPassword}
                  onChange={handlePassChange}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisible}
                    >
                      {isVisibility ? (
                        <IoEyeOffOutline className="pointer-events-none text-2xl text-default-400" />
                      ) : (
                        <MdOutlineRemoveRedEye className="pointer-events-none text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  classNames={{
                    base: ' w-full h-6 my-2 ',
                    label: ['text-xs  text-white focus-within:text-white'],

                    inputWrapper: [
                      'border border-slate-500/50',
                      'text-white',
                      'bg-transparent',
                      'data-[hover=true]:bg-[#282551]',
                      'data-[hover=true]:border-[#4435CF]',
                      'focus-within:!bg-[#282551]',
                      'focus-within:border-[#4435CF] border-2',
                    ],
                    innerWrapper: ['bg-transparent', 'boder-2 border-blue-100'],
                  }}
                ></Input>
                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}
                <Button
                  onClick={() => handleChangePassword()}
                  color="primary"
                  variant="bordered"
                  className="my-5 w-full border-2 border-[#323B45] bg-blue-500 text-white"
                >
                  submit
                </Button>
              </div>
            );
          default:
            break;
        }
      })()}
    </div>
  );
};

export default ForgetPassword;
