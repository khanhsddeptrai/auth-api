import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { User } from "../drizzle/schema";
import { UserType, UserTypeExist } from "../types/user";


export async function checkExistingUser(id: number): Promise<UserTypeExist | undefined> {
    const user = await db
        .select()
        .from(User)
        .where(eq(User.id, id))
        .limit(1)
    return user[0]
}