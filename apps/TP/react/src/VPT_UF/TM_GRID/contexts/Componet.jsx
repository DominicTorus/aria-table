import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { defaultProps } from '../utils/defaultProps';
import { v4 as uuidv4 } from 'uuid';

import _ from 'lodash';

export const ComponentContext = createContext();

export const ComponentProvider = ({ children }) => {
	const [state, setState] = useState({
		root: {
			id: 'root',
			parent: 'root',
			type: 'Canvas',
			T_parentId: 'root',
			children: [],
			data: {
				label: 'root',
				nodeProperty: {
					elementInfo: {},
				},
			},
			property: {
				name: '',
				nodeType: 'Canvas',
				description: '',
			},
			grid: defaultProps?.root || {},
			groupType: 'group',
		},
	});
	const [selectedComponent, setSelectedComponent] = useState('');

	const AddToComponet = (newComponent, parentId) => {
		if (!newComponent) return;
		const { id, type, grid, children, parent, data, property } = newComponent;
		let groupType, layoutFlag;
		if (type === 'group') {
			groupType = newComponent?.groupType || 'group';
			layoutFlag = newComponent?.layoutFlag || 'no';
		}
		console.log(newComponent, parentId, 'newState');
		if (parentId && state?.[parentId]) {
			if (
				state?.[parentId]?.children &&
				!state?.[parentId]?.children.includes(id)
			) {
				setState((prevState) => {
					let newState = structuredClone(prevState);

					if (parent && newState?.[parent]) {
						newState = {
							...newState,
							[parent]: {
								...newState?.[parent],
								children: newState?.[parent]?.children.filter(
									(childId) => childId !== id,
								),
							},
						};
					}

					newState = {
						...newState,
						[parentId]: {
							...newState?.[parentId],
							children: [...newState?.[parentId]?.children, id],
						},
						[id]: {
							id,
							type,
							grid,
							children,
							data,
							property,

							T_parentId: parentId === 'root' ? id : parentId,
							parent: parentId,
						},
					};
					console.log(newState?.[id], 'newStateID');
					if (type === 'group') {
						newState = {
							...newState,
							[id]: {
								...newState?.[id],
								groupType: groupType || 'group',
								layoutFlag: layoutFlag || 'no',
							},
						};
						console.log(newState, 'newState');
					}

					return newState;
				});
			}
		}
	};

	const DuplicateComponent = (comId, parent) => {
		if (!comId) return;

		console.log(comId, parent, 'componentselectedComp->');

		let newcomponent = comId;
		const newID = uuidv4();
			if(newcomponent?.type=="group"){

				newcomponent = {
					...newcomponent,
					id: newID,
					T_parentId: newID,

				};
			}else{
				newcomponent = {
					...newcomponent,
					id: newID,
					T_parentId: newID,
					grid: {
						column: {
							start: "",
							end: ""
						},
						row: {
							start: "",
							end: ""
						},
						style: {
							gap: "",
							height: "",
							width: ""
						}
					}

				};
			}

		console.log(comId, parent, newcomponent, 'componentselectedComp');
		AddToComponet(newcomponent, parent);

		newcomponent?.children.forEach((element, index) => {
			let childComponet = state[element];
			childComponet = {
				...childComponet,
				id: uuidv4(),
				parent: newcomponent?.id,
				T_parentId: newcomponent?.id,
				grid: {
					column: {
						start: "",
						end: ""
					},
					row: {
						start: "",
						end: ""
					},
					style: {
						gap: "",
						height: "",
						width: ""
					}
			}

			};

			newcomponent.children[index] = childComponet?.id;

			console.log(childComponet, newcomponent, state, 'componentchild');

			setState((prevState) => {
				let newState = structuredClone(prevState);
				newState = {
					...newState,
					[childComponet.id]: childComponet,
				};
				return newState;
			});
		});

		console.log(comId, state, 'componentselectedComp');
	};

	const UpdateComponet = (comId, newProps) => {
		if (!comId) return;

		const { id } = state?.[comId];
		setState((prevState) => {
			let newState = structuredClone(prevState);
			newState = {
				...newState,
				[id]: {
					...newState?.[id],
					grid: {
						...newState?.[id]?.grid,
						...newProps,
					},
				},
			};
			return newState;
		});
	};

	const changeGridPosition = (comId, gridElement, startOrEnd, value) => {
		if (!comId && state?.[comId]) return;

		setState((prevState) => {
			let newState = structuredClone(prevState);
			newState = {
				...newState,
				[comId]: {
					...newState?.[comId],
					grid: {
						...newState?.[comId]?.grid,
						[gridElement]: {
							...newState?.[comId]?.grid?.[gridElement],
							[startOrEnd]: value,
						},
					},
				},
			};

			return newState;
		});
	};
	const nodes = useMemo(() => Object.values(state), [state]);
	const convertNodesToState = (nodes) => {
		console.log(nodes, 'prop');
		if (_.isEmpty(nodes)) {
			setState({
				root: {
					id: 'root',
					parent: 'root',
					type: 'Canvas',
					T_parentId: 'root',
					children: [],
					data: {
						label: 'root',
						nodeProperty: {
							elementInfo: {},
						},
					},
					property: {
						name: '',
						nodeType: 'Canvas',
						description: '',
					},
					grid: defaultProps?.root || {},
					groupType: 'group',
				},
			});
		} else {
			let newState = {};
			nodes.forEach((node) => {
				newState = {
					...newState,
					[node?.id]: node,
				};
			});
			setState(newState);
		}
	};

	const setNodes = useCallback(
		(prop) => {
			if (typeof prop === 'function') {
				convertNodesToState(prop(nodes));
			} else {
				convertNodesToState(prop);
			}
		},
		[nodes],
	);

	const resetState = () => {
		setState({
			root: {
				id: 'root',
				parent: 'root',
				type: 'Canvas',
				T_parentId: 'root',
				children: [],
				data: {
					label: 'root',
					nodeProperty: {
						elementInfo: {},
					},
				},
				property: {
					name: '',
					nodeType: 'Canvas',
					description: '',
				},
				grid: defaultProps?.root || {},
				groupType: 'group',
			},
		});
	};

	const deleteNode = (st) => {
		const { nodes } = st;
		const { id } = nodes[0];

		if (id === 'root') {
			if (window.confirm('Do you want to empty the canvas?')) resetState();
			else return;
		} else {
			const deleteNodeRec = (state, id) => {
				const { children } = state[id];
				if (!_.isEmpty(children))
					children.forEach((child) => {
						deleteNodeRec(state, child);
					});
				delete state[id];
			};
			setState((prevState) => {
				let newState = structuredClone(prevState);
				if (!newState[id]) return;
				const { parent } = newState[id];

				if (parent) {
					newState = {
						...newState,
						[parent]: {
							...newState?.[parent],
							children: newState?.[parent]?.children.filter(
								(childId) => childId !== id,
							),
						},
					};
				}
				deleteNodeRec(newState, id);

				return newState;
			});
		}
	};

	return (
		<ComponentContext.Provider
			value={{
				nodes,
				state,
				setNodes,
				AddToComponet,
				UpdateComponet,
				selectedComponent,
				changeGridPosition,
				convertNodesToState,
				setSelectedComponent,
				resetState,
				deleteNode,
				DuplicateComponent,
			}}
		>
			{children}
		</ComponentContext.Provider>
	);
};

export const useComponent = () => {
	const context = useContext(ComponentContext);
	if (context === undefined) {
		throw new Error('useComponent must be used within a ComponentProvider');
	}
	return context;
};
