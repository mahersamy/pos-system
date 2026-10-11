import { Component, input, OnInit, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-dashboard-stat-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.scss'],
})
export class DashboardStatCardComponent implements AfterViewInit {
    @ViewChild('sparkCanvas') sparkCanvas!: ElementRef<HTMLCanvasElement>;

    readonly label      = input.required<string>();
    readonly value      = input.required<string>();
    readonly icon       = input<string>('pi pi-chart-line');
    readonly iconColor  = input<'pink' | 'blue' | 'green'>('pink');
    readonly sparkData  = input<number[]>([]);

    private readonly platformId = inject(PLATFORM_ID);

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId) && this.sparkCanvas) {
            this.drawSparkline();
        }
    }

    private drawSparkline(): void {
        const canvas = this.sparkCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const data = this.sparkData();
        if (!data.length) return;

        const W = canvas.offsetWidth  || 120;
        const H = canvas.offsetHeight || 40;
        canvas.width  = W;
        canvas.height = H;

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const step = W / (data.length - 1);

        const colorMap: Record<string, string> = {
            pink:  '#fac1d9',
            blue:  '#6be4ff',
            green: '#37d101',
        };
        const color = colorMap[this.iconColor()] ?? '#fac1d9';

        ctx.clearRect(0, 0, W, H);

        // fill area
        ctx.beginPath();
        data.forEach((d, i) => {
            const x = i * step;
            const y = H - ((d - min) / range) * (H - 8) - 4;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.lineTo((data.length - 1) * step, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // line
        ctx.beginPath();
        data.forEach((d, i) => {
            const x = i * step;
            const y = H - ((d - min) / range) * (H - 8) - 4;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
}
