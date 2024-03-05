export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addCoupon' : IDL.Func(
        [IDL.Text, IDL.Int8, IDL.Int32],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'maxDiscount' : IDL.Int32,
              'couponId' : IDL.Text,
              'customerId' : IDL.Text,
              'discountPercentage' : IDL.Int8,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'addCustomer' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'balance' : IDL.Float64,
              'name' : IDL.Text,
              'totalBuy' : IDL.Float64,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'addProduct' : IDL.Func(
        [IDL.Text, IDL.Int32, IDL.Float64],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'name' : IDL.Text,
              'stock' : IDL.Int32,
              'price' : IDL.Float64,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'createTransaction' : IDL.Func(
        [IDL.Text, IDL.Int32, IDL.Opt(IDL.Text), IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'finalPrice' : IDL.Float64,
              'complete' : IDL.Bool,
              'couponId' : IDL.Opt(IDL.Text),
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'customerTopUp' : IDL.Func(
        [IDL.Text, IDL.Float64],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'balance' : IDL.Float64,
              'name' : IDL.Text,
              'totalBuy' : IDL.Float64,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'deleteCoupon' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'deleteCustomer' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'deleteProduct' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'getAll' : IDL.Func(
        [],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(
              IDL.Record({
                'maxDiscount' : IDL.Int32,
                'couponId' : IDL.Text,
                'customerId' : IDL.Text,
                'discountPercentage' : IDL.Int8,
              })
            ),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getAllCustomer' : IDL.Func(
        [],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(
              IDL.Record({
                'id' : IDL.Text,
                'balance' : IDL.Float64,
                'name' : IDL.Text,
                'totalBuy' : IDL.Float64,
              })
            ),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getAllProduct' : IDL.Func(
        [],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(
              IDL.Record({
                'id' : IDL.Text,
                'name' : IDL.Text,
                'stock' : IDL.Int32,
                'price' : IDL.Float64,
              })
            ),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getAllTransaction' : IDL.Func(
        [],
        [
          IDL.Variant({
            'Ok' : IDL.Vec(
              IDL.Record({
                'id' : IDL.Text,
                'finalPrice' : IDL.Float64,
                'complete' : IDL.Bool,
                'couponId' : IDL.Opt(IDL.Text),
              })
            ),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getCoupon' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'maxDiscount' : IDL.Int32,
              'couponId' : IDL.Text,
              'customerId' : IDL.Text,
              'discountPercentage' : IDL.Int8,
            }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getCustomer' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'balance' : IDL.Float64,
              'name' : IDL.Text,
              'totalBuy' : IDL.Float64,
            }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getProductById' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'name' : IDL.Text,
              'stock' : IDL.Int32,
              'price' : IDL.Float64,
            }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'updateProduct' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Int32, IDL.Float64],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Text,
              'name' : IDL.Text,
              'stock' : IDL.Int32,
              'price' : IDL.Float64,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
