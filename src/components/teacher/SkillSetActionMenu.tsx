import React from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
}
    from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

const SkillSetActionMenu = ({ skillset, anchorEl, handleOptionsClose, handleOptionsMenuItemClick } : any) => {
    
    return (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleOptionsClose}>
            {/* Additional options menu */}
            <MenuItem  onClick={ () => handleOptionsMenuItemClick(skillset, 'EDIT_SKILLSET')}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary='Edit' />
            </MenuItem>
            <MenuItem onClick={ () => handleOptionsMenuItemClick(skillset, 'DELETE_SKILLSET')}>
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete" />
            </MenuItem>
        </Menu>
    );
};

export default SkillSetActionMenu;
