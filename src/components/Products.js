import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
    CircularProgress,
    Grid,
    InputAdornment,
    TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import Header from "./Header";
import Cart, { generateCartItemsFrom } from "./Cart"
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
    let { enqueueSnackbar } = useSnackbar();
    let [loading, setLoading] = useState(false);
    // let [tempProd, setTempProd] = useState([]);
    let [timer, setTimer] = useState(null)
    let [products, setProducts] = useState([])
    let [input, setInput] = useState("")
    let [items, setItems] = useState([])
    let token = localStorage.getItem("token")
    // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
    /**
     * Make API call to get the products list and store it to display the products
     *
     * @returns { Array.<Product> }
     * 
     * 
     *      Array of objects with complete data on all available products
     *
     * API endpoint - "GET /products"
     *
     * Example for successful response from backend:
     * HTTP 200
     * [
     *      {
     *          "name": "iPhone XR",
     *          "category": "Phones",
     *          "cost": 100,
     *          "rating": 4,
     *          "image": "https://i.imgur.com/lulqWzW.jpg",
     *          "_id": "v4sLtEcMpzabRyfx"
     *      },
     *      {
     *          "name": "Basketball",
     *          "category": "Sports",
     *          "cost": 100,
     *          "rating": 5,
     *          "image": "https://i.imgur.com/lulqWzW.jpg",
     *          "_id": "upLK9JbQ4rMhTwt4"
     *      }
     * ]
     *
     * Example for failed response from backend:
     * HTTP 500
     * {
     *      "success": false,
     *      "message": "Something went wrong. Check the backend console for more details"
     * }
     */



    const performAPICall = async () => {
        try {
            setLoading(true)
            let res = await axios.get(`${config.endpoint}/products`)
            let data = res.data
            // setTempProd(data)
            // console.log(data)
            setProducts(data)
            let items = await fetchCart(token)
            // console.log(items)
            if (token) {
                setItems(generateCartItemsFrom(items, res.data))
            }
        }
        catch (e) {
            // console.log(e.response)
            if (e.response && e.response.status === 404) {
                enqueueSnackbar(e.response.data.message, { variant: "error" });
            }
        }
        setLoading(false)
    };

    useEffect(() => {
        performAPICall();
    }, []);

    // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
    /**
     * Definition for search handler
     * This is the function that is called on adding new search keys
     *
     * @param {string} text
     *    Text user types in the search bar. To filter the displayed products based on this text.
     *
     * @returns { Array.<Product> }
     *      Array of objects with complete data on filtered set of products
     *
     * API endpoint - "GET /products/search?value=<search-query>"
     *
     */
    const performSearch = async (text) => {
        setLoading(true)
        try {
            let res = await axios.get(`${config.endpoint}/products/search?value=${text}`)
            let data = res.data
            setProducts(data)
        }
        catch (e) {
            // console.log(e.response)
            if (e.response && e.response.status === 404) {
                setProducts(null)
            }
        }
        setLoading(false)
    };

    // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
    /**
     * Definition for debounce handler
     * With debounce, this is the function to be called whenever the user types text in the searchbar field
     *
     * @param {{ target: { value: string } }} event
     *    JS event object emitted from the search input field
     *
     * @param {NodeJS.Timeout} debounceTimeout
     *    Timer id set for the previous debounce call
     *
     */
    // let timer
    // const debounceSearch = (event, debounceTimeout) => {
    //   if (timer){
    //     clearTimeout(timer)
    //   }
    //   timer=setTimeout(()=>{
    //   performSearch(event.target.value)
    //   }, debounceTimeout)
    // };
    const debounceSearch = (event, debounceTimeout) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout)
        }
        let timerId = setTimeout(() => {
            performSearch(event.target.value)
        }, 500);
        setTimer(timerId)
    }


    /**
     * Perform the API call to fetch the user's cart and return the response
     *
     * @param {string} token - Authentication token returned on login
     *
     * @returns { Array.<{ productId: string, qty: number }> | null }
     *    The response JSON object
     *
     * Example for successful response from backend:
     * HTTP 200
     * [
     *      {
     *          "productId": "KCRwjF7lN97HnEaY",
     *          "qty": 3
     *      },
     *      {
     *          "productId": "BW0jAAeDJmlZCF8i",
     *          "qty": 1
     *      }
     * ]
     *
     * Example for failed response from backend:
     * HTTP 401
     * {
     *      "success": false,
     *      "message": "Protected route, Oauth2 Bearer token not found"
     * }
     */
    const fetchCart = async (token) => {
        if (!token) return [];

        try {
            // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
            let res = await axios.get(`${config.endpoint}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (e) {
            if (e.response && e.response.status === 400) {
                enqueueSnackbar(e.response.data.message, { variant: "error" });
            } else {
                enqueueSnackbar(
                    "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
                    {
                        variant: "error",
                    }
                );
            }
            return null;
        }
    };


    // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
    /**
     * Return if a product already is present in the cart
     *
     * @param { Array.<{ productId: String, quantity: Number }> } items
     *    Array of objects with productId and quantity of products in cart
     * @param { String } productId
     *    Id of a product to be checked
     *
     * @returns { Boolean }
     *    Whether a product of given "productId" exists in the "items" array
     *
     */
    const isItemInCart = (items, productId) => {
        return items.some((item) => item._id === productId)
    };

    /**
     * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
     *
     * @param {string} token
     *    Authentication token returned on login
     * @param { Array.<{ productId: String, quantity: Number }> } items
     *    Array of objects with productId and quantity of products in cart
     * @param { Array.<Product> } products
     *    Array of objects with complete data on all available products
     * @param {string} productId
     *    ID of the product that is to be added or updated in cart
     * @param {number} qty
     *    How many of the product should be in the cart
     * @param {boolean} options
     *    If this function was triggered from the product card's "Add to Cart" button
     *
     * Example for successful response from backend:
     * HTTP 200 - Updated list of cart items
     * [
     *      {
     *          "productId": "KCRwjF7lN97HnEaY",
     *          "qty": 3
     *      },
     *      {
     *          "productId": "BW0jAAeDJmlZCF8i",
     *          "qty": 1
     *      }
     * ]
     *
     * Example for failed response from backend:
     * HTTP 404 - On invalid productId
     * {
     *      "success": false,
     *      "message": "Product doesn't exist"
     * }
     */
    const addToCart = async (
        token,
        items,
        products,
        productId,
        qty,
        options = { preventDuplicate: false }
    ) => {

        try {
            if (options.preventDuplicate) {
                if (isItemInCart(items, productId)) {
                    enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" });
                }
            }
            let res = await axios.post(`${config.endpoint}/cart`, {
                productId, qty
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            // console.log(res.data)
            setItems(generateCartItemsFrom(res.data, products))
            // console.log("cartItems",items)
        }
        catch (e) {
            // console.log(e)
        }
    };

    // console.log("items>",items)
    return (
        <div>
            <Header>
                {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
                <TextField
                    className="search-desktop"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search color="primary" />
                            </InputAdornment>
                        ),
                    }}
                    value={input}
                    // onChange={(e)=>{performSearch(e.target.value)}}
                    // onChange={(e)=>{debounceSearch(e, 500)}}
                    onChange={(e) => {
                        setInput(e.target.value);
                        debounceSearch(e, timer);
                    }}
                    placeholder="Search for items/categories"
                    name="search"
                />
            </Header>
            {/* Search view for mobiles */}
            <TextField
                className="search-mobile"
                size="small"
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search color="primary" />
                        </InputAdornment>
                    ),
                }}
                value={input}
                // onChange={(e)=>{performSearch(e.target.value)}}
                // onChange={(e)=>{debounceSearch(e, 500)}}
                onChange={(e) => {
                    setInput(e.target.value);
                    debounceSearch(e, timer);
                }}
                placeholder="Search for items/categories"
                name="search"
            />
            <Grid container>
                <Grid
                    item
                    className="product-grid"
                    xs={12}
                    md={localStorage.getItem("username") ? 9 : 12}
                >
                    <Box className="hero">
                        <p className="hero-heading">
                            India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                            to your door step
                        </p>
                    </Box>
                    {loading === true ? (
                        <div className="loading">
                            <CircularProgress />
                            <h5>Loading Products...</h5>
                        </div>
                    ) : products === null ? (
                        <div className="loading">
                            <SentimentDissatisfied />
                            <h5>No products found</h5>
                        </div>
                    ) : (
                        <Grid container spacing={2} my={4} px={2}>
                            {products.map((item) => {
                                return (
                                    <Grid item xs={6} md={3} key={item._id}>
                                        <ProductCard
                                            product={item}
                                            handleAddToCart={(productId, qty) => {
                                                addToCart(token, items, products, productId, qty, {
                                                    preventDuplicate: true,
                                                });
                                            }}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Grid>
                {localStorage.getItem("username") ? (
                    <Grid item xs={12} md={3} sx={{ bgcolor: "#E9F5E1" }}>
                        <Cart
                            items={items}
                            handleQuantity={(productId, qty) => {
                                addToCart(token, items, products, productId, qty);
                            }}
                        />
                    </Grid>
                ) : (
                    <></>
                )}
            </Grid>

            <Footer />
        </div>
    );
};

export default Products;
