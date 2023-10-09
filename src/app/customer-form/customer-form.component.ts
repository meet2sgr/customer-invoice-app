import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'], 
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup; 
  isNewCustomer = true; 
  customerId!: string; 
  customerData!: Customer;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country_code: ['', Validators.required],
      phone_Number: ['', Validators.required],
      balance: ['', Validators.required],
      gender: ['', Validators.required]
    });

    // Check if we are editing an existing customer
    this.route.params.subscribe((params) => {
      this.customerId = params['id'];
      if (this.customerId) {
        this.isNewCustomer = false;
        // Load the customer data and populate the form fields
        this.loadCustomerData(this.customerId);
      }
    });
  }

  loadCustomerData(customerId: string) {
    // Fetch customer data by ID and populate the form fields
    this.customerService.getCustomerById(customerId).subscribe(
      (customer) => {
        this.customerForm.patchValue(customer);
        this.customerData = customer;
      },
      (error) => {
        console.error('Error loading customer data:', error);
      }
    );
  }

  submitForm() {
    if (this.customerForm.valid) {
      const formData = this.customerForm.value;

      if (this.isNewCustomer) {
        // Create a new customer
        let customer: Customer = {
          id: Math.floor((Math.random() * 10000)).toString(),
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          country_code: formData.country_code,
          phone_Number: formData.phone_Number,
          balance: formData.balance,
          gender: formData.gender,
          salutation: '',
          initials: '',
          firstname_ascii: '',
          firstname_country_rank: '',
          firstname_country_frequency: '',
          lastname_ascii: '',
          lastname_country_rank: '',
          lastname_country_frequency: '',
          password: '',
          country_code_alpha: '',
          country_name: '',
          primary_language_code: '',
          primary_language: '',
          currency: 'USD'
        };
        this.customerService.createCustomer(customer).subscribe(
          () => {
            alert("Customer created successfully.");
            this.router.navigate(['/customers']);
          },
          (error) => {
            alert("Error creating customer" + error.message);
            console.error('Error creating customer:', error);
          }
        );
      } else {
        // Update an existing customer
        this.customerData.firstname = formData.firstname;
        this.customerData.lastname = formData.lastname;
        this.customerData.email = formData.email;
        this.customerData.country_code = formData.country_code;
        this.customerData.phone_Number = formData.phone_Number;
        this.customerData.balance = formData.balance;
        this.customerData.gender  = formData.gender;

        this.customerService.updateCustomer(this.customerId, this.customerData).subscribe(
          () => {
            alert("Customer updated successfully.");
            this.router.navigate(['/customers']);
          },
          (error) => {
            alert("Error updating customer" + error.message);
            console.error('Error updating customer:', error);
          }
        );
      }
    }
    else{
      alert("Please fill all the fields");
    }
  }
}
  