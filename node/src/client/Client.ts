import {
    ID,

    Notebook,
    INotebooks,

    IResponse,

    IResponse_version,
    IResponse_lsNotebooks,

    IPayload_fullTextSearchBlock,
    IResponse_fullTextSearchBlock,

    IPayload_getBlockBreadcrumb,
    IResponse_getBlockBreadcrumb,

    IPayload_searchDocs,
    IResponse_searchDocs,

    IPayload_listDocsByPath,
    IResponse_listDocsByPath,

    IResponse_getRecentDocs,
} from "./../types/siyuan";

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
    public async version(): Promise<IResponse_version> {
        const response = await this._request("/api/system/version") as IResponse_version;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(): Promise<IResponse_lsNotebooks> {
        const response = await this._request("/api/notebook/lsNotebooks") as IResponse_lsNotebooks;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(): Promise<IResponse_getRecentDocs> {
        const response = await this._request("/api/storage/getRecentDocs") as IResponse_getRecentDocs;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(payload: IPayload_fullTextSearchBlock): Promise<IResponse_fullTextSearchBlock> {
        const response = await this._request("/api/search/fullTextSearchBlock", payload) as IResponse_fullTextSearchBlock;
        return response;
    }

    /* 获得指定块的面包屑 */
    public async getBlockBreadcrumb(payload: IPayload_getBlockBreadcrumb): Promise<IResponse_getBlockBreadcrumb> {
        const response = await this._request("/api/block/getBlockBreadcrumb", payload) as IResponse_getBlockBreadcrumb;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(payload: IPayload_searchDocs): Promise<IResponse_searchDocs> {
        const response = await this._request("/api/filetree/searchDocs", payload) as IResponse_searchDocs;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(payload: IPayload_listDocsByPath): Promise<IResponse_listDocsByPath> {
        const response = await this._request("/api/filetree/listDocsByPath", payload) as IResponse_listDocsByPath;
        return response;
    }

    protected async _request(
        pathname: string,
        payload: object = {},
    ): Promise<IResponse> {
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
            const body: IResponse = await response.json();

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
