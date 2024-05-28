import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import {TruncatePipe} from './pipes/truncate.pipe';
import {CategoryFilterComponent} from './components/category-filter/category-filter.component';
import {TruncateTitlePipe} from './pipes/truncate-title.pipe';
import {FreeConsultationComponent} from './components/free-consultation/free-consultation.component';
import {OrderComponent} from './components/order/order.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {CommentCardComponent} from './components/comment-card/comment-card.component';
import {DateFormatPipe} from './pipes/date-format.pipe';
import {LoaderComponent} from './components/loader/loader.component';


@NgModule({
  declarations: [
    ArticleCardComponent,
    TruncatePipe,
    CategoryFilterComponent,
    TruncateTitlePipe,
    FreeConsultationComponent,
    OrderComponent,
    CommentCardComponent,
    DateFormatPipe,
    LoaderComponent
  ],
  exports: [
    ArticleCardComponent,
    CategoryFilterComponent,
    FreeConsultationComponent,
    OrderComponent,
    CommentCardComponent,
    LoaderComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatSelectModule,
    ]
})

export class SharedModule {
}
