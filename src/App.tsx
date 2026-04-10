import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./assets/pages/Home";
import { TyphoonTracker } from "./assets/pages/TyphoonTracker";
import { Temperature } from "./assets/pages/Temperature";
import { NewsFeed } from "./assets/pages/NewsFeed";
import { Navbar } from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/typhoon-tracker" element={<TyphoonTracker />} />
        <Route path="/temperature" element={<Temperature />} />
        <Route path="/news-feed" element={<NewsFeed />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;