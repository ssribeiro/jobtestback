//let mongoose = require("mongoose");
const DayModel = require('../app/models/day');
const Util = require('../app/util');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiThings);
//Our parent block

describe('Days', () => {
  let today;
  let theDate;

  beforeEach((done) => {
    theDate = Util.moment();
    today = {
      day: theDate.date(),
      month: theDate.month()+1,
      weekday: Util.localeWeekName(theDate.weekday()),
      orderFromToday: 0,
    };
    done();
  });

  describe('/GET days', () => {

    it('it should GET all the 5 days', (done) => {
      chai.request(server)
        .get('/api/days')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(5);
        done();
      });
    });

    it('it should include today', (done) => {
      console.log('today is:', today);
      chai.request(server)
        .get('/api/days')
        .end((err, res) => {
          res.body.should.contain.a.thing.with.property('day', today.day);
          const theDay = res.body.filter(day=>day.day==today.day)[0];
          theDay.month.should.be.deep.equal(today.month);
          theDay.weekday.should.be.deep.equal(today.weekday);
        done();
      });
    });

    it('it should say that today is at order ZERO', (done) => {
      console.log('today is:', today);
      chai.request(server)
        .get('/api/days')
        .end((err, res) => {
          const theDay = res.body.filter(day=>day.day==today.day)[0];
          theDay.orderFromToday.should.be.deep.equal(0);
        done();
      });
    });

    it('it should say that tomorrow is at order ONE', (done) => {
      theDate.add(1, 'days');
      tomorrow = {
        day: theDate.date(),
        month: theDate.month()+1,
        weekday: Util.localeWeekName(theDate.weekday()),
        orderFromToday: 1,
      }
      console.log('tomorrow is:', tomorrow);
      chai.request(server)
        .get('/api/days')
        .end((err, res) => {
          const theDay = res.body.filter(day=>day.day==tomorrow.day)[0];
          theDay.orderFromToday.should.be.deep.equal(1);
        done();
      });
    });

    it('it should say that yesterday is at order ONE MINUS', (done) => {
      theDate.subtract(1, 'days');
      tomorrow = {
        day: theDate.date(),
        month: theDate.month()+1,
        weekday: Util.localeWeekName(theDate.weekday()),
        orderFromToday: -1,
      }
      console.log('tomorrow is:', tomorrow);
      chai.request(server)
        .get('/api/days')
        .end((err, res) => {
          const theDay = res.body.filter(day=>day.day==tomorrow.day)[0];
          theDay.orderFromToday.should.be.deep.equal(-1);
        done();
      });
    });

  });

});
