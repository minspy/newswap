import React from "react";
import styled, { keyframes } from "styled-components";
import PancakeIcon from "./PancakeIcon";
import { SpinnerProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  position: relative;
`;

const FloatingPanIcon = styled(PancakeIcon)`
  animation: ${rotate} 2s linear infinite;
  transform: translate3d(0, 0, 0);
`;

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 32 }) => {
  return (
    <Container>
      <FloatingPanIcon width={`${size}px`} />
    </Container>
  );
};

export default Spinner;
