"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button as RACButton,
  FieldError,
  Input,
  Label,
  Text,
  TextField,
  Button,
} from "react-aria-components";
import {
  DeleteIcon,
  DownArrow,
  PlusIcon,
  SixDotsSvg,
  UpArrow,
} from "../../constants/svgApplications";
import { motion, AnimatePresence } from "framer-motion";
import { TreeNode } from "../../constants/MenuItemTree";
import _ from "lodash";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/Store/store";
import { toast } from "react-toastify";
import TorusToast from "../torusComponents/torusToast";

type HandleUpdateJsonType = (
  path: string,
  newContent: any,
  isDropContent?: boolean
) => void;

type HandleDragStart = (
  e: React.DragEvent<HTMLDivElement>,
  path: string
) => void;

type HandleDropNode = (
  e: React.DragEvent<HTMLDivElement>,
  path: string
) => void;

type handleDeleteKeys = (path: string, fab: string) => void;

type handleDeleteMenuGrp = (path: string) => void;

type MenuType = "group" | "item";

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  path: string;
  handleUpdateJson: HandleUpdateJsonType;
  handleDropNode: HandleDropNode;
  handleDragStartOfNode: HandleDragStart;
  handleDeleteKeys: handleDeleteKeys;
  handleDeleteMenuGrp: handleDeleteMenuGrp;
  isDarkMode: boolean;
  setClearKeyPath: React.Dispatch<React.SetStateAction<string | null>>;
}

interface TreeProps {
  data: TreeNode[];
  setData: (data: TreeNode[]) => void;
}

