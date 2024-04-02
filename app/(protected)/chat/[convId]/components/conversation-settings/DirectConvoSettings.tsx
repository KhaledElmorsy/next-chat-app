import TabbedWindow from './TabbedWindow';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import Overview from './direct-settings-pages/Overview';

export default function DirectConvoSettings() {
  return (
    <TabbedWindow
      tabs={[
        {
          Icon: IoIosInformationCircleOutline,
          name: 'Overview',
          page: <Overview />,
        },
      ]}
    />
  );
}
