import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';


@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements AfterViewInit, OnChanges {
    @ViewChild('chartCanvas', { static: true }) chartCanvas: ElementRef;
    private chart: Chart;
    @Input() areValuesMoney: boolean = false;
    @Input() width: string = '700px';
    @Input() dataEntries: { label: any, data: number }[];
    colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#9C27B0', '#FF5722'];
    ngOnChanges(): void {
        this.updateChart();
    }
    ngAfterViewInit(): void {

        const ctx: CanvasRenderingContext2D = this.chartCanvas.nativeElement.getContext('2d');
        // Chart.js initialization and configuration
        let data = {
            labels: [],
            datasets: [{
                label: 'Total de ingresos',
                data: [],
                backgroundColor: this.colors.slice(0, this.dataEntries.length),
                borderWidth: 1
            }]
        }
        this.dataEntries.forEach(x => {
            data.labels.push(x.label as never);
            data.datasets[0].data.push(x.data as never);
        })
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: this.areValuesMoney ? {

                            callback: function (value) {
                                // Customize the number format here
                                return value.toLocaleString('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                    minimumFractionDigits: 2,
                                });
                            },
                        } : undefined,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: this.areValuesMoney ? {
                            label: (context) => {
                                // Customize the number format for tooltip values
                                return parseFloat(context.formattedValue?.replace(/,/g, ''))?.toLocaleString('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                    minimumFractionDigits: 2,
                                });
                            },
                        } : undefined,
                    }
                }

            }
        });
    }
    updateChart(): void {
        let data = {
            labels: [],
            datasets: [{
                label: 'Total de ingresos',
                data: [],
                backgroundColor: this.colors.slice(0, this.dataEntries.length),
                borderWidth: 1
            }]
        }
        this.dataEntries.forEach(x => {
            data.labels.push(x.label as never);
            data.datasets[0].data.push(x.data as never);
        })
        this.chart.data = data;
        this.chart.update();
    }
}
