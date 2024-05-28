import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  showPopup$: Subject<boolean> = new Subject<boolean>();

  type: { consultation: string, order: string } = {
    consultation: 'consultation',
    order: 'order',
  };

  constructor(private http: HttpClient) {
  }

  consultation(name: string, phone: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name, phone, type
    });
  }

  order(name: string, phone: string, service: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name, phone, service, type
    });
  }
}
