import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen text-center px-2">
      
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      
      <Link href="/home" className="text-red-500 underline">
        Return Home
      </Link>
      
    </div>
  );
}
