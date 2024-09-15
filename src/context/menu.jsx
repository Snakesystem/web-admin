/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useResponseHandler } from "../hooks/useResponseHandler";

const MenuContext = createContext();

export const useMenu = () =>  useContext(MenuContext);

const MenuProvider = ({ children }) => {
    const [menu, setMenu] = useState(null);
    const { getRequest } = useApi();
    const { isLoading } = useResponseHandler();

    const getMenuItems = async () => {
        try {
            const response = await getRequest('api/monitoring/menu')
            setMenu(response)
        } catch (error) {
            console.log(error)
        }
    }
        
    useEffect(() => {
        getMenuItems()
    }, [])
    
    return (
        <MenuContext.Provider value={{ menu, isLoading }}>
            {children}
        </MenuContext.Provider>
    )
}

export default MenuProvider