import React from "react";
import Characters from "./Characters";
import Planets from "./Planets";
import Starships from "./Starships";

export const Home = () => {
    return (
        <div className="container">

            <section className="mb-5">
                <Characters />
            </section>

            <section className="mb-5">
                <Planets />
            </section>

            <section className="mb-5">
                <Starships />
            </section>
        </div>
    );
};