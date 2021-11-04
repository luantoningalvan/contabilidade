import * as styled from "./styles";
import Link from "next/link";
import { FiUsers, FiBarChart, FiBox } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";

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
          <Link href="/">
            <a>
              <FiBox size={20} />
            </a>
          </Link>
          <Link href="/results">
            <a>
              <FiBarChart size={20} />
            </a>
          </Link>
          <Link href="/records">
            <a>
              <FiUsers size={20} />
            </a>
          </Link>
        </nav>
      </styled.Navbar>
      <styled.Main>{props.children}</styled.Main>
    </>
  );
};
