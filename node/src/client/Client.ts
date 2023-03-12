import types from "./../types/siyuan";

export class Client {

    public readonly method: string = "POST"; // 请求方法
    public readonly headers: {
        Authorization: string;
        [propName: string]: string;
    }; // 请求头

    constructor(
        public url: URL,
        public token: string,
    ) {
        this.headers = {
            Authorization: `Token ${this.token}`,
        };
    }

    /* 更新配置 */
    public update(
        url: URL,
        token: string,
    ) {
        this.url = url;
        this.token = token;
        this.headers.Authorization = `Token ${this.token}`;
    }

    /* 获得内核版本 */
    public async version(): Promise<types.IResponse_version> {
        const response = await this._request("/api/system/version") as types.IResponse_version;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(): Promise<types.IResponse_lsNotebooks> {
        const response = await this._request("/api/notebook/lsNotebooks") as types.IResponse_lsNotebooks;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(): Promise<types.IResponse_getRecentDocs> {
        const response = await this._request("/api/storage/getRecentDocs") as types.IResponse_getRecentDocs;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(payload: types.IPayload_fullTextSearchBlock): Promise<types.IResponse_fullTextSearchBlock> {
        const response = await this._request("/api/search/fullTextSearchBlock", payload) as types.IResponse_fullTextSearchBlock;
        return response;
    }

    /* 获得指定块的面包屑 */
    public async getBlockBreadcrumb(payload: types.IPayload_getBlockBreadcrumb): Promise<types.IResponse_getBlockBreadcrumb> {
        const response = await this._request("/api/block/getBlockBreadcrumb", payload) as types.IResponse_getBlockBreadcrumb;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(payload: types.IPayload_searchDocs): Promise<types.IResponse_searchDocs> {
        const response = await this._request("/api/filetree/searchDocs", payload) as types.IResponse_searchDocs;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(payload: types.IPayload_listDocsByPath): Promise<types.IResponse_listDocsByPath> {
        const response = await this._request("/api/filetree/listDocsByPath", payload) as types.IResponse_listDocsByPath;
        return response;
    }

    protected async _request(
        pathname: string,
        payload: object = {},
    ): Promise<types.IResponse> {
        this.url.pathname = pathname;
        let response;

        try {
            response = await fetch(
                this.url.href,
                {
                    body: JSON.stringify(payload),
                    method: this.method,
                    headers: this.headers,
                },
            );
        } catch (error) {
            throw error;
        }

        if (response.ok) {
            const body: types.IResponse = await response.json();

            if (body.code === 0) {
                return body;
            }
            else {
                const error = new Error(body.msg);
                throw error;
            }
        }
        else {
            const error = new Error(response.statusText);
            throw error;
        }
    }
}
