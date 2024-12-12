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

export class WriteTorusPlatformData implements INodeType {
	description: INodeTypeDescription;
	constructor() {
		// Dynamically set display names for properties based on JSON data
		// const myStringDisplayName = jsonData.data.url;
		// const mySecondStringDisplayName = jsonData.data.method;

		// Define the node description

		this.description = {
			displayName: 'Write Torus Platform Data',
			name: 'WriteTorusPlatformData',
			group: ['transform'],
			version: 1,
			description: 'Basic Example Node',
			defaults: {
				name: 'Write Torus Platform Data',
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
				{
					displayName: 'Value',
					name: 'value',
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
	// 	const returnData: INodeExecutionData[] = [];

	// 	for (let i = 0; i < items.length; i++) {
	// 		// const item = items[i];
	// 		const redisData = this.getNodeParameter('redisData', i) as string;
	// 		const torusKey = this.getNodeParameter('torusKey', i) as string;

	// 		const redis = new Redis({
	// 			host: process.env.HOST,
	// 			port: process.env.PORT,
	// 		});

	// 		try {
	// 			// Retrieve data from Redis based on the provided key
	// 			let data;
	// 			if (redisData === 'json') {
	// 				data = await redis.call('JSON.GET', torusKey);
	// 				console.log(data);
	// 			} else if (redisData === 'stream') {
	// 				data = await redis.call('xrange', torusKey, '-', '+');
	// 			}

	// 			returnData.push({
	// 				json: {
	// 					torusData: data,
	// 				},
	// 			});
	// 		} catch (error) {
	// 			throw new NodeOperationError(this.getNode(), 'Redis Error: ' + error.message);
	// 		}
	// 	}

	// 	return [returnData];
	// }

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const redisData = this.getNodeParameter('redisData', i) as string;
			const torusKey = this.getNodeParameter('torusKey', i) as string;
			const value: any = this.getNodeParameter('value', i) as string; // Assuming the input data contains the value to set in Redis
			console.log(value);

			const redis = new Redis({
				host: process.env.HOST,
				port: process.env.PORT,
			});

			try {
				// Connect to Redis server
				// await redis.connect();

				// Set the key-value pair in Redis
				if (redisData === 'json') {
					await redis.call('JSON.SET', torusKey, '$', JSON.stringify(value));
				} else if (redisData === 'stream') {
					// Assuming 'value' is an array of objects for the stream
					for (const item of value) {
						await redis.call('xadd', torusKey, '*', 'value', JSON.stringify(item));
					}
				}

				// Add the result to the return data
				returnData.push({
					json: { message: `Value successfully set in Redis for key '${torusKey}'` },
				});
			} catch (error) {
				console.error('Redis Error:', error.message);
				throw new NodeOperationError(this.getNode(), 'Redis Error: ' + error.message);
			}
		}

		return [returnData];
	}
}
