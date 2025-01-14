import { Location } from 'react-router-dom';

/**
 * Function to find active link in the navbar
 *
 * @param location - Location object of react router dom
 * @param {string} path - Path to check
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isActiveLink = (location: Location<any>, path: string) =>
    checkPathIsSame(location, path) ? 'font-bold border-b-2 pb-2 border-orange-600' : 'text-gray-600';

/**
 * Function to check the location of the component is same as the given path
 *
 * @param location - Location object of react router dom
 * @param {string} path - Path to check
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkPathIsSame = (location: Location<any>, path: string): boolean => location.pathname === path;
