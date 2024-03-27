import { auth } from '@/auth';
import SideBarButton from './components/SideBarButton';
import NavLinks from './components/NavLinks';
import { PiSignOut } from 'react-icons/pi';
import Image from 'next/image';
import { redirect } from 'next/navigation';

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
          <SideBarButton href="/api/auth/signout" ariaLabel='sign out'>
            <PiSignOut title="sign out" />
          </SideBarButton>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
