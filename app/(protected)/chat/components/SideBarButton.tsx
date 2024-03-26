'use client';

import Link from 'next/link';
import clsx from 'clsx';

interface SideBarButtonProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export default function SideBarButton({
  href,
  children,
  active,
}: SideBarButtonProps) {
  return (
    <Link href={href}>
      <button
        className={clsx(
          'grid place-content-center bg-slate-100 size-9 rounded-sm duration-200 shadow-sm hover:shadow-md',
          active && 'border-l-2 border-green-800 bg-slate-200'
        )}
      >
        {children}
      </button>
    </Link>
  );
}
