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
    CountByDay,
    IAdminDashboardCard,
    IAdminDashboardGraph,
    IOrderStatusWithCounts,
    CountByMonth,
    IRestaurantDashboard,
    MinMaxYears,
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

        // totalRevenue: totalOrderedPrice, //
        // lastSevenDaysUsers,
        // lastSevenDaysRestaurants,
        return { orderStatusData: transformedStatusesWithCounts, totalRevenue, menusCount, cuisinesCount };
    };

    public getAdminDashboardCardData = async (): Promise<IAdminDashboardCard> => {
        const PERCENTAGE: number = 0.5; // Commission percentage
        const percentageDecimal: number = PERCENTAGE / 100; // Calculate commission percentage in decimal

        const [restaurantsCount, usersCount, orderStatusesWithCounts, totalOrderedPrice, totalCommission]: [
            number,
            number,
            IOrderStatusWithCounts[],
            number,
            number,
        ] = await Promise.all([
            this.restaurantRepository.countRestaurants(),
            this.profileRepository.countProfiles(),
            this.orderRepository.countOrderStatuses(),
            this.orderRepository.findTotalOrderedPrice(),
            this.orderRepository.findPercentageCommitionAmount(percentageDecimal),
        ]);

        // Transform order statuses
        const transformedStatusesWithCount: IOrderStatusWithCounts[] =
            this.mapOrderStatusesWithCounts(orderStatusesWithCounts);

        // To get data of last 7 days
        const startDate: Date = new Date();
        startDate.setHours(0, 0, 0, 0); // Set to start of today
        startDate.setDate(startDate.getDate() - 6); // Go back 6 days to include today and last 6 days
        const lastSevenDaysUsers: CountByDay[] =
            await this.profileRepository.countLast7DaysCreatedProfiles(startDate);
        const lastSevenDaysRestaurants: CountByDay[] =
            await this.restaurantRepository.countLast7DaysCreatedRestaurants(startDate);

        return {
            restaurantsCount,
            usersCount,
            orderStatuses: transformedStatusesWithCount,
            totalTurnover: totalOrderedPrice,
            totalCommission,
            lastSevenDaysUsers,
            lastSevenDaysRestaurants,
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
        const allStatuses: string[] = ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered'];

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
