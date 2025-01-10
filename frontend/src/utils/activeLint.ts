import { Location } from 'react-router-dom';

// Navbar active link
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isActiveLink = (location: Location<any>, path: string) =>
    location.pathname === path ? 'font-bold border-b-2 pb-2 border-orange-600' : 'text-gray-600';
