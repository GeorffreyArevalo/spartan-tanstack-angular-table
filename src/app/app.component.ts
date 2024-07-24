import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { generateRandomInvoices } from './helpers/get-data.helper';
import { HeaderDataTable } from './interfaces/header-data-table.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CustomTableComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'table-spartan-tankstack';


  public data = generateRandomInvoices(100);

  public headersColumns: HeaderDataTable[] = [
    {
      id: 'invoice',
      title: 'Invoice'
    },
    {
      id: 'paymentStatus',
      title: 'Payment Status'
    },
    {
      id: 'paymentMethod',
      title: 'Payment Method'
    },
    {
      id: 'totalAmount',
      title: 'Total Amount'
    },
  ];

}
