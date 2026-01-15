import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{
				name: 'Send LinkedIn Connection Request',
				value: 'sendConnectionRequest',
				description: 'Send a connection request to a LinkedIn user',
				action: 'Send linked in connection request',
			},
		],
		default: 'sendConnectionRequest',
	},
];

/* ───────── UI: fields with listSearch ───────── */
// This version shows search results and displays the user's name

export const userFields: INodeProperties[] = [
	{
		displayName: 'LinkedIn User',
		name: 'linkedinUser',
		type: 'resourceLocator',
		required: true,
		displayOptions: { show: { resource: ['user'], operation: ['sendConnectionRequest'] } },
		default: { mode: 'list', value: '' },
		description: 'The LinkedIn user to send the connection request to',
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
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: { show: { resource: ['user'], operation: ['sendConnectionRequest'] } },
		default: '',
		description: 'The personalized message to include with the connection request',
	},
];
