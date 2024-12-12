import React from 'react'
import { ListBox, ListBoxItem } from 'react-aria-components';

export const TorusListbox = (props) => {
	let options = props.label;
	return (
		<ListBox aria-label="TorusListbox" items={options} selectionMode="single">

			{(item) => <ListBoxItem className='w-10 overflow-hidden  text-[0.72vw] ' >



				{item.name}


				</ListBoxItem>}

		</ListBox>
		);
}
