import { useEffect, useState } from 'react'
import AddMenuModal from '../../components/modal/AddMenuModal'
import { Button, Typography } from '@mui/material'
import MenuCard from '../../components/cards/MenuCard'
import { getMenusApi } from '../../api/apiMethods/menu'
import { useAppSelector } from '../../redux/hooks'
import { IResponse } from '../../types/api'

const Menu = () => {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
    const [menus, setMenus] = useState([])
    const handleAddMenuOpen = () => setIsAddMenuOpen(true)
    const handleAddMenuClose = () => setIsAddMenuOpen(false)

    const restaurantData = useAppSelector((state) => state.restaurantReducer.restaurantData)

    useEffect(() => {
        ;(async () => {
            const response: IResponse | undefined = await getMenusApi(restaurantData.restaurant.id)
            if (response) {
                setMenus(response.data)
            }
        })()
    }, [])

    return (
        <div className="my-5">
            <div className="flex justify-between items-center">
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
                    <AddMenuModal isOpen={isAddMenuOpen} handleClose={handleAddMenuClose} />
                )}
            </div>
            {menus.length && (
                <div className="flex flex-wrap justify-center gap-5 mx-5 bg-green-300">
                    {menus.map((menu, index) => (
                        <MenuCard key={index} menu={menu} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Menu
