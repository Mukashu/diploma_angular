import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {Router} from "@angular/router";
import {ActiveLinkService} from "../../services/active-link.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input() article!: ArticleType;
  localStaticPath: string = environment.localStaticPath;

  constructor(private router: Router,
              private activeLinkService: ActiveLinkService,) {
  }

  ngOnInit(): void {
  }

  articleDetail() {
    this.activeLinkService.activeLink$.next('');
    this.activeLinkService.removeActiveLink();
    this.router.navigate(['/articles/' + this.article.url]);
  }
}
