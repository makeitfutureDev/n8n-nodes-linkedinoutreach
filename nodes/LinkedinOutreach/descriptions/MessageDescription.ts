import { INodeProperties } from 'n8n-workflow';

/* ───────── UI: Message operations ───────── */
export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['message'] } },
		default: 'sendMessage',
		options: [
			{
				name: 'Send Message',
				value: 'sendMessage',
				description: 'Send a new message to start a conversation',
				action: 'Send a message',
			},
		],
	},
];

/* ───────── UI: Message fields ───────── */
export const messageFields: INodeProperties[] = [
	{
		displayName: 'Attendees',
		name: 'attendees_ids',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['sendMessage'] } },
		default: {},
		description: 'One or more attendee provider\'s internal IDs',
		options: [
			{
				name: 'attendee',
				displayName: 'Attendee',
				values: [
					{
						displayName: 'LinkedIn User',
						name: 'linkedinUser',
						type: 'resourceLocator',
						required: true,
						default: { mode: 'list', value: '' },
						description: 'The LinkedIn user to send the message to',
						modes: [
							{
								displayName: 'From Public ID',
								name: 'list',
								type: 'list',
								placeholder: 'Search by public ID (e.g. ionut-andrei-popescu)',
								typeOptions: {
									searchListMethod: 'searchLinkedInUser',
									searchable: true,
									searchFilterRequired: true,
								},
							},
							{
								displayName: 'By Provider ID',
								name: 'id',
								type: 'string',
								placeholder: 'e.g. ACoAABxxxxxx',
								validation: [
									{
										type: 'regex',
										properties: {
											regex: '.+',
											errorMessage: 'Please enter a valid provider ID',
										},
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: 'Message Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['sendMessage'] } },
		default: '',
		description: 'The message that will start the new conversation',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		displayOptions: { show: { resource: ['message'], operation: ['sendMessage'] } },
		default: '',
		description: 'An optional field to set the subject of the conversation',
	},
	{
		displayName: 'API Version',
		name: 'api',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['sendMessage'] } },
		default: 'classic',
		description: 'The LinkedIn API that should be used to start chatting',
		options: [
			{
				name: 'Classic',
				value: 'classic',
			},
			{
				name: 'Recruiter',
				value: 'recruiter',
			},
			{
				name: 'Sales Navigator',
				value: 'sales_navigator',
			},
		],
	},
	{
		displayName: 'InMail',
		name: 'inmail',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				api: ['classic', 'sales_navigator'],
			},
		},
		default: false,
		description: 'Whether to start the new conversation with an InMail',
	},
	{
		displayName: 'Signature',
		name: 'signature',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				api: ['recruiter'],
			},
		},
		default: '',
		description: 'The signature of the sender',
	},
	{
		displayName: 'Hiring Project ID',
		name: 'hiring_project_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				api: ['recruiter'],
			},
		},
		default: '',
		description: 'The ID of the project the chat should be started in',
	},
	{
		displayName: 'Email Address',
		name: 'email_address',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				api: ['recruiter'],
			},
		},
		default: '',
		description: 'The email address of the recipient in case the chat should be started with email instead of InMail',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: { show: { resource: ['message'], operation: ['sendMessage'] } },
		default: '',
		description: 'The name of the binary property containing the file to attach (leave empty for no attachment)',
	},
];