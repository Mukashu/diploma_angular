import { Component, OnInit } from '@angular/core';
import {ActiveLinkService} from "../../services/active-link.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private activeLinkService: ActiveLinkService,
              private router: Router,) { }

  ngOnInit(): void {
  }

  activeLink(link: string) {
    this.activeLinkService.activeLink$.next(link);
    this.activeLinkService.setActiveLink(link);
    this.router.navigate(['/'], { fragment: link });
  }

}
