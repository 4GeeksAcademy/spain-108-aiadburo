import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { AddContact } from "./pages/AddContact";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Characters from "./pages/Characters";
import Planets from "./pages/Planets";
import Starships from "./pages/Starships";
import Contact from "./pages/Contact";
import CharacterCard from "./pages/CharacterCard";
import PlanetCard from "./pages/PlanetCard";
import StarshipCard from "./pages/StarshipCard";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
            <Route index element={<Home />} />
            <Route path="add" element={<AddContact />} />
            <Route path="edit/:id" element={<AddContact />} />
            <Route path="contact" element={<Contact />} />
            <Route path="single/:theId" element={<Single />} />
            <Route path="demo" element={<Demo />} />      
            <Route path="characters">
                <Route index element={<Characters />} />
                <Route path=":uid" element={<CharacterCard />} />
            </Route>
            <Route path="planets">
                <Route index element={<Planets />} />
                <Route path=":uid" element={<PlanetCard />} />
            </Route>
            <Route path="starships">
                <Route index element={<Starships />} />
                <Route path=":uid" element={<StarshipCard />} />
            </Route>
        </Route>
    )
);