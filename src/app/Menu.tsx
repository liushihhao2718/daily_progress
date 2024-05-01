import React from "react";
import styled from "styled-components";

const Dropbtn = styled.div`
  display: flex;
  text-align: center;
  text-decoration: none;
`;

const DropDownContent = styled.div<{ open?: boolean }>`
  display: ${(props) => (props.open ? "flex" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;

  flex-direction: column;
`;

const DropDownLi = styled.div`
  width: 50px;
  display: flex;

  &:hover {
    background-color: #fcfcfc;
  }
`;

const SubA = styled.a`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  &:hover {
    background-color: #fcfcfc;
  }
`;

function Menu({
  onClick,
  children,
}: {
  onClick?: (action: string) => void;
  children: React.ReactNode;
}) {
  const handleClick = (action: string) => {
    if (!action) return;

    if (onClick) onClick(action);
  };

  return (
    <DropDownLi>
      <Dropbtn onClick={() => handleClick("DropDown")}>{children}</Dropbtn>
      <DropDownContent>
        {" "}
        <SubA onClick={() => handleClick("Link1")}>Link 1</SubA>
        <SubA onClick={() => handleClick("Link2")}>Link 2</SubA>
        <SubA onClick={() => handleClick("Link3")}>Link 3</SubA>
      </DropDownContent>
    </DropDownLi>
  );
}

export { Menu, DropDownLi, Dropbtn, DropDownContent, SubA };
