import React from "react";
import Svg from "../Svg/Svg";
import { SvgProps } from "../Svg/types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 60 60" {...props}>
      <svg
        width="60px"
        height="60px"
        viewBox="0 0 30 30"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <title>编组</title>
        <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="画板" transform="translate(-253.000000, -237.000000)" fill="#80858E">
            <g id="编组" transform="translate(253.000000, 237.000000)">
              <rect
                id="325"
                fillOpacity="0.9"
                transform="translate(7.928932, 7.928932) rotate(-45.000000) translate(-7.928932, -7.928932) "
                x="5.92893219"
                y="2.92893219"
                width="4"
                height="10"
                rx="2"
               />
              <rect
                id="270"
                fillOpacity="0.7"
                transform="translate(5.000000, 15.000000) rotate(90.000000) translate(-5.000000, -15.000000) "
                x="3"
                y="10"
                width="4"
                height="10"
                rx="2"
               />
              <rect
                id="225"
                fillOpacity="0.6"
                transform="translate(7.928932, 22.071068) rotate(45.000000) translate(-7.928932, -22.071068) "
                x="5.92893219"
                y="17.0710678"
                width="4"
                height="10"
                rx="2"
               />
              <rect id="180" fillOpacity="0.4" x="13" y="20" width="4" height="10" rx="2" />
              <rect
                id="135"
                fillOpacity="0.3"
                transform="translate(22.071068, 22.071068) rotate(-45.000000) translate(-22.071068, -22.071068) "
                x="20.0710678"
                y="17.0710678"
                width="4"
                height="10"
                rx="2"
               />
              <rect
                id="90"
                fillOpacity="0.2"
                transform="translate(25.000000, 15.000000) rotate(90.000000) translate(-25.000000, -15.000000) "
                x="23"
                y="10"
                width="4"
                height="10"
                rx="2"
               />
              <rect
                id="45"
                fillOpacity="0.1"
                transform="translate(22.071068, 7.928932) rotate(45.000000) translate(-22.071068, -7.928932) "
                x="20.0710678"
                y="2.92893219"
                width="4"
                height="10"
                rx="2"
               />
              <rect id="0" x="13" y="0" width="4" height="10" rx="2" />
            </g>
          </g>
        </g>
      </svg>
    </Svg>
  );
};

export default Icon;
