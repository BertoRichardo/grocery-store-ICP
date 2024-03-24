import {
    Canister,
    int32,
    Opt,
    query,
    Record,
    Result,
    StableBTreeMap,
    text,
    update,
    Vec,
    int8,
    float64,
    None,
}  from 'azle';

import { v4 as uuidv4 } from 'uuid';

// This type represent the member of the grocery 
const Customer = Record({
    id : text, 
    name : text, 
    balance : float64, 
    totalBuy : float64,
});

type Customer = typeof Customer.tsType;

// This type represent an Product 
const Product = Record({
    id : text,
    name : text,
    stock : int32, 
    price : float64, 
});

type Product = typeof Product.tsType;

// This type represent a transaction 
const Transaction = Record({
    id : text, 
    finalPrice : float64 , 
    couponId : Opt(text),
});

type Transaction = typeof Transaction.tsType;


// This typre represent a coupon for buy some get some 
const Coupon = Record({
    couponId : text, 
    customerId : text,
    discountPercentage : int8,
    maxDiscount : float64 , 
});

type Coupon = typeof Coupon.tsType; 

// Storage
const productsStorage = StableBTreeMap<text, Product>(0);
const transactionStorage = StableBTreeMap<text, Transaction> (1);
const couponsStorage = StableBTreeMap<text, Coupon>(2);
const customersStorage = StableBTreeMap<text, Customer>(3);



