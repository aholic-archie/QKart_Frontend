import {
    AddOutlined,
    RemoveOutlined,
    ShoppingCart,
    ShoppingCartOutlined,
  } from "@mui/icons-material";
  import { Button, IconButton, Stack } from "@mui/material";
  import Typography from "@mui/material/Typography";
  import { Box } from "@mui/system";
  import React from "react";
  import { useHistory } from "react-router-dom";
  import "./Cart.css";
  
  // Definition of Data Structures used
  /**
   * @typedef {Object} Product - Data on product available to buy
   * 
   * @property {string} name - The name or title of the product
   * @property {string} category - The category that the product belongs to
   * @property {number} cost - The price to buy the product
   * @property {number} rating - The aggregate rating of the product (integer out of five)
   * @property {string} image - Contains URL for the product image
   * @property {string} _id - Unique ID for the product
   */
  
  /**
   * @typedef {Object} CartItem -  - Data on product added to cart
   * 
   * @property {string} name - The name or title of the product in cart
   * @property {string} qty - The quantity of product added to cart
   * @property {string} category - The category that the product belongs to
   * @property {number} cost - The price to buy the product
   * @property {number} rating - The aggregate rating of the product (integer out of five)
   * @property {string} image - Contains URL for the product image
   * @property {string} productId - Unique ID for the product
   */
  
  /**
   * Returns the complete data on all products in cartData by searching in productsData
   *
   * @param { Array.<{ productId: String, qty: Number }> } cartData
   *    Array of objects with productId and quantity of products in cart
   * 
   * @param { Array.<Product> } productsData
   *    Array of objects with complete data on all available products
   *
   * @returns { Array.<CartItem> }
   *    Array of objects with complete data on products in cart
   *
   */
  export const generateCartItemsFrom = (cartData, productsData) => {
    // console.log(cartData, productsData)
    let productMap={}
    productsData.forEach((prodData)=>{
      productMap[prodData._id]=prodData
    })
    // console.log(productMap)
    return cartData.map((item)=>({
      ...productMap[item.productId],
      ...item
    }))
    // if (!cartData) return;
  
    // let nextCart = cartData.map((item) => ({
    //   ...item,
    //   ...productsData.find((product) => item.productId === product._id),
    // }));
  
    // return nextCart;
  };
  
  /**
   * Get the total value of all products added to the cart
   *
   * @param { Array.<CartItem> } items
   *    Array of objects with complete data on products added to the cart
   *
   * @returns { Number }
   *    Value of all items in the cart
   *
   */
  export const getTotalCartValue = (items = []) => {
    let total=0
    items.forEach((item)=>{
      total+=(item.qty*item.cost)
    })
    return total
  };
  
  export const getTotalItems=(items=[])=>{
    let totalQty=0
    items.forEach((item)=>{
      totalQty+=item.qty
    })
    return totalQty
  }
  
  /**
   * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
   * 
   * @param {Number} value
   *    Current quantity of product in cart
   * 
   * @param {Function} handleAdd
   *    Handler function which adds 1 more of a product to cart
   * 
   * @param {Function} handleDelete
   *    Handler function which reduces the quantity of a product in cart by 1
   * 
   * @param {Boolean} isReadOnly
   *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
   * 
   */
  const ItemQuantity = ({
    value,
    handleAdd,
    handleDelete,
  }) => {
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  };
  
  /**
   * Component to display the Cart view
   * 
   * @param { Array.<Product> } products
   *    Array of objects with complete data of all available products
   * 
   * @param { Array.<Product> } items
   *    Array of objects with complete data on products in cart
   * 
   * @param {Function} handleDelete
   *    Current quantity of product in cart
   * 
   * @param {Boolean} isReadOnly
   *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
   * 
   */
  const Cart = ({
    products,
    items = [],
    handleQuantity,
    isReadOnly
  }) => {
    let history=useHistory()
  
    if (!items.length) {
      return (
        <Box className="cart empty">
          <ShoppingCartOutlined className="empty-cart-icon" />
          <Box color="#aaa" textAlign="center">
            Cart is empty. Add more items to the cart to checkout.
          </Box>
        </Box>
      );
    }
  
    return (
      <>
        <Box className="cart">
          {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
          <Box
            // padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
          >
            {items.map((item)=>(
  <Box display="flex" alignItems="flex-start" padding="1rem" key={item._id}>
      <Box className="image-container">
          <img
              // Add product image
              src={item.image}
              // Add product name as alt eext
              alt={item.name}
              width="100%"
              height="100%"
          />
      </Box>
      <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="6rem"
          paddingX="1rem"
      >
          <div>{item.name}</div>
          <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
          >
          {!isReadOnly && <ItemQuantity
          // Add required props by checking implementation
          value={item.qty}
          handleAdd={()=>{
            handleQuantity(item._id, item.qty+1)
          }}
          handleDelete={()=>{
            handleQuantity(item._id, item.qty-1)
          }}
          />}
          {isReadOnly && <Box padding="0.5rem" fontWeight="700">
              Qty: {item.qty}
          </Box>}
          <Box padding="0.5rem" fontWeight="700">
              ${item.cost}
          </Box>
          </Box>
      </Box>
  </Box>))}
          <Stack direction="row" justifyContent="space-between" paddingBottom={isReadOnly ?"1rem" :"0"} paddingTop={isReadOnly ?"1rem" :"0"} minWidth={"92%"}>
            <Box color="#3C3C3C" alignSelf="center" >
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
            </Stack>
          </Box>
  
          {!isReadOnly && <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={()=>{
                history.push("/checkout")
              }}
            >
              Checkout
            </Button>
          </Box>}
        </Box>
        {isReadOnly && <Box className="cart" mt={1} pb={2}>
        <Typography variant="h6" pt={3} pl={2} gutterBottom sx={{fontWeight:"bold"}}>
          Order Details
        </Typography>
        <Stack direction="row" justifyContent="space-between" px={2}>
              <Typography variant="subtitle2" gutterBottom>
                Products
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                {getTotalItems(items)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" px={2}>
              <Typography variant="subtitle2" gutterBottom>
                Subtotal
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
              $ {getTotalCartValue(items)}
              </Typography>
            </Stack><Stack direction="row" justifyContent="space-between" px={2}>
              <Typography variant="subtitle2" gutterBottom>
                Shipping Charges
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                $ 0
              </Typography>
            </Stack><Stack direction="row" justifyContent="space-between" px={2}>
              <Typography variant="body1" gutterBottom sx={{fontWeight:"bold"}}>
                Total
              </Typography>
              <Typography variant="body1" gutterBottom sx={{fontWeight:"bold"}}>
                $ {getTotalCartValue(items)}
              </Typography>
            </Stack>
        </Box>}
      </>
    );
  };
  
  export default Cart;
  