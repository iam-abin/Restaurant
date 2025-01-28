const MENU_URL = '/menu';

const menuApiUrls = {
    addMenuItemUrl: `${MENU_URL}`,
    getMenuItemUrl: (menuItemId: string) => `${MENU_URL}/${menuItemId}`,
    getMenuUrl: (restaurantId: string, page: number, limit?: number) =>
        `${MENU_URL}/restaurant/${restaurantId}?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    editMenuItemUrl: (menuItemId: string) => `${MENU_URL}/${menuItemId}`,
    closeOpenMenuItemUrl: (menuItemId: string) => `${MENU_URL}/close-open/${menuItemId}`,
};

export default menuApiUrls;
