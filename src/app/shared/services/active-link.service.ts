import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActiveLinkService {

  public activeLink$: Subject<string | null> = new Subject<string | null>();
  private activeLinkKey: string = 'activeLink';

  constructor() { }

  setActiveLink(link: string): void {
    sessionStorage.setItem(this.activeLinkKey, link);
  }

  getActiveLink(): string | null {
    return sessionStorage.getItem(this.activeLinkKey);
  }

  removeActiveLink(): void {
    sessionStorage.removeItem(this.activeLinkKey);
  }
}
