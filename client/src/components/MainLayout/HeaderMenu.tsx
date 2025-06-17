import {
    AiOutlineAreaChart,
    AiOutlineBars,
    AiOutlineQuestionCircle,
    AiOutlineSearch,
    AiOutlineSetting,
} from 'react-icons/ai';

import { Box, Button, Menu, MenuButton, MenuItem as ChakraMenuItem, MenuList } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Header } from '../Header/Header';
import { MenuItem } from '../Header/MenuItem';

export const HeaderMenu = () => {
    const { email, logout } = useContext(AuthContext);

    return (
        <Header brandLinkProps={{ to: '/app/timeline', as: RouterLink }}>
            <MenuItem to="/app/timeline" icon={<AiOutlineBars />} title="Timeline" />
            <MenuItem to="/app/summary" icon={<AiOutlineAreaChart />} title="Summary" />
            <MenuItem to="/app/search" icon={<AiOutlineSearch />} title="Search" />
            <MenuItem to="/app/settings" icon={<AiOutlineSetting />} title="Settings" />
            <MenuItem to="/app/support" icon={<AiOutlineQuestionCircle />} title="Support" />
            <Box flex="1" />

            <Box>
                <ColorModeSwitcher />
            </Box>
            {email && (
                <Menu>
                    <MenuButton as={Button} variant="ghost">
                        {email}
                    </MenuButton>
                    <MenuList>
                        <ChakraMenuItem onClick={logout}>Cerrar sesión</ChakraMenuItem>
                    </MenuList>
                </Menu>
            )}
        </Header>
    );
};
