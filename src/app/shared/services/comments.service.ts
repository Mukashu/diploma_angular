import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";
import {MoreCommentsType} from "../../../types/more-comments.type";
import {SendReactionType} from "../../../types/send-reaction.type";
import {UserActionType} from "../../../types/user-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  readonly accessTokenKey: string;
  public sendReactionError$: Subject<boolean> = new Subject<boolean>();
  public userActions$: Subject<UserActionType[]> = new Subject<UserActionType[]>();

  allUserActions: UserActionType[] = [];
  violate: string = 'violate';

  constructor(private http: HttpClient,
              private authService: AuthService) {

    this.accessTokenKey = this.authService.accessTokenKey;
  }

  transferAllUserActionsToCommentCard(articleId: string) {
    this.getAllUserActions(articleId).subscribe({
      next: (allUserActions: UserActionType[] | DefaultResponseType) => {
        if (allUserActions as UserActionType[]) {
          this.allUserActions = allUserActions as UserActionType[];
          //Оповещаем компонент комментариев, что у нас имеются установленные пользователем реакции
          this.userActions$.next(this.allUserActions);
        }
      }
    });
  }

  sendReaction(reaction: SendReactionType) {
    if (reaction.reaction === this.violate) {
      //Отправляем полученную реакцию на сервер
      this.postAction(reaction.id, reaction.reaction)
        .subscribe({
          next: response => {
            this.sendReactionError$.next(response.error);
          },
          error: err => {
            this.sendReactionError$.next(err.error.error);
          }
        });
    } else {
      //Отправляем полученную реакцию на сервер
      this.postAction(reaction.id, reaction.reaction).subscribe({
        next: (response: DefaultResponseType) => {
          if (!response.error) {
            //Запрашиваем отправленную пользователем реакцию с сервера
            this.getUserAction(reaction.id).subscribe({
              next: (userAction: UserActionType[] | DefaultResponseType) => {
                if (userAction as UserActionType[]) {
                  this.sendReactionError$.next(response.error);
                  //Если пришел не пустой массив, то ищем в массиве всех реакций пользователя, есть ли совпадение id отправленной и уже имеющейся реакции
                  if ((userAction as UserActionType[]).length !== 0) {
                    //Если в массиве реакций такая присутствует, то перезаписываем свойство этой реакции на то, которое отправил пользователь
                    if (this.allUserActions.find(userAction => userAction.comment === reaction.id)) {
                      this.allUserActions = this.allUserActions.map(userAction => {
                        if (userAction.comment === reaction.id) {
                          return {...userAction, action: reaction.reaction};
                        }
                        return userAction;
                      });
                      this.userActions$.next(this.allUserActions);
                      //Если такой реакции в массиве нет, то добавляем ее в массив реакций пользователя
                    } else {
                      this.allUserActions = this.allUserActions.concat(userAction as UserActionType[]);
                      this.userActions$.next(this.allUserActions);
                    }
                    //Если в ответ пришел пустой массив, то удаляем отправленную реакцию из массива реакций пользователя
                  } else {
                    this.allUserActions = this.allUserActions.filter(allUserAction => allUserAction.comment !== reaction.id);
                    this.userActions$.next(this.allUserActions);
                  }
                }

                if (userAction as DefaultResponseType) {
                  if ((userAction as DefaultResponseType).error) {
                    this.sendReactionError$.next((userAction as DefaultResponseType).error);
                  }
                }
              }
            });
          } else {
            this.sendReactionError$.next(response.error);
          }
        },
        error: () => {
          this.sendReactionError$.next(true);
        }
      });
    }
  }

  postComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments',
      {text, article},
      {headers: {'x-auth': `${localStorage.getItem(this.accessTokenKey)}`}});
  }

  postAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action',
      {action},
      {headers: {'x-auth': `${localStorage.getItem(this.accessTokenKey)}`}});
  }

  getMoreComments(pages: number, id: string): Observable<MoreCommentsType> {
    return this.http.get<MoreCommentsType>(environment.api + 'comments?offset=' + pages + '&article=' + id);
  }

  getAllUserActions(id: string): Observable<UserActionType[] | DefaultResponseType> {
    return this.http.get<UserActionType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions?articleId=' + id,
      {headers: {'x-auth': `${localStorage.getItem(this.accessTokenKey)}`}});
  }

  getUserAction(id: string): Observable<UserActionType[] | DefaultResponseType> {
    return this.http.get<UserActionType[] | DefaultResponseType>(environment.api + `comments/${id}/actions`,
      {headers: {'x-auth': `${localStorage.getItem(this.accessTokenKey)}`}});
  }
}
