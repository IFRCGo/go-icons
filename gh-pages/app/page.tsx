"use client";
const icons = require('@ifrc-go/icons');
const pkg = require('package.json');

import toast, { Toaster } from 'react-hot-toast';
import SadFaceIcon from './svg/sadface.svg';
import GoIcon from './svg/logo.svg';
import DotIcon from './svg/dot.svg';
import SearchIcon from './svg/search.svg';
import { useDebounce } from './useDebounce';

import { useState, useCallback, ElementType } from 'react';

function Icons({ search }: { search: string }) {
    const filteredIcons: Record<string, ElementType> = search.length > 1 ? Object.keys(icons)
    .filter(key => key.match(new RegExp(search, "i")))
    .reduce((acc, key) => {
        acc[key] = icons[key];
        return acc;
    }, {} as Record<string, ElementType>) : icons;

    const [selectedIcon, setSelectedIcon]  = useState<string>();

    const handleIconClick = useCallback((value: string) => {
        navigator.clipboard.writeText(value);
        toast(`Copied ${value} to clipboard`);
        setSelectedIcon(value);
    }, []);

    if (search && Object.keys(filteredIcons).length === 0) {
        return (
            <div className="flex flex-col items-center py-20 text-sm
                leading-6 text-slate-600 md:py-24 lg:py-32">
                <SadFaceIcon className="h-8" />
                <p className="mt-6">
                    Sorry! we don’t have icons for{' '}
                    <span className="font-semibold text-slate-900">{`“${search}”`}</span>.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]
            gap-6 pb-16 pt-10">
            {Object.entries(filteredIcons).map(([key, Component]) => (
                <div className={`mx-auto cursor-pointer rounded-lg p-6 text-3xl text-slate-900
                        hover:shadow-md ${key === selectedIcon ? 'bg-slate-100' : 'bg-white'}`}
                    role="button"
                    aria-label={key}
                    key={key}
                    onClick={() => handleIconClick(key)}
                >
                    <Component />
                </div>
            ))}
        </div>
    )
}

function Header() {
    return (
        <header className="relative overflow-hidden pt-6">
            <div className="absolute inset-0 shadow-[inset_0_-1px_0_rgba(22,27,59,0.04)]" />
            <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <GoIcon className="h-10" />
                        <div className="flex items-center gap-4">
                            <p className="text-base font-bold tracking-tight text-slate-900 md:text-4xl">
                                IFRC GO Icons
                            </p>
                            <div
                                aria-label="Version"
                                className="flex items-center rounded-full border border-slate-700/10
                                    bg-slate-100 py-1.5 pl-2.5 pr-3 text-xs font-semibold text-slate-800
                                    transition hover:border-slate-700/20"
                            >
                                {`v${pkg.dependencies['@ifrc-go/icons'].substring(1)}`}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-start text-center lg:py-6">
                    <div className="flex max-w-[37rem] flex-col py-16 lg:pb-11 lg:pt-12">
                        <h1 className="mb-6 text-lg font-bold leading-9 tracking-tight text-slate-900 md:text-4xl">
                            Icons Library for IFRC GO
                        </h1>
                        <div className="flex items-center gap-4 text-sm leading-6 text-slate-500 lg:justify-start">
                            <p>{`${Object.keys(icons).length} icons`}</p>
                            <DotIcon className="w-0.5 fill-current" />
                            <p>React library</p>
                            <DotIcon className="w-0.5 fill-current" />
                            <p>MIT license</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default function App() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce<string>(search, 500);

    return (
        <div className="flex min-h-screen grow flex-col">
            <Header />
            <main className="relative flex grow flex-col">
                <div className="container mx-auto flex max-w-7xl flex-col
                    px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                    <div className="relative inset-0 flex-auto shadow-[inset_0_-1px_0_rgba(22,27,59,0.04)]">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search icons"
                            placeholder="Search icons"
                            className="block w-full appearance-none rounded-lg bg-transparent py-6 pl-9 pr-4
                                text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none
                                [&::-webkit-search-cancel-button]:appearance-none
                                [&::-webkit-search-decoration]:appearance-none
                                [&::-webkit-search-results-button]:appearance-none
                                [&::-webkit-search-results-decoration]:appearance-none"
                        />
                        <SearchIcon className="pointer-events-none absolute inset-y-0
                            left-0 h-full w-5 fill-slate-500 transition" />
                    </div>
                </div>
                <div className="container mx-auto max-w-7xl grow px-4 sm:px-6 lg:px-8">
                    <Icons search={debouncedSearch} />
                </div>
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <footer className="flex max-w-7xl flex-col items-center gap-10 border-t
                        border-slate-400/20 pb-20 pt-10 sm:flex-row">
                        <p className="flex items-center gap-3 text-sm leading-6 text-slate-900">
                            <GoIcon className="h-8" />
                            <span>
                                <a
                                    href="https://github.com/IFRCGo/"
                                    className="font-semibold"
                                >
                                    IFRC GO
                                </a>
                            </span>
                        </p>
                    </footer>
                </div>
            </main>
            <Toaster position="bottom-center" containerStyle={{
                position: 'sticky',
                bottom: '2.5rem',
            }}
                toastOptions={{
                    style: {
                        maxWidth: 500
                    }
                }}
            />

        </div>
    )
}
