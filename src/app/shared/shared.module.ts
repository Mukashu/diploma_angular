import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    ArticleCardComponent
  ],
  exports: [
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
