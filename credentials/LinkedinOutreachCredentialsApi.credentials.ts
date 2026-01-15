import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LinkedinOutreachCredentialsApi implements ICredentialType {
	name = 'linkedinOutreachCredentialsApi';
	displayName = 'LinkedIn Outreach Credentials API';

	documentationUrl = 'https://developer.unipile.com/docs/getting-started';

	properties: INodeProperties[] = [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			default: '',
			description:
				'Your User ID shown in the AI Outreach dashboard.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				'Your API Key shown in the AI Outreach dashboard.',
		},
		{
			displayName: 'Account ID',
			name: 'account_id',
			type: 'string',
			default: '',
			description:
				'A filter to target items related to a certain account. Can be a comma-separated list of IDs.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				userId: '={{$credentials.userId}}',
				apiKey: '={{$credentials.apiKey}}',
				account_id: '={{$credentials.account_id}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://rnmqfhwsqojadktbxnrf.supabase.co/functions/v1',
			url: '/linkedin-list-accounts',
			method: 'POST'
		},
	};
}
