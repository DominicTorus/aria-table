import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { TorusModellerContext } from '../../../Layout';
import { useReactFlow } from 'reactflow';
import { DarkmodeContext } from '../../../commonComponents/context/DarkmodeContext';

import { Delete, EditNode } from '../../../SVG_Application';

import { IoIosArrowForward } from 'react-icons/io';
import { Dialog } from 'primereact/dialog';
import TorusButton from '../../../torusComponents/TorusButton';

export function ContextMenuEvents({
	id,
	top,
	left,
	right,
	bottom,
	uniqueNames,
	onClose,
	currentDrawing,
	changeProperty,
	setToogle,
	onEdit,
	updatedNodeConfig,
	nodeConfig,
	nodeData,
	eventsNodeType,
	eventHandlerType,
	setEventsNodeType,
	setEventHandlerType,
	setContextProps,
	eventJson,
	setDropdownData,
	DropdownData,
	menu,
	selectedResponseData,
	setSelectedResponseData,
	setShowNodeProperty,
	setHandlerNodeVal,
	setRiseListenSidebar,
  setRiseListenSidebarForShow,
  setSelectedHandlerData,
	setnodeid,
	...props
}) {
	// const { controlJson: eventJson } = useContext(TorusModellerContext);
	const { getNode, setNodes, setEdges, getNodes, getEdges } = useReactFlow();
	const [editedHeader, setEditedHeader] = useState('');
	const [toogleInputNameEdit, setToogleInputNameEdit] = useState(false);
	const [isOpen, onOpenChange] = useState(false);
	// const [DropdownData, setDropdownData] = useState([]);
	// const [clickedGroup, setClickedGroup] = useState([]);
	const [visible, setVisible] = useState({
		bool: false,
		type: '',
	});
	const responsedata = ['defaults', 'success', 'fail'];

	const { darkMode } = useContext(DarkmodeContext);
	const [files, setFiles] = useState(null);
	const toast = useRef(null);
	const [nodeInfo, setNodeInfo] = useState(null);
	const activeTab = '';
	const [contextMenuVisible, setContextMenuVisible] = useState(false);
	const [contextMenuPosition, setContextMenuPosition] = useState({
		x: 0,
		y: 0,
	});
	const [rendervalue, setRendervalue] = useState(null);
	const [currentModel, setCurrentModel] = useState(null);
	const [json, setJson] = useState({});

	const [opensideTab, setOpensideTab] = useState(false);

	const node = getNode(id);
	const nodes = getNodes();
	const edges = getEdges();
	setnodeid(node);
	const { mappedData, setMappedData, selectedTheme, selectedAccntColor } =
		useContext(TorusModellerContext);


		useEffect(()=>{
			console.log(node, '<<--$node$-->>');
		},[id])

	// /**
	// * Renders a Builder component based on the provided model and JSON configuration.
	// *
	// * @param {Object} propw - The props object containing the necessary configuration for the Builder component.
	// * @param {Object} model - The model object used to determine the UI policy for the Builder component.
	// * @param {Object} js - The JSON object used as the default configuration for the Builder component.
	// * @return {JSX.Element|null} The rendered Builder component or null if an error occurred.
	// */
	// const handleRender = (propw, model, js) => {
	// try {
	// let ConfigToRender;
	// if (model) {
	// ConfigToRender = (
	// <Builder
	// key={model}
	// isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
	// defaultJSOn={js}
	// controlPolicy={controlPolicy}
	// colorPolicy={colorPolicy}
	// updatedNodeConfig={updatejson}
	// uiPolicy={cardUIPolicy}
	// showError={showError}
	// helperJson={{}}
	// />
	// );
	// } else {
	// ConfigToRender = (
	// <Builder
	// isAdmin={{ canAdd: true, canDelete: true, canEdit: true }}
	// defaultJSOn={js}
	// controlPolicy={controlPolicy}
	// colorPolicy={colorPolicy}
	// updatedNodeConfig={updatejson}
	// uiPolicy={cardUIPolicy}
	// showError={showError}
	// helperJson={{}}
	// />
	// );
	// }
	// return ConfigToRender;
	// } catch (error) {
	// console.error("Something went wrong on handle render");
	// }
	// };

	//function used to
	const risenode = useCallback(
		(type, nodeType, resdata, handlerdata, handlerProperties) => {
			try {
				console.log(type, nodeType, resdata, handlerdata,'reaa');
				if (node?.type === 'rise') return;

				let cuurrentNode = getNode(node.id);
				const hasChild =
					cuurrentNode &&
					Array.isArray(cuurrentNode.data.children) &&
					cuurrentNode.data.children.length > 0;
				let maxChildId;
				if (type === 'rise') {
					if (hasChild && cuurrentNode.data.children.length == 1) {
						maxChildId = cuurrentNode.data.children[0];
						const hasChild = maxChildId.split('.');
						const lastChild = hasChild[hasChild.length - 1];
						maxChildId = parseInt(lastChild, 10);
					} else {
						maxChildId = nodes.reduce((initialId, currentNode) => {
							if (currentNode.id.startsWith(`${node.id}.`)) {
								const hasChild = currentNode.id.split('.');
								const lastChild = hasChild[hasChild.length - 1];
								const childId = parseInt(lastChild, 10);
								return childId;
							}
							return initialId;
						}, 0);
					}
					const newChildId = maxChildId + 1;
					let childId = `${node.id}.${newChildId}`;
					let seq = childId.split('.').splice(1).join('.');
					let validateSuccess = false;
					let validateFailure = false;
					cuurrentNode &&
						cuurrentNode.data.children.length > 0 &&
						getNodes().map((elem) => {
							if (node.data.children.includes(elem.id)) {
								if (
									elem.data.responseType === 'success' &&
									resdata === 'success'
								) {
									validateSuccess = true;
									alert('success exists');
									return elem;
								} else if (
									elem.data.responseType === 'fail' &&
									resdata === 'fail'
								) {
									validateFailure = true;
									alert('fail exists');
									return elem;
								}
							}
							return elem;
						});
					let handlerNode;
					let handlerEdge;

					if (resdata) {
						if (resdata === 'fail' && !validateFailure) {
							const failNode = {
								id: `${node.id}.${newChildId}`,
								type: 'responseNode',
								position: {
									x: node.position.x + Math.random() * (500 - 300) + 100,
									y: node.position.y + Math.random() * (500 - 300) + 100,
								},

								data: {
									label: 'fail',
									responseType: 'fail',
									parentId: node.id,
									sequence: `${seq}`,
									children: [],
								},
							};
							const failEdge = {
								id: `${node.id}->${failNode.id}`,
								source: node.id,
								type: 'straight',
								target: failNode.id,
							};

							const handlerNode = {
								id: `${failNode.id}.1`,
								type: 'handlerNode',
								eventContext: "rise",
								position: {
									x: failNode.position.x + Math.random() * (150 - 100) + 100,
									y: failNode.position.y + Math.random() * (150 - 100) + 100,
								},
								data: {
									label: handlerdata??"rise",
									eventContext: "rise",
									sequence: `${seq}.1`,
									value: '',
									parentId: failNode.id,
									children: [],
								},
							};

							cuurrentNode = {
								...cuurrentNode,
								data: {
									...cuurrentNode.data,
									children: [...cuurrentNode.data.children, failNode.id],
								},
							};

							const handlerEdge = {
								id: `${failNode.id}->${failNode.id}.${newChildId}`,
								source: failNode.id,
								type: 'straight',
								target: handlerNode.id,
							};

							failNode.data.children = [handlerNode.id];
							setNodes((nds) => [
								...nds.filter((n) => n.id !== node.id),
								cuurrentNode,
								handlerNode,
								failNode,
							]);
							setEdges((eds) => [...eds, handlerEdge, failEdge]);
						}

						if (resdata === 'success' && !validateSuccess) {
							const successNode = {
								id: `${node.id}.${newChildId}`,
								type: 'responseNode',
								position: {
									x: node.position.x + Math.random() * (150 - 100) + 100,
									y: node.position.y + Math.random() * (150 - 100) + 100,
								},

								data: {
									label: 'success',
									responseType: 'success',
									parentId: node.id,
									children: [],
									sequence: `${seq}`,
								},
							};

							const handlerNode = {
								id: `${successNode.id}.1`,
								type: 'handlerNode',
								label: handlerdata??"rise",
								eventContext: "rise",
								position: {
									x: successNode.position.x + Math.random() * (150 - 100) + 100,
									y: successNode.position.y + Math.random() * (150 - 100) + 100,
								},
								data: {
									label: handlerdata??"rise",
									eventContext:"rise",
									sequence: `${seq}.1`,
									value: '',
									parentId: successNode.id,
									children: [],
								},
							};

							cuurrentNode = {
								...cuurrentNode,
								data: {
									...cuurrentNode.data,
									children: [...cuurrentNode.data.children, successNode.id],
								},
							};

							const handlerEdge = {
								id: `${successNode.id}->${successNode.id}.${newChildId}`,
								source: successNode.id,
								type: 'straight',
								target: handlerNode.id,
							};

							const successEdge = {
								id: `${node.id}->${successNode.id}`,
								source: node.id,
								type: 'straight',
								target: successNode.id,
							};

							successNode.data.children = [handlerNode.id];

							setNodes((nds) => [
								...nds.filter((n) => n.id !== node.id),
								cuurrentNode,
								handlerNode,
								successNode,
							]);
							setEdges((eds) => [...eds, handlerEdge, successEdge]);
						}
						if (resdata === 'defaults') {
							const handlerNode = {
								id: `${node.id}.${newChildId}`,
								type: 'handlerNode',
								label: handlerdata??"rise",
								eventContext: "rise",
								position: {
									x: node.position.x + Math.random() * (150 - 100) + 100,
									y: node.position.y + Math.random() * (150 - 100) + 100,
								},
								data: {
									label: handlerdata??"rise",
									eventContext:"rise",
									value: '',
									sequence: `${seq}`,
									parentId: node.id,
									children: [],
								},
							};

							cuurrentNode = {
								...cuurrentNode,
								data: {
									...cuurrentNode.data,
									children: [...cuurrentNode.data.children, handlerNode.id],
								},
							};

							const handlerEdge = {
								id: `${node.id}->${node.id}.${newChildId}`,
								source: node.id,
								type: 'straight',
								target: `${node.id}.${newChildId}`,
							};

							setNodes((nds) => [
								...nds.filter((n) => n.id !== node.id),
								cuurrentNode,
								handlerNode,
							]);
							setEdges((eds) => [...eds, handlerEdge]);
						}
						// setShowNodeProperty(false);
						setHandlerNodeVal('');
						setSelectedResponseData('defaults');
					} else {
						setNodes((nds) => [
							...nds.filter((n) => n.id !== node.id),
							cuurrentNode,
							handlerNode,
						]);
						setEdges((eds) => [...eds, handlerEdge]);
					}
				}

				if (type === 'riseListen' && handlerProperties?.listenerType !== "type2") {
					let isValidate = false;
					cuurrentNode &&
						cuurrentNode.data.children.length > 0 &&
						getNodes().map((elem) => {
							if (node.data.children.includes(elem.id)) {
								if (
									elem.data.responseType === 'success' &&
									resdata === 'success'
								) {
									alert('success exists');
									isValidate = true;
									return elem;
								} else if (
									elem.data.responseType === 'fail' &&
									resdata === 'fail'
								) {
									alert('fail exists');
									isValidate = true;
									return elem;
								}
							}
							return elem;	
						});
					if (!isValidate) {
						setRiseListenSidebar(true);
						onOpenChange(true);
            
            
					}
					// setShowNodeProperty(false);
					setHandlerNodeVal('');
				}
        if (type === 'riseListen' && handlerProperties?.listenerType === "type2") {
					let isValidate = false;
					cuurrentNode &&
						cuurrentNode.data.children.length > 0 &&
						getNodes().map((elem) => {
							if (node.data.children.includes(elem.id)) {
								if (
									elem.data.responseType === 'success' &&
									resdata === 'success'
								) {
									alert('success exists');
									isValidate = true;
									return elem;
								} else if (
									elem.data.responseType === 'fail' &&
									resdata === 'fail'
								) {
									alert('fail exists');
									isValidate = true;
									return elem;
								}
							}
							return elem;
						});
					if (!isValidate) {
						setRiseListenSidebar(false);
						setRiseListenSidebarForShow(true);
						onOpenChange(true);
					}
					// setShowNodeProperty(false);
					setHandlerNodeVal('');
				}


				if (type === 'self') {
					if (hasChild && cuurrentNode.data.children.length == 1) {
						maxChildId = cuurrentNode.data.children[0];
						const hasChild = maxChildId.split('.');
						const lastChild = hasChild[hasChild.length - 1];
						maxChildId = parseInt(lastChild, 10);
					} else {
						maxChildId = nodes.reduce((initialId, currentNode) => {
							if (currentNode.id.startsWith(`${node.id}.`)) {
								const hasChild = currentNode.id.split('.');
								const lastChild = hasChild[hasChild.length - 1];
								const childId = parseInt(lastChild, 10);
								return childId > initialId ? childId : initialId;
							}
							return initialId;
						}, 0);
					}

					const newChildId = maxChildId + 1;
					const childId = `${node.id}.${newChildId}`;
					const seq = childId.split('.').splice(1).join('.');

					let handlerNode;
					let handlerEdge;

					if (resdata === 'fail') {
						const failNode = {
							id: `${node.id}.${newChildId}`,
							type: 'responseNode',
							position: {
								x: node.position.x + Math.random() * (500 - 300) + 100,
								y: node.position.y + Math.random() * (500 - 300) + 100,
							},
							data: {
								label: 'fail',
								responseType: 'fail',
								parentId: node.id,
								sequence: `${seq}`,
								children: [],
							},
						};

						const failEdge = {
							id: `${node.id}->${failNode.id}`,
							source: node.id,
							type: 'straight',
							target: failNode.id,
						};

						handlerNode = {
							id: `${failNode.id}.1`,
							type: 'handlerNode',
							label: 'self',
							eventContext: 'self',
							position: {
								x: failNode.position.x + Math.random() * (150 - 100) + 100,
								y: failNode.position.y + Math.random() * (150 - 100) + 100,
							},
							data: {
								label: 'self',
								eventContext: 'self',
								targetId: failNode.id,
								value: '',
								sequence: `${seq}.1`,
								parentId: failNode.id,
								children: [],
							},
						};

						cuurrentNode = {
							...cuurrentNode,
							data: {
								...cuurrentNode.data,
								children: [...cuurrentNode.data.children, failNode.id],
							},
						};

						handlerEdge = {
							id: `${failNode.id}->${failNode.id}.${newChildId}`,
							source: failNode.id,
							type: 'straight',
							target: handlerNode.id,
						};

						failNode.data.children = [handlerNode.id];

						setNodes((nds) => [
							...nds.filter((n) => n.id !== node.id),
							cuurrentNode,
							handlerNode,
							failNode,
						]);
						setEdges((eds) => [...eds, handlerEdge, failEdge]);
					}
					 else if (resdata === 'success') {
						const successNode = {
							id: `${node.id}.${newChildId}`,
							type: 'responseNode',
							position: {
								x: node.position.x + Math.random() * (150 - 100) + 100,
								y: node.position.y + Math.random() * (150 - 100) + 100,
							},
							data: {
								label: 'success',
								responseType: 'success',
								parentId: node.id,
								children: [],
								sequence: `${seq}`,
							},
						};

						handlerNode = {
							id: `${successNode.id}.1`,
							type: 'handlerNode',
							label: 'self',
							eventContext: 'self',
							position: {
								x: successNode.position.x + Math.random() * (150 - 100) + 100,
								y: successNode.position.y + Math.random() * (150 - 100) + 100,
							},
							data: {
								label: 'self',
								eventContext: 'self',
								value: '',
								targetId: successNode.id,
								sequence: `${seq}.1`,
								parentId: successNode.id,
								children: [],
							},
						};

						cuurrentNode = {
							...cuurrentNode,
							data: {
								...cuurrentNode.data,
								children: [...cuurrentNode.data.children, successNode.id],
							},
						};

						const handlerEdge = {
							id: `${successNode.id}->${successNode.id}.${newChildId}`,
							source: successNode.id,
							type: 'straight',
							target: handlerNode.id,
						};

						const successEdge = {
							id: `${node.id}->${successNode.id}`,
							source: node.id,
							type: 'straight',
							target: successNode.id,
						};

						successNode.data.children = [handlerNode.id];

						setNodes((nds) => [
							...nds.filter((n) => n.id !== node.id),
							cuurrentNode,
							handlerNode,
							successNode,
						]);
						setEdges((eds) => [...eds, handlerEdge, successEdge]);
					} 
					else if (resdata === 'defaults') {
						handlerNode = {
							id: `${node.id}.${newChildId}`,
							type: 'handlerNode',
							label: 'self',
							eventContext: 'self',
							position: {
								x: node.position.x + Math.random() * (150 - 100) + 100,
								y: node.position.y + Math.random() * (150 - 100) + 100,
							},
							data: {
								label: 'self',
								eventContext: 'self',
								targetId: node.id,
								value: '',
								sequence: `${seq}`,
								parentId: node.id,
								children: [],
							},
						};

						cuurrentNode = {
							...cuurrentNode,
							data: {
								...cuurrentNode.data,
								children: [...cuurrentNode.data.children, handlerNode.id],
							},
						};

						const handlerEdge = {
							id: `${node.id}->${node.id}.${newChildId}`,
							source: node.id,
							type: 'straight',
							target: `${node.id}.${newChildId}`,
						};

						setNodes((nds) => [
							...nds.filter((n) => n.id !== node.id),
							cuurrentNode,
							handlerNode,
						]);
						setEdges((eds) => [...eds, handlerEdge]);
					}
					 else {
						setNodes((nds) => [
							...nds.filter((n) => n.id !== node.id),
							cuurrentNode,
						]);
					}
					// setShowNodeProperty(false);
					setHandlerNodeVal('');
					setSelectedResponseData('defaults');
				}
			} catch (error) {
				console.error(error);
			}
		},
		[node, setNodes, setEdges, getNode, getNodes, nodes],
	);

	const filterNodes = (nodes, parentId, id) => {
		try {
			const stack = [parentId];
			const visited = new Set();

			while (stack.length > 0) {
				const nodeId = stack.pop();

				if (visited.has(nodeId)) {
					continue;
				}
				visited.add(nodeId);

				const childrenIndexes = nodes
					.map((node, index) =>
						node.data &&
						(node.data.parent === nodeId || node.data.parentId === nodeId)
							? index
							: -1,
					)
					.filter((index) => index !== -1);
				stack.push(
					...childrenIndexes.map((childIndex) => nodes[childIndex].id),
				);

				const nodeIndex = nodes.findIndex((node) => node.id === nodeId);
				if (nodeIndex !== -1) {
					nodes.splice(nodeIndex, 1);
				}
			}

			return nodes;
		} catch (error) {
			console.error(error);
		}
	};

	const filterEdges = (edges, remainingNodeIds) => {
		try {
			return edges.filter((edge) => {
				return (
					remainingNodeIds.includes(edge.source) &&
					remainingNodeIds.includes(edge.target)
				);
			});
		} catch (error) {
			console.error(error);
		}
	};

	function hasTargetKey(data, id) {
		console.log(data, id, 'targetkey');
		if (!data) return false;

		if (data.id === id && data.targetKey) {
			return true;
		}
		if (data.id === id && !data.targetKey && data.children.length === 0)
			return false;

		if (data.id === id && !data.targetKey)
			if (data.children && data.children.length > 0) {
				let found = false;
				for (const child of data.children) {
					if (!found) found = hasTargetKey(child, child.id);
				}
				return found;
			} else return false;

		if (data.children && data.children.length > 0) {
			let found = false;
			for (const child of data.children) {
				if (!found) found = hasTargetKey(child, id);
				else break;
			}
			return found;
		}

		return false;
	}
	const handledeletiononTargetkey = (node, mappedData) => {
		try {
			let checkparent = null;
			let checktarget = node?.id;
			let findedtargetkey = null;
			if (
				node?.data?.hasOwnProperty('parent') ||
				node?.data?.hasOwnProperty('parentId')
			) {
				checkparent = node?.data?.parent ?? node?.data?.parentId;
			}

			console.log(checkparent, node, mappedData, 'checkparent');
			if (checkparent) {
				const relevanNode = mappedData?.artifact?.node.filter((item) => {
					return (
						item?.nodeId === checkparent ||
						item?.nodeId === checkparent.split('.')[0]
					);
				});
				let relavanobj;
				if (relevanNode.length == 0) {
					relavanobj = mappedData?.artifact?.node
						.find(
							(item) =>
								item?.objElements.length > 0 &&
								item.objElements.find(
									(obj) =>
										obj.elementId === checkparent ||
										obj.elementId === checkparent.split('.')[0],
								),
						)
						?.objElements.find(
							(obj) =>
								obj.elementId === checkparent ||
								obj.elementId === checkparent.split('.')[0],
						);

					console.log(relavanobj, checkparent, 'relavanobj>>');
					// const [firstElement, ...restElements] = checktarget.split('.');
					// const newCheckparent = [relavanobj.nodeId, ...restElements].join('.');

					if (relavanobj !== null) {
						findedtargetkey = hasTargetKey(
							relavanobj.events.eventSummary,
							node?.id,
						);
					}
				}
				if (!relavanobj && relevanNode !== null) {
					findedtargetkey = hasTargetKey(
						relevanNode.events.eventSummary,
						node?.id,
					);
					console.log(findedtargetkey, 'findedtargetkey');
				}
				console.log(relevanNode, relavanobj, findedtargetkey, 'relevanNode');
			}
		} catch (error) {
			console.log(error);
		}
	};
	const deleteNodesAndEdges = (nodes, edges, prefix, mappedData) => {
		try {
			const nod = getNode(prefix);
			let parentId = null;
			if (nod.data.hasOwnProperty('parentId')) {
				parentId = nod.data.parentId;
			}
			// handledeletiononTargetkey(nod, mappedData);
			console.log('remainingNodes', nod, mappedData);
			let remainingNodes = filterNodes(nodes, prefix);
			const remainingNodeIds = remainingNodes.map((node) => node.id);
			const remainingEdges = filterEdges(edges, remainingNodeIds);
			if (parentId) {
				remainingNodes =
					remainingNodes &&
					remainingNodes.length > 0 &&
					remainingNodes.map((node) => {
						if (node.id === parentId) {
							return {
								...node,
								data: {
									...node.data,
									children: node.data.children.filter(
										(childId) => childId !== prefix,
									),
								},
							};
						}
						return node;
					});
			}

			setNodes(remainingNodes);
			setEdges(remainingEdges);
		} catch (error) {
			console.error(error);
		}
	};

	const handleHeaderChange = (e) => {
		try {
			if (
				uniqueNames.includes(e.target.value) &&
				e.target.value !== node?.data.label
			) {
				e.target.value = '';
				return;
			} else {
				setEditedHeader(e.target.value);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const flatenEventJson = () => {
			try {
				let flatenJson = [];

				const flaten = (obj) => {
					let data = {};
					Object.keys(obj).forEach((key) => {
						if (typeof obj[key] === 'object') {
							flaten(obj[key]);
						} else {
							if (key === 'nodeName') {
								data = {
									...data,
									label: obj[key],
								};
							}
							if (key === 'nodeType') {
								data = {
									...data,
									type: obj[key],
								};
							}
							if (key === 'nodeId') {
								data = {
									...data,
									key: obj[key],
								};
							}
						}
					});

					if (Object.keys(data).length) flatenJson.push(data);
				};

				flaten(eventJson);

				setDropdownData(flatenJson);
			} catch (error) {
				console.error(error);
			}
		};

		flatenEventJson();
	}, [eventJson]);

	const handleSelectedListener = (e, resdata) => {
		try {
			console.log(e, resdata, 'handleSelectedListener');
			let parentNode = getNode(node.id);

			if (parentNode.data.parentId === e) {
				alert('cannot select parent');
				return;
			}
			let id = e;
			// setSelectedListener(e);
			let nod = getNode(id);
			const hasChild =
				parentNode &&
				Array.isArray(parentNode.data.children) &&
				parentNode.data.children.length > 0;
			let maxChildId;
			if (hasChild && parentNode.data.children.length == 1) {
				maxChildId = parentNode.data.children[0];
				const hasChild = maxChildId.split('.');
				const lastChild = hasChild[hasChild.length - 1];
				maxChildId = parseInt(lastChild, 10);
			} else {
				maxChildId = getNodes().reduce((initialId, currentNode) => {
					if (currentNode.id.startsWith(`${parentNode.id}.`)) {
						const hasChild = currentNode.id.split('.');
						const lastChild = hasChild[hasChild.length - 1];
						const childId = parseInt(lastChild, 10);
						return childId;
					}
					return initialId;
				}, 0);
			}
			const newChildId = maxChildId + 1;
			let childId = `${parentNode.id}.${newChildId}`;
			let seq = childId.split('.').splice(1).join('.');

			if (resdata !== 'defaults') {
				let responseNode = {
					id: childId,
					type: 'responseNode',
					position: {
						x: parentNode.position.x + Math.random() * (150 - 100) + 100,
						y: parentNode.position.y + Math.random() * (150 - 100) + 100,
					},

					data: {
						label: resdata,
						responseType: resdata,
						parentId: parentNode.id,
						children: [],
						sequence: seq,
					},
				};

				const responseEdge = {
					id: `${parentNode.id}->${responseNode.id}`,
					source: parentNode.id,
					type: 'straight',
					target: responseNode.id,
				};

				let handlerNode = {
					id: `${responseNode.id + '.1'}`,
					type: 'handlerNode',

					position: {
						x: responseNode.position.x + Math.random() * (150 - 100) + 100,
						y: responseNode.position.y + Math.random() * (150 - 100) + 100,
					},
					data: {
						label: 'riseListen',
						eventContext: 'riseListen',
						parentId: responseNode.id,
						value: '',
						sequence: `${seq}.1`,
						children: [],
					},
				};

				const handlerEdge = {
					id: `${responseNode.id}->${handlerNode.id}`,
					source: responseNode.id,
					type: 'straight',
					target: handlerNode.id,
				};

				responseNode = {
					...responseNode,
					data: {
						...responseNode.data,
						children: [...responseNode.data.children, handlerNode.id],
					},
				};
				parentNode = {
					...parentNode,
					data: {
						...parentNode.data,
						children: [...parentNode.data.children, responseNode.id],
					},
				};
				if (nod) {
					let idw = nod.id.split('.')[0];
					const copyofNode = {
						id: idw + `${handlerNode.data.sequence}.1`,
						type: nod.type,
						position: {
							x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
							y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
						},
						data: {
							...nod.data,
							parentId: handlerNode.id,
							children: [],
							sequence: `${handlerNode.data.sequence}.1`,
						},
					};

					handlerNode = {
						...handlerNode,
						data: {
							...handlerNode.data,

							children: [...handlerNode.data.children, copyofNode.id],
						},
					};

					const edge = {
						id: `${handlerNode.id}->${copyofNode.id}`,
						source: handlerNode.id,
						type: 'straight',
						target: copyofNode.id,
					};
					setNodes((nds) => [
						...nds.filter((n) => n.id !== parentNode.id),
						copyofNode,
						responseNode,
						handlerNode,
						parentNode,
					]);
					setEdges((eds) => [...eds, handlerEdge, edge, responseEdge]);
				} else {
					const nodesData = DropdownData.filter((node) => {
						return node.key === id;
					});
					let newNode = {
						id: `${nodesData[0].key}.${handlerNode.data.sequence}.1`,
						type: nodesData[0].type !== 'group' ? 'controlNode' : 'groupNode',
						position: {
							x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
							y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
						},
						data: {
							sequence: `${handlerNode.data.sequence}.1`,
							parentId: handlerNode.id,
							nodeName: nodesData[0].label,
							nodeId: nodesData[0].key,
							nodeType: nodesData[0].type,
							children: [],
						},
					};
					const edge = {
						id: `${id}->${newNode.id}`,
						source: handlerNode.id,
						type: 'straight',
						target: newNode.id,
					};

					handlerNode = {
						...handlerNode,
						data: {
							...handlerNode.data,
							children: [...handlerNode.data.children, newNode.id],
						},
					};

					setNodes((nds) => [
						...nds.filter((node) => node.id !== parentNode.id),
						parentNode,
						handlerNode,
						responseNode,

						newNode,
					]);
					setEdges((eds) => [...eds, handlerEdge, edge, responseEdge]);
				}
			} else {
				let handlerNode = {
					id: childId,
					type: 'handlerNode',
					position: {
						x: parentNode.position.x + Math.random() * (150 - 100) + 100,
						y: parentNode.position.y + Math.random() * (150 - 100) + 100,
					},
					data: {
						label: 'riseListen',
						eventContext: 'riseListen',
						parentId: parentNode.id,
						value: '',
						sequence: `${seq}`,
						children: [],
					},
				};

				const handlerEdge = {
					id: `${parentNode.id}->${handlerNode.id}`,
					source: parentNode.id,
					type: 'straight',
					target: handlerNode.id,
				};

				parentNode = {
					...parentNode,
					data: {
						...parentNode.data,

						children: [...parentNode.data.children, handlerNode.id],
					},
				};
				if (nod) {
					let idw = nod.id.split('.')[0];
					const copyofNode = {
						id: idw + `.${seq}.1`,
						type: nod.type,
						position: {
							x: handlerNode.position.x + Math.random() * (150 - 100) + 100,
							y: handlerNode.position.y + Math.random() * (150 - 100) + 100,
						},
						data: {
							...nod.data,
							parentId: handlerNode.id,
							children: [],
							sequence: `${seq}.1`,
						},
					};

					const edge = {
						id: `${handlerNode.id}->${copyofNode.id}`,
						source: handlerNode.id,
						type: 'straight',
						target: copyofNode.id,
					};
					handlerNode = {
						...handlerNode,
						data: {
							...handlerNode.data,
							children: [...handlerNode.data.children, copyofNode.id],
						},
					};

					setNodes((nds) => [
						...nds.filter((node) => node.id !== parentNode.id),
						handlerNode,
						copyofNode,
						parentNode,
					]);
					setEdges((eds) => [...eds, edge, handlerEdge]);
				} else {
					const nodesData = DropdownData.filter((node) => {
						return node.key === id;
					});
					let newNode = {
						id: `${nodesData[0].key}.${seq}.1`,
						type: nodesData[0].type !== 'group' ? 'controlNode' : 'groupNode',
						position: {
							x: parentNode.position.x + Math.random() * (150 - 100) + 100,
							y: parentNode.position.y + Math.random() * (150 - 100) + 100,
						},
						data: {
							sequence: `${seq}.1`,
							parentId: handlerNode.id,
							nodeName: nodesData[0].label,
							nodeId: nodesData[0].key,
							nodeType: nodesData[0].type,
							children: [],
						},
					};
					const edge = {
						id: `${handlerNode.id}->${newNode.id}`,
						source: handlerNode.id,
						type: 'straight',
						target: newNode.id,
					};

					handlerNode = {
						...handlerNode,
						data: {
							...handlerNode.data,
							children: [...handlerNode.data.children, newNode.id],
						},
					};

					setNodes((nds) => [
						...nds.filter((node) => node.id !== parentNode.id),
						parentNode,
						handlerNode,
						newNode,
					]);
					setEdges((eds) => [...eds, edge, handlerEdge]);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};
	const handleHeaderBlur = (e) => {
		try {
			if (editedHeader === '') {
				return;
			}

			setNodes((nds) => {
				return (
					nds &&
					nds.map((node) => {
						if (node.id === id) {
							return {
								...node,
								data: {
									...node.data,
									label: editedHeader,
								},
							};
						}
						return node;
					})
				);
			});
		} catch (error) {
			console.error(error);
		}
	};
	const showError = (msg) => {
		toast.current.show({
			severity: 'error',
			summary: 'Error',
			detail: msg,
			life: 1000,
		});
	};

	return (
		<>
			<div
				style={{
					top,
					left,
					right,
					bottom,
					backgroundColor: `${selectedTheme?.bg}`,
				}}
				{...props}
				className={`${
					node?.data?.label
						? `
							z-[1000] w-[12.5vw] shadow-md ${node?.type === 'controlNode' || node?.type === 'componentNode' ? 'h-[140px]' : node?.type === 'groupNode' ? 'h-[15vh]' : 'h-[15vh]'} 
							absolute items-center justify-around rounded-md `
						: `
							z-[1000] w-[12.5vw] shadow-md ${node?.type === 'controlNode' || node?.type === 'componentNode' ? 'h-[140px]' : node?.type === 'groupNode' ? 'h-[15vh]' : 'h-[15vh]'} 
							absolute items-center justify-around rounded-md `
				}`}
			>
				<div
					className={`flex w-full justify-between gap-3 border-b px-1 py-1`}
					style={{
						borderColor: `${selectedTheme?.border}`,
					}}
				>
					{/* {!toogleInputNameEdit ? ( */}
					<div className="min-w-max-[80%] flex items-center justify-center">
						{node?.type === 'controlNode' ? (
							<p
								onClick={() => {
									setToogleInputNameEdit(!toogleInputNameEdit);
								}}
								className={`w-full cursor-pointer text-[0.78vw] font-semibold text-white`}
								style={{
									color: `${selectedTheme?.text}`,
								}}
							>
								{node?.data.nodeName}
							</p>
						) : (
							<p
								onClick={() => {
									setToogleInputNameEdit(!toogleInputNameEdit);
								}}
								className={`w-full cursor-pointer text-[0.78vw] font-semibold`}
								style={{
									color: `${selectedTheme?.text}`,
								}}
							>
								{node?.data.label}
							</p>
						)}
					</div>

					{/* ) : (
						// <InputText
						// placeholder="Type here..."
						// value={editedHeader || node?.data.label}
						// onChange={(e) => {
						// handleHeaderChange(e);
						// }}
						// onKeyDown={(e) => {
						// if (e.key === "Enter") {
						// handleHeaderBlur(e);
						// }
						// }}
						// />

						<TorusModularInput
							// key={data.id + "grid" + key}
							// otherMethod={{
							// onblur: (e) => {
							// changeProperty({ [key]: e.target.value });
							// },
							// onkeydown: (e) => {
							// if (e.key === "Enter") {
							// changeProperty({ [key]: e.target.value });
							// }
							// },
							// }}
							// label={key}
							isRequired={true}
							type="text"
							placeholder="Enter here"
							bgColor="bg-transparent"
							labelColor="text-black dark:text-white/35 "
							outlineColor="#cbd5e1"
							labelSize={"text-[0.62vw] pl-[0.25vw]"}
							textColor="text-black dark:text-white"
							radius="sm"
							size=""
							isReadOnly={false}
							isDisabled={false}
							errorShown={false}
							isClearable={true}
							backgroundColor={"bg-gray-300/25 dark:bg-[#0F0F0F]"}
							onChange={(e) => {
								handleHeaderChange(e);
							}}
							otherMethod={{
								onblur: (e) => {
									if (e.key === "Enter") {
										handleHeaderBlur(e);
									}
								},
								onkeydown: (e) => {
									if (e.key === "Enter") {
										handleHeaderBlur(e);
									}
								},
							}}
							// handleActionEventsChange(
							// e,
							// "sourceQueue",
							// selectedAction,
							// );

							value={editedHeader || node?.data.label}
							// defaultValue={value}
							textSize={"text-[0.83vw]"}
							inputClassName={"px-[0.25vw] py-[0.55vh]"}
							wrapperClass={"px-[0.25vw] py-[0.55vh]"}
						/>
						)} */}
				</div>

				<div className="flex flex-col justify-around gap-[1.85vh] py-[1.85vh]">
					{/* <Divider className={darkMode ? "bg-[#212121]" : "bg-black"} /> */}
					{/* <button
						onClick={() => {
							onEdit(id);
							setEventsNodeType(node?.type);
							setEventHandlerType(node?.data.handlerType);
							setContextProps({
								node,
								responsedata,
								risenode,
								onClose,
							});

							// setVisible({ bool: true, type: "rise" });
						}}
						className={
							darkMode
								? "w-full rounded-md bg-transparent py-1  text-[0.78vw] text-slate-50"
								: "w-full rounded-md bg-transparent py-1  text-[0.78vw] text-slate-950"
						}
						>
							Edited Node
						</button> */}

					<TorusButton
						key={'uf_edit'}
						onPress={() => {
							onEdit(id);
							setEventsNodeType(node?.type);
							setEventHandlerType(node?.data.eventContext);
							setContextProps({
								node,
								responsedata,
								risenode,
								onClose,
							});
							onClose('edit');
							setSelectedHandlerData(null)

							// setTimeout(() => {
							// onClose(null);
							// }, 500);

							// setVisible({ bool: true, type: "rise" });
						}}
						Children={
							<div className="flex items-center justify-center">
								<div className="  flex w-[90%] cursor-pointer flex-row items-center">
									<div className="flex w-[70%] items-center justify-start">
										<div className=" flex items-center justify-center gap-3  text-sm">
											<EditNode
												className={' h-[0.83vw] w-[0.83vw] '}
												stroke={`${selectedTheme && selectedTheme?.['textOpacity/50']}`}
											/>
											<span
												className="text-[0.72vw] leading-[2.22vh]"
												style={{
													color: `${selectedTheme?.text}`,
												}}
											>
												Edit Node
											</span>
										</div>
									</div>
									<div className="flex w-[30%] flex-row items-center justify-end gap-2 p-1">
										<div
											className="  flex h-[1vw] w-[1VW]  items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]"
											style={{
												backgroundColor: `${selectedTheme?.bgCard}`,
												border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
											}}
										></div>
										<div
											className="flex h-[1vw] w-[1vw] items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]
 "
											style={{
												backgroundColor: `${selectedTheme?.bgCard}`,
												border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
												color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
											}}
										>
											E
										</div>
									</div>
								</div>
							</div>
						}
					/>

					{/* <div
						className="  flex w-[98%] cursor-pointer flex-row items-center"
						onClick={() => {
							onEdit(id);
							setEventsNodeType(node?.type);
							setEventHandlerType(node?.data.eventContext);
							setContextProps({
								node,
								responsedata,
								risenode,
								onClose,
							});
							onClose('edit');

							// setTimeout(() => {
							// onClose(null);
							// }, 500);

							// setVisible({ bool: true, type: "rise" });
						}}
					>
						<div className="flex w-[70%] items-center justify-start">
							<div className=" flex items-center justify-center gap-3  text-sm">
								<EditNode
									className={' h-[0.83vw] w-[0.83vw] '}
									stroke={`${selectedTheme && selectedTheme?.['textOpacity/50']}`}
								/>
								<span
									className="text-[0.72vw] leading-[2.22vh]"
									style={{
										color: `${selectedTheme?.text}`,
									}}
								>
									Edit Node
								</span>
							</div>
						</div>
						<div className="flex w-[30%] flex-row items-center justify-end gap-1.5 p-[0.25vw]">
							<div
								className="  flex h-[1vw] w-[1VW]  items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]"
								style={{
									backgroundColor: `${selectedTheme?.bgCard}`,
									border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
								}}
							></div>
							<div
								className="flex h-[1vw] w-[1vw] items-center justify-center  rounded-sm  text-[0.72vw] leading-[1.04vh]
 "
								style={{
									backgroundColor: `${selectedTheme?.bgCard}`,
									border: `1px solid ${selectedTheme && selectedTheme?.['textOpacity/15']}`,
									color: `${selectedTheme && selectedTheme?.['textOpacity/50']}`,
								}}
							>
								E
							</div>
						</div>
					</div> */}

					{/*Delete node */}
					{/* <button
						className={
							darkMode
								? "w-full rounded-md bg-transparent py-1  text-[0.78vw] text-slate-50"
								: "w-full rounded-md bg-transparent py-1  text-[0.78vw] text-slate-950"
						}
						onClick={() => {
							deleteNodesAndEdges(nodes, edges, node.id);
							onClose(null);
						}}
						>
							Delete
						</button> */}

					<TorusButton
						key={'events_delete'}
						onPress={() => {
							deleteNodesAndEdges(nodes, edges, node.id, mappedData);
							onClose('delete');
						}}
						Children={
							<div className="flex items-center justify-center">
								<div className="flex  w-[90%]  cursor-pointer flex-row items-center">
									<div className="flex w-[70%] items-center justify-start">
										<div className="   flex items-center justify-center gap-3  text-sm text-[#F44336] dark:text-[#F44336] ">
											<Delete
												className={
													' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white '
												}
											/>
											<span className="text-[0.72vw] leading-[2.22vh]">
												Delete
											</span>
										</div>
									</div>
									<div className="flex w-[30%]  items-center justify-end gap-2 p-1">
										<div className=" flex h-[1.85vh] w-[1.51vw] items-center justify-center rounded-sm border border-red-500  bg-red-300 text-red-600 ">
											<span
												className="text-[0.72vw]
leading-[1.04vh] text-[#020202]/35 dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
											>
												Del
											</span>
										</div>
									</div>
								</div>
							</div>
						}
					/>

					{/* <div
						className="flex  w-[95%]  cursor-pointer flex-row items-center"
						onClick={() => {
							deleteNodesAndEdges(nodes, edges, node.id, mappedData);
							onClose('delete');
						}}
					>
						<div className="flex w-[70%] items-center justify-start">
							<div className="   flex items-center justify-center gap-3  text-sm text-[#F44336] dark:text-[#F44336] ">
								<Delete
									className={
										' h-[0.83vw] w-[0.83vw] stroke-black dark:stroke-white '
									}
								/>
								<span className="text-[0.72vw] leading-[2.22vh]">Delete</span>
							</div>
						</div>
						<div className="flex w-[30%]  items-center justify-end gap-2 p-1">
							<div className="dark:text-[ #FFFFFF]/35 flex h-[1.85vh] w-[1.51vw] items-center  justify-center rounded-sm  bg-[#F2F3F8] dark:bg-[#0F0F0F] ">
								<span
									className="text-[0.72vw]
  leading-[1.04vh] text-[#020202]/35 dark:bg-[#0F0F0F] dark:text-[#FFFFFF]/35"
								>
									Del
								</span>
							</div>
						</div>
					</div> */}
				</div>

				{/*Edit node */}

				{/* <Dialog
					visible={isOpen}
					onHide={() => {
						onOpenChange(false);
						onClose(null);
					}}
					headerStyle={{ width: '400px', maxHeight: '50px' }}
					headerClassName="bg-neutral-100"
					header="Events"
					contentStyle={{ width: '400px', minHeight: '400px' }}
					contentClassName="w-[50px] h-[50px] "
				>
					<div className="mt-[11px] flex items-center justify-center">
						<div className="flex h-[400px] w-[400px] flex-col items-center justify-center overflow-y-scroll">
							{eventJson &&
								DropdownData &&
								DropdownData.length &&
								eventJson.length > 0 &&
								eventJson.map((item, index) => {
									return (
										Object.keys(item) &&
										Object.keys(item).length > 0 &&
										Object.keys(item)?.map((key) => {
											return (
												<>
													{console.log(eventJson, item, 'canvas')}
													{key === 'nodeType' && item[key] !== 'group' && (
														<div className=" cursor-pointer select-none items-start text-lg">
															{key} : {item[key]}
														</div>
													)}

													{key === 'nodeType' &&
														(item[key] === 'canvas' ||
															item[key] === 'group') && (
															<div className=" mb-[20px]    cursor-pointer  select-none items-start text-lg">
																<div
																	className=" transition-all-ease-in  flex rounded-2xl
                  text-lg   duration-500"
																	onClick={() => {
																		if (clickedGroup.includes(item.nodeId)) {
																			setClickedGroup(
																				clickedGroup.filter(
																					(group) => group !== item.nodeId,
																				),
																			);
																		} else {
																			setClickedGroup([
																				...clickedGroup,
																				item.nodeId,
																			]);
																		}
																		// setClickedJson(item);
																		// setShowEvents(true);
																	}}
																>
																	<span>
																		<IoIosArrowForward
																			color="#90A4AE"
																			className={` mt-[3px] text-lg
															${clickedGroup.includes(item.nodeId) ? 'rotate-90' : 'rotate-0'}`}
																/>
																</span>

																<span className="text-md ml-[4px]">
																	{key} : {item[key]}
																	<span className="whitespace-nowrap text-sm font-bold text-[#FF66AA]">
																		{`{${item['children'].length}}`}
																	</span>
																</span>
																</div>
																</div>
														)}

													{key === 'nodeName' && (
														<div
															onClick={() => {
																onOpenChange(false);
																handleSelectedListener(
																	item.nodeId,
																	selectedResponseData,
																);
																onOpenChange(false);
																// setTimeout(() => {
																// onClose(null);
																// }, 500);
															}}
															className="flex w-full cursor-pointer items-start justify-center overflow-ellipsis text-lg"
														>
															{key} : {item[key]}
														</div>
													)}

													<AnimatePresence>
														{clickedGroup.includes(item.nodeId) &&
															key === 'children' && (
																<motion.div
																	className="w-[210px] rounded-md border  border-gray-400 p-[20px]  "
																	initial={{ height: 0, opacity: 0 }}
																	exit={{ height: 0, opacity: 0 }}
																	animate={{ height: 'auto', opacity: 1 }}
																>
																	{item[key] &&
																		item[key].length > 0 &&
																		item[key]?.map((key1) => {
																			return Object.keys(key1).map((key2) => {
																				return (
																					<div
																						className={`gird grid-row-2 flex ${key2 === 'nodeName' ? 'cursor-pointer' : ''} flex-row gap-5 text-lg`}
																					>
																						{key2 === 'nodeType' && (
																							<div
																								className="  select-none gap-5 text-lg"
																								onClick={() => {
																									// setClickedJson(key1);
																									// setShowEvents(true);
																									// setTimeout(() => {
																									// onClose(null);
																									// }, 500);
																								}}
																							>
																								<div
																									className={`${darkMode ? 'text-black' : ''} text-lg`}
																								>
																									{key2} : {key1[key2]}
																								</div>
																							</div>
																						)}
																						{key2 === 'nodeName' && (
																							<div
																								onClick={() => {
																									handleSelectedListener(
																										key1.nodeId,
																										selectedResponseData,
																									);
																									onOpenChange(false);
																									// setTimeout(() => {
																									// onClose(null);
																									// }, 1000);
																								}}
																								className={`${darkMode ? 'text-black' : ''} text-lg`}
																							>
																								{key2} : {key1[key2]}
																							</div>
																						)}
																					</div>
																				);
																			});
																		})}
																</motion.div>
															)}
													</AnimatePresence>
												</>
											);
										})
									);
								})}
						</div>
					</div>
				</Dialog> */}
			</div>
		</>
	);
}
