import { useState } from "react";
import AddMenuModal from "../../components/modal/AddMenuModal";
import { Button, Typography } from "@mui/material";
import MenuCard from "../../components/cards/MenuCard";

const Menu = () => {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const handleAddMenuOpen = () => setIsAddMenuOpen(true);
    const handleAddMenuClose = () => setIsAddMenuOpen(false);

    return (
        <div>
            <div className="mt-3 flex justify-between items-center">
                <Typography className="text-xl font-extrabold">Available menus</Typography>
                <div className="mt-3 flex flex-col items-end gap-5">
                    <Button
                        className="h-10"
                        color="warning"
                        variant="contained"
                        onClick={handleAddMenuOpen}
                    >
                        Add menu
                    </Button>
                </div>
                {isAddMenuOpen && (
                    <AddMenuModal
                        isOpen={isAddMenuOpen}
                        handleClose={handleAddMenuClose}
                    />
                )}
            </div>
            <div className="flex flex-row gap-5 flex-wrap mt-5">
                {[...new Array(4).fill(0)].map((item) => (
                    <MenuCard />
                ))}
            </div>
        </div>
    );
};

export default Menu;
