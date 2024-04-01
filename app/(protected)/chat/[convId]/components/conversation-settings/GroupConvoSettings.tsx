import TabbedWindow from './TabbedWindow';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { RiGroupLine } from 'react-icons/ri';
import Overview from './group-settings-pages/Overview';
import Members from './group-settings-pages/Members';

export default function GroupConvoSettings() {
  return (
    <TabbedWindow
      tabs={[
        {
          name: 'Overview',
          Icon: IoIosInformationCircleOutline,
          page: <Overview />,
        },
        {
          name: 'Members',
          Icon: RiGroupLine,
          page: <Members />,
        },
      ]}
    />
  );
}
