import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IMenuDocument } from '../database/model';
import { MenuService } from '../services';
import { IJwtPayload, IMenu, MenuIdParam, Menus, Pagination, RestaurantIdParam } from '../types';

@autoInjectable()
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    public addMenu = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const file: Express.Multer.File = req.file!;
        const menu: IMenuDocument = await this.menuService.createMenu(
            userId,
            req.body as Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
            file,
        );
        res.status(201).json(createSuccessResponse('Menu created successfully', menu));
    };

    public getMenus = async (req: Request, res: Response): Promise<void> => {
        const { restaurantId } = req.params as RestaurantIdParam;
        const { page = 1, limit = 10 } = req.query as Pagination;

        const menu: Menus = await this.menuService.getMenus(restaurantId, page as number, limit as number);
        res.status(200).json(createSuccessResponse('Menus fetched successfully', menu));
    };

    public getMenu = async (req: Request, res: Response): Promise<void> => {
        const { menuId } = req.params as MenuIdParam;
        const menu: IMenuDocument = await this.menuService.getMenu(menuId);
        res.status(200).json(createSuccessResponse('Menu item fetched successfully', menu));
    };

    public editMenu = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { menuId } = req.params as MenuIdParam;
        const file: Express.Multer.File = req.file!;

        const menu: IMenuDocument | null = await this.menuService.updateMenu(
            userId,
            menuId,
            req.body as Partial<IMenu>,
            file,
        );
        res.status(200).json(createSuccessResponse('Menus updated successfully', menu));
    };
}
