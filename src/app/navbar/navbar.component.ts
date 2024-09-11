import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { environment } from '../environment';

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
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private apiUrl = environment.apiUrl;
  deliveryCharge = 199;
  showProducts: boolean = false;
  ItemList: Product[] = [];
  cartItems: any[] = [];
  token: string = '';
  showCart: boolean = false;
  Payload: any;
  showUser: boolean = false;
  num: number = 0;
  showCartItem: boolean = false;
  constructor(private router: Router,  private cartService: CartService, private renderer: Renderer2, private elementRef: ElementRef) {}

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
      axios.get(`${this.apiUrl}/products/itemList`)
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
    console.log("closeall please");
    this.showUser = false;
    this.showCart = false;
  }

  cart1() {
    this.showCart = !this.showCart;
    this.loadCartItems();
    if (this.showCart) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  showHistory(){
    this.router.navigate([`./order-history/${this.Payload.id}`]);
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

  makeResponsive() {
    this.cart1(); // Close the cart // Remove the unresponsive class
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.deliveryCharge;
  }


  checkout() {
    this.cart1();
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

home(){
  this.router.navigate(['./dashboard']);
}

@HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  if (!clickedInside && this.showUser) {
    this.showUser = false;
  }
}


}