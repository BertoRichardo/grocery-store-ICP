import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addCoupon' : ActorMethod<
    [string, number, number],
    {
        'Ok' : {
          'maxDiscount' : number,
          'couponId' : string,
          'customerId' : string,
          'discountPercentage' : number,
        }
      } |
      { 'Err' : string }
  >,
  'addCustomer' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'balance' : number,
          'name' : string,
          'totalBuy' : number,
        }
      } |
      { 'Err' : string }
  >,
  'addProduct' : ActorMethod<
    [string, number, number],
    {
        'Ok' : {
          'id' : string,
          'name' : string,
          'stock' : number,
          'price' : number,
        }
      } |
      { 'Err' : string }
  >,
  'createTransaction' : ActorMethod<
    [string, number, [] | [string], string],
    {
        'Ok' : {
          'id' : string,
          'finalPrice' : number,
          'complete' : boolean,
          'couponId' : [] | [string],
        }
      } |
      { 'Err' : string }
  >,
  'customerTopUp' : ActorMethod<
    [string, number],
    {
        'Ok' : {
          'id' : string,
          'balance' : number,
          'name' : string,
          'totalBuy' : number,
        }
      } |
      { 'Err' : string }
  >,
  'deleteCoupon' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'deleteCustomer' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'deleteProduct' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'getAll' : ActorMethod<
    [],
    {
        'Ok' : Array<
          {
            'maxDiscount' : number,
            'couponId' : string,
            'customerId' : string,
            'discountPercentage' : number,
          }
        >
      } |
      { 'Err' : string }
  >,
  'getAllCustomer' : ActorMethod<
    [],
    {
        'Ok' : Array<
          {
            'id' : string,
            'balance' : number,
            'name' : string,
            'totalBuy' : number,
          }
        >
      } |
      { 'Err' : string }
  >,
  'getAllProduct' : ActorMethod<
    [],
    {
        'Ok' : Array<
          { 'id' : string, 'name' : string, 'stock' : number, 'price' : number }
        >
      } |
      { 'Err' : string }
  >,
  'getAllTransaction' : ActorMethod<
    [],
    {
        'Ok' : Array<
          {
            'id' : string,
            'finalPrice' : number,
            'complete' : boolean,
            'couponId' : [] | [string],
          }
        >
      } |
      { 'Err' : string }
  >,
  'getCoupon' : ActorMethod<
    [string],
    {
        'Ok' : {
          'maxDiscount' : number,
          'couponId' : string,
          'customerId' : string,
          'discountPercentage' : number,
        }
      } |
      { 'Err' : string }
  >,
  'getCustomer' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'balance' : number,
          'name' : string,
          'totalBuy' : number,
        }
      } |
      { 'Err' : string }
  >,
  'getProductById' : ActorMethod<
    [string],
    {
        'Ok' : {
          'id' : string,
          'name' : string,
          'stock' : number,
          'price' : number,
        }
      } |
      { 'Err' : string }
  >,
  'updateProduct' : ActorMethod<
    [string, string, number, number],
    {
        'Ok' : {
          'id' : string,
          'name' : string,
          'stock' : number,
          'price' : number,
        }
      } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
