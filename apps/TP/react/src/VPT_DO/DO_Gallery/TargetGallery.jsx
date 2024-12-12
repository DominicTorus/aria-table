/* eslint-disable */
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Breadcrumb, Breadcrumbs, Header, Link } from 'react-aria-components';
import { Panel, useReactFlow } from 'reactflow';
import { Close, LogicCenterSVG } from '../../SVG_Application';
import TorusButton from '../../torusComponents/TorusButton';

import { TorusModellerContext } from '../../Layout';
import { DarkmodeContext } from '../../commonComponents/context/DarkmodeContext';

import { IoIosAdd, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import {
	artifactList,
	getAllCatalogWithArtifactGroup,
} from '../../commonComponents/api/fabricsApi';
import TorusDialog from '../../torusComponents/TorusDialog';
import TorusSearch from '../../torusComponents/TorusSearch';

import { IoCloseOutline } from 'react-icons/io5';
import CatalogAccordian from '../../CatalogAccordian';
import TorusDropDown from '../../torusComponents/TorusDropDown';

import _ from 'lodash';
import { getSubflow } from '../../commonComponents/api/orchestratorApi';
import { calculatePositionX, calculatePositionY } from '../../utils/utils';
import { OrchestratorContext } from '../App';

export default function TargetGallery({
	handleArtifactSelectionLogicCenter,
	setAllNodes,
	setNodes,
	selectedArtifactForLogic,
	nodes,
}) {
  const { getNodes, getNode, setEdges } = useReactFlow();
  const {
    setSource,
    target,
    setTarget,
    mappedData,
    selectedTarget,
    setSelectedTarget,
    setTargetItems,
    setSelectedSource,
    setSecurityTarget,
    targetItems,
    setSourceItems,
    setSecurityData,
    setMappedData,
  } = useContext(OrchestratorContext);
  const {
    selectedSubFlow,
    selectedFabric: fabric,
    selectedProject,
    selectedArtifactGroup,
    selectedArtifact,
    selectedVersion,
    client,
    selectedTheme,
  } = useContext(TorusModellerContext);
  const [cataLogListWithArtifactGroup, setCataLogListWithArtifactGroup] =
    useState({});
  const [currentSelecedCatalogandGroup, setCurrentSelecedCatalogandGroup] =
    useState({});
  const [currentSelectedTarget, setCurrentSelectedTarget] = useState({});
  const [currentSelectedFabric, setcurrentSelectedFabric] = useState('');
  const [artifactsList, setArtifactsList] = useState([]);
  const [targetClone, setTargetClone] = useState({});

	const handleCatalogWithArtifactGroup = useCallback(async (fabric, client) => {
		try {
			return await getAllCatalogWithArtifactGroup(fabric, client)
				.then((res) => res.data)
				.catch((err) => {
					console.error(err);
				});
		} catch (error) {
			console.error(error);
		}
	});
	const { darkMode } = useContext(DarkmodeContext);

	const handleArtifactChange = (value, client) => {
		try {
			handleCatalogWithArtifactGroup(value, client)
				.then((res) => {
					setCataLogListWithArtifactGroup(res);
				})
				.catch((err) => {
					console.error(err);
				});

      setcurrentSelectedFabric(value);
    } catch (error) {
      console.log(error);
    }
  };

	useEffect(() => {
		if (fabric === 'DF-DFD') handleArtifactChange('DF-DST', client);
		else handleArtifactChange(fabric, client);
	}, [fabric]);

	useEffect(() => {
		artiFactSelection({
			tKey: 'AF',
			catalog: selectedProject,
			artifactGroup: selectedArtifactGroup,
			artifact: selectedArtifact,
			version: selectedVersion,
		});
	}, []);

	useEffect(() => {
		if (
			!targetItems ||
			!Array.isArray(targetItems) ||
			targetItems?.length === 0
		) {
			if (selectedSubFlow === 'DO')
				handleConfirm(currentSelectedTarget, '', selectedSubFlow, true);
			else handleConfirm(currentSelectedTarget, '', selectedSubFlow, false);
		}
	}, [currentSelectedTarget]);

	console.log(targetItems, 'tar-0');

	const handleAccordionContentToggle = async (value) => {
		try {
			let res = await artifactList(
				currentSelectedFabric,
				JSON.stringify([
					client,
					value?.tKey,
					currentSelectedFabric,
					value?.catalog,
					value?.artifactGroup,
				]),
				true,
			)
				.then((res) => res.data)
				.catch((err) => {
					console.error(err);
				});
			setArtifactsList(res);
			setCurrentSelecedCatalogandGroup(value);
		} catch (error) {
			console.log(error);
		}
	};

	console.log(target, 'ittfirst');
	const accordionItems = useMemo(() => {
		return [
			{
				title: 'My Artifacts',
				type: 'categery',
				id: 'AF',
				content: cataLogListWithArtifactGroup?.['AF'] ?? [],
			},
			{
				title: 'Shared with me',
				type: 'categery',
				id: 'AFS',
				content: cataLogListWithArtifactGroup?.['AFS'] ?? [],
			},
			{
				title: 'Purchased',
				type: 'categery',
				id: 'AFR',

				content: cataLogListWithArtifactGroup?.['AFR'] ?? [],
			},
		];
	}, [cataLogListWithArtifactGroup]);

	const showSelectedVersion = (catalogAndGroup, artifact) => {
		try {
			let redisKey =
				'CK:' +
				client +
				':FNGK:' +
				catalogAndGroup?.tKey +
				':FNK:' +
				currentSelectedFabric +
				':CATK:' +
				catalogAndGroup?.catalog +
				':AFGK:' +
				catalogAndGroup?.artifactGroup +
				':AFK:' +
				artifact;

			if (
				currentSelectedTarget?.path &&
				currentSelectedTarget?.path.startsWith(redisKey) &&
				currentSelectedTarget?.artifact === artifact
			) {
				let versionSet = new Set([]);

				versionSet.add(currentSelectedTarget?.version);

				return versionSet;
			} else {
				return new Set(['v']);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const artiFactSelection = (artifactInfo) => {
		try {
			let redisKey =
				'CK:' +
				client +
				':FNGK:' +
				artifactInfo?.tKey +
				':FNK:' +
				(fabric === 'DF-DFD' ? 'DF-DST' : fabric) +
				':CATK:' +
				artifactInfo?.catalog +
				':AFGK:' +
				artifactInfo?.artifactGroup +
				':AFK:' +
				artifactInfo?.artifact +
				':AFVK:' +
				artifactInfo?.version;
			setCurrentSelectedTarget({
				...artifactInfo,
				path: redisKey,
			});

			setSecurityTarget(redisKey);

			setMappedData({
				...mappedData,
				target: {
					key: redisKey,
					targetType: 'screen',
					targetName: artifactInfo?.artifact,
				},
			});

			setTarget({
				key: redisKey,
				targetType: 'screen',
				targetName: artifactInfo?.artifact,
			});
			setTargetClone({
				key: redisKey,
				targetType: 'screen',
				targetName: artifactInfo?.artifact,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const handleConfirm = (
		currentTarget,
		close,
		selectedSubFlow,
		initial = false,
	) => {
		try {
			let otherKey = [
				'CK',
				'FNGK',
				'FNK',
				'CATK',
				'AFGK',
				'AFK',
				'AFVK',
				'AFSK',
			];
			console.log(currentTarget, 'currentTarget');
			let key;
			if (selectedSubFlow === 'DO') {
				key = currentTarget?.path.replace('DF-DST:', 'DF-DFD:').split(':');
			} else {
				key = currentTarget?.path.split(':');
			}
			key = key.filter((item) => !otherKey.includes(item));
			console.log(currentTarget, 'key');
			getSubflow(JSON.stringify(key), selectedSubFlow)
				.then((res) => {
					if (res && res?.data && res?.status === 200) {
						console.log(res, 'itttargetresting');
						if (res?.data?.nodes) {
							setNodes(res?.data?.nodes);
						} else {
							setNodes([]);
						}
						if (res?.data?.edges) {
							setEdges(res?.data?.edges);
						} else {
							setEdges([]);
						}

						if (!_.isEmpty(res?.data?.source)) setSource(res?.data?.source);
						else setSource([]);
						if (!_.isEmpty(res?.data?.target)) setTarget(res?.data?.target);
						else setTarget(targetClone);
						if (res?.data?.mappedData) {
							setMappedData(res?.data?.mappedData);
						} else {
							setMappedData({});
						}

						if (res?.data?.logicCenterData) {
							setMappedData((prev) => ({
								...prev,
								...res?.data?.logicCenterData,
							}));
						}

						if (res?.data?.securityData) {
							setSecurityData(res?.data?.securityData);
						} else {
							setSecurityData({});
						}

						if (res?.data?.securityCenterData) {
							setSecurityData((prev) => ({
								...prev,
								securityTemplate: res?.data?.securityCenterData,
							}));
						}
						if (res?.data?.selectedSource) {
							setSelectedSource(res?.data?.selectedSource);
						} else {
							setSelectedSource([]);
						}
						if (selectedSubFlow == 'DO' && res?.data?.sourceItems) {
							setSourceItems(res?.data?.sourceItems);
						} else {
							setSourceItems([]);
						}
						let newSourceNode = {
							id: currentTarget?.path,
							type: 'customTargetItems',
							data: res?.data?.targetItems ?? [],
							position: {
								x: calculatePositionX(900),
								y: calculatePositionY(15),
							},
						};

						let node = getNode(currentTarget?.path);
						if (!node) {
							setNodes((prev) =>
								prev
									.filter((node) => node.type !== 'customTargetItems')
									.concat(newSourceNode),
							);
						}

						setTargetItems(res?.data?.targetItems ?? []);
						setSelectedTarget(currentTarget);
						// setTarget(currentTarget);
					}
				})
				.catch((error) => {
					console.error(error);
				});
			close();
			setCurrentSelectedTarget({});
			setCurrentSelecedCatalogandGroup({});
			setArtifactsList([]);
		} catch (error) {
			console.log(error);
		}
	};

	const handleConfirmDo = (currentSelectedTarget, close, selectedSubFlow) => {
		console.log(
			'🚀 ~ handleConfirmDo ~ currentSelectedTarget:',
			currentSelectedTarget,
		);
	};
	console.log(target, 'itttarget');

	return (
		<Panel
			position="right"
			style={{
				pointerEvents: 'all',
				backgroundColor: `${selectedTheme?.bg}`,
				border: `0.3px solid ${selectedTheme && selectedTheme?.border}`,
			}}
			className={`h-[90vh] w-[12%] rounded-[0.5vw] border`}
		>
			<Header
				className={`font-inter border border-b pb-2 pl-2 pr-0 pt-2 text-[0.83vw] font-semibold leading-[2.22vh] tracking-normal transition-opacity duration-1000 ease-in-out`}
				style={{
					backgroundColor: `transparent`,
					borderColor: `${selectedTheme?.['border']}`,
					borderTop: `0`,
					borderLeft: `0`,
					borderRight: `0`,
					color: `${selectedTheme?.['textOpacity/50']}`,
				}}
			>
				Target
			</Header>
			<div className="flex  h-[96%] w-full ">
				<div className="w-full p-2">
					<DisplayTarget
						handleArtifactSelectionLogicCenter={
							handleArtifactSelectionLogicCenter
						}
						setAllNodes={setAllNodes}
						setNodes={setNodes}
						selectedArtifactForLogic={selectedArtifactForLogic}
					/>
					{selectedSubFlow === 'DO' ? (
						<>
							{!selectedTarget?.path && (
								<div className=" mt-2 border border-dashed border-slate-300 px-2   py-2 dark:border-[#CBD5E1]">
									<span className="flex  justify-center ">
										<TorusDialog
											key={'AddTarget'}
											triggerElement={
												<TorusButton
													size={'md'}
													radius={'lg'}
													isIconOnly={true}
													height={'md'}
													Children={
														<IoIosAdd
															color={darkMode ? 'white' : 'black'}
															size={18}
														/>
													}
													fontStyle={'text-sm font-medium text-[#FFFFFF]'}
												/>
											}
											classNames={{
												modalOverlayClassName: ' pt-[4.5%] items-start',
												modalClassName:
													' h-[65.27vh]  w-[36.61vw] flex  justify-center items-center ',
												dialogClassName:
													' w-full h-full   rounded-lg flex-col bg-white  ',
											}}
											title={'Add'}
											message={'Edit'}
										>
											{({ close }) => (
												<div
													className={` flex h-full w-full flex-col justify-between rounded-lg border border-[#E5E9EB] bg-white dark:border-[#212121] dark:bg-[#161616] `}
												>
													<div className="flex h-[10%] w-[100%] flex-row border-b border-[#E5E9EB] p-2 dark:border-[#212121]">
														<div className="flex  items-center justify-start">
															<p className="px-2 text-start text-[12px] font-semibold text-black dark:text-white">
																Library
															</p>
														</div>
														<div className="flex w-full items-center justify-center">
															<div className="flex w-[21.56vw] items-center justify-center">
																<TorusSearch
																	height="sm"
																	placeholder="Search"
																	radius="sm"
																	textStyle={
																		'text-black dark:text-white text-[0.83vw] font-normal leading-[2.22vh] tracking-normal pl-[0.5vw]'
																	}
																	borderColor={'border-[#00000026]'}
																	bgColor="bg-[#F4F5FA] dark:bg-[#0F0F0F]"
																	placeholderStyle={
																		'placeholder:text-[#1C274C] dark:placeholder:text-[#FFFFFF]/35 text-start  placeholder-opacity-75 placeholder:text-[0.72vw]  dark:placeholder-[#3f3f3f]'
																	}
																	// onChange={handleSearchChange}
																/>
															</div>
														</div>
														<div className="flex  flex-row  items-center justify-end gap-2 ">
															<span
																className="flex cursor-pointer items-center justify-center rounded-md  transition-all duration-200  "
																onClick={() => {
																	close();
																	setCurrentSelectedTarget({});
																	setCurrentSelecedCatalogandGroup({});
																	setArtifactsList([]);
																}}
															>
																<IoCloseOutline
																	size={18}
																	className="  text-black dark:text-white"
																/>
															</span>
														</div>
													</div>
													<div className="flex h-full w-[90%] items-center justify-center border-l border-[#E5E9EB]  dark:border-[#212121]   ">
														<div
															className="flex h-full w-[10.50vw] flex-col items-start justify-start
                             gap-1 border-r border-[#E5E9EB] dark:border-[#212121]"
														>
															<CatalogAccordian
																items={accordionItems}
																onSelectionChange={(data) => {
																	handleAccordionContentToggle(data);
																}}
															/>
														</div>

														<div className="justify-flex-start flex h-[100%] w-[23vw]  scroll-m-1 flex-col items-center gap-1 px-[1.55vh] pt-[0.85vh]">
															<div className="flex h-[290px] w-full flex-col items-center justify-start transition-all duration-300 ">
																<div
																	className={` flex h-[100%] w-full flex-col items-center justify-start overflow-y-scroll scroll-smooth scrollbar-default `}
																>
																	{artifactsList && artifactsList.length > 0 ? (
																		<>
																			{artifactsList.map((obj, index) => {
																				return (
																					<div
																						className={`flex h-[5vh] w-[100%] items-center justify-center py-[1vh]`}
																					>
																						<div className="flex  h-[3.14vh] w-[17vw]  flex-row items-center justify-between rounded bg-[#F4F5FA] px-[0.5vw] py-[0.5vh] dark:bg-[#0F0F0F]">
																							<>
																								<div className="flex h-full w-[70%] flex-row items-center justify-start">
																									<div className="flex h-full w-full items-center justify-start truncate  text-[0.72vw] font-medium text-black dark:text-white">
																										{obj?.artifact}
																									</div>
																								</div>
																							</>
																						</div>
																						<div className="flex  h-[1.77vw] w-[6vw] items-center justify-end ">
																							<TorusDropDown
																								title={
																									<div className="flex w-[100%] items-center justify-between">
																										<div>
																											{currentSelectedTarget
																												? showSelectedVersion(
																													currentSelecedCatalogandGroup,
																													obj?.artifact,
																													)
																												: 'v'}
																										</div>
																										<div>
																											<IoIosArrowDown
																												className="text-[#667085] dark:text-white"
																												size={'0.83vw'}
																											/>
																										</div>
																									</div>
																								}
																								selectionMode="single"
																								selected={
																									currentSelectedTarget &&
																									showSelectedVersion(
																										currentSelecedCatalogandGroup,
																										obj?.artifact,
																									)
																								}
																								fontStyle={
																									'w-[100%] flex justify-between items-center'
																								}
																								setSelected={(e) => {
																									artiFactSelection({
																										tKey: currentSelecedCatalogandGroup.tKey,
																										catalog:
																											currentSelecedCatalogandGroup.catalog,
																										artifactGroup:
																											currentSelecedCatalogandGroup.artifactGroup,
																										artifact: obj?.artifact,
																										version: Array.from(e)[0],
																									});
																								}}
																								items={
																									obj?.versionList &&
																									obj?.versionList?.map(
																										(item) => ({
																											label: item,
																											key: item,
																										}),
																									)
																								}
																								classNames={{
																									buttonClassName:
																										'rounded border-none px-2 outline-none  h-[3.14vh] w-[4.27vw] text-[0.72vw] font-medium text-[#101828]   bg-[#F4F5FA] dark:bg-[#0F0F0F] text-start dark:text-white',
																									popoverClassName:
																										'flex item-center justify-center w-[4.27vw] text-[0.72vw]',
																									listBoxClassName:
																										'overflow-y-auto bg-white border border-[#F2F4F7] dark:bg-[#0F0F0F] ',
																									listBoxItemClassName:
																										'flex  justify-between text-md',
																								}}
																							/>
																						</div>
																					</div>
																				);
																			})}
																		</>
																	) : (
																		<div
																			className="flex h-full w-full items-center justify-center text-[12px]"
																			style={{
																				color: `${selectedTheme?.text}80`,
																			}}
																		>
																			no artifacts
																		</div>
																	)}
																</div>
															</div>
														</div>
													</div>
													{/* <div className="flex h-[50%] w-full items-center justify-center border-l border-[#E5E9EB] px-[1.5vw]  dark:border-[#212121]   ">
		<TorusModularInput
			key={'DataSet Name'}
			label={'DataSet Name'}
			isRequired={true}
			type="text"
			placeholder="Type Key..."
			bgColor="bg-transparent"
			labelColor="text-black dark:text-white/35 "
			labelSize={'text-[0.62vw] pl-[0.25vw]'}
			outlineColor="#cbd5e1"
			textColor="text-black dark:text-white"
			radius="sm"
			size=""
			isReadOnly={false}
			isDisabled={false}
			errorShown={false}
			isClearable={true}
			backgroundColor={'bg-gray-300/25 dark:bg-[#161616]'}
			onChange={(e) => {
				setDataSetName(e);
			}}
			// value={value}
			defaultValue={dataSetName}
			textSize={'text-[0.83vw]'}
			inputClassName={'px-[0.25vw] py-[0.55vh]'}
			wrapperClass={'px-[0.25vw] py-[0.55vh]'}
		/>
		</div> */}

			<div className="flex h-[10%] w-full flex-row  border-t border-gray-300 p-2 dark:border-[#212121] ">
				<div className="flex w-full items-center justify-end gap-2">
					<TorusButton
						onPress={() => {
							handleConfirmDo(
								currentSelectedTarget,
								close,
								selectedSubFlow,
							);
						}}
						buttonClassName={` text-[0.72vw] bg-[#0736C4]  text-white cursor-pointer"  w-[84.67px] h-[29.33px] rounded-md  font-normal  flex justify-center items-center`}
						Children={'Confirm'}
					/>
				</div>
			</div>
			</div>
			)}
			</TorusDialog>
			</span>
			</div>
			)}
			</>
			) : (
				<>
					{!selectedTarget?.path && (
						<div className=" mt-2 border border-dashed border-slate-300 px-2   py-2 dark:border-[#CBD5E1]">
							<span className="flex  justify-center ">
								<TorusDialog
									key={'AddSource'}
									triggerElement={
										<TorusButton
											size={'md'}
											radius={'lg'}
											isIconOnly={true}
											height={'md'}
											Children={
												<IoIosAdd
													color={darkMode ? 'white' : 'black'}
													size={18}
												/>
											}
											fontStyle={'text-sm font-medium text-[#FFFFFF]'}
										/>
									}
									classNames={{
										modalOverlayClassName: ' pt-[4.5%] items-start',
										modalClassName:
											' h-[65.27vh]  w-[36.61vw] flex  justify-center items-center ',
										dialogClassName:
											' w-full h-full   rounded-lg flex-col bg-white  ',
									}}
									title={'Add'}
									message={'Edit'}
									children={({ close }) => (
										<div
											className={` flex h-full w-full flex-col justify-between rounded-lg border border-[#E5E9EB] bg-white dark:border-[#212121] dark:bg-[#161616] `}
										>
											<div className="flex h-[10%] w-[100%] flex-row border-b border-[#E5E9EB] p-2 dark:border-[#212121]">
												<div className="flex  items-center justify-start">
													<p className="px-2 text-start text-[12px] font-semibold text-black dark:text-white">
														Library
													</p>
												</div>
												<div className="flex w-full items-center justify-center">
													<div className="flex w-[21.56vw] items-center justify-center">
														<TorusSearch
															height="sm"
															placeholder="Search"
															radius="sm"
															textStyle={
																'text-black dark:text-white text-[0.83vw] font-normal leading-[2.22vh] tracking-normal pl-[0.5vw]'
															}
															borderColor={'border-[#00000026]'}
															bgColor="bg-[#F4F5FA] dark:bg-[#0F0F0F]"
															placeholderStyle={
																'placeholder:text-[#1C274C] dark:placeholder:text-[#FFFFFF]/35 text-start  placeholder-opacity-75 placeholder:text-[0.72vw]  dark:placeholder-[#3f3f3f]'
															}
															// onChange={handleSearchChange}
														/>
													</div>
												</div>
												<div className="flex  flex-row  items-center justify-end gap-2 ">
													<span
														className="flex cursor-pointer items-center justify-center rounded-md  transition-all duration-200  "
														onClick={() => {
															close();
															setCurrentSelectedTarget({});
															setCurrentSelecedCatalogandGroup({});
															setArtifactsList([]);
														}}
													>
														<IoCloseOutline
															size={18}
															className="  text-black dark:text-white"
														/>
													</span>
												</div>
											</div>
											{/* <div className="flex h-[52.03vh] flex-row justify-center"> */}
											{/* <div className="h-full  w-[3.33vw] ">
			<div className="flex h-[97%] w-[97%] flex-col items-center justify-start gap-1">
				<div className="flex h-full w-[100%] flex-col items-center  justify-start  pt-1 ">
					<TorusTab
						defaultSelectedKey={selectedFabric}
						key="TorusTab"
						orientation="vertical"
						classNames={{
							tabs: "cursor-pointer ",
							tabList:
								"w-full h-[100%]  flex justify-center items-center gap-[0.85vh] transition-all duration-200",
							tab: `h-full w-full flex justify-center items-center torus-pressed:outline-none torus-focus:outline-none `,
						}}
						tabs={[
							{
								id: "DF",
								content: ({ isSelected }) => (
									<div
										className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? "bg-[#F4F5FA] dark:bg-[#252525]" : ""} `}
									>
										<Data
											className={"h-[1.25vw] w-[1.25vw] "}
											strokeColor={
												!isSelected ? "#A59E92" : "#000000"
											}
										/>
									</div>
								),
							},
							{
								id:
									selectedFabric === "events"
										? "events"
										: "UF",
								content: ({ isSelected }) => (
									<div
										className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? "bg-[#F4F5FA] dark:bg-[#252525]" : ""} `}
									>
										<Wire
											className={"h-[1.25vw] w-[1.25vw]"}
											strokeColor={
												!isSelected ? "#A59E92" : "#000000"
											}
										/>
									</div>
								),
							},
							{
								id: "PF",
								content: ({ isSelected }) => (
									<div
										className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? "bg-[#F4F5FA] dark:bg-[#252525]" : ""} `}
									>
										<Connect
											className={"h-[1.25vw] w-[1.25vw]"}
											strokeColor={
												!isSelected ? "#A59E92" : "#000000"
											}
										/>
									</div>
								),
							},
							// {
							// id: "SF",
							// content: ({ isSelected }) => (
							// <div
							// className={`flex h-[2.39vw] w-[2.39vw] items-center justify-center rounded ${isSelected ? "bg-[#F4F5FA] dark:bg-[#252525]" : ""} `}
							// >
							// <Sheild
							// className={"h-[1.25vw] w-[1.25vw]"}
							// strokeColor={
							// !isSelected ? "#A59E92" : "#000000"
							// }
							// />
							// </div>
							// ),
							// },
						]}
						onSelectionChange={handleArtifactChange}
					/>
				</div>
			</div>
		</div> */}

			<div className="flex h-full w-[90%] items-center justify-center border-l border-[#E5E9EB]  dark:border-[#212121]   ">
				<div
					className="flex h-full w-[10.50vw] flex-col items-start justify-start
                             gap-1 border-r border-[#E5E9EB] dark:border-[#212121]"
				>
					<CatalogAccordian
						items={accordionItems}
						onSelectionChange={(data) => {
							handleAccordionContentToggle(data);
						}}
					/>
				</div>

				<div className="justify-flex-start flex h-[100%] w-[23vw]  scroll-m-1 flex-col items-center gap-1 px-[1.55vh] pt-[0.85vh]">
					<div className="flex h-[290px] w-full flex-col items-center justify-start transition-all duration-300 ">
						<div
							className={` flex h-[100%] w-full flex-col items-center justify-start overflow-y-scroll scroll-smooth scrollbar-default `}
						>
							{artifactsList && artifactsList.length > 0 ? (
								<>
									{artifactsList.map((obj, index) => {
										return (
											<div
												className={`flex h-[5vh] w-[100%] items-center justify-center py-[1vh]`}
											>
												<div className="flex  h-[3.14vh] w-[17vw]  flex-row items-center justify-between rounded bg-[#F4F5FA] px-[0.5vw] py-[0.5vh] dark:bg-[#0F0F0F]">
													<>
														<div className="flex h-full w-[70%] flex-row items-center justify-start">
															<div className="flex h-full w-full items-center justify-start truncate  text-[0.72vw] font-medium text-black dark:text-white">
																{obj?.artifact}
															</div>
														</div>
													</>
												</div>
												<div className="flex  h-[1.77vw] w-[6vw] items-center justify-end ">
													{/* <div className="flex w-[100%] items-center justify-between">
			<div>
				{(selectedVersion &&
					selectedArtifact ===
						obj?.artifact &&
					selectedVersion) ||
					"v"}
			</div>
			<div>
				<IoIosArrowDown
					className="text-[#667085] dark:text-white"
					size={"0.83vw"}
				/>
			</div>
			</div> */}
				<TorusDropDown
					title={
						<div className="flex w-[100%] items-center justify-between">
							<div>
								{currentSelectedTarget
									? showSelectedVersion(
										currentSelecedCatalogandGroup,
										obj?.artifact,
										)
									: 'v'}
							</div>
							<div>
								<IoIosArrowDown
									className="text-[#667085] dark:text-white"
									size={'0.83vw'}
								/>
							</div>
						</div>
					}
					selectionMode="multiple"
					selected={
						currentSelectedTarget &&
						showSelectedVersion(
							currentSelecedCatalogandGroup,
							obj?.artifact,
						)
					}
					fontStyle={
						'w-[100%] flex justify-between items-center'
					}
					setSelected={(e) => {
						artiFactSelection({
							tKey: currentSelecedCatalogandGroup.tKey,
							catalog:
								currentSelecedCatalogandGroup.catalog,
							artifactGroup:
								currentSelecedCatalogandGroup.artifactGroup,
							artifact: obj?.artifact,
							version: Array.from(e)[0],
						});
					}}
					items={
						obj?.versionList &&
						obj?.versionList?.map(
							(item) => ({
								label: item,
								key: item,
							}),
						)
					}
					classNames={{
						buttonClassName:
							'rounded border-none px-2 outline-none  h-[3.14vh] w-[4.27vw] text-[0.72vw] font-medium text-[#101828]   bg-[#F4F5FA] dark:bg-[#0F0F0F] text-start dark:text-white',
						popoverClassName:
							'flex item-center justify-center w-[4.27vw] text-[0.72vw]',
						listBoxClassName:
							'overflow-y-auto bg-white border border-[#F2F4F7] dark:bg-[#0F0F0F] ',
						listBoxItemClassName:
							'flex  justify-between text-md',
					}}
				/>
				</div>
				</div>
				);
				})}
				</>
				) : (
					<div
						className="flex h-full w-full items-center justify-center text-[12px]"
						style={{
							color: `${selectedTheme?.text}80`,
						}}
					>
						no artifacts
					</div>
				)}
				</div>
				</div>
				</div>
				</div>
				{/* </div> */}
				<div className="flex h-[10%] w-full flex-row  border-t border-gray-300 p-2 dark:border-[#212121] ">
					<div className="flex w-full items-center justify-end gap-2">
						<TorusButton
							onPress={() => {
								handleConfirm(
									currentSelectedTarget,
									close,
									selectedSubFlow,
								);
							}}
							buttonClassName={` text-[0.72vw] bg-[#0736C4]  text-white cursor-pointer"  w-[84.67px] h-[29.33px] rounded-md  font-normal  flex justify-center items-center`}
							Children={'Confirm'}
						/>
					</div>
				</div>
				</div>
				)}
				/>
				</span>
				</div>
				)}
				</>
				)}
				</div>
				</div>
			</Panel>
	);
}

const DisplayTarget = ({
	setAllNodes,
	setNodes,
	selectedArtifactForLogic,
	handleArtifactSelectionLogicCenter,
}) => {
  const {
    setSelectedSubFlow,
    selectedSubFlow,
    setFromSubFlow,
    selectedTheme,
    selectedAccntColor,
  } = useContext(TorusModellerContext);
  const {
    selectedTarget,
    setSelectedTarget,
    setSelectedSource,
    setSourceItems,
    setTargetItems,
    setTarget,
  } = useContext(OrchestratorContext);
  const { setEdges } = useReactFlow();

  return (
    <>
      {selectedTarget?.path && (
        <div
          className={`justify-space-evenly flex max-h-[90%] w-full  cursor-pointer flex-col items-center gap-2 overflow-scroll  scrollbar-hide`}
        >
          <div
            className={`mb-[0.85vh] mt-[0.55vh] flex  w-full flex-col items-start gap-[0.85vh] rounded-md border p-2 duration-100 ease-in-out transition-background  `}
            style={{
              // backgroundColor: `${
              //   selectedTarget?.path == selectedArtifactForLogic?.path
              //     ? `#D6DFFA`
              //     : `${selectedTheme?.text}80`
              // }`,
              // borderColor: `${
              //   selectedTarget?.path == selectedArtifactForLogic?.path
              //     ? `#D6DFFA`
              //     : `${selectedTheme?.bgCard}`
              // }`,
              backgroundColor: `${
                selectedTarget?.path == selectedArtifactForLogic?.path
                  ? `${selectedAccntColor}50`
                  : `${selectedTheme?.bg}`
              }`,

							borderColor: `${
								selectedTarget?.path == selectedArtifactForLogic?.path
									? `${selectedAccntColor}`
									: `${selectedTheme?.border}`
							}`,
						}}
					>
						<div className="flex w-full items-center justify-between">
							<Breadcrumbs isDisabled className="flex flex-row gap-2 text-xs">
								<Breadcrumb>
									<Link
										className="white-space-nowrap flex max-w-12 flex-row items-center justify-center gap-1 truncate text-[0.52vw] font-normal  leading-[2.22vh]"
										style={{
											color: `${
												selectedTarget?.path == selectedArtifactForLogic?.path
													? `${selectedTheme?.text}`
													: `${selectedTheme?.text}90`
											}`,
										}}
									>
										{selectedTarget?.catalog}
										<IoIosArrowForward />
									</Link>
								</Breadcrumb>

                <Breadcrumb>
                  <Link
                    className="white-space-nowrap flex max-w-12 flex-row items-center justify-start gap-1 truncate text-[0.52vw] font-normal  leading-[2.22vh]"
                    style={{
                      color: `${
                        selectedTarget?.path == selectedArtifactForLogic?.path
                          ? `${selectedTheme?.text}`
                          : `${selectedTheme?.text}90`
                      }`,
                    }}
                  >
                    {selectedTarget?.artifactGroup}
                  </Link>
                </Breadcrumb>
              </Breadcrumbs>
              <div
                title="Logic Center"
                onClick={() => {
                  if (selectedTarget?.path === selectedArtifactForLogic?.path) {
                    handleArtifactSelectionLogicCenter(null);
                  } else handleArtifactSelectionLogicCenter(selectedTarget);
                }}
                className="cursor-pointer"
              >
                <LogicCenterSVG
                  fill={
                    selectedTarget?.path == selectedArtifactForLogic?.path
                      ? `${selectedAccntColor}`
                      : `${selectedTheme?.text}80`
                  }
                  size="0.72vw"
                />
              </div>
              <Close
                props={{
                  onClick: () => {
                    // setSelectedSource([]);
                    // setSourceItems([]);
                    // setSource([" "]);
                    setSelectedTarget({});
                    setTarget([' ']);
                    setTargetItems([]);
                    setSourceItems([]);
                    setSelectedSource([]);
                    setNodes((prev) =>
                      prev.filter((node) => node.type !== 'customSourceItems'),
                    );
                    // resetMappedData();
                    setNodes((prev) =>
                      prev.filter((node) => node.type !== 'customTargetItems'),
                    );
                    setEdges([]);
                    setAllNodes((prev) => {
                      if (!prev) return {};
                      let data = {};
                      Object.keys(prev).forEach((key) => {
                        if (prev[key].type !== 'customTargetItems') {
                          data = {
                            ...data,
                            [key]: prev[key],
                          };
                        }
                      });
                      return data;
                    });
                    setSelectedSubFlow(null);
                    setFromSubFlow(true);
                  },
                }}
                size="0.52vw"
                stroke={`${
                  selectedTarget?.path == selectedArtifactForLogic?.path
                    ? `${selectedTheme?.text}`
                    : `${selectedTheme?.text}80`
                }`}
              />
            </div>

            <div className="flex w-full  items-center justify-between">
              <span
                className="w-[85%] truncate text-[0.83vw] font-medium  "
                style={{
                  color: `${
                    selectedTarget?.path == selectedArtifactForLogic?.path
                      ? `${selectedTheme?.text}`
                      : `${selectedTheme?.text}80`
                  }`,
                }}
              >
                {selectedTarget?.artifact}
              </span>
              <span
                className="flex h-[1.85vh] w-[1.25vw] items-center justify-center rounded-lg px-1 text-[0.52vw] font-medium  leading-[2.22vh] text-white"
                style={{
                  backgroundColor: `${
                    selectedTarget?.path == selectedArtifactForLogic?.path
                      ? `${selectedAccntColor}80`
                      : `${selectedTheme?.text}20`
                  }`,
                  color: `${
                    selectedTarget?.path == selectedArtifactForLogic?.path
                      ? `${selectedTheme?.text}`
                      : `${selectedTheme?.text}90`
                  }`,
                }}
              >
                {selectedTarget?.version}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
