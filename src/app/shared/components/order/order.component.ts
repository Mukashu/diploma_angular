import {Component, HostListener, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {RequestService} from "../../services/request.service";
import {PopupComponentsType} from "../../../../types/popup-components.type";
import {ServiceType} from "../../../../types/service.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @Input() services: ServiceType[] = [];
  @Input() selectedOption: string | null = null;

  orderForm = this.fb.group({
    service: [''],
    name: ['', Validators.required],
    phone: ['', Validators.required]
  });

  showPopupComponents: PopupComponentsType = {
    form: true,
    success: false,
    alert: false,
  };

  showSelect: boolean = false;

  constructor(private fb: FormBuilder,
              private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.orderForm.controls['service'].setValue(this.selectedOption);
  }

  closePopupWindow() {
    this.requestService.showPopup$.next(false);
  }

  selectOption(text: string) {
    this.orderForm.controls['service'].setValue(text);
  }

  showSelectList() {
    this.showSelect = !this.showSelect;
  }

  getOrder() {
    if (this.orderForm.valid && this.orderForm.value.service && this.orderForm.value.name && this.orderForm.value.phone) {
      this.requestService.order(this.orderForm.value.name, this.orderForm.value.phone, this.orderForm.value.service, this.requestService.type.order)
        .subscribe({
          next: (response: DefaultResponseType) => {
            if (!response.error) {
              this.showPopupComponents = {
                form: false,
                success: true,
                alert: false,
              };
            } else {
              this.showPopupComponents = {
                form: true,
                success: false,
                alert: true,
              };
            }
          },
          error: (error: HttpErrorResponse) => {
            this.showPopupComponents = {
              form: true,
              success: false,
              alert: true,
            };
            throw new Error(error.message);
          }
        });
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.showSelect) {
      if (!target.closest('.select-input')) {
        this.showSelect = false;
      }
    }
  }
}
