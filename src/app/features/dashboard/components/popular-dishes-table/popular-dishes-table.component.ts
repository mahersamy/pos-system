import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PopularDishItem } from '../../models/dashboard.model';

@Component({
    selector: 'app-popular-dishes-table',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './popular-dishes-table.component.html',
    styleUrls: ['./popular-dishes-table.component.scss'],
})
export class PopularDishesTableComponent {
    readonly dishes = input<PopularDishItem[]>([]);
}
