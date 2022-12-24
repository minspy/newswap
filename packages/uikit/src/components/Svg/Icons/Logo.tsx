import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="/images/logo.png" style={{ width: "44px", height: "44px" }} {...props} alt="" />;
};

export default Icon;
