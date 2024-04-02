import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

interface LightButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export default function LightButton({
  children,
  className = '',
  ...props
}: LightButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-md outline outline-[0.5px] border-b-[1.2px] outline-gray-200 px-3 py-[3px] text-sm min-w-24',
        className
      )}
    >
      {children}
    </button>
  );
}
