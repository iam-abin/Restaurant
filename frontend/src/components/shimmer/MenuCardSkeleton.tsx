import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Skeleton } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicIcon from "@mui/icons-material/Public";

const MenuCardSkeleton = () => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <div className="relative">
                <Skeleton variant="rectangular" width="100%" height={160} />
            </div>
            <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <div className="mt-2 gap-1 flex flex-col items-left text-gray-600 dark:text-gray-400">
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    <Skeleton variant="rounded" width={70} height={25} />
                    <Skeleton variant="rounded" width={40} height={25} />
                </div>
            </CardContent>
            <div className="flex justify-center">
                <Skeleton variant="text" width="90%" height={50} />
            </div>
        </Card>
    );
};

export default MenuCardSkeleton;
