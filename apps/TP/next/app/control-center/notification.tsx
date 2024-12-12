import React, { useState } from "react";
import SwitchComponent from "./switchcomponent";
import { capitalize } from "../../lib/utils/utility";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/Store/store";

type NotificationCategories =
  | "artifacts"
  | "artifactGroups"
  | "catalogs"
  | "organizationMatrix"
  | "accessTemplate"
  | "accessProfile"
  | "pushToBuild";

type NotificationActions = {
  creating?: boolean;
  renaming?: boolean;
  deleting?: boolean;
  addingOrg?: boolean;
  updatingOrg?: boolean;
  deletingOrg?: boolean;
  addingUserRole?: boolean;
  addingProduct?: boolean;
};

const Notifications: React.FC = () => {
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);
  const locale = useSelector((state: RootState) => state.main.locale);
  const accentColor = useSelector((state: RootState) => state.main.accentColor);
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const [notifications, setNotifications] = useState<
    Record<NotificationCategories, NotificationActions>
  >({
    artifacts: {
      creating: true,
      renaming: false,
    },
    artifactGroups: {
      creating: true,
      renaming: false,
    },
    catalogs: {
      creating: true,
      renaming: false,
    },
    organizationMatrix: {
      creating: true,
      renaming: false,
    },
    accessTemplate: {
      creating: true,
      renaming: false,
    },
    accessProfile: {
      creating: true,
      renaming: false,
      deleting: false,
    },
    pushToBuild: {
      creating: true,
    },
  });

  const handleToggle = (
    category: NotificationCategories,
    action: keyof NotificationActions
  ) => {
    setNotifications(
      (prev: Record<NotificationCategories, NotificationActions>) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [action]: !prev[category][action],
        },
      })
    );
  };

  const notificationConfig: Record<
    NotificationCategories,
    { label: string; action: keyof NotificationActions }[]
  > = {
    artifacts: [
      { label: "Creating an artifact", action: "creating" },
      { label: "Renaming an artifact", action: "renaming" },
    ],
    artifactGroups: [
      { label: "Creating an artifact group", action: "creating" },
      { label: "Renaming an artifact group", action: "renaming" },
    ],
    catalogs: [
      { label: "Creating a catalog", action: "creating" },
      { label: "Renaming a catalog", action: "renaming" },
    ],
    organizationMatrix: [
      { label: "Creating an organization matrix", action: "creating" },
      { label: "Renaming an organization matrix", action: "renaming" },
    ],
    accessTemplate: [
      { label: "Creating an access template", action: "creating" },
      { label: "Renaming an access template", action: "renaming" },
    ],
    accessProfile: [
      { label: "Creating an access profile", action: "creating" },
      { label: "Renaming an access profile", action: "renaming" },
    ],
    pushToBuild: [{ label: "When a build is pushed", action: "creating" }],
  };

  function camelCaseToParagraphCase(str: string) {
    // Step 1: Insert spaces before capital letters
    let result = str.replace(/([A-Z])/g, " $1");

    result = result
      .split(" ")
      .map((word) => capitalize(word))
      .join(" ");

    return result;
  }

  return (
    <div className="flex flex-col gap-[2.49vh] w-[86.93vw] h-[93.61vh] px-[0.83vw] py-[1.87vh]">
      <div className="flex flex-col gap-[2vh] py-4 border-b"
        style={{ borderColor: torusTheme["border"] }}>
        <h1 className="font-semibold leading-[1.85vh] "
          style={{ color: torusTheme["text"], fontSize: `${fontSize * 1.25}vw` }}>
          {locale["Notifications"]}
        </h1>
        <p className="leading-[1.04vw]"
          style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.83}vw` }}>
          {locale["Manage when you will receive notifications"]}
        </p>
      </div>
      <div className="w-full max-w-[89.27vw] h-[82.77vh] overflow-y-scroll">
        {Object.entries(notificationConfig).map(([category, actions]) => (
          <div
            className="leading-[1.04vw] py-[0.58vh]"
            style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.72}vw` }}
            key={category}
          >
            <h2 className="leading-[1.04vw] font-semibold pb-1"
              style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}>
              {locale[camelCaseToParagraphCase(category)]}
            </h2>
            {actions.map(({ label, action }) => (
              <div className="py-[1.3vh]" key={action}>
                <div className="flex">
                  <p className="w-[30vw] leading-[1.04vw] "
                    style={{ color: torusTheme["textOpacity/50"], fontSize: `${fontSize * 0.83}vw` }}>
                    {locale[label]}
                  </p>
                  <SwitchComponent
                    isSelected={
                      notifications[category as NotificationCategories]?.[
                      action
                      ] ?? false
                    }
                    onChange={() =>
                      handleToggle(category as NotificationCategories, action)
                    }
                    localAccentColor={accentColor}
                  />
                </div>
              </div>
            ))}
            <hr className="w-full"
              style={{ borderColor: torusTheme["borderLine"] }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
