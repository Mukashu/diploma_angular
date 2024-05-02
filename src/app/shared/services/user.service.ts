import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {UserInfoType} from "../../../types/user-info.type";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly accessTokenKey: string;

  constructor(private http: HttpClient,
              authService: AuthService,) {

    this.accessTokenKey = authService.accessTokenKey;
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users', {headers: {'x-auth': `${localStorage.getItem(this.accessTokenKey)}`}});
  }
}
