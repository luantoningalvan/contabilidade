import styled from "styled-components";

export const CategoryItem = styled.div`
  padding: 0.5rem;
  margin: 0 -0.5rem;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;

  > div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &:hover {
    background: #ececec;
    border-radius: 0.25rem;
  }
`;

export const Circle = styled.div<{ color: string }>`
  height: 1.5rem;
  width: 1.5rem;
  background: ${(props) => props.color};
  border-radius: 50%;
`;
