import React from 'react';
import styled from 'styled-components';

const Spin = () => {
  return (
    <StyledWrapper>
      <div>
        <svg height={0} width={0}>
          <defs>
            <filter colorInterpolationFilters="sRGB" height="200%" y="-50%" width="200%" x="-50%" id="goo">
              <feGaussianBlur result="blur" stdDeviation={8} in="SourceGraphic" />
              <feColorMatrix result="cm" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" mode="matrix" in="blur" />
            </filter>
          </defs>
        </svg>
        <svg height={180} width={320} viewBox="0 0 320 180">
          <g filter="url(#goo)">
            <circle cy={90} cx={160} r={19} fill="#275EFE" className="circle" />
            <circle cy={90} cx={160} r={19} fill="#275EFE" className="circle right" />
          </g>
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .circle {
    animation: move571 4s linear infinite;
  }

  .circle.right {
    animation-direction: reverse;
  }

  @keyframes move571 {
    25% {
      transform: translateX(-32px);
    }

    75% {
      transform: translateX(32px);
    }
  }`;

export default Spin;
