import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	
	} from 'n8n-workflow';

const Redis = require('ioredis');

export class TorusPlatformData implements INodeType {
	description: INodeTypeDescription;
	constructor() {
		this.description = {
			displayName: 'Torus Platform Data',
			name: 'torusPlatformData',
			group: ['transform'],
			version: 1,
			description: 'Node for reading or writing data to Torus platform',
			defaults: {
				name: 'Torus Platform Data',
			},
			inputs: ['main'],
			outputs: ['main'],
			properties: [
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					options: [
						{
							name: 'WRITE',
							value: 'write',
						},
						{
							name: 'READ',
							value: 'read',
						},
						{
							name: 'BOTH',
							value: 'both',
						},
					],
					default: 'write',
					description: 'Select whether to write or read data from Torus',
				},
				{
					displayName: 'Redis Data',
					name: 'redisData',
					type: 'options',
					options: [
						{
							name: 'JSON ',
							value: 'json',
						},
						{
							name: 'STREAM ',
							value: 'stream',
						},
						
					],
					default: '',
					description: 'Choose the type of data structure in Redis',
					displayOptions: {
						show: {
							operation: ['write','read'],
						},
					},
				},
				{
					displayName: 'Redis DataType',
					name: 'redisDataType',
					type: 'options',
					options: [
						{
							name: 'JSON - JSON',
							value: 'json-json',
						},
						{
							name: 'STREAM - STREAM',
							value: 'stream-stream',
						},
						{
							name: 'JSON - STREAM',
							value: 'json-stream',
						},
						{
							name: 'STREAM - JSON',
							value: 'stream-json',
						},
					],
					default: '',
					description: 'Choose the type of data structure in Redis',
					displayOptions: {
						show: {
							operation: ['both'],
						},
					},
				},
				{
					
					displayName: 'Group Name',
					name: 'groupName',
					type: 'string',
					default: '',
					placeholder: 'Enter consumer name',
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						show: {
							 operation:['both'],
							 redisDataType: ['stream-json'],
						},
					},
				},
				{
					
					displayName: 'Consumer',
					name: 'consumer',
					type: 'string',
					default: '',
					placeholder: 'Enter consumer name',
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						show: {
							 operation:['both'],
							 redisDataType: ['stream-json'],
						},
					},
				},
				{
					
					displayName: 'Key Name',
					name: 'keyName',
					type: 'string',
					default: '',
					placeholder: 'Enter key name',
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						show: {
							 operation:['read','write'],
							redisData: ['json'],
						},
					},
				},
				{
					displayName: 'Stream Name',
					name: 'streamName',
					type: 'string',
					default: '',
					placeholder: 'Enter key name',
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						show: {
							  operation:['read','write'],
							redisData: ['stream'],
						},
					},
				},	
				{
					displayName: 'From KeyName ',
					name: 'fromKeyName',
					type: 'string',
					default: '',
					placeholder: 'Enter key name',
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						show: {
							operation: ['both'],
							redisDataType: ['stream-stream','json-json','json-stream','stream-json'],
						},
					},
				},
				{
					displayName: 'To KeyName',
					name: 'toKeyName',
					type: 'string',
					default: '',
					placeholder: 'Enter key name',
					description: 'Specify the key for storing or retrieving data in Torus',
					displayOptions: {
						show: {
							operation: ['both'],
							redisDataType: ['stream-stream','json-json','json-stream','stream-json'],
						},
					},
				},
				{
					displayName: 'Path',
					name: 'path',
					type: 'string',
					default: '',
					placeholder: 'Enter path',
					description: 'Specify the value to be stored in Torus (for write operation)',
					displayOptions: {
						show: {
							operation: [ 'both'],
							redisDataType:['json-json','stream-stream']
						},
					},
				},
			
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					placeholder: 'Enter value',
					description: 'Specify the value to be stored in Torus (for write operation)',
					displayOptions: {
						show: {
							operation: ['write'],
						},
					},
				},
				{
					displayName: 'Value',
					name: 'Value',
					type: 'string',
					default:'',
					placeholder: 'Enter Value',
					description: 'Specify the Value to be stored in Torus (for write operation)',
					displayOptions: {
						show: {
							operation: ['both'],
							redisDataType:['stream-stream','json-json']
						},
					},
				},
			],
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			
			
			let redisData='';
			let keyName = '';
			let streamName = '';
			let value = '';
			let fromKeyName='';
			let toKeyName='';
			let path='';
			let Value='';
			let consumer='';
			let groupName='';
			let redisDataType='';

            if(operation === 'write' || operation === 'read'){
				redisData = this.getNodeParameter('redisData', i) as string;

			if (redisData === 'json') {
				keyName = this.getNodeParameter('keyName', i) as string;
				} else if (redisData === 'stream') {
				streamName = this.getNodeParameter('streamName', i) as string;
			}
		}
			if (operation === 'write' ) {
				value = this.getNodeParameter('value', i) as string;
			}
			if ( operation === 'both') {
				redisDataType = this.getNodeParameter('redisDataType', i) as string;
				if(redisDataType === 'json-json' || redisDataType === 'stream-stream'){
				
				Value = this.getNodeParameter('Value', i) as string;
				path=this.getNodeParameter('path', i) as string;
				}
				if(redisDataType === 'stream-json'){
                  consumer = this.getNodeParameter('consumer', i) as string;
				  groupName = this.getNodeParameter('groupName', i) as string;
				}
				fromKeyName = this.getNodeParameter('fromKeyName', i) as string;
				toKeyName =this.getNodeParameter('toKeyName', i) as string;
				
			}

			const redis = new Redis({
				host: process.env.HOST,
				port: process.env.PORT,
			});

			try {
				if (operation === 'write') {
					if (redisData === 'json') {
						await redis.call('JSON.SET', keyName, '$', JSON.stringify(value));
						returnData.push({
							json: {
								operation: 'write',
								keyName,
								value,
							},
						});
					} else if (redisData === 'stream') {
						await redis.call('xadd', streamName, '*', 'value', JSON.stringify(value));
						returnData.push({
							json: {
								operation: 'write',
								streamName,
								value,
							},
						});
					}
				}

				if (operation === 'read') {
					let data: any;
					if (redisData === 'json') {
						data = await redis.call('JSON.GET', keyName);
						returnData.push({
							json: {
								operation: 'read',
								keyName,
								data,
							},
						});
					} else if (redisData === 'stream') {
						data = await redis.call('xrange', streamName, '-', '+');
						returnData.push({
							json: {
								operation: 'read',
								streamName,
								data,
							},
						});
					}
				}

				if (operation === 'both') {
					let list: any;
					if (redisDataType === 'json-json') {
						if(fromKeyName){
						list = await redis.call('JSON.GET', fromKeyName);
						 let info = JSON.parse(list);
						console.log(info);
						
						
						returnData.push({
							json: {
								operation: 'both',
								fromKeyName,
								info,
								
							},
						});
					}
						if(toKeyName && path){

						await redis.call('JSON.ARRAPPEND', toKeyName, '.'+path, Value);
						returnData.push({
							json: {
								operation: 'both',
								toKeyName,
								Value,
								
							},
						});
					}else{
						if(toKeyName){
							await redis.call('JSON.SET', toKeyName, '$',  Value);
							returnData.push({
								json: {
									operation: 'both',
									toKeyName,
									Value,
									
								},
							});
						}
					}	
					} else if (redisDataType === 'stream-stream') {
						if(fromKeyName){
						list = await redis.call('xrange', fromKeyName, '-', '+');
						returnData.push({
							json: {
								operation: 'both',
								fromKeyName,
								list,
							
							},
						});
					}
						if(toKeyName  && path){ await redis.call('xadd', toKeyName, '*', path, Value);
						returnData.push({
							json: {
								operation: 'both',
								
								Value,
								toKeyName,
							},
						});
					}
					if(toKeyName){ await redis.call('xadd', toKeyName, '*', 'value', JSON.stringify(Value));
						returnData.push({
							json: {
								operation: 'both',
								
								Value,
								toKeyName,
							},
						});
					}
					}
					else if (redisDataType === 'json-stream') {
						if(fromKeyName){
						list = await redis.call('JSON.GET', fromKeyName);
						
						
						returnData.push({
							json: {
								operation: 'both',
								fromKeyName,
								list,
								toKeyName,
							
							},
						});
					}
					if(list && list.length > 0){
						
						if(toKeyName){ await redis.call('xadd', toKeyName, '*','json', list);
						returnData.push({
							json: {
								operation: 'both',
							    list,
								toKeyName,
								fromKeyName,
							},
						});
					}
				
			}
					}

					else if (redisDataType === 'stream-json') {
						if(fromKeyName){
						list = await redis.xreadgroup('GROUP', groupName, consumer, 'STREAMS',fromKeyName, '>');
						
						
						returnData.push({
							json: {
								operation: 'both',
								fromKeyName,
								list,
								toKeyName,
							
							},
						});
					}
					if(list && list.length > 0){
						
						if(toKeyName){ await redis.call('JSON.SET', toKeyName, '$', JSON.stringify(list));
						returnData.push({
							json: {
								operation: 'both',
							    list,
								toKeyName,
								fromKeyName,
							},
						});
					}
				
			}
					}
					
				}
				

			} catch (error) {
				console.error('Redis Error:', error.message);
				throw new NodeOperationError(this.getNode(), 'Redis Error: ' + error.message);
			}
		}

		return [returnData];
	}
}
