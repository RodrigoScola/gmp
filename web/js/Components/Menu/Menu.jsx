"use client";
import React from "react";
export const Menu = (props) => {
    const { TriggerElement, children } = props;
    return (<>
      <button onClick={() => props.onOpen()}>{TriggerElement}</button>
      {props.isOpen && <div {...props}>{children}</div>}
    </>);
};
