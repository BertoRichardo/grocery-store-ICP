# grocery-app-ICP

## Overview

This documentation provides an overview of the Grocery Store system, which is implemented in TypeScript using the Azle framework. The system allows users to manage grocery store, including adding, updating, and deleting product; make a transaction; adding, updating, and deleting Customer; adding and deleting Coupon.

## Additional Notes

- The system utilizes Azle's `query` and `update` decorators for defining query and update functions.
- A workaround is implemented to make the `uuid` package compatible with Azle.
- Error handling is implemented using `Result` types to handle success and error scenarios.

### Installation

1. Clone the repository

   ```bash
    git clone https://github.com/BertoRichardo/grocery-store-ICP.git
    cd  cd grocery-store-ICP/
   ```

2. Install dependencies

   ```bash
   npm install
   ```

   `dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:

   ```bash
   npm run dfx_install
   ```

3. Start the IC local development environment

   ```bash
   dfx start --background --clean
   ```

4. Deploy the canisters to the local development environment

   ```bash
   dfx deploy
   ```

## Methods : 
- **addCoupon**: This method will create a new coupon that can be used for transaction
- **addCustomer**: This method will create a new customer of the grocery store
- **addProduct**: This method will allow user to create a new product
- **createTransaction**: This method will create a new transaction and update the state of the product and customer 
- **customerTopUp**: This method will allow user to add customer balance
- **deleteCoupon**: This method will delete coupon with given id
- **deleteCustomer**: This method will delete customer with given id
- **deleteProduct**: This method will delete product with given id
- **getAllCoupon**: This method will get the data of all active coupon 
- **getAllCustomer**: This method will get the data of all customers
- **getAllProduct**: This method will get the data of all Products
- **getAllTransaction**: This method will get the data of all transaction
- **getCouponById**: This method will get the data of coupons with given Id
- **getCustomerById**: This method will get the data of customers with given Id
- **getProductById**: This method will get the data of products with given Id
- **getTransactionById**: This method will get the data of transactions with given Id
- **updateProduct**: This method will allow user to update a product data with given Id