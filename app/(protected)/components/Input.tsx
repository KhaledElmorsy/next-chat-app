export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="text-xs px-4 py-1.5 w-full focus-visible:outline-none shadow-md ring-[0.5px] ring-gray-200 border-b-2 border-gray-300 focus-visible:border-green-700 rounded-md"
    />
  );
}
