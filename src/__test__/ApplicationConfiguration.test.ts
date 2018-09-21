import test from "ava";
import {ApplicationConfiguration} from "../ApplicationConfiguration";

test("should load appropriate configuration file", async (t) => {
    const config = await ApplicationConfiguration.load(`${__dirname}/config.yml`);
    t.is(config instanceof ApplicationConfiguration, true);
    t.is(config.name, "bluesky-seed-service");
});