import styled from "styled-components";

interface NavbarProps {
  color?: string;
}

export const Navbar = styled.header<NavbarProps>`
  width: 54px;
  height: 100vh;
  background-color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;

  .logo {
    width: 54px;
    height: 54px;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
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
    flex-direction: column;
    height: 3rem;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;

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

export const Main = styled.main`
  margin-left: 54px;
`;
