const MENU_URL = '/menu';

const menuApiUrls = {
    addMenuUrl: `${MENU_URL}`,
    getMenuUrl: (menuId: string) => `${MENU_URL}/${menuId}`,
    getMenusUrl: (restaurantId: string, page: number, limit?: number) =>
        `${MENU_URL}/restaurant/${restaurantId}?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    editMenuUrl: (menuId: string) => `${MENU_URL}/${menuId}`,
};

export default menuApiUrls;
