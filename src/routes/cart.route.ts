import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import prisma from "../lib/db";
import { checkUserToken } from "../middlewares/check-user-token";
import CartService from "../services/cart.service";

const cartRoute = new Hono();
const cartServices = new CartService();

cartRoute.get("/", checkUserToken, async (c) => {
    const user = c.get("user");

    const existingCart = await prisma.cart.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          items: {
            include: {
              product: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!existingCart) {
        const newCart = await cartServices.newCart(user);

        return c.json(newCart)
      };

      const totalPrice = existingCart.items.reduce((accumulator, cartItem) => {
        const productPrice = cartItem.product.price;
        const quantity = cartItem.quantity;
        return accumulator + productPrice * quantity;
      }, 0);

      return c.json({ ...existingCart, total: totalPrice });
});

cartRoute.post("/items", checkUserToken, zValidator("json", z.object({ productId: z.string(), quantity: z.number().min(1), price: z.number().min(10)})), async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    const existingCart = await cartServices.existingCart(user);

    if (!existingCart) {
        return c.json({ message: "Shopping cart is unavailable" }, 404);
    };

    const existingItem = existingCart.items.find(
        (item) => item.productId === body.productId
    );

    if (existingItem) {
        await prisma.cartItem.update({
            where: {id: existingItem.id},
            data: { quantity: existingItem.quantity + body.quantity }
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: existingCart.id,
            productId: body.productId,
            quantity: body.quantity,
            }
        });
    };

    const updatedCart = await prisma.cart.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });

    return c.json(updatedCart);
});

export default cartRoute;
