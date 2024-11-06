import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils';
import { IMenuDocument } from '../database/model';
import { container } from 'tsyringe';
import { MenuService } from '../services';
import { IMenu } from '../types';

const menuService = container.resolve(MenuService);

class MenuController {
    public async addMenu(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const file: Express.Multer.File = req.file!;
        const menu: IMenuDocument | null = await menuService.createMenu(
            userId,
            req.body as Omit<IMenu, 'imageUrl' | 'restaurantId'>,
            file,
        );
        res.status(200).json(createSuccessResponse('Menu created successfully', menu));
    }
}

export const menuController = new MenuController();
