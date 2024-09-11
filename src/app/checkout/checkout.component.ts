import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CurrencyPipe } from '@angular/common';
import { PkrCurrencyPipe } from "../pkr-currency.pipe";
import { environment } from '../environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  providers: [CurrencyPipe]  ,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatBadgeModule, PkrCurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  deliveryCharge = 199;
  cartItems: any[] = [];
  id: any;
  name: any;
  contact: any;
  email: any;
  address: any;
  ins: any;
  time: any;
  showCartItem: boolean = false;
  Payload: any;
  token: string = '';

  constructor(private CurrencyPipe: CurrencyPipe, private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.token = sessionStorage.getItem('token') ?? '';
    if (this.token) {
      const arrayToken = this.token.split('.');
      const tokenPayload = JSON.parse(atob(arrayToken[1]));
      this.Payload = tokenPayload;
    }
    console.log(this.token);
    this.loadCartItems();
    this.updateShowCartItem();
    this.name=this.Payload.Name;
    this.email=this.Payload.Email;
    this.id=this.Payload.id;
    console.log(this.id);
  }

  clearCart() {
    // this.cartService.clearCart();
    this.updateShowCartItem();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems().map(item => ({
      ...item,
      total: item.price * item.quantity
    }));
  }

  getSubtotal(): number {
    let subTotal =0;
    subTotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    sessionStorage.setItem('subtotal', subTotal.toString());
    return subTotal
  }

  getGrandTotal(): number {
    let grandTotal =0;
    grandTotal = this.getSubtotal() + this.deliveryCharge;
    sessionStorage.setItem('grandtotal', grandTotal.toString());
    return grandTotal;
  }

  updateShowCartItem() {
    this.showCartItem = this.cartItems.length > 0;
  }

  placeOrder() {

    if (this.name && this.contact && this.address) {
      // Proceed with the order
      console.log('Order placed successfully.');
    } else {
      console.log('Form is invalid.');
    }
    const orderData= [
       {
        id: this.id,
        name: this.name,
        contact: this.contact,
        address: this.address,
        email: this.email
      }
    ];

    sessionStorage.setItem('order', JSON.stringify(orderData));
    
    this.router.navigate(['/payment/4']);
  }
}









    // const orderData = {
    //   cartItems: this.cartItems,
    //   customerInfo: {
    //     id: this.id,
    //     name: this.name,
    //     contact: this.contact,
    //     address: this.address,
    //     email: this.email
    //   }
    // };
  
  
    // axios.post('http://localhost:3000/orders/checkout', orderData)
    //   .then((response) => {
    //     if (response.data.success) {
    //       alert('Order placed successfully!');
    //       this.router.navigate(['/dashboard']);
    //       this.cartService.clearCart();
    //     } else {
    //       alert('Request failed: ' + (response.data.message || 'Unknown error'));
    //     }
    //   })
    //   .catch((error) => {
    //     alert('Request failed: ' + (error.response?.data?.message || 'Unknown error'));  
    //   });





        // axios.post('http://localhost:3000/orders/checkout', orderData)
    //   .then((response) => {
    //     if (response.data.success) {
    //       alert('Order placed successfully!');
    //       this.router.navigate(['/dashboard']);
    //       this.cartService.clearCart();
    //     } else {
    //       alert('Request failed: ' + (response.data.message || 'Unknown error'));
    //     }
    //   })
    //   .catch((error) => {
    //     alert('Request failed: ' + (error.response?.data?.message || 'Unknown error'));  
    //   });