import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
// import * as fs from 'fs';
// import * as path from 'path';

// const filePath = path.join(__dirname, '../../../custom-node-config.json');
// const fileContent = fs.readFileSync(filePath, 'utf8');
// const jsonData = JSON.parse(fileContent);
// console.log(jsonData);

// function generateDisplayName(propertyName: string): string {
//  // Logic to generate dynamic display name
//  // For example, you can concatenate the property name with a value from jsonData
//  return `${propertyName} - ${jsonData.data[propertyName]}`;
// }
const Redis = require('ioredis');
// var redis = new Redis({
// 	host: process.env.HOST,
// 	port: process.env.PORT,
// });

export class ReadTorusPlatformData implements INodeType {
	description: INodeTypeDescription;
	constructor() {
		// Dynamically set display names for properties based on JSON data
		// const myStringDisplayName = jsonData.data.url;
		// const mySecondStringDisplayName = jsonData.data.method;

		// Define the node description

		this.description = {
			displayName: 'Read Torus Platform Data',
			name: 'readTorusPlatformData',
			group: ['transform'],
			version: 1,
			description: 'Basic Example Node',
			defaults: {
				name: 'Read Torus Platform Data',
			},
			inputs: ['main'],
			outputs: ['main'],
			properties: [
				{
					displayName: 'Redis_Data',
					name: 'redisData',
					type: 'options',
					options: [
						{
							name: 'JSON',
							value: 'json',
						},
						{
							name: 'STREAM',
							value: 'stream',
						},
					],
					default: 'json',
					placeholder: 'Placeholder value',
					description: 'The description text',
				},
				{
					displayName: 'Torus_Key',
					name: 'torusKey',
					type: 'string',
					default: '',
					placeholder: 'keyName',
					description: 'The description text',
				},
			],
		};
		// const myStringDefaultValue = this.description.properties[0].default;
		// const mySecondStringDefaultValue = this.description.properties[1].default;
		// this.description.properties[0].default = myStringDisplayName;

		// this.description.properties[1].default = mySecondStringDisplayName;
	}

	// async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	// 	const items = this.getInputData();
	// 	var request: any = await redis.call('JSON.GET', 'myjson', '$');
	// 	console.log(request);
	// 	const returnData: INodeExecutionData[][] = [];
	// 	let returnItem: INodeExecutionData;

	// 	// let item: INodeExecutionData;

	// 	// let myString: string;
	// 	let mySecondString: string;

	// 	// Iterates over all input items and add the key "myString" with the
	// 	// value the parameter "myString" resolves to.
	// 	// (This could be a different value for each item in case it contains an expression)
	// 	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
	// 		try {
	// 			// const inputData = items[itemIndex].json;
	// 			// const defaultMyString = inputData?.field1 ?? 'defaultMyString';
	// 			// myString = this.getNodeParameter('myString', itemIndex, request) as string;
	// 			mySecondString = this.getNodeParameter('mySecondString', itemIndex, request) as string;

	// 			// console.log(myString, mySecondString);

	// 			// item = items[itemIndex];
	// 			returnItem = {
	// 				json: {
	// 					// myString,
	// 					mySecondString,
	// 				},
	// 			};

	// 			returnData.push([returnItem]);
	// 		} catch (error) {
	// 			// This node should never fail but we want to showcase how
	// 			// to handle errors.
	// 			if (this.continueOnFail()) {
	// 				items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
	// 			} else {
	// 				// Adding `itemIndex` allows other workflows to handle this error
	// 				if (error.context) {
	// 					// If the error thrown already contains the context property,
	// 					// only append the itemIndex
	// 					error.context.itemIndex = itemIndex;
	// 					throw error;
	// 				}
	// 				throw new NodeOperationError(this.getNode(), error, {
	// 					itemIndex,
	// 				});
	// 			}
	// 		}
	// 	}

	// 	// console.log(returnData);

	// 	return this.prepareOutputData(returnData.flat());
	// }
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			// const item = items[i];
			const redisData = this.getNodeParameter('redisData', i) as string;
			const torusKey = this.getNodeParameter('torusKey', i) as string;

			const redis = new Redis({
				host: process.env.HOST,
				port: process.env.PORT,
			});

			try {
				// Retrieve data from Redis based on the provided key
				let data;
				if (redisData === 'json') {
					data = await redis.call('JSON.GET', torusKey);
					console.log(data);
				} else if (redisData === 'stream') {
					data = await redis.call('xrange', torusKey, '-', '+');
				}

				returnData.push({
					json: {
						torusData: data,
					},
				});
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'Redis Error: ' + error.message);
			}
		}

		return [returnData];
	}
}
