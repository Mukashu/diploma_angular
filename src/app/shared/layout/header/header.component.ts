import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ActiveLinkService} from "../../services/active-link.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  user: string = '';
  selectedLink: string | null = null;

  constructor(private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private activeLinkService: ActiveLinkService,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
    let selectedLinkStorage: string | null = this.activeLinkService.getActiveLink();

    if (this.isLogged) {
      this.getUserInfo();
    }

    if (selectedLinkStorage) {
      this.selectedLink = selectedLinkStorage;
    }
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe({
      next: (isLoggedIn: boolean): void => {
        this.isLogged = isLoggedIn;

        if (this.isLogged) {
          this.getUserInfo();
        }
      }
    });

    this.activeLinkService.activeLink$.subscribe({
      next: (link: string | null): void => {
        this.selectedLink = link;
      }
    });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (): void => {
          this.doLogout();
        },
        error: (): void => {
          this.doLogout();
        }
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  getUserInfo(): void {
    this.userService.getUserInfo()
      .subscribe({
        next: (data: UserInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            this._snackBar.open('Ошибка получения информации о пользователе');
            this.doLogout();
          }

          if (!(data as UserInfoType).name) {
            this._snackBar.open('Ошибка получения информации о пользователе');
            this.doLogout();
          }

          this.user = (data as UserInfoType).name;
        },
        error: () => {
          this._snackBar.open('Ошибка получения информации о пользователе');
          this.doLogout();
        }
      });
  }

  useLink(link: string): void {
    this.selectedLink = link;
    this.activeLinkService.setActiveLink(link);
    this.router.navigate(['/'], { fragment: link });
  }
}
