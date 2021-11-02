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
  height: 4rem;

  h1 a {
    color: white;
    font-size: 1.4rem;
    font-weight: 700;
    text-decoration: none;
  }

  nav {
    display: flex;
    font-size: 1.1rem;

    a {
      display: block;
      text-decoration: none;
      color: white;
      padding: 1rem;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
`;
