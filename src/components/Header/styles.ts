import styled from "styled-components";

interface HeaderContainerProps {
  color?: string;
}

export const HeaderContainer = styled.header<HeaderContainerProps>`
  width: 100%;
  background-color: ${(props) => props.color || "#000"};

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 3rem;

  h1 {
    font-size: 1.3rem;
    line-height: 1.3rem;

    a {
      color: white;
      font-weight: 700;
      text-decoration: none;
    }
  }

  nav {
    display: flex;
    height: 3rem;
    align-items: center;
    gap: 0.5rem;

    a {
      display: block;
      font-size: 1.1rem;
      text-decoration: none;
      color: white;
      border-radius: 4px;
      padding: 0.5rem;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
`;
