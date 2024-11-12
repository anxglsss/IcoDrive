'use client'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

type FormType = 'sign-in' | 'sign-up'

const authFormSchema = (type: FormType) => {
	return z.object({
		email: z.string().email(),
		fullName:
			type == 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
	})
}

const AuthForm = ({ type }: { type: FormType }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [accountId, setAccountId] = useState(null)

	const formSchema = authFormSchema(type)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: '',
			email: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='auth-form'>
					<h1 className='form-title'>
						{type === 'sign-in' ? 'Sign In' : 'Sign Up'}
					</h1>
					{type === 'sign-up' && (
						<FormField
							control={form.control}
							name='fullName'
							render={({ field }) => (
								<FormItem>
									<div className='shad-form-item'>
										<FormLabel className='shad-form-label'>Full name</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter your full name'
												className='shad-input'
												{...field}
											/>
										</FormControl>
									</div>
									<FormMessage className='shad-form-message' />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<div className='shad-form-item'>
									<FormLabel className='shad-form-label'>Email</FormLabel>

									<FormControl>
										<Input
											placeholder='Enter your email'
											className='shad-input'
											{...field}
										/>
									</FormControl>
								</div>

								<FormMessage className='shad-form-message' />
							</FormItem>
						)}
					/>

					<Button
						type='submit'
						className='form-submit-button'
						disabled={isLoading}
					>
						{type === 'sign-in' ? 'Sign In' : 'Sign up'}{' '}
						{isLoading && (
							<Image
								src='/icons/loader.svg'
								alt='loader'
								width={24}
								height={24}
								className='ml-2 animate-spin'
							/>
						)}
					</Button>

					<div className='body-2 flex justify-center'>
						<p className='text-light-100'>
							{type === 'sign-in'
								? "Don't have an account?"
								: 'Already have an account?'}
						</p>
						<Link
							href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
							className='ml-1 font-medium text-brand'
						>
							{' '}
							{type === 'sign-in' ? 'Sign Up' : 'Sign In'}
						</Link>
					</div>
				</form>

				{errorMessage && <p className='error-message'>*{errorMessage}</p>}
			</Form>

			{accountId && <h1>OTP Modal Implementation</h1>}
		</>
	)
}

export default AuthForm
