const sinon = require("sinon");
const chai = require("chai");
sinon.assert.expose(chai.assert, {prefix: ""});
const expect = chai.expect;
const assert = chai.assert;
chai.use(require("sinon-chai"));

const mock = sinon.mock;
const spy = sinon.spy;
const fake = sinon.fake;
const stub = sinon.stub;

export function createQuery(keyspace: string = "sample_keyspace") {
    return require("cassanknex")({
        debug: false
    })(keyspace);
}

export {
    expect,
    assert,
    mock,
    spy,
    fake,
    stub
};