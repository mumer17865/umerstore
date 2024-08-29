import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { DateTimeFormatPipe } from '../date-time-format.pipe';
import { CurrencyPipe } from '@angular/common';
import { PkrCurrencyPipe } from "../pkr-currency.pipe";

@Component({
  selector: 'app-order-history',
  standalone: true,
  providers: [CurrencyPipe]  ,
  imports: [CommonModule, DateTimeFormatPipe, RouterOutlet, PkrCurrencyPipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  isPopupVisible = false;
  selectedOrder: any;
  orders: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private CurrencyPipe: CurrencyPipe,
  ) {}
  filteredOrders: any[] | undefined;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id']; // The '+' operator converts the string to a number
      this.fetchProductDetails(userId);
    });
  }

  fetchProductDetails(userId: number) {
    axios.get(`http://localhost:3000/getHistory/history/${userId}`)
      .then((response) => {
        this.processOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  processOrders(items: any[]) {
    const ordersMap = new Map<number, any>();

    items.forEach(item => {
      if (!ordersMap.has(item.orderId)) {
        ordersMap.set(item.orderId, {
          orderId: item.orderId,
          createdAt: item.createdAt,
          items: [],
          total: 0
        });
      }
      const order = ordersMap.get(item.orderId);
      order.items.push(item);
      order.total += Number(item.subTotal); // Calculate the total subtotal for the order
    });

    this.orders = Array.from(ordersMap.values());
  }

  filterOrdersByOrderId(orderId: number): void {
    this.filteredOrders = this.orders.filter(order => order.orderId === orderId);
    this.selectedOrder = this.filteredOrders[0];
    this.openPopup();
  }

  openPopup() {
    this.isPopupVisible = true;
    document.body.classList.add('popup-open'); 
  }

  closePopup() {
    this.isPopupVisible = false;
    document.body.classList.remove('popup-open'); 
  }
}