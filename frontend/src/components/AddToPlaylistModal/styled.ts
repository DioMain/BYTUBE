import styled from "styled-components";

const AddToPlayListItem = styled.button`
  background-color: rgb(200, 200, 200);

  border-radius: 12px;
  border-width: 0;

  padding: 6px;

  cursor: pointer;

  &:hover {
    background-color: rgb(180, 180, 180);
  }

  &:disabled {
    background-color: rgb(130, 130, 130);
    cursor: default;
    color: white;
  }
`;

const styles = {
  AddToPlayListItem,
};

export default styles;
