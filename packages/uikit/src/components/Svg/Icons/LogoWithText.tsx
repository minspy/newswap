import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="/images/logoWithText.png" style={{ width: "180px", height: "48px" }} alt="" {...props} />;
};

export default Icon;