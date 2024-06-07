import dbConnect from "@/lib/dbConnects";
import UserModel from "@/Models/userModel"
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "@/Helpers/sendVerificationsEmail";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
// login route using ts 
export default async (req : NextApiRequest, res: NextResponse) => {
  if (req.method === 'POST') {
    await dbConnect();
    const { email, password } = req.body;
    try {
      const user =
        await
            UserModel.findOne({ email: email });
        if (!user) {
            return res.json({ message: 'User not found' },{status : false});
            }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
            }
        if (!user.isVerified) {
            return res.status(400).json({ message: 'User not verified' });
            }
        return res.status(200).json({ message: 'Login success' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    }
    return res.status(405).json({ message: 'Method not allowed' });
}

