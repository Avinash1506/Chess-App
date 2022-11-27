/*
    Reference - http://www.glicko.net/research/gdescrip.pdf
*/

const Rating = require("../models/Rating");

const reciprocal = (val) => {
    return 1 / val;
}

const getRD = (RD_old, c, t) => {
    return Math.min(Math.sqrt(Math.pow(RD_old, 2) + Math.pow(c, 2)*t), 350);
}

const getOldRatingAndOldRD = async (player) => {
    let userRatingData;

    const func = async () => {
        userRatingData = await Rating.find({username: player});
    }

    await func();

    let rating = 1500, RD = 350;

    let noOfElements = userRatingData.length;
    if(noOfElements !== 0) {
        rating = userRatingData[noOfElements - 1]['rating'];
        let RD_old = userRatingData[noOfElements - 1]['RD'];

        let c = 63.2;

        RD = getRD(RD_old, c, 1);
    }   

    return [rating, RD];
}

const getS = (verdict) => {
    if(verdict === 'win') {
        return 1;
    } else if(verdict === 'lose') {
        return 0;
    } else if(verdict === 'draw') {
        return 0.5;
    }
}

const getSj = (verdict) => {
    if(verdict === 'win') return 0;
    else if(verdict === 'lose') return 1;
    else if(verdict === 'draw') return 0.5;
}

const getQ = () => {
    return Math.log(10) / 400;
}

const g = (RD) => {
    return reciprocal(Math.sqrt(1+(3*Math.pow(getQ(), 2)*Math.pow(RD, 2)) / Math.pow(Math.PI, 2)));  
}

const E = (r, rj, RDj) => {
    return reciprocal(1 + reciprocal(Math.pow(10, g(RDj)*(r-rj)/400)));
}

const getD2 = (q, r, rj, RDj) => {
    const e = E(r, rj, RDj);
    return reciprocal(Math.pow(q, 2)*(Math.pow(g(RDj), 2)*e*(1 - e)));
}

const getNewR = (r, RD, rj, RDj, s, q, d2, sj) => {
    return r + (q/(reciprocal(Math.pow(RD, 2)) + reciprocal(d2)))*(g(RDj)*(s - E(r, rj, RDj)))
}

const getNewRD = (RD, d2) => {
    return Math.sqrt(reciprocal(reciprocal(Math.pow(RD, 2)) + reciprocal(d2)));
}

const getRatingAndRD = async (player1, player2, verdict) => {
    
    const [r, RD] = await getOldRatingAndOldRD(player1)
    const [rj, RDj] = await getOldRatingAndOldRD(player2)

    const s = getS(verdict);
    const sj = getSj(verdict);
    const q = getQ();
    const d2 = getD2(q, r, rj, RDj);

    const r_dash = getNewR(r, RD, rj, RDj, s, q, d2, sj);
    const RD_dash = getNewRD(RD, d2);

    return [r_dash, RD_dash];
}

const updateRating = async (player1, player2, verdict, roomId) => {
    const [ratingOfPlayer1, RDOfPlayer1] = await getRatingAndRD(player1, player2, verdict);

    if(verdict === 'win') {
        verdict = 'lose';
    } else if(verdict ===  'lose') {
        verdict = 'win';
    }

    const [ratingOfPlayer2, RDOfPlayer2] = await getRatingAndRD(player2, player1, verdict);

    console.log([ratingOfPlayer1, RDOfPlayer1, ratingOfPlayer2, RDOfPlayer2]);
    const ratingObj1 = new Rating({username: player1, rating: ratingOfPlayer1, RD: RDOfPlayer1, roomId: roomId});
    await ratingObj1.save();

    const ratingObj2 = new Rating({username: player2, rating: ratingOfPlayer2, RD: RDOfPlayer2, roomId: roomId});
    await ratingObj2.save();
}

module.exports = updateRating;