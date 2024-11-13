'use server'

import { avatarPlaceholderUrl } from '@/app/constants'
import { IUser } from '@/app/types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ID, Query } from 'node-appwrite'
import { createAdminClient, createSessionClient } from '../appwrite'
import { appwriteConfig } from '../appwrite/config'
import { parseStringify } from '../functions/parse-stringify'

async function getUserByEmail(email: string) {
	const { databases } = await createAdminClient()

	const users = await databases.listDocuments(
		appwriteConfig.databaseId,
		appwriteConfig.usersCollectionId,
		[Query.equal('email', [email])] // [Checking] Array with query to check existing email
	)

	return users.total > 0 ? users.documents[0] : null
}

export async function sendEmailOTP({ email }: { email: string }) {
	const { account } = await createAdminClient()
	try {
		// [createEmailToken] - send to given email unique token, with userId/accountId
		const session = await account.createEmailToken(ID.unique(), email) // [ID] - generate unique id
		return session.userId
	} catch (error) {
		handleError(error, 'Error with sending OTP email')
	}
}

export async function createAccount({ fullName, email }: IUser) {
	const existingUser = await getUserByEmail(email)

	const accountId = await sendEmailOTP({ email })
	if (!accountId) throw new Error('Failed with OTP')

	if (!existingUser) {
		const { databases } = await createAdminClient()

		await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			ID.unique(),
			{
				fullName,
				email,
				avatar: avatarPlaceholderUrl,
				accountId,
			}
		)
	}
	return parseStringify({ accountId })
}

export async function verifyEmail({
	accountId,
	password,
}: {
	accountId: string
	password: string
}) {
	try {
		const { account } = await createAdminClient()

		const session = await account.createSession(accountId, password)

		;(await cookies()).set('appwrite-session', session.secret, {
			path: '/',
			sameSite: 'strict',
			secure: true,
			httpOnly: true,
		})

		return parseStringify({ sessionId: session.$id })
	} catch (error) {
		handleError(error, 'Error with email verification')
	}
}

export const getCurrentUser = async () => {
	try {
		const { databases, account } = await createSessionClient()

		const result = await account.get()

		const user = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			[Query.equal('accountId', result.$id)]
		)

		if (user.total <= 0) return null

		return parseStringify(user.documents[0])
	} catch (error) {
		console.log(error)
	}
}

export async function signOutUser() {
	const { account } = await createSessionClient()

	try {
		await account.deleteSession('current')
		;(await cookies()).delete('appwrite-session')
	} catch (error) {
		handleError(error, 'Error signing out user')
	} finally {
		redirect('/sign-in')
	}
}

export async function signInUser({ email }: { email: string }) {
	try {
		const existingUser = await getUserByEmail(email)

		if (existingUser) {
			await sendEmailOTP({ email })
			return parseStringify({ accountId: existingUser.accountId })
		}

		return parseStringify({ accountId: null, error: 'User not found' })
	} catch (error) {
		handleError(error, 'Error signing in user')
	}
}
