import { NavigationItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import navigation from '../../data/navigation';

export default function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('color-theme')) {
            return localStorage.getItem('color-theme') === 'dark';
        }
        return typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    });
    const [currentPath, setCurrentPath] = useState('');

    // Get current path from window location
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    // Listen to Inertia navigation changes
    useEffect(() => {
        const handleNavigation = () => {
            setCurrentPath(window.location.pathname);
            setIsMenuOpen(false); // Otomatis tutup menu mobile saat pindah halaman
            setActiveDropdown(null); // Tutup dropdown saat pindah
        };

        const unsubscribe = router.on('navigate', handleNavigation);
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            if (typeof window !== 'undefined') localStorage.setItem('color-theme', 'dark');
        } else {
            root.classList.remove('dark');
            if (typeof window !== 'undefined') localStorage.setItem('color-theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const handleDropdownToggle = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const isActiveRoute = (route: NavigationItem) => {
        if (route.path) return currentPath === route.path;
        if (route.paths) return route.paths.some((subRoute) => currentPath === subRoute.path);
        return false;
    };

    const isActiveSubRoute = (path: string) => {
        return currentPath === path;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null);
        };

        if (typeof window !== 'undefined') {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    return (
        <nav
            id="navbar"
            className={`section-padding-x normal-font-size fixed top-0 z-[998] w-full py-4 text-dark-base transition-all duration-300 xl:backdrop-blur-md dark:text-light-base`}
        >
            <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
                <div className="flex w-full items-center justify-between rounded-lg border border-gray-300/30 bg-white/80 px-4 py-2 shadow-md backdrop-blur-md xl:w-auto xl:rounded-none xl:border-none xl:bg-transparent xl:px-0 xl:py-0 xl:shadow-none xl:backdrop-blur-none dark:border-gray-600/30 dark:bg-gray-900/80 xl:dark:bg-transparent xl:dark:shadow-none">
                    {/* Logo */}
                    <a href="#" className="transition-transform duration-300 hover:scale-105">
                        <img src="/img/logos/hmif.png" className="w-16" alt="Logo HMIF" />
                    </a>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        className="relative z-[999] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition-all duration-300 hover:bg-gray-100 focus:outline-none xl:hidden dark:hover:bg-gray-800"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 dark:bg-gray-100 ${
                                isMenuOpen ? 'translate-y-2 rotate-45' : ''
                            }`}
                        ></span>
                        <span
                            className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 dark:bg-gray-100 ${
                                isMenuOpen ? 'opacity-0' : 'opacity-100'
                            }`}
                        ></span>
                        <span
                            className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 dark:bg-gray-100 ${
                                isMenuOpen ? '-translate-y-2 -rotate-45' : ''
                            }`}
                        ></span>
                    </button>
                </div>

                {/* Navigation Links Container */}
                <div
                    className={`w-full overflow-hidden transition-all duration-500 ease-in-out xl:block xl:w-auto xl:overflow-visible ${
                        isMenuOpen ? 'mt-4 max-h-[1000px] opacity-100' : 'max-h-0 xl:mt-0 xl:max-h-none xl:opacity-100'
                    }`}
                >
                    <ul className="flex flex-col gap-2 rounded-lg border border-gray-400/30 bg-white/50 p-4 font-medium backdrop-blur-md xl:flex-row xl:gap-4 xl:border-none xl:bg-transparent xl:p-0 xl:backdrop-blur-none dark:border-gray-600/30 dark:bg-gray-800/50 xl:dark:bg-transparent">
                        {navigation.map((route, index) => (
                            <li key={index} className="group relative">
                                {route.path ? (
                                    route.path.startsWith('http') || route.path.startsWith('https') ? (
                                        <a
                                            href={route.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`block rounded px-3 py-2 transition-all duration-200 ${
                                                route.title === 'Jutif'
                                                    ? 'bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary text-light-base hover:scale-105 hover:shadow-lg'
                                                    : isActiveRoute(route)
                                                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            {route.title}
                                        </a>
                                    ) : (
                                        <Link
                                            href={route.path}
                                            className={`block rounded px-3 py-2 transition-all duration-200 ${
                                                route.title === 'Jutif'
                                                    ? 'bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary text-light-base'
                                                    : isActiveRoute(route)
                                                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            {route.title}
                                        </Link>
                                    )
                                ) : (
                                    /* Dropdown Toggle */
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDropdownToggle(index);
                                            }}
                                            className={`flex w-full items-center justify-between rounded px-3 py-2 transition-colors duration-200 xl:w-auto ${
                                                isActiveRoute(route)
                                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <span>{route.title}</span>
                                            <svg
                                                className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                                                    activeDropdown === index ? 'rotate-180' : ''
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu with Animation */}
                                        <div
                                            className={`absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-md border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-out lg:right-0 lg:left-auto lg:origin-top-right dark:border-gray-700 dark:bg-gray-800 ${
                                                activeDropdown === index
                                                    ? 'visible translate-y-0 scale-100 opacity-100'
                                                    : 'invisible -translate-y-2 scale-95 opacity-0'
                                            } `}
                                        >
                                            <div className="py-1">
                                                {route.paths?.map((subRoute, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subRoute.path}
                                                        className={`block border-l-2 border-transparent px-4 py-2 text-sm transition-all duration-200 hover:pl-6 ${
                                                            isActiveSubRoute(subRoute.path)
                                                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
                                                                : 'text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                                                        }`}
                                                        onClick={() => {
                                                            setActiveDropdown(null);
                                                            setIsMenuOpen(false);
                                                        }}
                                                    >
                                                        {subRoute.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}

                        {/* Theme Toggle */}
                        <li className="mt-4 xl:mt-0">
                            <button
                                id="theme-toggle"
                                type="button"
                                onClick={toggleTheme}
                                className="group relative flex w-fit items-center justify-center overflow-hidden rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all duration-300 hover:border-blue-500 hover:shadow-md xl:w-auto dark:border-gray-600 dark:hover:border-blue-400"
                                aria-label="Toggle theme"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
                                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                                    {isDarkMode ? (
                                        <svg
                                            className="h-5 w-5 text-yellow-500 transition-colors duration-300"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5 text-indigo-600 transition-colors duration-300"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                        </svg>
                                    )}
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
