import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { WebService } from "./web.service";
import { ApiUrl } from "../config/config";
import { IModel, IUser } from "../model/data";
import { IData, IPage } from "../model/base";
import { Md5 } from "ts-md5";

export interface IFilter {
  key: string;
  val: string | number;
}

@Injectable({
  providedIn: "root"
})
export class DataService {
  apiUrl = ApiUrl;

  constructor(private webService: WebService) {}

  private setUrl(position: string, filters?: IFilter[], id?: number): string {
    let url = `${this.apiUrl}/${position}/`;
    if (!!id) {
      url += `${id}`;
    }
    if (!!filters && !!filters.length) {
      url += `?`;
      filters.forEach((filter: IFilter, index: number) => {
        if (!!index) {
          url += `&&`;
        }
        url += `${filter.key}=${filter.val}`;
      });
    }
    return url;
  }

  connect(token: string): Observable<IData> {
    let url = this.setUrl("admins", [
      { key: "token", val: token },
      { key: "_embed", val: "holds" }
    ]);
    return this.webService.getF(url).pipe(
      map((res: IModel[]) => {
        let errocode = 0;

        if (!res || !res.length) {
          errocode = 2;
        }
        if (!!res[0]) {
          let user = <IUser>res[0];
          if (user.status != 1) {
            errocode = 3;
          }
        }
        this.webService.setHeaders(token);
        return <IData>{
          res: res,
          errorcode: errocode
        };
      })
    );
  }

  resData(res: IModel[] | IModel, errocode: number): IData {
    return <IData>{
      res: res,
      errorcode: errocode
    };
  }

  getData(position: string, id?: number, filters?: IFilter[], pageObj?: IPage): Observable<IData> {
    let url = this.setUrl(position, filters, id);
    return this.webService.getF(url).pipe(
      map((res: IModel[]) => {
        let errocode = 0;
        if (!!pageObj) {
          pageObj.length = res.length;
          res["pageObj"] = pageObj;
          res = this.rangeData(res, pageObj);
        }
        return this.resData(res, errocode);
      })
    );
  }

  insertOne(position: string, obj: IModel): Observable<IData> {
    let url = this.setUrl(position);
    return this.webService.postF(url, obj).pipe(
      map((res: IModel) => {
        let errocode = 0;
        if (!res || !res.id) {
          errocode = 4;
        }
        return this.resData(res, errocode);
      })
    );
  }

  updateOne(position: string, obj: IModel, id: number): Observable<IData> {
    let url = this.setUrl(position, null, id);
    return this.webService.patchF(url, obj).pipe(
      map((res: IModel) => {
        let errocode = 0;
        if (!res) {
          errocode = 5;
        }
        return this.resData(res, errocode);
      })
    );
  }

  deleteOne(position: string, id: number): Observable<IData> {
    let url = this.setUrl(position, null, id);
    return this.webService.delF(url).pipe(
      map((res: IModel) => {
        let errocode = 0;
        if (Object.keys(res).length !== 0) {
          errocode = 6;
        }
        return this.resData(res, errocode);
      })
    );
  }

  //加上新增或是更新日期
  checkData(obj: IModel, operatorId: number, isInsert = true): IModel {
    let insert = <IModel>{
      insertBy: operatorId,
      inserted: new Date().getTime()
    };
    let update = <IModel>{
      updateBy: operatorId,
      updated: new Date().getTime()
    };
    if (isInsert) {
      obj = { ...obj, ...insert, ...update };
    } else {
      //update
      obj = { ...obj, ...update };
    }
    return obj;
  }

  rangeData(obj: IModel[], pageObj: IPage): IModel[] {
    let start = pageObj.pageIndex * pageObj.pageSize;
    let end = start + pageObj.pageSize;
    if (pageObj.length < end) {
      end = pageObj.length;
    }
    return obj.slice(start, end);
  }

  makeToken(account: string): string {
    return <string>Md5.hashStr(`${account}`);
  }
}
