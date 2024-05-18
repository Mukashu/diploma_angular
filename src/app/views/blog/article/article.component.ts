import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {FullArticleWithCommentsType} from "../../../../types/fullArticleWithComments.type";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ArticleType} from "../../../../types/article.type";
import {HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: FullArticleWithCommentsType = {
    text: '',
    comments: [],
    commentsCount: 0,
    id: '',
    title: '',
    description: '',
    image: '',
    date: '',
    category: '',
    url: '',
  };

  textAfterFilter: SafeHtml | null = null;
  relatedArticles: ArticleType[] | null = null;
  localStaticPath: string = environment.localStaticPath;

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {

      this.articleService.getFullArticleWithComments(params['articleUrl']).subscribe({
        next: (article: FullArticleWithCommentsType) => {
          this.article = article;
          this.filterArticleText(article.text);

          this.articleService.getRelatedArticle(article.url).subscribe({
            next: (relatedArticles: ArticleType[]) => {
              this.relatedArticles = relatedArticles;
            },
            error: (err: HttpErrorResponse) => {
              this.relatedArticles = null;
            }
          });
        }
      });
    });
  }


  filterArticleText(text: string) {
    const textHTML = new DOMParser().parseFromString(text, 'text/html');
    const h1 = textHTML.querySelector('h1');

    if (h1) {
      const nextSibling = h1.nextElementSibling;
      h1.remove();
      if (nextSibling) {
        nextSibling.remove();
      }
    }

    this.textAfterFilter = this.sanitizer.bypassSecurityTrustHtml(textHTML.body.innerHTML);
  }
}
