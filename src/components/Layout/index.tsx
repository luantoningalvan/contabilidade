import * as styled from "./styles";
import Link from "next/link";
import { FaCalculator, FaUsers, FaChartPie } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = (props: LayoutProps) => {
  return (
    <>
      <styled.Navbar>
        <div className="logo">
          <Link href="/">
            <a>
              <FaCalculator size={20} />
            </a>
          </Link>
        </div>
        <nav>
          <Link href="/results">
            <a>
              <FaChartPie size={20} />
            </a>
          </Link>
          <Link href="/users">
            <a>
              <FaUsers size={20} />
            </a>
          </Link>
        </nav>
      </styled.Navbar>
      <styled.Main>{props.children}</styled.Main>
    </>
  );
};
