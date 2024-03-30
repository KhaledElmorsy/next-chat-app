import { FaWhatsapp } from 'react-icons/fa6';

export default async function Chats() {
  return (
    <div className="hidden sm:flex flex-col gap-2 justify-center items-center w-full h-full bg-slate-50">
      <div className="text-6xl text-slate-200">
        <FaWhatsapp />
      </div>
      <h2 className="text-2xl flex items-end gap-2 text-gray-400">Whatsapp</h2>
      <p className="text-sm text-gray-300">Select or start a new chat</p>
    </div>
  );
}
