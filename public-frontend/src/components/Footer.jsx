export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500">© {new Date().getFullYear()} Mentora. All rights reserved.</p>
        <div className="flex gap-6 text-gray-600">
          <a href="#" className="hover:text-blue-600">Privacy</a>
          <a href="#" className="hover:text-blue-600">Terms</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </div>
      </div>
    </footer>
  );
}
