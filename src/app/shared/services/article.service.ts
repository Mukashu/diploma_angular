import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ArticlesType} from "../../../types/articles.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {FullArticleWithCommentsType} from "../../../types/fullArticleWithComments.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getArticles(activeParams: ActiveParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {
      params: activeParams,
    });
  }

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getFullArticleWithComments(url: string): Observable<FullArticleWithCommentsType> {
    return this.http.get<FullArticleWithCommentsType>(environment.api + 'articles/' + url);
  }

  getRelatedArticle(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }
}
