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

  count: number | null = null;
  pages: number | null = null;
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
    this.articleService.getArticles().subscribe({
      next: (articles: ArticlesType): void => {
        this.articles = articles.items;
        this.count = articles.count;
        this.pages = articles.pages;

        this.categoryService.getCategories().subscribe({
          next: (data: CategoryType[]): void => {
            this.categories = data;

            this.activatedRoute.queryParams.subscribe(params => {
              this.activeParams = ActiveParamsUtil.processParams(params);

              this.appliedFilters = [];
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

    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }
}

