import {Component, HostListener, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticlesType} from "../../../../types/articles.type";
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {CategoryType} from "../../../../types/category.type";
import {CategoryService} from "../../../shared/services/category.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit {

  articles: ArticleType[] = [];

  pages: number[] = [];
  articlesFilter: boolean = false;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  categories: CategoryType[] = [];

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: CategoryType[]): void => {
        this.categories = data;

        this.activatedRoute.queryParams.subscribe({
          next: params => {
            this.activeParams = ActiveParamsUtil.processParams(params);
            this.appliedFilters = [];

            if (this.activeParams.categories.length > 0) {
              this.activeParams.categories.forEach(category => {
                for (let i = 0; i < this.categories.length; i++) {
                  if (this.categories[i].url === category) {
                    let foundName = this.categories[i].name;

                    if (foundName) {
                      this.appliedFilters.push({
                        name: foundName,
                        urlParam: category,
                      });
                    }
                  }
                }
              });
            }

            this.articleService.getArticles(this.activeParams).subscribe({
              next: (articles: ArticlesType): void => {

                this.pages = [];
                for (let i = 1; i <= articles.pages; i++) {
                  this.pages.push(i);
                }

                this.articles = articles.items;
              }
            });
          }
        });
      }
    });
  }

  showFilter(): void {
    this.articlesFilter = !this.articlesFilter;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.articlesFilter && !target.closest('.blog-sorting')) {
      if (!target.closest('app-category-filter')) {
        this.articlesFilter = false;
      }
    }
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(category => category !== appliedFilter.urlParam);
    this.activeParams.page = 1;

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }
}

