import { Cell, Column, Row, Table, TableBody, TableHeader } from "react-aria-components";

export default function TorusColumn(props) {
	let columns = [
		{name: 'Name', id: 'name', isRowHeader: true},
		];

		let rows = props?.label || [];

		return (
			<Table aria-label="Files" {...props} className={`${props.className}`}>
				<TableHeader columns={columns}>
					{column => (
						<Column className={" bg-slate-300 border border-r  text-[0.72vw] " } isRowHeader={column.isRowHeader}>
							{column.name}
						</Column>
					)}
				</TableHeader>
				<TableBody items={rows}  >
					{item => (
						<Row columns={columns}   >
							{column => <Cell className={"border-r   text-[0.72vw]  "}>{item[column.id]}</Cell>}
						</Row>
					)}
				</TableBody>
			</Table>
		);
	}
