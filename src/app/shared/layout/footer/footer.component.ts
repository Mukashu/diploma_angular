import { Component, OnInit } from '@angular/core';
import {ActiveLinkService} from "../../services/active-link.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private activeLinkService: ActiveLinkService) { }

  ngOnInit(): void {
  }

  activeLink(link: string) {
    this.activeLinkService.activeLink$.next(link);
  }

}
