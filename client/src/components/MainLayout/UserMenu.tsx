import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

export function UserMenu() {
    const { email, logout } = useAuth();
    const navigate = useNavigate();

    if (!email) return null;

    const doLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Menu>
            <MenuButton as={Button} variant="ghost">
                {email}
            </MenuButton>
            <MenuList>
                <MenuItem onClick={doLogout}>Cerrar sesión</MenuItem>
            </MenuList>
        </Menu>
    );
}
