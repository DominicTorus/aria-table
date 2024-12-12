import React, { useState } from "react";
import DropDown from "../components/multiDropdownnew";
import {
  DaylightTheme,
  EclipseTheme,
  MidnightTheme,
  SunriseTheme,
} from "../constants/svgApplications";
import { Button, Input, ListBoxItem } from "react-aria-components";
import { IoIosCheckmark } from "react-icons/io";
import { useSelector } from "react-redux";
import { getCookie } from "../../lib/utils/cookiemgmt";
import { RootState } from "../../lib/Store/store";
import { getLanguage, getTheme } from "../../lib/utils/utility";

const TorusAppearance = ({
  localTheme,
  setLocalTheme,
  localAccentColor,
  setLocalAccentColor,
  localLanguage,
  setLocalLanguage,
  localLanguageCode,
  setLocalLanguageCode,
  localThemeObj,
  setLocalThemeObj,
  selectedFontSize,
  setSelectedFontSize,
  fontSizes
}: {
  localTheme: string;
  setLocalTheme: any;
  localAccentColor: string;
  setLocalAccentColor: any;
  localLanguage: any;
  setLocalLanguage: any;
  localLanguageCode: string;
  setLocalLanguageCode: any;
  localThemeObj: Record<string, string> | undefined;
  setLocalThemeObj: React.Dispatch<
    React.SetStateAction<Record<string, string> | undefined>
  >;
  selectedFontSize: any;
  setSelectedFontSize: React.Dispatch<React.SetStateAction<number | string>>;
  fontSizes: Record<string, number | string>[];
}) => {

  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);

  const languageOptions = [
    { code: "en-GB", name: "English" },
    { code: "ar-AR", name: "Arabic" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "ta-IN", name: "Tamil" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<any>(
    localLanguageCode
      ? languageOptions.find((lang) => lang.code === localLanguageCode)
      : getCookie("cfg_lc")
        ? languageOptions.find((lang) => lang.code === getCookie("cfg_lc"))
        : languageOptions[0]
  );

  const getWidthOfIcon = () => {
    if (window.innerWidth > 1500) {
      return "11vw";
    } else {
      return "16vw";
    }
  };

  const Theme = [
    {
      displayParam: "Daylight",
      icon: <DaylightTheme width={getWidthOfIcon()} />,
      code: "daylight",
    },
    {
      displayParam: "Midnight",
      icon: <MidnightTheme width={getWidthOfIcon()} />,
      code: "midnight",
    },
    {
      displayParam: "Sunrise",
      icon: <SunriseTheme width={getWidthOfIcon()} />,
      code: "sunrise",
    },
    {
      displayParam: "Eclipse",
      icon: <EclipseTheme width={getWidthOfIcon()} />,
      code: "eclipse",
    },
  ];

  const color = [
    "#0736C4",
    "#00BFFF",
    "#FFC723",
    "#2AE38F",
    "#F44336",
    "#EC407A",
    "#FF5722",
  ];

  const handleTheme = (theme: string) => {
    setLocalTheme(theme);
    setLocalThemeObj(getTheme(theme));
  };

  const renderOptionForLanguage = (
    item: any,
    close: () => void,
    handleSelectionChange: (selectedItem: any, close: () => void) => void,
    setOpen: (open: boolean) => void,
    selected: boolean | any
  ) => (
    <ListBoxItem
      key={item.code}
      textValue={item.code}
      onAction={() => handleSelectionChange(item, close)}
      className="p-1 cursor-pointer focus:outline-none flex justify-between"
      style={{ fontSize: `${selectedFontSize ? selectedFontSize.code * 0.83 : fontSize * 0.83}vw`, color: localThemeObj ? localThemeObj["text"] : torusTheme["text"], backgroundColor: selectedLanguage.code === item.code ? localThemeObj ? localThemeObj["borderLine"] : torusTheme["borderLine"] : "" }}
    >
      {`${item.name} `}
      {selectedLanguage.code === item.code ? (
        <IoIosCheckmark size={20} fill={localAccentColor ? localAccentColor : accentColor} />
      ) : (
        ""
      )}
    </ListBoxItem>
  );

  const handleLanguageSelection = (lang: typeof selectedLanguage) => {
    setSelectedLanguage(lang);
    setLocalLanguage(getLanguage(lang.code));
    setLocalLanguageCode(lang.code);
  };

  const handleFontSelection = (fontSize: typeof selectedFontSize) => {
    setSelectedFontSize(fontSize);
  }

  const renderOptionForFontSize = (
    item: any,
    close: () => void,
    handleSelectionChange: (selectedItem: any, close: () => void) => void,
    setOpen: (open: boolean) => void,
    selected: boolean | any
  ) => {
    const fontSizeOfOptions = selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72;
    const isSelected = selectedFontSize ? selectedFontSize?.code === item.code : fontSize === item.code;
    return (
      <ListBoxItem
        key={item.code}
        textValue={item.code}
        onAction={() => handleSelectionChange(item, close)}
        className="p-1 cursor-pointer focus:outline-none flex justify-between"
        style={{ fontSize: `${fontSizeOfOptions}vw`, color: localThemeObj ? localThemeObj["text"] : torusTheme["text"], backgroundColor: isSelected ? localThemeObj ? localThemeObj["borderLine"] : torusTheme["borderLine"] : "" }}
      >
        {`${item.name} `}
        {isSelected ? (
          <IoIosCheckmark size={20} fill={localAccentColor ? localAccentColor : accentColor} />
        ) : (
          ""
        )}
      </ListBoxItem>
    )
  }

  return (
    <div
      className={`flex flex-col gap-[2.49vh] w-[86.93vw] h-[93.61vh] px-[0.83vw] py-[1.87vh]`}
    >
      <div className="flex flex-col gap-[2vh]">
        <h1
          className={`font-semibold leading-[1.85vh]`}
          style={{
            color: localThemeObj ? localThemeObj["text"] : torusTheme["text"],
            fontSize: `${selectedFontSize ? selectedFontSize.code * 1.25 : fontSize * 1.25}vw`,
          }}
        >
          {localLanguage["Appearance"]}
        </h1>
        <hr
          className="w-[79.47vw] border"
          style={{
            borderColor: localThemeObj
              ? localThemeObj["borderLine"]
              : torusTheme["borderLine"],
          }}
        />
      </div>
      <div className="flex flex-col gap-[2.5vh]">
        <div className="flex items-center">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh] "
              style={{
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {localLanguage["Language"]}
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["textOpacity/50"]
                  : torusTheme["textOpacity/50"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {localLanguage["Select the language of the application"]}.
            </p>
          </div>
          <DropDown
            triggerButton={
              selectedLanguage ? selectedLanguage?.name : "English"
            }
            selectedKeys={selectedLanguage}
            setSelectedKeys={handleLanguageSelection}
            items={languageOptions}
            arrowFill={localAccentColor ? localAccentColor : accentColor}
            classNames={{
              triggerButton: `w-[14.16vw] h-[4.07vh] leading-[2.22vh] font-medium focus:outline-none`,
              popover: `w-[14.16vw]`,
              listbox: `overflow-y-auto`,
              listboxItem:
                "flex leading-[2.22vh] justify-between",
            }}
            renderOption={renderOptionForLanguage}
            styles={{
              triggerButton: {
                backgroundColor: localThemeObj
                  ? localThemeObj["bgCard"]
                  : torusTheme["bgCard"],
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.83 : fontSize * 0.83}vw`,
              },
              popover: {
                backgroundColor: localThemeObj
                  ? localThemeObj["bg"]
                  : torusTheme["bg"],
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
              },
              listbox: {
                borderColor: localThemeObj
                  ? localThemeObj["borderLine"]
                  : torusTheme["borderLine"],
              },
              listboxItem: {
                backgroundColor: localThemeObj
                  ? localThemeObj["borderLine"]
                  : torusTheme["borderLine"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.83 : fontSize * 0.83}vw`,
              },
            }}
          />
        </div>
        <hr
          className="w-[79.47vw] border"
          style={{
            borderColor: localThemeObj
              ? localThemeObj["borderLine"]
              : torusTheme["borderLine"],
          }}
        />

        <div className="flex flex-col gap-[2.49vh]">
          <div className="flex flex-col gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {localLanguage["Interface Theme"]}
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["textOpacity/50"]
                  : torusTheme["textOpacity/50"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {localLanguage["Select the Theme of the application"]}.
            </p>
          </div>
          <div className="flex gap-[1.17vw]">
            {Theme.map((theme) => (
              <div
                key={theme.displayParam}
                className="flex flex-col gap-[2.25vh]"
              >
                <Button
                  onPress={() => {
                    handleTheme(theme.code);
                  }}
                  key={theme.displayParam}
                  style={{
                    borderColor:
                      localTheme == theme.code ? localAccentColor : "",
                  }}
                  className={`${localTheme === theme.code
                    ? "border-4 rounded-tl-xl rounded-md"
                    : "outline-none"
                    } outline-none`}
                >
                  {theme.icon}
                </Button>
                <span
                  className="flex items-center justify-center font-medium leading-[1.85vh]"
                  style={{
                    color: localThemeObj
                      ? localThemeObj["text"]
                      : torusTheme["text"],
                    fontSize: `${selectedFontSize ? selectedFontSize.code * 0.83 : fontSize * 0.83}vw`,
                  }}
                >
                  {theme.displayParam}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr
          className="w-[79.47vw] border"
          style={{
            borderColor: localThemeObj
              ? localThemeObj["borderLine"]
              : torusTheme["borderLine"],
          }}
        />
        <div className="flex">
          <div className="flex flex-col gap-[0.62vh] w-[20vw]">
            <h1
              className="font-semibold leading-[1.85vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {localLanguage["Accent Colors"]}
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["textOpacity/50"]
                  : torusTheme["textOpacity/50"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {
                localLanguage[
                "Select or customize your application accent color"
                ]
              }
              .
            </p>
          </div>
          <div className="flex flex-col gap-[1.87vh]">
            <div className="flex gap-[0.58vw]">
              {color.map((col) => (
                <span
                  key={col}
                  style={{ backgroundColor: col }}
                  onClick={() => setLocalAccentColor(col)}
                  className={`cursor-pointer w-[1.66vw] h-[1.66vw] rounded-full `}
                ></span>
              ))}
            </div>
            <div className="flex gap-[0.58vw] items-center">
              <h2
                className="font-medium leading-[2.22vh]"
                style={{
                  color: localThemeObj
                    ? localThemeObj["text"]
                    : torusTheme["text"],
                  fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
                }}
              >
                {localLanguage["Custom Color"]}
              </h2>
              <Input
                className={`outline-none w-[5.78vw] leading-[1.85vh] rounded-md px-[0.58vw] py-[0.62vh]`}
                style={{
                  backgroundColor: localThemeObj
                    ? localThemeObj["bgCard"]
                    : torusTheme["bgCard"],
                  color: localThemeObj
                    ? localThemeObj["text"]
                    : torusTheme["text"],
                  fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
                }}
                value={localAccentColor}
                disabled
              />
              <div
                onClick={() =>
                  document.getElementById("client-colorPicker")?.click()
                }
                className="flex items-center justify-center w-[2.4vw] h-[2.4vw]"
              >
                <div
                  className="border-2 w-[2.4vw] h-[2.4vw] rounded-full flex items-center justify-center"
                  style={{ borderColor: localAccentColor }}
                >
                  <div
                    className={`cursor-pointer w-[1.66vw] h-[1.66vw] rounded-full`}
                    style={{ backgroundColor: localAccentColor }}
                  ></div>
                </div>
              </div>
              <input
                type="color"
                id="client-colorPicker"
                defaultValue={localAccentColor}
                onChange={(e) => setLocalAccentColor(e.target.value)}
                className="invisible"
              />
            </div>
          </div>
        </div>
        <hr
          className="w-[79.47vw] border"
          style={{
            borderColor: localThemeObj
              ? localThemeObj["borderLine"]
              : torusTheme["borderLine"],
          }}
        />
        <div className="flex items-center">
          <div className="flex flex-col w-[20vw] gap-[0.62vh]">
            <h1
              className="font-semibold leading-[1.85vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {localLanguage["Font Size"]}
            </h1>
            <p
              className="leading-[1.85vh]"
              style={{
                color: localThemeObj
                  ? localThemeObj["textOpacity/50"]
                  : torusTheme["textOpacity/50"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              }}
            >
              {localLanguage["Select the font size of the application"]}.
            </p>
          </div>
          <DropDown
            triggerButton={selectedFontSize ? selectedFontSize?.name : fontSizes.find((item) => item.code === fontSize)?.name}
            selectedKeys={selectedFontSize}
            setSelectedKeys={handleFontSelection}
            items={fontSizes}
            classNames={{
              triggerButton: `w-[14.16vw] h-[4.07vh] leading-[2.22vh] font-medium focus:outline-none`,
              popover: `w-[14.16vw]`,
              listbox: `overflow-y-auto`,
              listboxItem:
                "flex leading-[2.22vh] justify-between",
            }}
            arrowFill={localAccentColor ? localAccentColor : accentColor}
            renderOption={renderOptionForFontSize}
            styles={{
              triggerButton: {
                backgroundColor: localThemeObj
                  ? localThemeObj["bgCard"]
                  : torusTheme["bgCard"],
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.83 : fontSize * 0.83}vw`,
              },
              popover: {
                backgroundColor: localThemeObj
                  ? localThemeObj["bg"]
                  : torusTheme["bg"],
                color: localThemeObj
                  ? localThemeObj["text"]
                  : torusTheme["text"],
              },
              listbox: {
                borderColor: localThemeObj
                  ? localThemeObj["borderLine"]
                  : torusTheme["borderLine"],
              },
              listboxItem: {
                backgroundColor: localThemeObj
                  ? localThemeObj["borderLine"]
                  : torusTheme["borderLine"],
                fontSize: `${selectedFontSize ? selectedFontSize.code * 0.72 : fontSize * 0.72}vw`,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TorusAppearance;
