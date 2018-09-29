// @ts-check

const sinon = require('sinon');
const chai = require('chai');
const shortenerController = require('../../../api/controllers/shortenerController');
const databaseAdaptor = require('../../../api/adaptors/databaseAdaptor');
const listStub = require('../stubs/adaptors/databaseAdaptor/listStub.json');
const appSettings = require('../../../api/common/appSettings');
const getStub = require('../stubs/adaptors/databaseAdaptor/getStub.json');

chai.should();

appSettings.selfBaseUrl = 'http://localhost:3009/';


// Negative test case can also be created, but these are not covered below.

describe('Shortener Controller', () => {
  const res = {
    send: () => { },
    setHeader: () => { },
    json: () => { },
    redirect: () => { },
  };
  let resSendSpy;
  beforeEach(() => {
    // resSendSpy = sinon.spy(res, 'json');
    // resSendSpy = sinon.spy(res, 'redirect');
    // resSendSpy = sinon.spy(res, 'send');
  });
  afterEach(() => {
    // resSendSpy.restore();
  });

  describe('GET /shortener, #getUrlList', () => {
    it('should return 200', (done) => {
      resSendSpy = sinon.spy(res, 'json');
      const listDataStub = sinon.stub(databaseAdaptor, 'list').returns(Promise.resolve(listStub));
      shortenerController.getUrlList({}, res);
      listDataStub.restore();
      setTimeout(() => {
        resSendSpy.withArgs([{ "label": "http://localhost:3009/u8N5z", "href": "http://localhost:3009/u8N5z", "addedAt": "2018-09-29T10:22:16.062Z" }]).called.should.be.true;
        done();
        resSendSpy.restore();
      }, 0);
    });
  });

  describe('GET /, #redirectToOriginalUrl', () => {
    it('should return 200', (done) => {
      resSendSpy = sinon.spy(res, 'redirect');
      const getDataStub = sinon.stub(databaseAdaptor, 'get').returns(Promise.resolve(getStub));
      shortenerController.redirectToOriginalUrl({ params: { shorturlid: 'u8N5z' } }, res);
      getDataStub.restore();
      setTimeout(() => {
        resSendSpy.withArgs('http://zipgo.in/').called.should.be.true;
        done();
        resSendSpy.restore();
      }, 0);
    });
  });

  describe('GET /shortener, #createShortUrl', () => {
    it('should return 201', (done) => {
      resSendSpy = sinon.spy(res, 'send');
      const req = { body: { originalUrl: 'http://test.com/' } };
      const addStub = sinon.stub(databaseAdaptor, 'addToDb').returns(Promise.resolve());
      const emptyGetDataStub = sinon.stub(databaseAdaptor, 'get').returns(Promise.resolve());
      shortenerController.createShortUrl(req, res);
      setTimeout(() => {
        resSendSpy.withArgs(201, { message: 'created' }).called.should.be.true;
        done();
        emptyGetDataStub.restore();
        addStub.restore();
        resSendSpy.restore();
      }, 0);
    });
  });
});
