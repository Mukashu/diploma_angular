import {Component, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentsService} from "../../services/comments.service";
import {UserActionType} from "../../../../types/user-action.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  @Input() comment: CommentType | null = null;

  allUserActions: UserActionType[] = [];
  loginUser: boolean = this.authService.getIsLoggedIn();

  actions = {
    like: 'like',
    dislike: 'dislike',
    violate: 'violate'
  };

  searchCommentAction: UserActionType | undefined = undefined;
  commentReactionLike: boolean = false;
  commentReactionDislike: boolean = false;

  constructor(private commentsService: CommentsService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    //Подписываемся на получение массива комментариев, в которых были проставлены реакции пользователем
    this.commentsService.userActions$.subscribe((userActions: UserActionType[]) => {
      this.allUserActions = userActions;
      //Ишем, публикуемый комментарий, в массиве комментариев, для которых реакция проставлена
      this.searchCommentAction = userActions.find((userAction: UserActionType) => userAction.comment === this.comment?.id);
      //Проверяем условия для каждой реакции, чтобы установить соответствующие цвета
      this.commentReactionLike = this.searchCommentAction?.action === this.actions.like || false;
      this.commentReactionDislike = this.searchCommentAction?.action === this.actions.dislike || false;
    });
  }

  //Функция отправки реакции в компонент статьи
  sendReaction(id: string, reaction: string) {
    if (this.loginUser) {
      if (reaction !== this.actions.violate) {
        //Отправляем принятые параметры в commentsService для отправки реакции на сервер
        this.commentsService.sendReaction({id: id, reaction: reaction});
        const isLike: boolean = reaction === this.actions.like;
        const isDislike: boolean = reaction === this.actions.dislike;
        const actionChanged: string | undefined = this.searchCommentAction?.action;

        // Увеличиваем или уменьшаем счётчик лайков
        if (isLike) {
          this.comment!.likesCount += this.commentReactionLike ? -1 : 1;
          if (actionChanged === this.actions.dislike) {
            this.comment!.dislikesCount--;
          }
        }

        // Увеличиваем или уменьшаем счётчик дизлайков
        if (isDislike) {
          this.comment!.dislikesCount += this.commentReactionDislike ? -1 : 1;
          if (actionChanged === this.actions.like) {
            this.comment!.likesCount--;
          }
        }

        this.commentsService.sendReactionError$.subscribe({
          next: error => {
            if (!error) {
              this._snackBar.open('Ваш голос учтен');
            } else {
              this._snackBar.open('Произошла ошибка, попробуйте позже');
            }
          }
        });
      }

      if (reaction === this.actions.violate) {
        //Отправляем принятые параметры в commentsService для отправки реакции на сервер
        this.commentsService.sendReaction({id: id, reaction: reaction});
        //Оповещаем пользователя в зависимости от полученного ответа от сервера
        this.commentsService.sendReactionError$.subscribe((error) => {
          if (!error) {
            this._snackBar.open('Жалоба отправлена');
          } else {
            this._snackBar.open('Жалоба уже отправлена');
          }
        });
      }
    } else {
      this._snackBar.open('Вы не авторизованы');
    }
  }
}
