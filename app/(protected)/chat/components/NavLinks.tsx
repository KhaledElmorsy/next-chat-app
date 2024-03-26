'use client';

import { usePathname } from 'next/navigation';
import SideBarButton from './SideBarButton';
import { PiChatCircleTextThin } from 'react-icons/pi';

const links = [
  {
    name: 'chat',
    href: '/chat',
    Icon: PiChatCircleTextThin,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return links.map(({ Icon, href, name }) => (
    <SideBarButton href={href} active={pathname.startsWith(href)} key={href}>
      <Icon className="text-2xl grid text-gray-700" title={name} />
    </SideBarButton>
  ));
}
