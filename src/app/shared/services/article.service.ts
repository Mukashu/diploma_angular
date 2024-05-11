import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ArticlesType} from "../../../types/articles.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getArticles(): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles');
  }

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }
}
