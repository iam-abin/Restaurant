const MENU_URL = `/menu`;

const menuApiUrls = {
    addMenuUrl: `${MENU_URL}`,
    getMenuUrl: (menuId: string) => `${MENU_URL}/${menuId}`,
    getMenusUrl: (restaurantId: string) =>
        `${MENU_URL}/restaurant/${restaurantId}`,
    editMenuUrl: (menuId: string) => `${MENU_URL}/${menuId}`,
};

export default menuApiUrls;
