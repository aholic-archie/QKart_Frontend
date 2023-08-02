import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
    Button,
    Card, Grid,
    CardActions,
    CardContent,
    CardMedia,
    Rating,
    Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
    return (
        <Card className="card">
            <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
            />
            <CardContent>
                <div>{product.name}</div>
                <Typography gutterBottom variant="h5" component="div">
                    ${product.cost}
                </Typography>
                <Rating value={product.rating} name={product.name} readOnly />
            </CardContent>
            <CardActions>
                <Button className="card-button" fullWidth variant="contained"
                    onClick={(e) => {
                        handleAddToCart(
                            // localStorage.getItem("token"),
                            // [],[],
                            product._id, 1)
                    }}
                >
                    <AddShoppingCartOutlined />
                    ADD TO CART
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
