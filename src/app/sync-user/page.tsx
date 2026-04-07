import { db } from "@/server/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function SyncUser() {
  // Get authenticated user
  const { userId } = await auth()

  if (!userId) {
    throw new Error("User not authenticated")
  }

  // Get Clerk client
  const client = await clerkClient()

  // Fetch Clerk user
  const user = await client.users.getUser(userId)

  // Upsert user into database
  await db.user.upsert({
    where: {
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      id: userId,
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })

  // Redirect to dashboard
  return redirect("/dashboard")
}