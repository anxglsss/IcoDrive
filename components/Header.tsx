import { Button } from '@/components/ui/button'
import { signOutUser } from '@/lib/actions/user.actions'
import Image from 'next/image'
import FileUploader from './FileUploader'

const Header = ({
	userId,
	accountId,
}: {
	userId: string
	accountId: string
}) => {
	return (
		<header className='header'>
			{/*Search*/}
			<h1 className='h1'>Search</h1>
			<div className='header-wrapper'>
				<FileUploader ownerId={userId} accountId={accountId} />
				<form
					action={async () => {
						'use server'

						await signOutUser()
					}}
				>
					<Button type='submit' className='sign-out-button'>
						<Image
							src='/icons/logout.svg'
							alt='logo'
							width={24}
							height={24}
							className='w-6'
						/>
					</Button>
				</form>
			</div>
		</header>
	)
}
export default Header
