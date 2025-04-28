import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { Fragment, useState } from 'react';
import { Box, Button, colors, Menu, MenuItem, TextField } from '@mui/material';
import { AddRounded, CheckRounded, CloseRounded } from '@mui/icons-material';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  flexWrap: 'wrap',
  listStyle: 'none',
}));

export default function CollectionItemsPicker({initialItems, onItemsChanged = () => {}}) {
  const [items, setItems] = useState(initialItems || []);

  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newItem, setNewItem] = useState('');

  const handleChipClick = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    onItemsChanged(selectedItems);
  };

  const handleAddItemClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddNewItem = () => {
    if (newItem.trim() && !items.includes(newItem)) {
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setSelectedItems([...selectedItems, newItem]);
      onItemsChanged([...selectedItems, newItem]);
      setNewItem('');
    }
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <ContentContainer
        component="ul"
      >
        {items.map((item) => (
          <ListItem key={item.id || item}>
            <Chip
              label={typeof item === 'object' ? item.name : item}
              onClick={() => handleChipClick(item)}
              color={selectedItems.includes(item) ? 'primary' : 'default'}
              icon={selectedItems.includes(item) ? <CheckRounded /> : null}
              deleteIcon={<CloseRounded style={{color: !selectedItems.includes(item) ? 'black' : 'white'}}/>}
              onDelete={() => setItems((prev) => prev.filter((i) => i !== item))} 
            />
          </ListItem>
        ))}
        <ListItem>
          <Button variant="outlined" onClick={handleAddItemClick} style={{borderRadius: '50px'}}>
            <AddRounded/>
            Add Item
          </Button>
        </ListItem>
      </ContentContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        style={{marginTop: '10px'}}
      >
        <div style={{margin: '3px 10px'}}>
          <TextField
            label="New Item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button onClick={handleAddNewItem}>Add</Button>
        </div>
      </Menu>
    </Fragment>
  );
}