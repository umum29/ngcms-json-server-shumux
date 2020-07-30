import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { catchError, tap } from "rxjs/operators";
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: "root"
})
export class WebService {
  headers: HttpHeaders;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  setHeaders(token: string) {
    this.headers = new HttpHeaders().set("Authentication", token);
  }

  getF<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url, { headers: this.headers }).pipe(
      tap(res => this.logger.print("response", res)),
      catchError(this.handleError)
    );
  }

  postF<T>(url: string, obj: T): Observable<T> {
    return this.http.post<T>(url, obj, { headers: this.headers }).pipe(
      tap(res => this.logger.print("post", res)),
      catchError(this.handleError)
    );
  }

  delF<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, { headers: this.headers }).pipe(
      tap(res => this.logger.print("del", res)),
      catchError(this.handleError)
    );
  }

  putF<T>(url: string, obj: T): Observable<T> {
    return this.http.put<T>(url, obj, { headers: this.headers }).pipe(
      tap(res => this.logger.print("put", res)),
      catchError(this.handleError)
    );
  }

  patchF<T>(url: string, obj: T): Observable<T> {
    return this.http.patch<T>(url, obj, { headers: this.headers }).pipe(
      tap(res => this.logger.print("patch", res)),
      catchError(this.handleError)
    );
  }

  private handleError(error: Response | any): Observable<any> {
    console.error(`${error.status}`);
    return of(null);
  }
}
