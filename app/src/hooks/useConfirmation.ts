import * as React from "react";
import { ConfirmationContext } from "../contexts/ConfirmationContext";

export const useConfirmation = () => React.useContext(ConfirmationContext);
