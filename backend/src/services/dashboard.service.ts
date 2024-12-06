import { autoInjectable } from 'tsyringe';
import { OrderRepository, ProfileRepository, RestaurantRepository } from '../database/repository';
import { IRestaurantDocument } from '../database/model';
import { NotFoundError } from '../errors';
import { IAdminDashboard, IOrderStatusWithCounts } from '../types';

@autoInjectable()
export class DashboardService {
    constructor(
        private readonly restaurantRepository: RestaurantRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly orderRepository: OrderRepository,
    ) {}

    public async getRestaurantDashboardData(userId: string): Promise<IOrderStatusWithCounts[]> {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findMyRestaurant(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');

        const orderStatusesWithCounts: IOrderStatusWithCounts[] = await this.orderRepository.countStatuses(
            restaurant?._id.toString(),
        );

        const transformedStatusesWithCount: IOrderStatusWithCounts[] =
            this.mapOrderStatusesWithCounts(orderStatusesWithCounts);

        return transformedStatusesWithCount;
    }

    public async getAdminDashboardData(): Promise<IAdminDashboard> {
        const PERCENTAGE = 0.5; // Commission percentage
        const percentageDecimal = PERCENTAGE / 100; // Calculate commission percentage in decimal

        const [restaurantsCount, usersCount, orderStatusesWithCounts, totalOrderedPrice, totalCommission] =
            await Promise.all([
                this.restaurantRepository.countRestaurants(),
                this.profileRepository.countUsers(),
                this.orderRepository.countStatuses(),
                this.orderRepository.totalOrderedPrice(),
                this.orderRepository.percentageCommitionAmound(percentageDecimal),
            ]);

        // Transform order statuses
        const transformedStatusesWithCount = this.mapOrderStatusesWithCounts(orderStatusesWithCounts);

        return {
            restaurantsCount,
            usersCount,
            orderStatuses: transformedStatusesWithCount,
            totalTurnover: totalOrderedPrice,
            totalCommission,
        };
    }

    private mapOrderStatusesWithCounts(
        orderStatusesWithCounts: IOrderStatusWithCounts[],
    ): IOrderStatusWithCounts[] {
        const allStatuses = ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered'];

        const countsMap = new Map(orderStatusesWithCounts.map(({ status, count }) => [status, count || 0]));

        const mappedStatuses = allStatuses.map((status) => ({
            status,
            count: countsMap.get(status) || 0,
        }));

        return mappedStatuses;
    }
}
