import * as styled from "./styles";
import Link from "next/link";

interface HeaderProps {
  color?: string;
}

export const Header = ({ color }: HeaderProps) => {
  return (
    <styled.HeaderContainer color={color}>
      <h1>
        <Link href="/">
          <a>Contabilidade</a>
        </Link>
      </h1>
      <div>
        <nav>
          <Link href="/records">
            <a>Cadastros</a>
          </Link>
          <Link href="/results">
            <a>Resultados</a>
          </Link>
        </nav>
      </div>
    </styled.HeaderContainer>
  );
};
