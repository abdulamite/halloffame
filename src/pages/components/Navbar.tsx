import { useState } from "react";
import Link from "next/link";

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    setIsOpen(!isOpen);
  }

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0">Logo</div>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={(event) => handleSubmit(event)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link
                href="/locations"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500  hover:text-blue-500 "
              >
                Locations
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500  hover:text-blue-500 "
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500  hover:text-blue-500 "
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div
        className={`${
          isOpen ? "block animate-slide-down" : "hidden animate-slide-up"
        } md:hidden absolute bg-white w-full`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/locations"
            className="text-gray-500  hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Locations
          </Link>
          <Link
            href="/about"
            className="text-gray-500  hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-500  hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
