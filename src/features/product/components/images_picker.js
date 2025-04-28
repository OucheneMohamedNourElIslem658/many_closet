import { Add, AddAPhotoRounded } from "@mui/icons-material";
import { IconButton, styled, Typography } from "@mui/material";
import { useState } from "react";

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

const ImagesPicker = () => {
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files).map((file) => URL.createObjectURL(file));
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }

    return (
        <ContentContainer>
            <HeaderContainer>
                <TitlesContainer>
                    <Title>Images</Title>
                    <SubTitle>Upload images for your product.</SubTitle>
                </TitlesContainer>
                <IconButton component="label" for={"images"}>
                    <AddAPhotoRounded style={{color: 'black'}}/>
                </IconButton>
            </HeaderContainer>
            <ImagesContainer>
                {
                    files.length > 0 ? files.map((file, index) => (
                        <ImagePreview key={index} margin={1}>
                            <img src={file} alt={`Image ${index + 1}`} />
                            <button type="button" onClick={() => handleRemoveFile(index)}>X</button>
                        </ImagePreview>
                    )) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' , alignSelf: 'center'}}>
                            No images selected.
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
                    id="images"
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    required={!files.length}
                />
            </div>
        </ContentContainer>
    );
}

export default ImagesPicker;