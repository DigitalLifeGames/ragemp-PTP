var assert = require("assert");
var request = require("request");

var server = Service.app;
describe('PTP Service Tests',() => {

    describe('/server/time',() => {
        it('should return integer', function(done) {

            request('http://localhost:3000/server/time',(error,response,body) => {
                if(isNaN(parseInt(body)))
                    assert.fail(new Error());
                done();
            });
        });
    });
});