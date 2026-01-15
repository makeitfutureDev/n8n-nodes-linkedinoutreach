import { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, IHttpRequestOptions, ILoadOptionsFunctions, JsonObject, NodeApiError } from "n8n-workflow";

export async function linkedinApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {

	const options = {
		method,
		qs: query,
		headers: {},
		url: uri || `https://rnmqfhwsqojadktbxnrf.supabase.co/functions/v1${endpoint}`,
		body,
		json: true,
	} satisfies IHttpRequestOptions;


	try {

		return await this.helpers.requestWithAuthentication.call(this, 'linkedinOutreachCredentialsApi', options);


	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