const RenderAccordian: React.FC<TreeNodeProps> = ({
  node,
  level,
  path,
  handleUpdateJson,
  handleDragStartOfNode,
  handleDropNode,
  handleDeleteKeys,
  handleDeleteMenuGrp,
  isDarkMode,
  setClearKeyPath,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isInput, setInput] = useState(false);
  const accentColor = useSelector((state: RootState) => state.main.accentColor)
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, path: string) => {
    const content = e.dataTransfer.getData("key");
    if (content) {
      handleUpdateJson(`${path}.keys`, JSON.parse(content), true);
    } else {
      handleDropNode(e, path);
    }
  };

  const handleChangeTitle = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    path: string
  ) => {
    if (e.target?.value) {
      handleUpdateJson(`${path}.title`, e.target.value);
      setInput(false);
    }
  };

  return (
    <div>
      <div
        className={`mt-[0.58vw] border rounded  border-[${torusTheme["border"]}]`}
        draggable
        onDragStart={(e) => handleDragStartOfNode(e, path)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, path)}
      >
        <div
          className={`cursor-pointer flex items-center w-full focus:outline-gray-400 group relative ${node.type == "group" ? "" : "flex-col"
            } p-[0.29vw] rounded`}
        >
          <div className="flex w-full h-full items-center">
            <RACButton
              aria-label="dd"
              className="mr-[0.58vw] focus:outline-none"
            >
              <SixDotsSvg fill={torusTheme["text"]} />
            </RACButton>
            {isInput ? (
              <Input
                defaultValue={node.title}
                className="border leading-[2.22vh] mr-[0.58vw] w-full focus:outline-none rounded-lg p-[0.29vw] "
                style={{
                  borderColor: accentColor,
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                  fontSize: `${fontSize * 0.83}vw`

                }}
                onKeyDown={(e) =>
                  e.key === "Enter" ? handleChangeTitle(e, path) : null
                }
                onBlur={(e) => { handleChangeTitle(e, path); e.target.style.borderColor = "" }}
                onFocus={(e) => (e.target.style.borderColor = accentColor)}
              />
            ) : (
              <span
                className="leading-[2.22vh]"
                style={{ color: torusTheme["text"], fontSize: `${fontSize * 0.83}vw` }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setInput(!isInput);
                }}
              >
                {node.title}
              </span>
            )}
            <div className="flex ml-auto items-center">
              <RACButton
                onPress={() => handleDeleteMenuGrp(`${path}`)}
                className="focus:outline-none h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <DeleteIcon fill="#EF4444" />
              </RACButton>
              <RACButton
                className="p-[0.58vw] transition-all duration-300 ease-in-out focus:outline-none"
                onPress={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <UpArrow fill={torusTheme["text"]} />
                ) : (
                  <DownArrow fill={torusTheme["text"]} />
                )}
              </RACButton>
            </div>
          </div>
          <AnimatePresence>
            {expanded && node.type == "item" && (
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {["df", "uf", "pf"].map((fab, id) => (
                  <TextField
                    className="m-[0.58vw] leading-[2.22vh] relative focus:outline-none"
                    style={{ fontSize: `${fontSize * 0.72}vw` }}
                    key={id}
                    onFocus={() => setClearKeyPath(`${path}.keys`)}
                  >
                    <Label />
                    <Input
                      onDragOver={(e) => e.preventDefault()}
                      value={node.keys ? node.keys[fab] : ""}
                      readOnly
                      onFocus={(e) =>
                        (e.target.style.borderColor = accentColor)
                      }
                      onBlur={(e) => (e.target.style.borderColor = "")}
                      className=
                      "p-[0.58vw] focus:outline-none border w-full rounded-lg pr-[2.34vw] "
                      style={{
                        backgroundColor: torusTheme["bgCard"],
                        color: torusTheme["text"],
                        borderColor: torusTheme["border"]
                      }}

                      name={fab}
                      placeholder={fab}
                    />
                    {node?.keys && node.keys[fab] ? (
                      <Button
                        onPress={() => handleDeleteKeys(`${path}.keys`, fab)}
                        className="absolute right-[0.58vw] top-[0.58vw] focus:outline-none"
                      >
                        <DeleteIcon fill="#EF4444" />
                      </Button>
                    ) : null}
                    <Text slot="description" />
                    <FieldError />
                  </TextField>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {expanded && node.items && node.type == "group" && (
          <motion.div
            className={`overflow-hidden`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {node.items.map((child, index) => (
              <div
                key={child.id}
                className="ml-[1.17vw] mt-[0.58vw] last:mb-[0.58vw]"
              >
                <RenderAccordian
                  key={child.id}
                  node={child}
                  level={level + 1}
                  path={`${path}.items.${index}`}
                  handleUpdateJson={handleUpdateJson}
                  handleDragStartOfNode={handleDragStartOfNode}
                  handleDropNode={handleDropNode}
                  handleDeleteKeys={handleDeleteKeys}
                  handleDeleteMenuGrp={handleDeleteMenuGrp}
                  isDarkMode={isDarkMode}
                  setClearKeyPath={setClearKeyPath}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItemAccordian: React.FC<TreeProps> = ({ data, setData }) => {
  const [isInput, setInput] = useState<null | string>(null);
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const plusIconRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useSelector((state: RootState) => state.main.useDarkMode);
  const [clearKeyPath, setClearKeyPath] = useState<null | string>(null);
  const [wordLength, setWordLength] = useState<number>(0);
  const accentColor = useSelector((state: RootState) => state.main.accentColor)
  const fontSize = useSelector((state: RootState) => state.main.fontSize);
  const torusTheme = useSelector((state: RootState) => state.main.testTheme);

  const handleUpdateJson: HandleUpdateJsonType = (
    path: string,
    newContent: any,
    isDropContent: boolean = false
  ) => {
    const js = structuredClone(data);
    if (isDropContent) {
      const getExistingContent = _.get(js, path);
      _.set(js, path, { ...getExistingContent, ...newContent });
      setData(js);
    } else {
      _.set(js, path, newContent);
      setData(js);
    }
  };

  const handleAddMenuGrp = (type: MenuType, close: () => void) => {
    if (type == "group") {
      const newMenuGrp: TreeNode = {
        id: `${data.length + 1}`,
        title: `Menu Item ${data.length + 1}`,
        sortOrder: `${data.length + 1}`,
        type: "group",
        items: [],
      };
      setData([...data, newMenuGrp]);
      close();
    } else {
      const newMenuGrp: TreeNode = {
        id: `${data.length + 1}`,
        title: `Menu Item ${data.length + 1}`,
        sortOrder: `${data.length + 1}`,
        type: "item",
        keys: {},
      };
      setData([...data, newMenuGrp]);
      close();
    }
  };

  const handleNewMenuItem = (id: number, type: MenuType, close: () => void) => {
    const val: TreeNode[] | any = _.get(data, `${id}.items`);
    var newMenuItem: TreeNode;
    if (type == "group") {
      newMenuItem = {
        id: `${id + 1}-${val.length + 1}`,
        title: `Menu Grp ${id + 1}-${val.length + 1}`,
        sortOrder: `${val.length + 1}`,
        type: "group",
        items: [],
      };
    } else {
      newMenuItem = {
        id: `${id + 1}-${val.length + 1}`,
        title: `Menu Item ${id + 1}-${val.length + 1}`,
        sortOrder: `${val.length + 1}`,
        type: "item",
        items: [],
        keys: {},
      };
    }
    val.push(newMenuItem);
    handleUpdateJson(`${id}.items`, val);
    close();
  };

  const handleChangeTitle = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    path: string
  ) => {
    if (e.target.value) {
      handleUpdateJson(`${path}.title`, e.target.value);
      setInput(null);
    }
  };

  const handleDragStartOfNode: HandleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    path: string
  ) => {
    e.dataTransfer.setData("pathOfSrcNode", path);
  };

  const handleDropNode: HandleDropNode = (
    e: React.DragEvent<HTMLDivElement>,
    pathOfTargetNode: string
  ) => {
    const pathOfSrcNode = e.dataTransfer.getData("pathOfSrcNode");
    const srcNode = _.get(data, pathOfSrcNode);
    const targetNode = _.get(data, pathOfTargetNode);

    //Code to sort node from within the same group at the Nav level working fine
    if (
      pathOfSrcNode.split(".").length == 1 &&
      pathOfTargetNode.split(".").length == 1
    ) {
      const js = structuredClone(data);
      _.update(js, pathOfSrcNode, () => targetNode);
      _.update(js, pathOfTargetNode, () => srcNode);
      const updatedSortOrder = js.map((node, index) => ({
        ...node,
        sortOrder: `${index + 1}`,
      }));
      setData(updatedSortOrder);
      return;
    }

    const parentPathOfSrcNode = pathOfSrcNode.split(".").slice(0, -1).join(".");
    const indexToModify = parseInt(
      pathOfSrcNode.split(".")[pathOfSrcNode.split(".").length - 1]
    );
    const parentPathOfTargetNode = pathOfTargetNode
      .split(".")
      .slice(0, -1)
      .join(".");

    //Code to sort node from within the same group working finely
    if (parentPathOfSrcNode == parentPathOfTargetNode) {
      const js = structuredClone(data);
      _.update(js, pathOfSrcNode, () => targetNode);
      _.update(js, pathOfTargetNode, () => srcNode);
      const updatedParentNode = _.get(js, parentPathOfSrcNode);
      const updatedSortOrder = updatedParentNode.map(
        (node: TreeNode, index: number) => ({
          ...node,
          sortOrder: `${index + 1}`,
        })
      );
      handleUpdateJson(parentPathOfSrcNode, updatedSortOrder);
      return;
    }

    //Code To Drop nodes from any group to any other group working finely
    if (pathOfSrcNode !== pathOfTargetNode && targetNode.type == "group") {
      const js = structuredClone(data);

      if (!parentPathOfSrcNode) {
        const srcNode = js.splice(indexToModify, 1)[0];
        targetNode.items.push({
          ...srcNode,
          sortOrder: `${targetNode.items.length + 1}`,
        });
        const updatedMainGroup = js.map((node: TreeNode, index: number) => ({
          ...node,
          sortOrder: `${index + 1}`,
        }));
        _.set(updatedMainGroup, pathOfTargetNode, targetNode);
        setData(updatedMainGroup);
        return;
      }

      const parentOfSrcNode = _.get(js, parentPathOfSrcNode);

      // Remove the node from the source group
      const srcNode = parentOfSrcNode.splice(indexToModify, 1)[0];

      // Update the sort order of the source group
      const sortedItemsOfSrcNode = parentOfSrcNode.map(
        (node: TreeNode, index: number) => ({
          ...node,
          sortOrder: `${index + 1}`,
        })
      );

      // Add the node to the target group
      targetNode.items.push({
        ...srcNode,
        sortOrder: `${targetNode.items.length + 1}`,
      });

      // Update the sort order of the target group
      const sortedItemsOfTargetNode = targetNode.items.map(
        (node: TreeNode, index: number) => ({
          ...node,
          sortOrder: `${index + 1}`,
        })
      );

      // Update the source group and target group in the state
      _.set(js, parentPathOfSrcNode, sortedItemsOfSrcNode);
      _.set(js, pathOfTargetNode, {
        ...targetNode,
        items: sortedItemsOfTargetNode,
      });
      setData(js);
    } else {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "warning",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Warnig",
          text: `Can't drop here`,
          closeButton: false,
        } as any
      );
    }
  };

  const handleDeleteKeys = (path: string, fab: string) => {
    const js = structuredClone(data);
    const datas: any = _.get(js, path);
    delete datas[fab];
    handleUpdateJson(path, datas);
  };

  const handleDeleteMenuGrp = (path: string, isCalledfromNav?: boolean) => {
    const js = structuredClone(data);
    if (isCalledfromNav) {
      const indexToDelete = parseInt(path);
      js.splice(indexToDelete, 1);
      setData(js);
    } else {
      const parentPath = path.split(".").slice(0, -1).join(".");
      const indexToDelete = parseInt(
        path.split(".")[path.split(".").length - 1]
      );
      const parentData: any = _.get(js, parentPath);
      parentData.splice(indexToDelete, 1);
      handleUpdateJson(parentPath, parentData);
    }
  };

  const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    target.scrollLeft = source.scrollLeft;
  };

  useEffect(() => {
    const headerSection = headerSectionRef.current;
    const contentSection = contentSectionRef.current;

    if (headerSection && contentSection) {
      const handleHeaderScroll = () =>
        syncScroll(headerSection, contentSection);
      const handleContentScroll = () =>
        syncScroll(contentSection, headerSection);

      headerSection.addEventListener("scroll", handleHeaderScroll);
      contentSection.addEventListener("scroll", handleContentScroll);

      return () => {
        headerSection.removeEventListener("scroll", handleHeaderScroll);
        contentSection.removeEventListener("scroll", handleContentScroll);
      };
    }
  }, []);

  const handleClearKeys = () => {
    if (clearKeyPath) {
      handleUpdateJson(clearKeyPath, {});
    } else {
      toast(
        <TorusToast setWordLength={setWordLength} wordLength={wordLength} />,
        {
          type: "warning",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          title: "Warnig",
          text: `Please select a MenuItem to clear keys`,
          closeButton: false,
        } as any
      );
    }
  };

  return (

    <div className="flex w-full">
      <div className="flex flex-col w-full">
        <div
          ref={headerSectionRef}
          className="flex w-full overflow-x-auto p-[0.58vw] rounded-xl gap-[0.58vw] scrollbar-hide"
          style={{
            backgroundColor: torusTheme["bgCard"],
            color: torusTheme["text"],
            borderColor: torusTheme["border"]
          }}
        >
          {data.map((node: TreeNode, id: number) => (
            <div
              draggable
              onDragStart={(e) => handleDragStartOfNode(e, `${id}`)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropNode(e, `${id}`)}
              key={id}
              className="flex p-[0.73vw] items-center gap-[0.58vw] border rounded flex-[0_0_23%] group relative cursor-pointer "
              style={{
                backgroundColor: torusTheme["bg"],
                color: torusTheme["text"],
                borderColor: torusTheme["border"]
              }}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
            >
              <SixDotsSvg fill={torusTheme["text"]} />
              {isInput === `${id}` ? (
                <Input
                  defaultValue={node.title}
                  className="border leading-[2.22vh] mr-[0.58vw] w-full focus:outline-none rounded-lg p-[0.29vw]"
                  style={{
                    backgroundColor: torusTheme["bgCard"],
                    color: torusTheme["text"],
                    borderColor: torusTheme["border"],
                    fontSize: `${fontSize * 0.83}vw`
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter"
                      ? handleChangeTitle(e, id.toString())
                      : null
                  }
                  onBlur={(e) => { handleChangeTitle(e, id.toString()); e.target.style.borderColor = "" }}
                  onFocus={(e) => (e.target.style.borderColor = accentColor)}
                />
              ) : (
                <span
                  className="leading-[2.22vh]"
                  style={{ fontSize: `${fontSize * 0.83}vw` }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setInput(id.toString());
                  }}
                >
                  {node.title}
                </span>
              )}
              <RACButton
                onPress={() => handleDeleteMenuGrp(`${id}`, true)}
                className="ml-auto mr-[0.58vw] focus:outline-none h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <DeleteIcon fill="#EF4444" />
              </RACButton>
            </div>
          ))}

          <DialogTrigger>
            <RACButton
              className="flex focus:outline-none px-[0.58vw] items-center rounded "
              style={{
                borderColor: torusTheme["border"],
                backgroundColor: torusTheme["bg"]
              }}

            >
              <PlusIcon fill={torusTheme["text"]} />
            </RACButton>
            <Popover placement="left">
              <Dialog className="border focus:outline-none rounded-lg "
                style={{
                  borderColor: torusTheme["border"],
                  backgroundColor: torusTheme["bgCard"],
                  color: torusTheme["text"],
                }}>
                {({ close }) => (
                  <div className="flex flex-col px-[1.46vw] py-[0.58vw] gap-[0.58vw]">
                    <RACButton
                      onPress={() => handleAddMenuGrp("group", close)}
                      className={"focus:outline-blue-300 p-[0.29vw] leading-[2.22vh]"}
                      style={{ fontSize: `${fontSize * 0.72}vw` }}
                    >
                      MenuGroup
                    </RACButton>
                    <RACButton
                      onPress={() => handleAddMenuGrp("item", close)}
                      className={"focus:outline-blue-300 p-[0.29vw] leading-[2.22vh]"}
                      style={{ fontSize: `${fontSize * 0.72}vw` }}
                    >
                      MenuItem
                    </RACButton>
                  </div>
                )}
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
        <div
          ref={contentSectionRef}
          className="flex h-[60vh] w-[95%] overflow-x-auto scrollbar-thin gap-[1.17vw]"
        >
          {data.map((node: TreeNode, id: number) => {
            if (node.type === "group") {
              return (
                <div className="flex-[0_0_23%]" key={id}>
                  {node.items?.map((subNode, index) => (
                    <div className="w-full" key={index}>
                      <RenderAccordian
                        node={subNode}
                        level={0}
                        path={`${id}.items.${index}`}
                        handleUpdateJson={handleUpdateJson}
                        handleDropNode={handleDropNode}
                        handleDragStartOfNode={handleDragStartOfNode}
                        handleDeleteKeys={handleDeleteKeys}
                        handleDeleteMenuGrp={handleDeleteMenuGrp}
                        isDarkMode={isDarkMode}
                        setClearKeyPath={setClearKeyPath}
                      />
                    </div>
                  ))}
                  <DialogTrigger>
                    <RACButton
                      className="w-[92%] flex items-center justify-center mt-[0.73vw] py-[0.58vw] ml-[0.58vw] rounded-lg border-[0.14vw] border-dashed focus:outline-none "
                      style={{
                        borderColor: torusTheme["border"],
                      }}
                    >
                      <PlusIcon fill={torusTheme["text"]} />
                    </RACButton>
                    <Popover placement="bottom">
                      <Dialog className="border focus:outline-none rounded-lg  "
                        style={{
                          borderColor: torusTheme["border"],
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                        }}>
                        {({ close }) => (
                          <div className="flex flex-col px-[1.46vw] py-[0.58vw] gap-[0.58vw]">
                            <RACButton
                              onPress={() =>
                                handleNewMenuItem(id, "group", close)
                              }
                              className={"focus:outline-blue-300 p-[0.29vw] leading-[2.22vh]"}
                              style={{ fontSize: `${fontSize * 0.72}vw` }}
                            >
                              MenuGroup
                            </RACButton>
                            <RACButton
                              onPress={() =>
                                handleNewMenuItem(id, "item", close)
                              }
                              className={"focus:outline-blue-300 p-[0.29vw] leading-[2.22vh]"}
                              style={{ fontSize: `${fontSize * 0.72}vw` }}
                            >
                              MenuItem
                            </RACButton>
                          </div>
                        )}
                      </Dialog>
                    </Popover>
                  </DialogTrigger>
                </div>
              );
            } else {
              return (
                <div
                  className="flex-[0_0_23%] ml-[1.17vw] h-fit border mt-[0.87vw] rounded  "
                  style={{
                    borderColor: torusTheme["border"]
                  }}
                  key={id}
                >
                  {["df", "uf", "pf"].map((fab, index) => (
                    <TextField
                      className="m-[0.58vw] leading-[2.22vh] relative"
                      style={{ fontSize: `${fontSize * 0.72}vw` }}
                      key={index}
                      onFocus={() => setClearKeyPath(`${id}.keys`)}
                    >
                      <Label />
                      <Input
                        value={node.keys ? node.keys[fab] : ""}
                        readOnly
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const content = e.dataTransfer.getData("key");
                          if (content) {
                            handleUpdateJson(
                              `${id}.keys`,
                              JSON.parse(content),
                              true
                            );
                          }
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = accentColor)
                        }
                        onBlur={(e) => (e.target.style.borderColor = "")}
                        className=
                        "p-[0.58vw] focus:outline-none border w-full rounded-lg pr-[2.34vw]"
                        style={{
                          backgroundColor: torusTheme["bgCard"],
                          color: torusTheme["text"],
                          borderColor: torusTheme["border"]
                        }}

                        name={fab}
                        placeholder={fab}
                      />
                      {node.keys?.[fab] ? (
                        <Button
                          onPress={() => handleDeleteKeys(`${id}.keys`, fab)}
                          className={
                            "absolute right-[0.58vw] top-[0.58vw] focus:outline-none"
                          }
                        >
                          <DeleteIcon fill="#EF4444" />
                        </Button>
                      ) : null}
                      <Text slot="description" />
                      <FieldError />
                    </TextField>
                  ))}
                </div>
              );
            }
          })}
        </div>
      </div>
      {/* this below button is used to trigger the clear key functionality from the builder */}
      <button
        className="hidden"
        onClick={handleClearKeys}
        id="triggerClearKeyFunctionality"
      ></button>
      {/* this above button is used to trigger the clear key functionality from the builder */}
    </div>
  );
};

export default MenuItemAccordian;
