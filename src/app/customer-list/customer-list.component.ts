import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [MessageService]
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  first = 0;
  rows = 5;
  clonedCustomers: { [s: string]: Customer } = {};
  constructor(private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router,) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }
  onRowEditInit(customer: Customer) {
    this.router.navigate([`/edit-customer/${customer.id}`]);
}

onRowEditSave(customer: Customer) {
    if (customer != undefined && customer != null) {
        delete this.clonedCustomers[customer.id as string];
        this.customerService.updateCustomer(customer.id as string, customer).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer is updated' });
        });
    } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Customer' });
    }
}

onRowEditCancel(customer: Customer, index: number) {
  this.customerService.deleteCustomer(customer.id as string).subscribe((data) => {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer is deleted' });
    delete this.customers[index];
  });
    // this.customers[index] = this.clonedCustomers[customer.id as string];
    // delete this.clonedCustomers[customer.id as string]; 
}
next() {
  this.first = this.first + this.rows;
}

prev() {
  this.first = this.first - this.rows;
}

reset() {
  this.first = 0;
}

pageChange(events: any) {
  this.first = events.first;
  this.rows = events.rows;
}

isLastPage(): boolean {
  return this.customers ? this.first === this.customers.length - this.rows : true;
}

isFirstPage(): boolean {
  return this.customers ? this.first === 0 : true;
}
}
