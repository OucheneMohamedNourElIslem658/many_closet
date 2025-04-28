import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { Fragment, useEffect, useState } from 'react';
import { Avatar, Box, Button, colors, Menu, MenuItem, Skeleton, TextField } from '@mui/material';
import { AddRounded, CheckRounded, CircleRounded, CloseRounded } from '@mui/icons-material';
import ActionConfirmationDialog from '../../landing/components/action_confirmation_dialog';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  flexWrap: 'wrap',
  listStyle: 'none',
}));

const NewItemFormContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  margin: '3px 10px'
}))

const ItemLeadingContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
}));

export default function CollectionItemsPicker({initialItems, type, onItemsChanged = ([]) => {}, isLoading = false}) {
  const [items, setItems] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChipClick = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddItemClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddNewItem = (newItem) => {
    if (!items.includes(newItem)) {
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setSelectedItems([...selectedItems, newItem]);
      onItemsChanged(selectedItems)
    }
    setAnchorEl(null);
  };

  const handleItemDelete = (item) => {
    setItems((prev) => prev.filter((i) => i !== item));
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  }

  useEffect(() => {
    onItemsChanged(selectedItems);
  }
  , [selectedItems]);


  useEffect(() => {
    if (initialItems) {
      setItems(initialItems)
    }
  }, [initialItems])

  return (
    <Fragment>
      <ContentContainer
        component="ul"
      >
        {isLoading ? (
          Array.from(new Array(5)).map((_, index) => (
            <ListItem key={index}>
              <Chip
                label={<Skeleton width={50} />}
                icon={<Skeleton variant="circular" width={24} height={24} />}
              />
            </ListItem>
          ))
        ) : (
          items.map((item) => {
            const colorCode = type === 'color' ? `${item.code}` : null;
            const isColorBlack = type === 'color' && item.code === `000000`;
            return <ListItem key={item.id || item}>
              <Chip
                label={item.name}
                onClick={() => handleChipClick(item)}
                color={selectedItems.includes(item) ? 'primary' : 'default'}
                sx={{
                  padding: '5px'
                }}
                icon={
                  selectedItems.includes(item) 
                  ? 
                    type === 'color' 
                    ? <CircleRounded 
                      fontSize='small'
                      style={{
                        color: `#${colorCode}`,
                        border: isColorBlack ? `2px solid white`: null,
                        borderRadius: '50%',
                        boxSizing: 'border-box',
                      }}
                    />
                    : <CheckRounded /> 
                  : null
                }
                deleteIcon={
                  <ActionConfirmationDialog
                    triggerButton={<CloseRounded style={{color: !selectedItems.includes(item) ? 'black' : 'white'}}/>}
                    title={`Are you sure you want to delete ${item.name} ?`}
                    description={`This action will remove ${item.name} from the list.`}
                    onConfirm={() => handleItemDelete(item)}
                  />
                }
                onDelete={() => {}} 
              />
            </ListItem>
          })
        )}
        {!isLoading && (
          <ListItem>
            <Button variant="outlined" onClick={handleAddItemClick} style={{borderRadius: '50px'}}>
              <AddRounded/>
              Add Item
            </Button>
          </ListItem>
        )}
      </ContentContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        style={{marginTop: '10px'}}
      >
        <NewItemFormContainer 
          as='form'
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const newItem = {
              id: items.length + 1,
              name: data.name,
              code: type === 'color' && data.code ? data.code.substring(1) : null,
            };
            handleAddNewItem(newItem);
          }}
        >
          <TextField
            label="Name"
            name='name'
            variant="outlined"
            size="small"
            required
            slotProps={{
              input: {
                endAdornment: type === 'color' && (
                  <input
                    type="color"
                    name='code'
                    style={{ width: '45px', height: '40px', border: 'none', cursor: 'pointer'}}
                    required
                  />
                ),
                style: {
                  paddingRight: 3
                }
              }
            }}
          />
          <Button type='submit'>Add</Button>
        </NewItemFormContainer>
      </Menu>
    </Fragment>
  );
}