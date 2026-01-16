import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';
import { userFields, userOperations } from './descriptions/UserDescription';
import { messageFields, messageOperations } from './descriptions/MessageDescription';

export class LinkedinOutreach implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LinkedIn Outreach by Boost.space',
		name: 'linkedinOutreach',
		icon: 'file:linkedin_icon.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Imported app LinkedIn Outreach by Boost.space.',
		defaults: {
			name: 'LinkedIn Outreach by Boost.space',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
	{
		name: 'linkedinOutreachCredentialsApi',
		required: true,
	},
],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				default: 'user',
				noDataExpression: true,
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Message',
						value: 'message',
					},
				]},

			// USER
			...userOperations,
			...userFields,

			// MESSAGE
			...messageOperations,
			...messageFields,
		],
	};

	/* ───────── Methods ───────── */
methods = {
	listSearch: {
		async searchLinkedInUser(
			this: ILoadOptionsFunctions,
			filter?: string,
		): Promise<INodeListSearchResult> {
			const baseUrl = 'https://rnmqfhwsqojadktbxnrf.supabase.co/functions/v1';

			if (!filter) {
				return { results: [] };
			}

			try {
				const options: IHttpRequestOptions = {
					method: 'POST',
					url: `${baseUrl}/linkedin-retrieve-profile`,
					body: {
						identifier: filter,
					},
					json: true,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'linkedinOutreachCredentialsApi',
					options,
				);

				if (response && response.provider_id) {
					const name = `${response.first_name || ''} ${response.last_name || ''}`.trim() || filter;
					return {
						results: [
							{
								name: name,
								value: response.provider_id,
								url: response.public_identifier 
									? `https://linkedin.com/in/${response.public_identifier}` 
									: undefined,
							},
						],
					};
				}

				return { results: [] };
			} catch (error) {
				return { results: [] };
			}
		},
	},
};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		let responseData;
		const returnData: INodeExecutionData[] = [];
		const baseUrl = 'https://rnmqfhwsqojadktbxnrf.supabase.co/functions/v1';


		for (let i = 0; i < items.length; i++) {
		try{

/* ───────── sendConnectionRequest ───────── */
if (resource === 'user') {
	if (operation === 'sendConnectionRequest') {
		const endpoint = `${baseUrl}/linkedin-connection-request`;

		const linkedinUser = this.getNodeParameter('linkedinUser', i) as IDataObject;
		const provider_id = linkedinUser.value as string;
		const body: IDataObject = {
			provider_id: provider_id,
			message: this.getNodeParameter('message', i) as string,
		};

		const options: IHttpRequestOptions = {
			method: 'POST',
			body,
			url: endpoint,
			json: true,
		};

		responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'linkedinOutreachCredentialsApi',
			options,
		);
	}
}



/* ───────── MESSAGE: sendMessage ───────── */
				if (resource === 'message') {
					if (operation === 'sendMessage') {
						const endpoint = `${baseUrl}/linkedin-send-message`;

						// Get attendees from fixedCollection
						const attendeesCollection = this.getNodeParameter('attendees_ids', i) as IDataObject;
						const attendeesList = (attendeesCollection.attendee as IDataObject[]) || [];
						const attendees_ids: string[] = attendeesList.map((item) => {
							const linkedinUser = item.linkedinUser as IDataObject;
							return linkedinUser.value as string;
						});

						if (attendees_ids.length === 0) {
							throw new NodeApiError(this.getNode(), { message: 'At least one attendee is required', statusCode: 400 });
						}

						const text = this.getNodeParameter('text', i) as string;
						const subject = this.getNodeParameter('subject', i, '') as string;
						const api = this.getNodeParameter('api', i) as string;

						// Build JSON body (credentials added automatically via httpRequestWithAuthentication)
						const body: IDataObject = {
							attendees_ids,
							text,
							api,
						};

						// Optional fields
						if (subject) {
							body.subject = subject;
						}

						// API-specific fields
						if (api === 'classic' || api === 'sales_navigator') {
							const inmail = this.getNodeParameter('inmail', i, false) as boolean;
							body.inmail = inmail;
						}

						if (api === 'recruiter') {
							const signature = this.getNodeParameter('signature', i, '') as string;
							const hiring_project_id = this.getNodeParameter('hiring_project_id', i, '') as string;
							const email_address = this.getNodeParameter('email_address', i, '') as string;

							if (signature) body.signature = signature;
							if (hiring_project_id) body.hiring_project_id = hiring_project_id;
							if (email_address) body.email_address = email_address;
						}

						// Handle file attachment (base64 encoded for edge function)
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, '') as string;
						if (binaryPropertyName && items[i].binary && items[i].binary![binaryPropertyName]) {
							const binaryData = items[i].binary![binaryPropertyName];
							const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
							body.file_data = fileBuffer.toString('base64');
							body.file_name = binaryData.fileName || 'attachment';
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: endpoint,
							body,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'linkedinOutreachCredentialsApi',
							options,
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

	return [returnData];
	}
}
