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

export const FilterBar = styled.div<{ color: string }>`
  padding: 0.5rem 1.5rem;
  background: ${(props) => props.color};
  display: flex;
  justify-content: space-between;

  .MuiButton-root {
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .MuiSelect-icon,
  .MuiInputLabel-root,
  .MuiInputAdornment-root {
    color: rgba(255, 255, 255, 0.7);
  }

  .MuiOutlinedInput-root {
    color: white;

    input::placeholder {
      color: white;
      opacity: 0.7;
    }

    .MuiOutlinedInput-notchedOutline {
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    &:hover {
      .MuiOutlinedInput-notchedOutline {
        border: 1px solid rgba(255, 255, 255, 0.7);
      }
    }
  }

  > div {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;
