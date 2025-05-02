import { Add, AddAPhotoRounded, Subtitles } from "@mui/icons-material";
import { IconButton, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Title = styled('p')(({ theme }) => ({
    fontSize: 18,
    color: theme.palette.text.primary,
    marginTop: 20
}))

const SubTitle = styled('p')(({ theme }) => ({
    fontSize: 12,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: 10,
}))
const ImagesContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: 16,
    border: `1px solid ${theme.palette.secondary.main}`,
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'scroll',
    width: '100%',
    height: 120,
    scrollbarWidth: 'none',
}));

const ImagePreview = styled('div')(({ theme }) => ({
    position: 'relative',
    minWidth: 100,
    maxWidth: 100,
    overflow: 'hidden',
    boxShadow: theme.shadows[1],
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    '& button': {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: 'none',
        borderRadius: '50%',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
}));

const ContentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 10,
    width: '100%',
}))

const HeaderContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
}))

const TitlesContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 5,
}))

const ImagesPicker = ({disabled, title = 'Images', subTitle, multiple = true, initialImages = [], imagesToDelete = () => {}}) => {
    const [files, setFiles] = useState([]);
    const [imagesToDeleteState, setImagesToDeleteState] = useState([]);

    useEffect(() => {
        if (initialImages.length > 0) {
            const initialFiles = initialImages.map((image) => ({
                url: image.url,
                file: null,
                storage_id: image.storage_id,
                id: image.$id
            }));
            setFiles(initialFiles);
        }
    }, [initialImages]);

    const handleFileChange = (event) => {
        if (multiple) {
            const selectedFiles = Array.from(event.target.files).map((file) => ({
                url: URL.createObjectURL(file),
                file: file,
                storage_id: null,
                id: null
            }));
            
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        } else {
            const file = event.target.files[0];
            if (file) {
                const newFile = {
                    url: URL.createObjectURL(file),
                    file: file,
                    storage_id: null,
                    id: null
                };
                setFiles([newFile]);
            }
        }
    }

    const handleRemoveFile = (index) => {
        if (files[index].id !== null) {
            setImagesToDeleteState((prev) => {
                const updatedState = [...prev, files[index]];
                imagesToDelete(updatedState);
                return updatedState;
            });
        }

        setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles.splice(index, 1);
            return newFiles;
        });

        const inputElement = document.getElementById("images");
        if (inputElement && inputElement.files) {
            const dataTransfer = new DataTransfer();
            Array.from(inputElement.files).forEach((file, i) => {
                const fileToRemove = files[index].file;

                if (file !== fileToRemove) {
                    dataTransfer.items.add(file);
                }
            });
            
            inputElement.files = dataTransfer.files;
        }
    }

    return (
        <ContentContainer>
            <HeaderContainer>
                <TitlesContainer>
                    <Title>{title}</Title>
                    {subTitle && <SubTitle>{subTitle}</SubTitle>}
                </TitlesContainer>
                <IconButton component="label" for={"images"} disabled={disabled}>
                    <AddAPhotoRounded style={{color: 'black'}}/>
                </IconButton>
            </HeaderContainer>
            <ImagesContainer>
                {
                    files.length > 0 ? files.map((file, index) => (
                        <ImagePreview key={index} margin={1}>
                            <img src={file.url} alt={`Image ${index + 1}`} />
                            {multiple && <button type="button" onClick={() => handleRemoveFile(index)} disabled={disabled}>X</button>}
                        </ImagePreview>
                    )) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' , alignSelf: 'center'}}>
                            {
                                multiple ? 'No images selected' : 'No image selected'
                            }
                        </Typography>
                    )
                }
            </ImagesContainer>
            <div
                style={{
                    width: 0,
                    overflow:'hidden'
                }}
            >
                <input
                    disabled={disabled}
                    id="images"
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileChange}
                    required={!files.length}
                />
            </div>
        </ContentContainer>
    );
}

export default ImagesPicker;