export default Canister({
    // PRODUCT //
    /**
     * Adds new Product
     * @param name - name of the new product
     * @param stock - stock of the new product
     * @param price - price of the new product
     * @returns created product or an error
     */
    addProduct: update(
        [text, int32, float64], Result(Product, text), 
        (name, stock, price) => {
        // Validation for required fields
            if (!name || !stock || !price) {
            // Construct a more descriptive error message
            return Result.Err('All fields (name, stock, price) are required' );
            }
        
            // Validation for positive stock and price
            if (stock < 0 || price < 0) {
            return Result.Err("Invalid stock or price. Please enter positive values.");
            }
        
            // Generate a unique ID for the Product
            const uniqueProductId = uuidv4();

            // Construct the new Product object
            const newProduct = {
                id: uniqueProductId,
                name: name,
                stock: stock,
                price: price,
            };

            // Insert the new Product into the Products map
            productsStorage.insert(uniqueProductId, newProduct);

            // Return the successful result with the new Product
            return Result.Ok(newProduct);
    }),


    /**
    * update Product
    * @param id - id of the product that want to be updated
    * @param name - the updated name of the new product
    * @param stock - the updated stock of the new product
    * @param price - the updated price of the new product
    * @returns updated product or an error
    */
    updateProduct: update(
        [text, text, int32, float64], Result(Product, text), 
        (id, name, stock, price) => {
        
            // Validate parameters
            if (!id || !name || !stock || !price){
                return Result.Err('All fields (id, name, stock, price) are required'); 
            }

            // Validation for positive stock and price
            if (stock < 0 || price < 0) {
            return Result.Err("Invalid stock or price. Please enter positive values.");
            }

            if (!productExist(id)){
                return Result.Err(`Product with id ${id} not found`)
            }
            const updatedProduct = {
                id: id,
                name: name,
                stock: stock,
                price: price,
            };
            productsStorage.insert(id, updatedProduct);
            return Result.Ok(updatedProduct);
    }),

    /**
    * delete Product
    * @param id - id of the product
    * @returns deletion status
    */
    deleteProduct: update(
        [text], Result(text, text), 
        (id) => {
            if (!id){
                return Result.Err("Product Id is missing!")
            }
            if (!productExist(id)){
                return Result.Err(`Product with id ${id} not found`);
            } 

            productsStorage.remove(id);
            return Result.Ok(`Successfully delete product with id ${id}`);
    
    }),

    /**
    * get Product by id
    * @param id - id of the product
    * @returns product with id = parameter or an error
    */
    getProductById: query(
        [text], Result(Product, text), 
        (id) => {
            if (!id){
                return Result.Err("Product Id is missing!")
            }
            if (!productExist(id)){
                return Result.Err(`Product with id ${id} not found`);
            } 

            return Result.Ok(productsStorage.get(id).Some!);
    }),

    /**
    * get Product by id
    * @param id - id of the Product
    * @returns Vector of all Product
    */
    getAllProduct: query([], Result(Vec(Product), text), () => {
    try {
        return Result.Ok(productsStorage.values());
    } catch (error) {
        return Result.Err('Failed to get product');
    }
    }),

    // TRANSACTION //
    /**
    * start transaction
    * @param id  - id of the product
    * @returns optional error
    */
    createTransaction : update (
        [text, int32, Opt(text), text  ], Result(Transaction, text),
        (productId, buyQuantity, uniqueCouponId = None, customerId) => {
            // Validate mandatory parameters
            if (!productId || !buyQuantity || !customerId) {
                return Result.Err(`Missing productId or buyQuantity param`)
            }
            // validate quantity
            if (buyQuantity < 0 ){
                return Result.Err(`buyQuantity must be a positive value`)
            }
            // validate product
            if (!productExist(productId)){
                return Result.Err(`Product with id ${productId} not found`)
            }
            
            // validate customer exist
            const customer = customersStorage.get(customerId).Some!
            if (!customerExist(customerId)) {
                return Result.Err(`Customer with id ${customerId} not found`)
            }

            // validate stock and buyQuantity
            const product = productsStorage.get(productId).Some!
            if (product.stock < buyQuantity) {
                return Result.Err(`buyProduct must be equal or less than the product stock`)
            }


            let price = product.price * buyQuantity
            let originalPrice = price
            let finalPrice ; 
            // give discount if there is uniqueCouponId on the param
            if (uniqueCouponId.Some!){
                // validate uniqueCouponId
                if (!couponExist(uniqueCouponId.Some!)){
                    return Result.Err(`Coupon with id ${uniqueCouponId} not found`)
                }

                const coupon = couponsStorage.get(uniqueCouponId.Some!).Some!
                
                
                if ((coupon.customerId) != customerId) {
                    return Result.Err(`Member is not the owner of the coupon`)
                } 
                else {
                    finalPrice =  Math.max ((((100 - coupon.discountPercentage) * price) / 100), (price - coupon.maxDiscount))
                }
            } else {
                finalPrice = originalPrice;
            }
            
            // validate customer balance
            const currBalance = customer.balance
            if (finalPrice > currBalance){
                return Result.Err("Customer balance is insufficient")
            }
            
            // Remove the used uniqueCouponId
            if (uniqueCouponId.Some){
                couponsStorage.remove(uniqueCouponId.Some!)
            }
            
            // update the product and customer 
            const updatedProduct : Product = {
                ...product, 
                stock : product.stock - buyQuantity}
            productsStorage.insert(productId ,updatedProduct)

            const updatedCustomer : Customer = {
                ...customer,
                balance : currBalance - finalPrice,
                totalBuy : customer.totalBuy + finalPrice,
            }
            customersStorage.insert(customerId, updatedCustomer);
            
            // insert the transaction 
            const uniqueTransaction = uuidv4();
            const transaction : Transaction= {
                id : uniqueTransaction, 
                finalPrice : finalPrice,
                couponId : None,
            }     
            transactionStorage.insert(uniqueTransaction, transaction);
            
            // return 
            return Result.Ok(transaction);
    }),

    /**
    * get Transaction by id
    * @param id - id of the Transaction
    * @returns Transaction with id = parameter or an error
    */
    getTransactionById: query(
        [text], Result(Transaction, text), 
        (id) => {
            if (!id){
                return Result.Err("Transaction Id is missing!")
            }
            if (!transactionExist(id)){
                return Result.Err(`Transaction with id ${id} not found`);
            } 

            return Result.Ok(transactionStorage.get(id).Some!);
    }),

    /**
    * get Transaction by id
    * @param id - id of the Transaction
    * @returns Vector of all transaction
    */
    getAllTransaction: query([], Result(Vec(Transaction), text), () => {
    try {
        return Result.Ok(transactionStorage.values());
    } catch (error) {
        return Result.Err('Failed to get transactions');
    }
    }),

    // CUSTOMER //
    /**
    * add Customer 
    * @param name - the name of the customer 
    * @returns new customer with balance and totalBuy initialized to 0
    */
    addCustomer : update(
        [text], Result(Customer, text), 
        (name) => {

            //Validatioin for required fields 
            if (!name){
                return Result.Err('Name is not valid');
            } 
            
            //generate id 
            const id = uuidv4();


            const newCustomer : Customer = {
                id : id, 
                name : name, 
                balance : 0 ,
                totalBuy : 0, 
            }
            customersStorage.insert(id, newCustomer);

            return Result.Ok(newCustomer);
        }
    ),

    /**
    * Customer top up
    * @param id - the id of the customer 
    * @param topUp - Amount of top up 
    * @returns new customer with updated balance 
    */
    customerTopUp : update(
        [text, float64], Result(Customer, text), 
        (id, topUp) => {
            // Validate parameters 
            if (!id || !topUp){
                return Result.Err('All fields are required');
            }

            if (!customerExist(id)){
                return Result.Err(`Customer with id ${id} not found`);
            }

            if (topUp < 0 ){
                return Result.Err('Top up amount invalid');
            }

            // insert the new balance 
            const oldCustomer = customersStorage.get(id).Some!;
            const newBalance = oldCustomer.balance + topUp;
            const updatedCustomer : Customer = {
                ...oldCustomer, 
                balance : newBalance,
            }

            customersStorage.insert(id, updatedCustomer);

            // return 
            return Result.Ok(updatedCustomer);
        }
    ),

    /**
    * get customer by id
    * @param id - id of the customer
    * @returns Vector of all customer
    */
    getAllCustomer: query([], Result(Vec(Customer), text), () => {
        try {
            return Result.Ok(customersStorage.values());
        } catch (error) {
            return Result.Err('Failed to get customer');
        }
        }),



        /**
    * delete Customer
    * @param id - id of the Customer
    * @returns deletion status
    */
    deleteCustomer: update(
        [text], Result(text, text), 
        (id) => {
            if (!id){
                return Result.Err("Customer Id is missing!")
            }
            if (!customerExist(id)){
                return Result.Err(`Customer with id ${id} not found`);
            } 

            customersStorage.remove(id);
            return Result.Ok(`Successfully delete Customer with id ${id}`);
        }
    ),

    /**
    * get customer by id
    * @param id - id of the customer
    * @returns customer with id = parameter or an error
    */
    getCustomerById: query(
        [text], Result(Customer, text), 
        (id) => {
            // Validate parameter
            if (!id){
                return Result.Err('Customer Id is missing');
            }

            if (!customerExist(id)){
                return Result.Err(`Customer with Id ${id} not found`);
            }

            return Result.Ok(customersStorage.get(id).Some!);
        }
    ),


    // Coupon // 
    /**
    * add Coupon 
    * @param name - the name of the coupon 
    * @returns new Coupon 
    */
    addCoupon : update(
        [text, int8, float64], Result(Coupon, text), 
        (customerId, discountPercentage, maxDiscount) => {

            //Validatioin for required fields 
            if (!customerId || !discountPercentage || !maxDiscount){
                return Result.Err(`Missing parameter(s)`);
            } 
            
            if (!customerExist(customerId)){
                return Result.Err(`Customer with id ${customerId} is not found`); 
            }

            if (discountPercentage < 0 || discountPercentage >= 100){
                return Result.Err(`Discount Percentage value is not valid`);
            }

            if (maxDiscount < 0){
                return Result.Err(`Max Discount value is not valid`);
            }

            //generate id 
            const uniqueCouponId : text = uuidv4();

            const newCoupon : Coupon = {
                couponId : uniqueCouponId,
                customerId : customerId,
                discountPercentage : discountPercentage,
                maxDiscount : maxDiscount,
            }

            couponsStorage.insert(uniqueCouponId, newCoupon);

            return Result.Ok(newCoupon);
        }
    ),

            /**
    * delete Coupon
    * @param id - id of the Coupon
    * @returns deletion status
    */
    deleteCoupon: update(
        [text], Result(text, text), 
        (id) => {
            if (!id){
                return Result.Err("Coupon Id is missing!")
            }
            if (!couponExist(id)){
                return Result.Err(`Coupon with id ${id} not found`);
            } 

            couponsStorage.remove(id);
            return Result.Ok(`Successfully delete Coupon with id ${id}`);
        }
    ),

    /**
    * get Coupon by id
    * @param id - id of the Coupon
    * @returns Coupon with id = parameter or an error
    */
    getCouponById: query(
        [text], Result(Coupon, text), 
        (id) => {
            // Validate parameter
            if (!id){
                return Result.Err('Coupon Id is missing');
            }

            if (!couponExist(id)){
                return Result.Err(`Coupon with Id ${id} not found`);
            }

            return Result.Ok(couponsStorage.get(id).Some!);
        }
    ),

    /**
    * get Coupon by id
    * @param id - id of the Coupon
    * @returns Vector of all Coupon
    */
    getAllCoupon: query([], Result(Vec(Coupon), text), () => {
        try {
            return Result.Ok(couponsStorage.values());
        } catch (error) {
            return Result.Err('Failed to get coupon');
        }
    }),
    
});

/**
* Checks if the product exists
 * @param productId - product identifier
 * @returns True if the product exists, false otherwise
 */
const productExist = (productId: text): boolean => {
    return productsStorage.containsKey(productId);
};

/**
* Checks if the coupon exists
 * @param couponId - coupon identifier
 * @returns True if the coupon exists, false otherwise
 */
const couponExist = (couponId: text): boolean => {
    return couponsStorage.containsKey(couponId);
};

/**
* Checks if the customer exists
 * @param customer - customer identifier
 * @returns True if the customer exists, false otherwise
 */
const customerExist = (customer: text): boolean => {
    return customersStorage.containsKey(customer);
};

/**
* Checks if the transaction exists
 * @param transaction - transaction identifier
 * @returns True if the transaction exists, false otherwise
 */
const transactionExist = (transaction: text): boolean => {
    return transactionStorage.containsKey(transaction);
};

// Mocking the 'crypto' object for testing purposes
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
      let array = new Uint8Array(32);
  
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
  
      return array;
    },
  };
  

