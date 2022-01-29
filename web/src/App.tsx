import { AppContext } from "./contexts";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import { Records } from "./pages/Records";

function App() {
  return (
    <ChakraProvider>
      <AppContext>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/records" element={<Records />} />
          </Routes>
        </Router>
      </AppContext>
    </ChakraProvider>
  );
}

export default App;
