'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

interface SignInVariant {
  provider: string;
  Icon: React.FC;
}

const providers = {
  google: {
    provider: 'google',
    Icon: FcGoogle,
  },
} satisfies Record<string, SignInVariant>;

interface SignInButtonProps {
  provider: keyof typeof providers;
}

export default function SignInButton({ provider }: SignInButtonProps) {
  const { provider: providerID, Icon } = providers[provider];
  return (
    <button
      onClick={() => signIn(providerID)}
      className="flex gap-1 justify-center items-center py-3 px-4 bg-white rounded-md shadow-md focus-visible:outline-green-700 duration-150 hover:shadow-lg active:scale-95"
    >
      <p className="text-sm">Sign in with</p>
      <Icon className="text-lg" title={providerID}/>
    </button>
  );
}
