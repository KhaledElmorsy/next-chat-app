import clsx from 'clsx';
import { useState } from 'react';
import { IconType } from 'react-icons';

interface Tab {
  Icon: IconType;
  name: string;
  page: JSX.Element;
}

interface TabbedWindowProps {
  tabs: Tab[];
}

export default function TabbedWindow({ tabs }: TabbedWindowProps) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="flex h-full rounded-md">
      <div className="flex flex-col gap-1 p-2 rounded-l-md bg-gray-50 h-full border-r border-gray-300">
        {tabs.map((t, i) => (
          <TabButton
            Icon={t.Icon}
            isActive={tabIndex === i}
            name={t.name}
            key={i}
            onClick={() => setTabIndex(i)}
          />
        ))}
      </div>
      <div className="w-full h-full bg-white rounded-[inherit] min-w-0">
        {tabs[tabIndex].page}
      </div>
    </div>
  );
}

interface TabButtonProps {
  name: string;
  Icon: IconType;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ name, Icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex gap-2 text-xs items-center hover:bg-gray-100 p-2 relative rounded-md',
        isActive &&
          'bg-gray-100 after:animate-grow-h after:absolute after:bg-green-700 after:left-0.5  after:w-[3px] after:h-1/2 after:rounded '
      )}
    >
      <Icon />
      <p className="hidden sm:block" aria-label={name}>
        {name}
      </p>
    </button>
  );
}
