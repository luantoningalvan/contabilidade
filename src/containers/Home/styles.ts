import { darken } from "polished";
import styled from "styled-components";

export const CategoriesBar = styled.div<{ color?: string }>`
  display: flex;
  padding: 0 1.5rem;
  background-color: ${(props) =>
    props.color ? darken(0.05, props.color) : "#111"};

  nav {
    flex: 1;
  }

  button {
    color: white !important;
  }

  .MuiTabs-indicator {
    background: white;
  }
`;

export const FilterBar = styled.div`
  padding: 0.5rem 1.5rem;
  background: #fafafa;
`;
