const PROFILE_URL = '/profile';

const profileApiUrls = {
    getProfileUrl: `${PROFILE_URL}`,
    getProfilesUrl: (page: number, limit?: number) =>
        `${PROFILE_URL}/users?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    searchProfileUrl: (searchText: string, page: number, limit?: number) =>
        `${PROFILE_URL}/search?searchText=${searchText ?? ''}&page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,

    updateProfileUrl: `${PROFILE_URL}`,
};

export default profileApiUrls;
