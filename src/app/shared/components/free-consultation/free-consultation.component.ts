import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {PopupComponentsType} from "../../../../types/popup-components.type";

@Component({
  selector: 'app-free-consultation',
  templateUrl: './free-consultation.component.html',
  styleUrls: ['./free-consultation.component.scss']
})
export class FreeConsultationComponent implements OnInit {

  consultationForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required]
  });

  showPopupComponents: PopupComponentsType = {
    form: true,
    success: false,
    alert: false,
  };

  constructor(private requestService: RequestService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  closePopupWindow() {
    this.requestService.showPopup$.next(false);
  }

  getConsultation() {
    if (this.consultationForm.valid && this.consultationForm.value.name && this.consultationForm.value.phone) {
      this.requestService.consultation(this.consultationForm.value.name, this.consultationForm.value.phone, this.requestService.type.consultation)
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
}
