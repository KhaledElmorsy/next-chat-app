import { auth } from '@/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PiSignOut } from 'react-icons/pi';
import Conversations from './components/Conversations';
import NavLinks from './components/NavLinks';
import NewConvo from './components/NewConvo';
import SideBarButton from './components/SideBarButton';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/');
  return (
    <div className="flex h-full">
      <div className="flex flex-col items-center justify-between bg-slate-50 w-11 py-2 px-1">
        <div className="flex flex-col items-center gap-2">
          <NavLinks />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Image
            src={session?.user?.image as string}
            alt={`${session?.user?.name}'s profile picture`}
            width={28}
            height={28}
            className="rounded-full"
          />
          <SideBarButton href="/api/auth/signout" ariaLabel="sign out">
            <PiSignOut title="sign out" />
          </SideBarButton>
        </div>
      </div>
      <div className="w-full h-full ring-1 ring-gray-200 rounded-md md:w-96">
        <div className="px-4 py-4 flex justify-between items-center ">
          <h1 className="text-2xl font-semibold">Chats</h1>
          <NewConvo />
        </div>
        <Conversations />
      </div>
      {children}
    </div>
  );
}
