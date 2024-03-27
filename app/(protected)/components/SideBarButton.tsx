'use client';

import Link from 'next/link';
import clsx from 'clsx';

interface SideBarButtonProps {
  href: string;
  ariaLabel?: string;
  children: React.ReactNode;
  active?: boolean;
}

export default function SideBarButton({
  href,
  ariaLabel,
  children,
  active,
}: SideBarButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={clsx(
        'grid place-content-center relative bg-slate-100 size-9 rounded-sm duration-100 shadow-sm hover:shadow-md hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800',
        active &&
          'after:bg-green-800 after:l-0 after:self-center after:absolute after:h-5 after:duration-200 hover:after:h-6 after:w-[3px] after:rounded-md bg-slate-200'
      )}
    >
      {children}
    </Link>
  );
}
