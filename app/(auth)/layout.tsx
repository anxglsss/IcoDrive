import Image from 'next/image'

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex min-h-screen'>
			<section className='xl:w-2/5 lg:flex items-center justify-center bg-brand w-1/2 hidden'>
				<div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>
					<Image
						src='/icons/logo-full.svg'
						alt='logo'
						width={224}
						height={82}
						className='h-auto'
					/>
					<div className='space-y-5 text-white'>
						<h1 className='h1'>Manage your files the best way</h1>
						<p className='body-1'>
							This is a place where you can store all your documents.
						</p>
					</div>
					<Image
						src='/images/files.png'
						alt='Files'
						width={342}
						height={342}
						className='transition-all hover:rotate-2 hover:scale-105'
					></Image>
				</div>
			</section>
			<section className='bg-white flex flex-1 flex-col p-4 py-10 items-center lg:justify-center lg:p-10 lg:py-0 text-black'>
				{children}
			</section>
		</div>
	)
}

export default Layout
