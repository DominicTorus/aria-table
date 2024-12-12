/* eslint-disable */
import React, { useRef } from 'react';
import {
	Dialog,
	DialogTrigger,
	Heading,
	ListBox,
	ListBoxItem,
	Popover,
} from 'react-aria-components';
import { IoIosCheckmark } from 'react-icons/io';

import TorusButton from '../torusComponents/TorusButton';
import { merger } from '../utils/utils';
const defaultTropdownClassNames = {
	buttonClassName: `torus-pressed:animate-torusButtonActive dark:bg-[#161616] dark:text-white  bg-[#F9FAFB] text-sm font-medium rounded-md transition-colors duration-300`,
	popoverClassName:
		'torus-entering:animate-torusPopOverOpen torus-exiting:animate-torusPopOverClose w-40',
	dialogClassName: 'outline-none w-full',
	listBoxClassName:
		'  w-full bg-slate-200 dark:bg-[#161616] border-2 dark:border-gray-700 border-gray-300 transition-all p-2 rounded-md gap-1 flex flex-col items-center',
	listBoxItemClassName:
		'p-1 w-full torus-focus:outline-none  rounded-md cursor-pointer transition-colors duration-300',
};

export default function TorusDropDown({
	isDisabled,
	label,
	title,
	classNames,
	buttonHeight = '',
	buttonWidth = '',
	setSelected,
	selected,
	endContent,
	renderEmptyState,
	items = [
		{ key: 'Item 1', label: 'Item 1' },
		{ key: 'Item 2', label: 'Item 2' },
		{ key: 'Item 3', label: 'Item 3' },
	],
	size = 20,
	popOverProps,
	listBoxProps,
	color,
	btWidth,
	btheight,
	selectionMode = 'multiple',
	fontStyle,
	btncolor,
	radius,
	outlineColor,
	gap,
	borderColor,
	startContent,
	isDropDown = false,
	className,
	onPress,
	secbuttonClassName,
	listBoxBackground,
	listItemColor
}) {
	const listBoxRefItem = useRef(null);
	console.log(items, 'items');
	const closeFn = () => {
		console.log(listBoxRefItem.current.parentNode, 'listparentItem-->');
		console.log(listBoxRefItem.current.id, 'listBox-->');

		const parentNode = listBoxRefItem.current.parentNode;
		if (parentNode) {
			parentNode.style.display = 'none';
		}
	};

	console.log(selected, 'multiple selected');

	return (
		<DialogTrigger>
			<TorusButton
				Children={title}
				buttonClassName={merger(
					defaultTropdownClassNames.buttonClassName,
					classNames?.buttonClassName,
				)}
				// title={label}
				height={btheight}
				width={btWidth}
				fontStyle={fontStyle}
				btncolor={btncolor}
				radius={radius}
				outlineColor={outlineColor}
				color={color}
				gap={gap}
				borderColor={borderColor}
				startContent={startContent ? startContent : ''}
				endContent={endContent ? endContent : ''}
				isDropDown={isDropDown}
				onPress={onPress}
				isDisabled={isDisabled}
				secbuttonClassName={secbuttonClassName}
			/>

			<Popover
				placement="bottom"
				className={merger(
					defaultTropdownClassNames.popoverClassName,
					classNames?.popoverClassName,
				)}
				{...popOverProps}
			>
				<Dialog
					className={merger(
						defaultTropdownClassNames.dialogClassName,
						classNames?.dialogClassName,
					)}
				>
					{({ close }) => (
						<ListBox
							endContent={endContent}
							renderEmptyState={renderEmptyState}
							className={merger(
								defaultTropdownClassNames.listBoxClassName,
								merger(
									`max-h-[40vh] ${
										items.length > 6
											? 'min-h-[30vh] overflow-y-auto'
											: items.length > 3
												? 'min-h-[20vh] overflow-y-auto'
												: items.length < 1
													? "before:content-['No data'] relative min-h-[5vh] before:absolute before:left-0 before:top-0 before:flex before:h-full before:w-full before:items-center before:justify-center"
													: ''
									}`,
									classNames?.listBoxClassName,
								),
							)}
							selectionMode={selectionMode}
							onSelectionChange={(keys) => {
								setSelected&& setSelected([...keys]);
							}}
							selectedKeys={selected}
							items={items}
							{...listBoxProps}
							style={{
								backgroundColor:listBoxBackground,
								border:`1px solid ${borderColor}`,
							}}
						>
							{(item) => (
								<ListBoxItem
									key={item.key}
									className={merger(
										defaultTropdownClassNames.listBoxItemClassName,
										classNames?.listBoxItemClassName,
									)}
									style={{
										color:listItemColor
									}}
									ref={listBoxRefItem}
								>
									{({ isSelected }) => (
										<div
											className="flex w-full items-center justify-center gap-2"
											onClick={() => {
												if (selectionMode === 'multiple') {
													console.log('multiple', isSelected, item);
												} else {
													close();
												}
											}}
										>
											<div className="flex w-full items-center justify-center gap-2">
												<div className="flex h-full w-full items-center justify-start"
												style={{
													color:listItemColor
												}}
												>
													{item.label !== 'new version' ? (
														<Heading
															className={merger(
																`${item.label === 'new version' ? 'whitespace-nowrap text-[0.68vw]' : 'text-[0.72vw]'} font-normal tracking-normal `,
																classNames?.label,
															)}
															
														>
															{item.label}
														</Heading>
													) : (
														<Heading
															className={merger(
																`${item.label === 'new version' ? 'whitespace-nowrap text-[0.68vw]' : 'text-[0.72vw]'} font-normal tracking-normal `,
																classNames?.label,
															)}
															
														>
															{item.label}
														</Heading>
													)}
												</div>

												<div className="flex h-full w-full items-center justify-end ">
													<span
														className={`transition-all duration-150 ${
															isSelected ? 'opacity-100' : 'opacity-0'
														}`}
													>
														<IoIosCheckmark
															size={20}
															className={`${
																isSelected
																	? 'text-[#0736C4] dark:text-white'
																	: ''
															} `}
														/>
													</span>
												</div>
											</div>
										</div>
									)}
								</ListBoxItem>
							)}
						</ListBox>
					)}
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
