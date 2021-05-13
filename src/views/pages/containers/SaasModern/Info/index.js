import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import Box from '../../../common/components/Box';
import Text from '../../../common/components/Text';
import Heading from '../../../common/components/Heading';
import Button from '../../../common/components/Button';
import Card from '../../../common/components/Card';
import Image from '../../../common/components/Image';
import Container from '../../../common/components/UI/Container';
// import { Document, Page } from 'react-pdf/dist/esm/entry.parcel';
import { Document, Page } from 'react-pdf/dist/esm/entry.parcel';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import InfoSectionWrapper from './info.style';
import ImageOne from '../../../common/assets/image/saasModern/1.png';
import ImageTwo from '../../../common/assets/image/saasModern/2.png';

import pdfFile from './openstreet-meth.pdf';
// import pdfFile from './sample.pdf';

const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
};

function InfoSection({
  row,
  col,
  title,
  description,
  button,
  textArea,
  imageArea,
  imageAreaRow,
  imageWrapper,
  imageWrapperOne,
  imageWrapperTwo,
  textAreaRow,
}) {
    const [file, setFile] = useState(pdfFile);
    const [numPages, setNumPages] = useState(null);
    
    function onDocumentLoadSuccess({ numPages }) {
        console.log(numPages,'this is page number')
        setNumPages(numPages);
    }
    function onLoadErrorFunc(error) {
        console.log(error);
    }
  return (
    <InfoSectionWrapper>
        <Container fullWidth noGutter className="info-sec-container">
            <Box {...row} {...imageAreaRow}>
            <Box {...col} {...imageArea} className="image_area">
                <Card {...imageWrapper} {...imageWrapperOne}>
                <Fade left>
                              <Image src={ImageOne} alt="Info Image One"/>
                </Fade>
                </Card>
                <Card {...imageWrapper} {...imageWrapperTwo}>
                <Fade bottom>
                    <Image src={ImageTwo} alt="Info Image Two" />
                </Fade>
                </Card>
            </Box>
            </Box>
        </Container>

      <Container>
        <Box {...row} {...textAreaRow}>
          <Box {...col} {...textArea}>
            <Heading
              {...title}
              content="Make your wealth grow with next level research"
            />
            <Text
              {...description}
              content="Openstreet leverages years of company filings and institutional data to make deep inferences about securities."
            />
            <Box>
            
              <Link to="/knowledgebase">
                <a>
                  <Button {...button} title="HOW IT WORKS" />
                </a>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </InfoSectionWrapper>
  );
};

InfoSection.propTypes = {
  row: PropTypes.object,
  col: PropTypes.object,
  title: PropTypes.object,
  description: PropTypes.object,
  button: PropTypes.object,
  textArea: PropTypes.object,
  imageArea: PropTypes.object,
  imageAreaRow: PropTypes.object,
  imageWrapper: PropTypes.object,
  imageWrapperOne: PropTypes.object,
  imageWrapperTwo: PropTypes.object,
  textAreaRow: PropTypes.object,
};

InfoSection.defaultProps = {
  row: {
    flexBox: true,
    flexWrap: 'wrap',
    ml: '-15px',
    mr: '-15px',
  },
  textAreaRow: {
    flexDirection: 'row-reverse',
  },
  col: {
    pr: '15px',
    pl: '15px',
  },
  textArea: {
    width: ['100%', '100%', '50%', '50%', '42%'],
  },
  imageArea: {
    width: ['100%', '100%', '50%', '50%', '55%'],
    flexBox: true,
  },
  imageWrapper: {
    boxShadow: 'none',
  },
  imageWrapperOne: {
    mr: ['-250px', '-250px', '-200px', '-250px', '-400px'],
  },
  imageWrapperTwo: {
    alignSelf: 'flex-end',
    mb: '-60px',
  },
  title: {
    fontSize: ['26px', '32px', '36px', '40px', '48px'],
    fontWeight: '400',
    color: '#0f2137',
    letterSpacing: '-0.025em',
    mb: '20px',
    lineHeight: '1.25',
  },
  description: {
    fontSize: ['15px', '15px', '15px', '16px', '16px'],
    color: '#343d48cc',
    lineHeight: '2',
    mb: '33px',
  },
  button: {
    type: 'button',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '4px',
    pl: '22px',
    pr: '22px',
    colors: 'secondaryWithBg',
  },
};

export default InfoSection;
