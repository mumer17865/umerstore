import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../environment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  orderRef: string | null = null;
  orderStatus: any = null;
  private apiUrl = environment.apiUrl;
  token: any[] = [];
  info: any[] = [];
  selectedOption: string = '';
  tokenLength = 0;
  subTotal = 0;
  grandTotal = 0;
  link = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const storedItems = sessionStorage.getItem('cartItems') ?? '[]';
    this.token = JSON.parse(storedItems);
    console.log(this.token);
    const storedItems1 = sessionStorage.getItem('order') ?? '[]';
    this.info = JSON.parse(storedItems1);
    console.log(this.info);
    const storedValue = sessionStorage.getItem('subtotal') ?? '0';
    this.subTotal = parseInt(storedValue, 10);
    const storedValue1 = sessionStorage.getItem('grandtotal') ?? '0';
    this.grandTotal = parseInt(storedValue1, 10);
    this.tokenLength = this.token.length;
    this.orderRef = this.route.snapshot.queryParamMap.get('order_ref');
    if (this.orderRef) {
      this.getOrderStatus(this.orderRef);
    }
  }

  placeOrder() {
    const orderData = {
      cartItems: this.token,
      info: this.info,
      subTotal: this.subTotal,
      grandTotal: this.grandTotal,
    };
    axios
      .post(`${this.apiUrl}/create-order`, orderData)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          this.goToPayment(response.data.result1);
        } else {
          alert(
            'Request failed: ' + (response.data.message || 'Unknown error')
          );
        }
      })
      .catch((error) => {
        alert(
          'Request failed: ' +
            (error.response?.data?.message || 'Unknown error')
        );
      });
  }

  cOD() {
    const orderData = {
      cartItems: this.token,
      customerInfo: this.info,
      subTotal: this.subTotal,
      grandTotal: this.grandTotal,
    };

    axios
      .post(`${this.apiUrl}/orders/checkout`, orderData)
      .then((response) => {
        this.cartService.clearCart();
        if (response.data.success) {
          // alert('Order placed successfully!');
          this.router.navigate(['/payment']);
        } else {
          alert(
            'Request failed: ' + (response.data.message || 'Unknown error')
          );
        }
      })
      .catch((error) => {
        alert(
          'Request failed: ' +
            (error.response?.data?.message || 'Unknown error')
        );
      });
  }

  goToPayment(s: string) {
    window.location.href = s;
  }

  emptyMethod() {
    this.router.navigate(['/dashboard']);
  }

  getOrderStatus(orderRef: string): void {
    axios.post(`${this.apiUrl}/order-status`, { orderRef }).then(
      (response) => {
        this.orderStatus = response;
        console.log('Order status:', response.data.body.payment_method);
        if(response.data.body.payment_method.transaction_id){
          this.cOD();
        }
      },
      (error) => {
        console.error('Error fetching order status:', error);
      }
    );
  }
}
