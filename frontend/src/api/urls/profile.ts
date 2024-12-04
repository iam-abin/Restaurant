const PROFILE_URL = `/profile`;

const profileApiUrls = {
    getProfileUrl: `${PROFILE_URL}`,
    getProfilesUrl: (page: number, limit: number) => `${PROFILE_URL}/users/${page}/${limit}`,
    updateProfileUrl: `${PROFILE_URL}`,
};

export default profileApiUrls;
