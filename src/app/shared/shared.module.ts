import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import { TruncatePipe } from './pipes/truncate.pipe';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { TruncateTitlePipe } from './pipes/truncate-title.pipe';



@NgModule({
  declarations: [
    ArticleCardComponent,
    TruncatePipe,
    CategoryFilterComponent,
    TruncateTitlePipe
  ],
  exports: [
    ArticleCardComponent,
    CategoryFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
