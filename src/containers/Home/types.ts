export type Unit = {
  id: number;
  name: string;
  purchase_price: number;
  sale_price: number;
  profit: number;
  client_name: string;
  sold: boolean;
};

export type Category = {
  id: number;
  name: string;
  color: string;
};
