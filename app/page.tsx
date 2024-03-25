import { FaWhatsapp } from 'react-icons/fa';
import SignInButton from './components/SignInButton';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-200 w-full h-full">
      <div className="flex text-2xl items-center -mt-40 gap-1 mb-3">
        <h1>Whatsapp</h1>
        <FaWhatsapp className="text-green-700 text-3xl" />
      </div>
      <p className="text-gray-400 mb-2 text-xs">To start chatting...</p>
      <SignInButton provider="google" />
    </div>
  );
}
