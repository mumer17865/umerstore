// product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    
  ];

  constructor() {}

  getProductById(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    return of(product!);
  }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }
}
