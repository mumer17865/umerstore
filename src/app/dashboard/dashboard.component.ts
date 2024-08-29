import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';

interface Product {
  productId: number;
  productName: string;
  desc: string;
  image: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  display: boolean ;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  deliveryCharge = 199;
  showProducts: boolean = false;
  showUser: boolean = false;
  showCart: boolean = false;
  Payload: any;
  ItemList: Product[] = [];
  cartItems: any[] = [];
  showCartItem: boolean = false;
  productId: number | undefined;
  quantity: string | undefined;
  num: number = 0;
  token: string = '';

  constructor(private router: Router, private cartService: CartService, private renderer: Renderer2) {}

  ngOnInit() {
    this.token = sessionStorage.getItem('token') ?? '';
    if (this.token) {
      const arrayToken = this.token.split('.');
      const tokenPayload = JSON.parse(atob(arrayToken[1]));
      this.Payload = tokenPayload;
    }
    this.loadCartItems();
    this.products();
  }
  
  loadCartItems() {
    const cartItems = this.cartService.getCartItems();
    this.cartItems = cartItems.map((item: any) => {
      const product = this.ItemList.find(p => p.productId === item.productId);

      if (product) {
        product.quantity = item.quantity;  // Sync quantity with product list
        return { ...product, quantity: item.quantity, total: product.price * item.quantity };
      }
  
      this.num += item.quantity;
      return null;
    }).filter(item => item !== null);
  
    this.updateShowCartItem();
  }

  products() {
    if (!this.showProducts) {
      axios.get('http://localhost:3000/products/itemList')
        .then((response) => {
          const cartItems = this.cartService.getCartItems();
          this.ItemList = response.data.map((item: any) => {
            const cartItem = cartItems.find((c: any) => c.productId === item.productId);
            return {
              ...item,
              quantity: cartItem ? cartItem.quantity : 0 // Set quantity from cart if exists
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
      this.showProducts = true;
    }
    
    this.showUser = false;
  }

  
  


  details(product1: number) {
    this.router.navigate(['/productdetails', product1]);
    }

  updateShowCartItem() {
    this.showCartItem = this.cartItems.length > 0;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  

  User() {
    this.showUser = !this.showUser;
  }

  closeAll() {
    this.showUser = false;
    this.showCart = false;
  }
  
  cart1() {
    this.showCart = !this.showCart;
    this.loadCartItems();
  }

  hideCart1(){
    this.showCart = false;
  }

  hideUser() {
    this.showUser = false;
  }
  increment(productId: number): void {
    const product = this.ItemList.find(p => p.productId === productId);
    if (product) {
      product.quantity++;
      this.num++;
      this.cartService.addToCart(productId, 1);
      this.syncCartWithProduct(productId, product.quantity); // Sync cart with product quantity
      this.loadCartItems();
    }
  }


  decrement(productId: number): void {
    const product = this.ItemList.find(p => p.productId === productId);
    if (product && product.quantity > 0) {
      product.quantity--;
      this.num--;
      if (product.quantity === 0) {
        this.cartService.removeFromCart(productId);
      } else {
        this.cartService.updateQuantity(productId, product.quantity);
      }
      this.syncCartWithProduct(productId, product.quantity); // Sync cart with product quantity
    }
    this.loadCartItems();
  }

  syncCartWithProduct(productId: number, quantity: number): void {
    const cartItem = this.cartItems.find(item => item.productId === productId);
    if (cartItem) {
      this.ItemList[productId-1].quantity=quantity;
    }
  }
  


  makeResponsive() {
    this.showCart = false; // Close the cart // Remove the unresponsive class
  }
  

  getInitials(name: string): string {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toLowerCase();
  }

  onHover(product: Product): void {
    product.display= true;
  }

  onLeave(product: Product): void {
    product.display= false;
  }


  clearCart() {
    this.num=0;
    this.cartService.clearCart();
    this.updateShowCartItem();
  }
  

  removeFromCart(productId: number) { 
    const product = this.ItemList.find(p => p.productId === productId);
    if (product && product.quantity > 0) {
      this.num-=product.quantity;
      product.quantity = 0;
    }
    this.cartService.removeFromCart(productId);
    this.loadCartItems();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.deliveryCharge;
  }

  checkout() {
      this.cartService.setCartItems(this.cartItems);
      this.router.navigate(['./checkout']);
    
    // axios.post('http://localhost:3000/checkout', this.cartItems)
    // .then((response) => {
    //     this.router.navigate(['./checkout']);
    // }, (error) => {
    //   alert('Request Failed');
    //   console.log(error);
    // });
  }

  
}
