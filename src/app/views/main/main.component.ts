import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  mainCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: false,
    startPosition: 1
  };

  main = [
    {
      image: 'main3.png',
      category: 'Новость дня',
      title: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
    },
    {
      image: 'main1.png',
      category: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span>-15%</span>!',
      text: false,
    },
    {
      image: 'main2.png',
      category: 'Акция',
      title: 'Нужен грамотный <span>копирайтер</span>?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
