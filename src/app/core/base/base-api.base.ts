// core/base/base-api.service.ts
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GlobalPaginatedResponse, GlobalResponse } from '../models/response-global.model';
import { GetAllModel } from '../models/get-all.model';
import { Adaptor } from './adaptor.base';


export abstract class BaseApiService<TRaw, TAdapted = TRaw> {
    protected readonly _http = inject(HttpClient);
    protected abstract readonly basePath: string;

    /** Override in subclass to plug in an Adapter. Leave null for no transform. */
    protected readonly adapter: Adaptor | null = null;

    private get _url() {
        return `${environment.apiUrl}${this.basePath}`;
    }

    private _adapt(item: TRaw): TAdapted {
        return this.adapter ? this.adapter.adapt(item) : (item as unknown as TAdapted);
    }

    getAll(getAllModel: GetAllModel): Observable<GlobalPaginatedResponse<TAdapted[]>> {
        const params = new HttpParams().appendAll(getAllModel as any);
        return this._http
            .get<GlobalPaginatedResponse<TRaw[]>>(this._url, { params })
            .pipe(map((res) => ({
                ...res,
                data: res.data.map((item) => this._adapt(item))
            })));
    }

    getOne(id: string): Observable<TAdapted> {
        return this._http
            .get<GlobalResponse<TRaw>>(`${this._url}/${id}`)
            .pipe(map((res) => this._adapt(res.data)));
    }

    create(payload: Partial<TRaw>): Observable<GlobalResponse<TRaw>> {
        return this._http.post<GlobalResponse<TRaw>>(this._url, payload);
    }

    update(id: string, payload: Partial<TRaw>): Observable<GlobalResponse<TRaw>> {
        return this._http.patch<GlobalResponse<TRaw>>(`${this._url}/${id}`, payload);
    }

    delete(id: string): Observable<GlobalResponse<null>> {
        return this._http.delete<GlobalResponse<null>>(`${this._url}/${id}`);
    }

    uploadImage(id: string, image: File): Observable<void> {
        const form = new FormData();
        form.append("image", image);
        return this._http.patch(
            `${this._url}/${id}/image`,
            form
        ).pipe(map(() => { }));
    }
}