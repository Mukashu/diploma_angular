import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  @Input() categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  showFilter: boolean = true;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.activeParams = ActiveParamsUtil.processParams(params);
    });
  }

  showFilterToBlog() {
    this.showFilter = !this.showFilter;
  }

  updateFilterParams(url: string): void {
    const existingCategory = this.activeParams.categories.find(item => item === url);

    if (!existingCategory) {
      this.activeParams.categories = [...this.activeParams.categories, url];
    } else {
      this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }
}
