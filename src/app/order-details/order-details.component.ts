import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orderId: number | undefined;
  items: any[] = [];
  id: number | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['orderId'];
      this.id = +params['id'];
      this.fetchOrderDetails(this.id, this.orderId);
    });
  }

  fetchOrderDetails(id: number, orderId: number) {
    axios.get(`http://localhost:3000/getHistory/history/${id}/details${orderId}`)
      .then((response) => {
        this.items = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

