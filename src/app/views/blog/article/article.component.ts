import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {FullArticleWithCommentsType} from "../../../../types/full-article-with-comments.type";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ArticleType} from "../../../../types/article.type";
import {HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentsService} from "../../../shared/services/comments.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentType} from "../../../../types/comment.type";
import {MoreCommentsType} from "../../../../types/more-comments.type";
import {LoaderService} from "../../../shared/services/loader.service";

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
  loginUser: boolean = this.authService.getIsLoggedIn();
  commentText: string = '';
  noComments: boolean = true;
  moreComments: boolean = false;
  comments: CommentType[] = [];

  firstClick: boolean = true;
  skipComments: number = 0;
  totalCommentsPages: number = 0;

  constructor(private articleService: ArticleService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private commentsService: CommentsService,
              private loaderService: LoaderService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    //Делаем запрос на получение статьи и размещаем ее в переменную this.article
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getFullArticleWithComments(params['articleUrl']).subscribe({
        next: (article: FullArticleWithCommentsType) => {
          this.article = article;

          //Форматируем текст статьи
          this.filterArticleText(this.article.text);

          //Делаем запрос на получение связанных статей
          this.articleService.getRelatedArticle(this.article.url).subscribe({
            next: (relatedArticles: ArticleType[]) => {
              this.relatedArticles = relatedArticles;
            },
            error: (err: HttpErrorResponse) => {
              this.relatedArticles = null;
            }
          });

          //Если в статье есть комментарии, то они добавляются в переменную this.comments и публикуются на странице
          //Иначе массив комментариев очищается, флаги наличия комментариев и доп коменнтариев сбрасываются
          if (this.article.comments && this.article.comments.length > 0) {
            this.noComments = false;
            this.comments = this.article.comments;
            if (this.article.commentsCount > 3) {
              this.moreComments = true;
              this.totalCommentsPages = Math.floor((this.article.commentsCount - 14) / 10) + 2;
            }

            if (this.loginUser) {
              //Делаем запрос на получение комментариев, в которых пользователь поставил реакцию.
              //Если такие комментарии есть, отправляем их в компонент карточки комментария
              this.commentsService.transferAllUserActionsToCommentCard(this.article.id);
            }
          } else {
            this.comments = [];
            this.noComments = true;
            this.moreComments = false;
          }
        }
      });
    });
  }

  // Функция форматирования текста статьи
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

  //Функция отправки комментариев для статьи
  sendComment(text: string, article: string): void {
    if (text) {
      //Если поле комментария не пустое, отправляем текст комментария на сервер для его публикации
      this.commentsService.postComment(text, article).subscribe({
        next: (response: DefaultResponseType) => {
          this.noComments = false;
          this.commentText = '';

          if (!response.error) {
            //Если запрос на отправку комментария прошел успешно, запрашиваем всю статью и обновляем ее в переменной this.article
            this.activatedRoute.params.subscribe(params => {
              this.articleService.getFullArticleWithComments(params['articleUrl']).subscribe({
                next: (article: FullArticleWithCommentsType) => {
                  this.article = article;

                  //Если в статье есть комментарии, то обновляем переменную this.comments, которая содержит все комментарии статьи
                  if (this.article.comments && this.article.comments.length > 0) {
                    this.comments = this.article.comments;
                    if (this.article.commentsCount > 3) {
                      this.moreComments = true;
                    }
                    this.firstClick = true;
                    this.skipComments = 0;
                    this.totalCommentsPages = Math.floor((this.article.commentsCount - 14) / 10) + 2;

                    //Делаем запрос на получение комментариев, в которых пользователь поставил реакцию.
                    //Если такие комментарии есть, отправляем их в компонент карточки комментария
                    this.commentsService.transferAllUserActionsToCommentCard(this.article.id);
                  }
                }
              });
            });
          }
        }
      });
    }
  }

  //Функция получения дополнительных комментариев для статьи.
  getMoreComments(): void {
    this.moreComments = false;
    this.loaderService.show();

    if (this.article.commentsCount <= 13) {
      this.firstClick = false;
      this.skipComments = 3;
      this.totalCommentsPages = 0;
    }

    if (this.article.commentsCount > 13) {
      if (!this.firstClick) {
        if (this.skipComments > 3) {
          this.skipComments += 10;
          this.totalCommentsPages--;
        }

        if (this.skipComments === 3) {
          this.skipComments = 13;
          this.totalCommentsPages--;
        }
      }

      if (this.firstClick) {
        this.firstClick = false;
        this.skipComments = 3;
        this.totalCommentsPages--;
      }
    }

    //Отправляем запрос на получение дополнительных комментариев для статьи
    this.commentsService.getMoreComments(this.skipComments, this.article.id).subscribe({
      next: (response: MoreCommentsType) => {

        //Добавляем полученные комментарии к тем, что уже отражаются на странице
        this.comments = this.comments.concat(response.comments);
        this.moreComments = this.totalCommentsPages !== 0;
        this.loaderService.hide();

        if (this.loginUser) {
          //Делаем запрос на получение комментариев, в которых пользователь поставил реакцию.
          //Если такие комментарии есть, отправляем их в компонент карточки комментария
          this.commentsService.transferAllUserActionsToCommentCard(this.article.id);
        }
      }
    });
  }
}

