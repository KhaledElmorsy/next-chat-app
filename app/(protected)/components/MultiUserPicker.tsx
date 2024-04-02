import { ISearchUserResult } from '@/app/lib/db';
import { searchUsers } from '../lib/actions';
import { createContext, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Input from './Input';

interface MultiUserPickerContext {
  pickedIds: number[];
  setPickedIds: React.Dispatch<React.SetStateAction<number[]>>;
  exclude?: number[];
}

const multiUserPickerContext = createContext<MultiUserPickerContext | null>(
  null
);

interface MultiUserPickerProviderProps extends MultiUserPickerContext {
  children: React.ReactNode;
}

export function MultiUserPickerProvider({
  children,
  pickedIds,
  setPickedIds,
  exclude = [],
}: MultiUserPickerProviderProps) {
  return (
    <multiUserPickerContext.Provider
      value={{ pickedIds, setPickedIds, exclude }}
    >
      {children}
    </multiUserPickerContext.Provider>
  );
}

function useMultiUserPicker() {
  const context = useContext(multiUserPickerContext);
  if (!context) {
    throw new Error('Multi user picker context used outside of provider');
  }
  return context;
}

interface MultiUserPickerProps {
  /**
   * An element to add between the search bar and search results. Useful for
   * replicating specific designs
   */
  sandwichedElement?: React.ReactNode;
}

export default function MultiUserPicker({
  sandwichedElement,
}: MultiUserPickerProps) {
  const {
    pickedIds,
    setPickedIds,
    exclude: excludedIds,
  } = useMultiUserPicker();

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<ISearchUserResult[]>([]);

  useEffect(() => {
    async function updateSearchResults() {
      setUsers(await searchUsers(search));
    }
    updateSearchResults();
  }, [search]);

  return (
    <>
      <Input
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      {sandwichedElement}
      <div className="flex flex-col overflow-y-auto">
        {users
          .filter((u) => !excludedIds?.includes(u.userId))
          .sort((a, b) => {
            const aSelected = pickedIds.find((pid) => pid === a.userId);
            const bSelected = pickedIds.find((pid) => pid === b.userId);
            if (aSelected) {
              return bSelected ? 0 : -1;
            } else {
              return bSelected ? 1 : 0;
            }
          })
          .map((u) => (
            <button
              className="w-full flex justify-between items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-md"
              key={u.userId}
              onClick={() =>
                setPickedIds((p) => {
                  const picked = p.includes(u.userId);
                  return picked
                    ? p.filter((id) => id !== u.userId)
                    : [...p, u.userId];
                })
              }
            >
              <div className="flex items-center gap-2">
                <Image
                  alt={`${u.name}'s picture`}
                  src={u.image}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <p className="overflow-ellipsis">{u.name}</p>
              </div>
              <input type="checkbox" checked={!!pickedIds.includes(u.userId)} />
            </button>
          ))}
      </div>
    </>
  );
}
