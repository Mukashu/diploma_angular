import {Component, OnInit} from '@angular/core';
import {ActiveLinkService} from "../../services/active-link.service";
import {Router} from "@angular/router";
import {RequestService} from "../../services/request.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  showPopup: boolean = false;

  constructor(private activeLinkService: ActiveLinkService,
              private router: Router,
              private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.requestService.showPopup$.subscribe((show: boolean) => {
      this.showPopup = show;
    });
  }

  activeLink(link: string) {
    this.activeLinkService.activeLink$.next(link);
    this.activeLinkService.setActiveLink(link);
    this.router.navigate(['/'], {fragment: link});
  }

  showPopupWindow() {
    this.showPopup = true;
  }
}
