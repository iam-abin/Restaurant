import { autoInjectable } from 'tsyringe';
import {
    MenuRepository,
    OrderRepository,
    ProfileRepository,
    RestaurantCuisineRepository,
    RestaurantRepository,
    UserRepository,
} from '../database/repository';
import { IRestaurantDocument } from '../database/model';
import { NotFoundError } from '../errors';
import {
    IAdminDashboardCard,
    IAdminDashboardGraph,
    IOrderStatusWithCounts,
    CountByMonth,
    IRestaurantDashboard,
    MinMaxYears,
    OrderStatus,
} from '../types';
// import { getCurrentYear } from '../utils';

@autoInjectable()
export class DashboardService {
    constructor(
        private readonly restaurantRepository: RestaurantRepository,
        private readonly restaurantCuisineRepository: RestaurantCuisineRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly orderRepository: OrderRepository,
        private readonly menuRepository: MenuRepository,
        private readonly userRepository: UserRepository,
    ) {}

    public getRestaurantDashboardData = async (userId: string): Promise<IRestaurantDashboard> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurantByOwnerId(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');

        const restaurantId: string = restaurant._id.toString();

        // Fetch all required data concurrently
        const [orderStatusesWithCounts, totalRevenue, menusCount, cuisinesCount]: [
            IOrderStatusWithCounts[],
            number,
            number,
            number,
        ] = await Promise.all([
            this.orderRepository.countOrderStatuses(restaurantId),
            this.orderRepository.findRestaurantTotalOrdersPrice(restaurantId),
            this.menuRepository.countRestaurantMenus(restaurantId),
            this.restaurantCuisineRepository.countRestaurantCuisines(restaurantId),
        ]);

        // Transform statuses
        const transformedStatusesWithCounts: IOrderStatusWithCounts[] =
            this.mapOrderStatusesWithCounts(orderStatusesWithCounts);

        return { orderStatusData: transformedStatusesWithCounts, totalRevenue, menusCount, cuisinesCount };
    };

    public getAdminDashboardCardData = async (): Promise<IAdminDashboardCard> => {
        const [restaurantsCount, usersCount, totalOrderedPrice]: [number, number, number] = await Promise.all(
            [
                this.restaurantRepository.countRestaurants(),
                this.profileRepository.countProfiles(),
                this.orderRepository.findAllOrdersPrice(),
            ],
        );

        return {
            restaurantsCount,
            usersCount,
            totalTurnover: totalOrderedPrice,
        };
    };

    public getAdminDashboardGraphData = async (year: number): Promise<IAdminDashboardGraph> => {
        const [restaurantsCountByMonth, profilesCountByMonth, minMaxYears]: [
            CountByMonth[],
            CountByMonth[],
            MinMaxYears,
        ] = await Promise.all([
            this.restaurantRepository.findRestaurantsCountGroupedByMonth(year),
            this.profileRepository.findProfilesCountGroupedByMonth(year),
            this.userRepository.findMinMaxYears(),
        ]);

        return { restaurantsCountByMonth, profilesCountByMonth, minMaxYears };
    };

    private mapOrderStatusesWithCounts = (
        orderStatusesWithCounts: IOrderStatusWithCounts[],
    ): IOrderStatusWithCounts[] => {
        const allStatuses: OrderStatus[] = [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED,
        ];

        const countsMap: Map<string, number> = new Map(
            orderStatusesWithCounts.map(({ status, count }) => [status, count || 0]),
        );

        const mappedStatuses: IOrderStatusWithCounts[] = allStatuses.map((status) => ({
            status,
            count: countsMap.get(status) || 0,
        }));

        return mappedStatuses;
    };
}
