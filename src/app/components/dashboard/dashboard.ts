import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';

@Component({
  imports: [Header],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
