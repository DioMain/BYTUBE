import { Stack } from "@mui/material";
import { TextFieldMixin } from "@styles/Inputs";
import { Avatar } from "@styles/Mixins";
import { ThemeValues } from "@styles/Themes";
import styled from "styled-components";

const CommentViewer = styled(Stack)``;

const NewComment = styled(Stack)`
  input {
    ${TextFieldMixin()}

    width: 100%;
  }
`;

const CommentList = styled(Stack)``;

const ListItem = styled(Stack)`
  background-color: ${ThemeValues.commonBackColor};

  padding: ${ThemeValues.commonPadding};

  border-radius: ${ThemeValues.smallBorderRadius};
`;

const ItemIcon = styled.div`
  ${Avatar("48px")}

  min-width: 48px;
`;

const ItemName = styled(Stack)`
  font-size: 14px;
  font-weight: 500;
`;

const ItemText = styled.p`
  font-size: 14px;
`;

const ItemInput = styled.input`
  ${TextFieldMixin()}

  width: 100%;
`;

const ItemCreated = styled.div`
  font-size: 10px;
`;

const styles = {
  CommentViewer,
  CommentList,
  NewComment,
  ListItem,
  ItemText,
  ItemCreated,
  ItemIcon,
  ItemName,
  ItemInput,
};

export default styles;
