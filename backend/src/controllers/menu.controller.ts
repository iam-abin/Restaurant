import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IMenuDocument } from '../database/model';
import { MenuService } from '../services';
import { IJwtPayload, IMenu, MenuId, Menu, Pagination, RestaurantId } from '../types';
import { DEFAULT_LIMIT_VALUE, DEFAULT_PAGE_VALUE, HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    public addMenuItem = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const file: Express.Multer.File = req.file!;
        const menu: IMenuDocument = await this.menuService.createMenuItem(
            userId,
            req.body as Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
            file,
        );
        res.status(HTTP_STATUS_CODE.CREATED).json(createSuccessResponse('Menu created successfully', menu));
    };

    public getMenu = async (req: Request, res: Response): Promise<void> => {
        const { restaurantId } = req.params as RestaurantId;
        const { page = DEFAULT_PAGE_VALUE, limit = DEFAULT_LIMIT_VALUE } = req.query as Pagination;

        const menu: Menu = await this.menuService.getMenu(restaurantId, page as number, limit as number);
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Menus fetched successfully', menu));
    };

    public getMenuItem = async (req: Request, res: Response): Promise<void> => {
        const { menuItemId } = req.params as MenuId;
        const menu: IMenuDocument = await this.menuService.getMenuItem(menuItemId);
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Menu item fetched successfully', menu));
    };

    public editMenuItem = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { menuItemId } = req.params as MenuId;
        const file: Express.Multer.File = req.file!;

        const menu: IMenuDocument | null = await this.menuService.updateMenuItem(
            userId,
            menuItemId,
            req.body as Partial<IMenu>,
            file,
        );
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Menus updated successfully', menu));
    };

    public closeOpenMenuItem = async (req: Request, res: Response): Promise<void> => {
        const { menuItemId } = req.params;
        const menuItem: IMenuDocument | null = await this.menuService.updateCloseMenuItemStatus(menuItemId);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse(
                `menu item ${menuItem?.isClosed ? 'closed' : 'opened'}  successfully`,
                menuItem,
            ),
        );
    };
}
