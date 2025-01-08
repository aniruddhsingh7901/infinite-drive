

import { Request, Response, NextFunction } from 'express';
import Cart from '../models/cartModel';
import Book from '../models/Book';

interface AuthRequest extends Request {
    user: {
        id: string;
        email: string;
    }
}

interface CartResponse {
    message: string;
    cart?: Cart | Cart[] | null;
}

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { book_id, quantity = 1 } = req.body;
        const user_id = req.user.id;

        let cart = await Cart.findOne({
            where: { user_id, book_id }
        });

        if (cart) {
            await cart.update({
                quantity: cart.quantity + quantity
            });
        } else {
            cart = await Cart.create({
                id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                user_id,
                book_id,
                quantity
            });
        }

        const cartWithBook = await Cart.findOne({
            where: { id: cart.id },
            include: [Book]
        });

        res.status(200).json({
            message: 'Book added to cart',
            cart: cartWithBook
        });
    } catch (error) {
        next(error);
    }
};

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cart = await Cart.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Book,
                attributes: ['id', 'title', 'price', 'cover_image']
            }]
        });

        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { book_id, quantity } = req.body;
        const user_id = req.user.id;

        const cart = await Cart.findOne({
            where: { user_id, book_id }
        });

        if (!cart) {
            res.status(404).json({
                message: 'Cart item not found'
            });
            return;
        }

        if (quantity <= 0) {
            await cart.destroy();
            res.status(200).json({
                message: 'Item removed from cart'
            });
            return;
        }

        await cart.update({ quantity });

        const updatedCart = await Cart.findOne({
            where: { id: cart.id },
            include: [Book]
        });

        res.status(200).json({
            message: 'Cart updated',
            cart: updatedCart
        });
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { book_id } = req.params;
        const user_id = req.user.id;

        const deleted = await Cart.destroy({
            where: { user_id, book_id }
        });

        if (deleted) {
            res.status(200).json({
                message: 'Item removed from cart'
            });
        } else {
            res.status(404).json({
                message: 'Cart item not found'
            });
        }
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Cart.destroy({
            where: { user_id: req.user.id }
        });

        res.status(200).json({
            message: 'Cart cleared'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
};