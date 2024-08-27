import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'cartItems';
  private productsKey = 'products';

  constructor() { }

  getCartItems(): any[] {
    const storedItems = sessionStorage.getItem(this.storageKey);
    return storedItems ? JSON.parse(storedItems) : [];
  }

  getProductById(productId: number): any {
    const products = this.getProducts();
    return products.find((product: any) => product.productId === productId);
  }

  getProducts(): any[] {
    const storedProducts = sessionStorage.getItem(this.productsKey);
    return storedProducts ? JSON.parse(storedProducts) : [];
  }

  setCartItems(items: any[]) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(items));
  }


  addToCart(productId: number, quantity: number) {
    const cartItems = this.getCartItems();
    const existingItem = cartItems.find((item: any) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ productId, quantity: quantity });
    }

    this.saveCartItems(cartItems);
  }

  clearCart() {
    sessionStorage.removeItem(this.storageKey);
  }

  updateQuantity(productId: number, quantity: number) {
    const cartItems = this.getCartItems();
    const item = cartItems.find((item: any) => item.productId === productId);

    if (item) {
      item.quantity = quantity;
      this.saveCartItems(cartItems);
    }
  }

  removeFromCart(productId: number) {
    let cartItems = this.getCartItems();
    cartItems = cartItems.filter((item: any) => item.productId !== productId);
    this.saveCartItems(cartItems);
  }

  private saveCartItems(items: any[]): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
