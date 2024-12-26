import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IMenuDocument } from '../database/model';
import { MenuService } from '../services';
import { IMenu } from '../types';

const menuService = container.resolve(MenuService);

class MenuController {
    public async addMenu(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const file: Express.Multer.File = req.file!;
        const menu: IMenuDocument = await menuService.createMenu(
            userId,
            req.body as Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
            file,
        );
        res.status(201).json(createSuccessResponse('Menu created successfully', menu));
    }

    public async getMenus(req: Request, res: Response): Promise<void> {
        const { restaurantId } = req.params;
        const menu: IMenuDocument[] = await menuService.getMenus(restaurantId);
        res.status(200).json(createSuccessResponse('Menus fetched successfully', menu));
    }

    public async getMenu(req: Request, res: Response): Promise<void> {
        const { menuId } = req.params;
        const menu: IMenuDocument = await menuService.getMenu(menuId);
        res.status(200).json(createSuccessResponse('Menu item fetched successfully', menu));
    }

    public async editMenu(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { menuId } = req.params;
        const file: Express.Multer.File = req.file!;
        const menu: IMenuDocument | null = await menuService.updateMenu(
            userId,
            menuId,
            req.body as Partial<IMenu>,
            file,
        );
        res.status(200).json(createSuccessResponse('Menus updated successfully', menu));
    }
}

export const menuController = new MenuController();
