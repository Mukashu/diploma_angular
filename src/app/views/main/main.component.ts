import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {ActivatedRoute} from "@angular/router";
import {ViewportScroller} from "@angular/common";
import {ActiveLinkService} from "../../shared/services/active-link.service";
import {RequestService} from "../../shared/services/request.service";
import {ServiceType} from "../../../types/service.type";
import {CarouselType} from "../../../types/carousel.type";

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

  main: CarouselType[] = [
    {
      image: 'main3.png',
      category: 'Новость дня',
      title: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      service: 'Реклама'
    },
    {
      image: 'main1.png',
      category: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span>-15%</span>!',
      text: false,
      service: 'Продвижение'
    },
    {
      image: 'main2.png',
      category: 'Акция',
      title: 'Нужен грамотный <span>копирайтер</span>?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      service: 'Копирайтинг'
    },
  ];

  services: ServiceType[] = [
    {
      image: 'services1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7500',
    },
    {
      image: 'services2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3500',
    },
    {
      image: 'services3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1000',
    },
    {
      image: 'services4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750',
    },
  ];

  advantages = [
    {
      number: '1',
      text: '<span>Мастерски вовлекаем аудиторию в процесс.</span> Мы увеличиваем процент вовлечённости за короткий промежуток времени.',
    },
    {
      number: '2',
      text: '<span>Разрабатываем бомбическую визуальную концепцию.</span> Наши специалисты знают как создать уникальный образ вашего проекта.',
    },
    {
      number: '3',
      text: '<span>Создаём мощные воронки с помощью текстов.</span> Наши копирайтеры создают не только вкусные текста, но и классные воронки.',
    },
    {
      number: '4',
      text: '<span>Помогаем продавать больше.</span> Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.',
    },
  ];

  articles: ArticleType[] = [];

  reviews = [
    {
      image: 'review1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      image: 'review2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      image: 'review3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      image: 'review1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      image: 'review2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      image: 'review3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
  ];

  reviewCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 25,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  showPopup: boolean = false;
  selectedOption: string | null = null;

  constructor(private articleService: ArticleService,
              private requestService: RequestService,
              private activeLinkService: ActiveLinkService,
              private viewportScroller: ViewportScroller,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe({
        next: (data: ArticleType[]) => {
          this.articles = data;
        }
      });

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });

    this.requestService.showPopup$.subscribe((show: boolean) => {
      this.showPopup = show;
    });
  }

  removeActiveLink(): void {
    this.activeLinkService.removeActiveLink();
    this.activeLinkService.activeLink$.next(null);
  }

  showPopupWindow(service: string) {
    this.showPopup = true;
    this.selectedOption = service;
  }
}
