import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  title: string = 'MOMENT';
  url?: string;
  color?: string;
  bgColor?: string;

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.title$.subscribe((title) => (this.title = title));
    this.headerService.backURL$.subscribe((url) => (this.url = url));
    this.headerService.color$.subscribe((color) => (this.color = color));
    this.headerService.bgColor$.subscribe(
      (bgColor) => (this.bgColor = bgColor)
    );
  }
}
