import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { CurrencyPipe } from '@angular/common';
import { PkrCurrencyPipe } from '../pkr-currency.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

interface Product {
  productId: number;
  productName: string;
  desc: string;
  image: any;
  price: any;
  quantity: any;
  createdAt: string;
  updatedAt: string;
  display: boolean;
}

@Component({
  standalone: true,
  providers: [CurrencyPipe],
  imports: [PkrCurrencyPipe, FormsModule],
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  quat = 1;
  cartItems: any[] = [];
  showCartItem: boolean = false;
  Item: Product | undefined;
  ItemList: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private CurrencyPipe: CurrencyPipe,
    private cartService: CartService
  ) {}

  decrement() {
    if (this.quat > 1) {
      this.quat--;
    }
  }

  increment() {
    this.quat++;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id']; // The '+' operator converts the string to a number
      this.fetchProductDetails(productId);
    });
  }

  fetchProductDetails(productId: number) {
    axios.get(`http://localhost:3000/products/itemList/${productId}`)
      .then((response) => {
        this.Item = response.data[0];
      })
      .catch((error) => {
        console.log(error);
      });
  }

  increment1(): void {
    if (this.Item) {
      this.cartService.addToCart(this.Item.productId, this.quat);
      this.loadCartItems(); // Reload cart items to update the view
    }
  }

  loadCartItems() {
    const cartItems = this.cartService.getCartItems();
    this.cartItems = cartItems.map((item: any) => {
      const product = this.ItemList.find(p => p.productId === item.productId);
      if (product) {
        return { ...product, quantity: item.quantity, total: product.price * item.quantity };
      }
      return null;
    }).filter(item => item !== null);
    this.updateShowCartItem();
  }

  updateShowCartItem() {
    this.showCartItem = this.cartItems.length > 0;
  }
}
