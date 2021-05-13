import styled, { keyframes } from 'styled-components';
import BannerBG from '../../../common/assets/image/saasModern/banner-texture.png';

const Bubble = keyframes`
  0% {
		box-shadow: 0 0 0 3px rgba(255,65,108,0.3);
		opacity: 1;
		transform: scale3d(1, 1, 1);
	}
	100% {
		box-shadow: 0 0 0 100px rgba(255,65,108,0);
		opacity: 0;
		transform: scale3d(1, 1, 1);
	}
`;

export const BannerWrapper = styled.section`
  padding: 150px 0 50px 0;
  background-image: url(${BannerBG}),
    linear-gradient(35deg, #7367F0 0%, #7367F0 100%);
  background-size: cover;
  background-position: top center;
  @media (max-width: 575px) {
    padding: 120px 0 0 0;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export const DiscountWrapper = styled.div`
  text-align: center;
`;

export const DiscountLabel = styled.div`
  font-family: 'Open Sans', sans-serif;
  display: inline-block;
  border-radius: 4em;
  padding: 9px 22px;
  margin-bottom: 22px;
  background-color: rgba(255, 255, 255, 0.15);
  @media (max-width: 575px) {
    padding: 7px 10px;
  }
`;

export const VideoModal = styled.div`
  display: inline-block;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    background: linear-gradient(
      -139deg,
      rgb(255, 65, 108) 0%,
      rgb(255, 75, 43) 100%
    );
    opacity: 0.2;
    pointer-events: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export const PlayButton = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff4553;
  cursor: pointer;
  outline: 0;
  z-index: 2;
  @media (max-width: 767px) {
    width: 60px;
    height: 60px;
    svg {
      width: 30px;
    }
  }
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    top: 0;
    left: 0;
    border-radius: inherit;
  }
  &:focus {
    &:after {
      animation: ${Bubble} 0.5s ease-out forwards;
    }
  }
`;

export const VideoWrapper = styled.div`
  max-width: calc(100% - 30px);
  width: 900px;
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-top: 56.25%;
  }
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

