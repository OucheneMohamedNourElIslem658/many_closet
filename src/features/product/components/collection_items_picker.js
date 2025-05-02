import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { Fragment, useEffect, useState } from 'react';
import { Avatar, Box, Button, colors, Menu, MenuItem, Skeleton, TextField } from '@mui/material';
import { AddRounded, CheckRounded, CircleRounded, CloseRounded } from '@mui/icons-material';
import ActionConfirmationDialog from '../../landing/components/action_confirmation_dialog';
import { addFilter, deleteFilter } from '../../../services/product';
import CustomizedSnackbar from '../../../commun/components/snackbar';

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

export default function CollectionItemsPicker({initialItems = [], initialSelectedItems = [], type, onItemsChanged = ([]) => {}, isLoading = false, disabled}) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState('');
  const [formDisabled, setFormDisabled] = useState(false);

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

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const newItem = {
      name: data.name,
    };

    if (type === 'colors') {
      newItem.code = data.code.replace('#', '').toUpperCase();
    }

    e.stopPropagation();

    if (!items.includes(newItem)) {
      setFormDisabled(true)
      try {
        const createdItem = await addFilter({type, data: newItem})
        const updatedItems = [...items, createdItem];
        setItems(updatedItems);
        setSelectedItems([...selectedItems, createdItem]);
        // onItemsChanged(selectedItems)
      } catch (error) {
        setError(error.message);
      } finally {
        setFormDisabled(false)
        setAnchorEl(null)
      }
    }
    setAnchorEl(null);
  };

  const handleItemDelete = async (item) => {
    try {
      await deleteFilter({type, id: item.id});
      setItems((prev) => prev.filter((i) => i !== item));
      setSelectedItems((prev) => prev.filter((i) => i !== item));
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    onItemsChanged(selectedItems);
  }
  , [selectedItems]);


  useEffect(() => {
    if (initialItems) {;
      setItems(initialItems)
    }
  }, [initialItems]);

  useEffect(() => {
    if (initialSelectedItems?.length) {
      setSelectedItems(() => {
        const initialSelectedItemsIDs = initialSelectedItems.map((item) => item.id || item);
        const newSelectedItems = initialItems.filter((item) =>
          initialSelectedItemsIDs.includes(item.id)
        );
        return newSelectedItems;
      });
    }
  }, [initialSelectedItems]);

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
            const colorCode = type === 'colors' ? `${item.hex}` : null;
            const isColorBlack = type === 'colors' && item.hex === `000000`;
            return <ListItem key={item.id || item}>
              <Chip
                disabled={disabled}
                label={item.name}
                onClick={() => handleChipClick(item)}
                color={selectedItems.includes(item) ? 'primary' : 'default'}
                sx={{
                  padding: '5px'
                }}
                icon={
                  selectedItems.includes(item) 
                  ? 
                    type === 'colors' 
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
                    onConfirm={async () => await handleItemDelete(item)}
                  />
                }
                onDelete={() => {}} 
              />
            </ListItem>
          })
        )}
        {!isLoading && (
          <ListItem>
            <Button variant="outlined" onClick={handleAddItemClick} style={{borderRadius: '50px'}} disabled={disabled}>
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
        <NewItemFormContainer>
          <form
            onSubmit={async (e) => await handleAddNewItem(e)}
          >
            <Fragment>
              <TextField
                label="Name"
                name='name'
                variant="outlined"
                size="small"
                required
                disabled={formDisabled}
                slotProps={{
                  input: {
                    endAdornment: type === 'colors' && (
                      <input
                        type="color"
                        name='code'
                        style={{ width: '45px', height: '40px', border: 'none', cursor: 'pointer'}}
                        required
                        disabled={formDisabled}
                      />
                    ),
                    style: {
                      paddingRight: 3
                    }
                  },
                  htmlInput: {
                    maxLength: type === 'colors' ? 20 : type === 'sizes' ? 5 : 50,
                  },
                }}
              />
              <Button type='submit' disabled={formDisabled}>Add</Button>
            </Fragment>
          </form>
        </NewItemFormContainer>
      </Menu>
      <CustomizedSnackbar
        open={Boolean(error)}
        message={error}
        type='error'
        handleClose={() => setError(null)}  
      />
    </Fragment>
  );
}