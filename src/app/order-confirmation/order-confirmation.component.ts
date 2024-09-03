import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from '../environment';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  orderRef: string | null = null;
  orderStatus: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Capture the order_ref from the query string
    this.orderRef = this.route.snapshot.queryParamMap.get('order_ref');

    if (this.orderRef) {
      this.getOrderStatus(this.orderRef);
    }
  }

  getOrderStatus(orderRef: string): void {
    axios.post(`${this.apiUrl}/order-status`, { orderRef })
      .then(
        (response) => {
          this.orderStatus = response;
          console.log('Order status:', response);
        },
        (error) => {
          console.error('Error fetching order status:', error);
        }
      );
  }
}
