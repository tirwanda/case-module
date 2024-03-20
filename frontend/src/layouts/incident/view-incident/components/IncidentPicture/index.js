import { useEffect, useState } from "react";

// react-images-viewer components
import ImgsViewer from "react-images-viewer";

// @mui material components
import Stack from "@mui/material/Stack";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Images
import image1 from "assets/images/products/No-Image.png";

function IncidentPicture({ image }) {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(image1);
  const [imgsViewer, setImgsViewer] = useState(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState(0);

  const handleSetCurrentImage = ({ currentTarget }) => {
    setCurrentImage(currentTarget.src);
    setImgsViewerCurrent(Number(currentTarget.id));
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent(imgsViewerCurrent + 1);
  const imgsViewerPrev = () => setImgsViewerCurrent(imgsViewerCurrent - 1);

  useEffect(() => {
    if (image?.length > 0) {
      setCurrentImage(image[0].url);
      const imageTemp = [];
      image.forEach((element) => {
        imageTemp.push({ src: element.url });
      });
      setImages(imageTemp);
    }
  }, [image]);

  useEffect(() => {}, [images]);

  return (
    <MDBox>
      <ImgsViewer
        imgs={images}
        isOpen={imgsViewer}
        onClose={closeImgsViewer}
        currImg={imgsViewerCurrent}
        onClickPrev={imgsViewerPrev}
        onClickNext={imgsViewerNext}
        backdropCloseable
      />
      <MDBox
        component="img"
        src={currentImage || image1}
        alt="Product Image"
        shadow="lg"
        borderRadius="lg"
        width="100%"
        onClick={openImgsViewer}
      />
      <MDBox mt={2} pt={1}>
        {images.length >= 1 && (
          <Stack direction="row" spacing={3}>
            {images.map((img, index) => (
              <MDBox
                key={index}
                component="img"
                id={index}
                src={img.src}
                alt="small image 1"
                borderRadius="lg"
                shadow="md"
                width="20%"
                height="5rem"
                minHeight="5rem"
                sx={{ cursor: "pointer", objectFit: "cover" }}
                onClick={handleSetCurrentImage}
              />
            ))}
          </Stack>
        )}
      </MDBox>
    </MDBox>
  );
}

export default IncidentPicture;
