# grocery-app-ICP

### Overview

This documentation provides an overview of the Grocery Store system, which is implemented in TypeScript using the Azle framework. The system allows users to manage grocery store, including adding, updating, and deleting product; make a transaction; adding, updating, and deleting Customer; adding and deleting Coupon.

### Additional Notes

- The system utilizes Azle's `$query` and `$update` decorators for defining query and update functions.
- A workaround is implemented to make the `uuid` package compatible with Azle.
- Error handling is implemented using `Result` types to handle success and error scenarios.

#### Installation

1. Clone the repository

   ```bash
    git clone https://github.com/lale001/sleep-record-management-system.git
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
