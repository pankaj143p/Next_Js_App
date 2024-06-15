import { NextAuthOptions } from 'next-auth'
import CredentialsProvoder from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/dbConnects'
import UserModel from '@/Models/userModel'
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvoder({
            id: "crediantials",
            name: "crediantials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ]
                    })
                    if (!user) {
                        throw new Error("Invalid credentials , user not found")

                    }

                    if (!user.isVerified) {
                        throw new Error("User not verified , please verify first")
                    }
                    console.log("everything is fine");
                    
                    // password validation check password is correct or not
                    const isPassword = await bcrypt.compare(credentials.password, user.password)
                    //  when password is correct 
                    if (isPassword) {
                        return user
                    } else {
                        throw new Error("Invalid credentials, please check your password")

                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            },
        })
    ],
    callbacks: {
        async jwt({
            token,
            user,
        }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        },
        async session({
            session,
            token
        }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username


            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}
