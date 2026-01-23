import { db } from "../db";
import { books } from "../db/schema";
import { eq } from "drizzle-orm";

export type CreateBookInput = {
    title: string
    price: number
}

export const bookRepo = {

    async findById(id: number) {
        const result = await db.select().from(books).where(eq(books.id, id))
        return result[0] ?? null
    },

    async findByTitle(title: string) {
        const result = await db.select().from(books).where(eq(books.title, title))
        return result[0] ?? null
    },
    
    async create(data: CreateBookInput) {
        const resultBook = await db.insert(books).values(data).returning()
        return resultBook[0]
    },

    async listAll() {
        const result = await db.select().from(books)
        return result
    },

    async deleteByTitle(title: string) {
        await db.delete(books).where(eq(books.title, title))
    },

    async updateByTitle(title: string, data: CreateBookInput) {
    await db.update(books).set({
            ...(data.title !== undefined && { title: data.title }),
            ...(data.price !== undefined && { price: data.price }),
        })
        .where(eq(books.title, title));
}


}