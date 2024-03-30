import { auth } from '@/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PiSignOut } from 'react-icons/pi';
import NavLinks from './components/NavLinks';
import SideBarButton from './components/SideBarButton';
import { getMappedConversationData } from './lib/util';
import ConversationSideBar from './components/ConversationSideBar';
import Revalidator from './components/Revalidator';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/');
  const user = session?.user;
  const mappedConversations = await getMappedConversationData(user);

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
      <ConversationSideBar conversations={mappedConversations} />
      {children}
      <Revalidator
        conversationIds={mappedConversations.map((c) => c.conversationId)}
      />
    </div>
  );
}
