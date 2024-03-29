'use client';

import Input from './Input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function ConversationSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Input
      placeholder="Search or start a new chat"
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query')?.toString()}
    />
  );
}
