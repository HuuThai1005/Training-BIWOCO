import { Router } from "express";
import bcrypt from "bcrypt"
import { db } from "../db";
import { books, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { bookRepo } from "../repositories/book.repo"
const router = Router()

router.post("/register", async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({message: "Incorrect email or pasword!"})
    }

    const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1)


    if(existingEmail.length > 0) {
        return res.status(400).json({message: "Email aldready exist"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await db.insert(users).values({ 
            email, password: hashedPassword,

        })
        res.json({message: "Register success"})
    } catch (err: any) {
        if (err.code === "23505") {
            res.status(400).json({message: "Email aldready exist"})
        }
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body

    const result = await db.select().from(users).where(eq(users.email, email))

    if(result.length === 0) {
        return res.status(400).json({message: "Invalid email or pasword"})
    }

    const user = result[0]
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        return res.status(401).json({message: "Invalid email or passowrd"})

    }

    res.json({message: "Login success", 
        user: {
            id: user.id,
            email: user.email,
        }
    })
})

router.post("/create-book", async (req, res) => {
    const {title, price} = req.body

    if(title === null || price === null) {
        return res.status(400).json({message: "Title or price cannot be null!"})
    }

    const existingBook = await db.select().from(books).where(eq(books.title, title)).limit(1)

    if(existingBook.length > 0) {
        return res.status(400).json({message: "Book already exits!"})
    }

    try {
        await db.insert(books).values({
            title, price
        })

        res.json({message: "Create book success!"})
    } catch (error) {
        res.status(500).json({message: "Invalid"})
    }
})

router.post("/books", async (req, res) => {
    const books =  await bookRepo.listAll()
    res.json({message: "Books:", books})
})

router.post("/delete", async (req, res) => {
    const {title} = req.body
    if(!title) {
        return res.status(400).json({message: "Title is required!"})
    }

    await bookRepo.deleteByTitle(title)
    res.json({message: "Deleted book success!"})
})

router.put("/books/:title", async (req, res) => {
    const title = String(req.params.title)
    const {title: newTitle, price} = req.body

    if(!title) {
        return res.status(400).json({message: "Invalid title!"})
    }

    if(newTitle === undefined || price === undefined) {
        return res.status(400).json({message: "Nothing to update!"})
    }

    const existingBook = await db.select().from(books).where(eq(books.title, title)).limit(1)
    if(existingBook.length === 0) {
        return res.status(404).json({message: "Book not found!"})
    }

    await bookRepo.updateByTitle(title, {title: newTitle, price})

    return res.json({message: "Update book success!"})

})

export default router