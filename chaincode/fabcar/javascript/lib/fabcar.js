/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.log('============= START : Initialize Ledger ===========');
        const cars = [
            {
                color: 'blue',
                make: 'Toyota',
                year: '2008',
                owner: 'Rafal',
            },
            {
                color: 'red',
                make: 'Ford',
                year: '2012',
                owner: 'Lukasz',
            },
            {
                color: 'green',
                make: 'Hyundai',
		year: '2011',
                owner: 'Maciek',
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
		year: '2007',
                owner: 'Max',
            },
            {
                color: 'black',
                make: 'Tesla',
		year: '2003',
                owner: 'Jan',
            },
            {
                color: 'purple',
                make: 'Peugeot',
		year: '2013',
                owner: 'Pawel',
            },
            {
                color: 'white',
                make: 'Chevrolet',
		year: '2002',
                owner: 'Drugi',
            },
            {
                color: 'violet',
                make: 'Fiat',
		year: '2017',
                owner: 'Jen',
            },
            {
                color: 'indigo',
                make: 'Chevrolet',
		year: '2006',
                owner: 'Mateusz',
            },
            {
                color: 'brown',
                make: 'Holden',
		year: '2018',
                owner: 'Karol',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.log('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, year, color, owner) {
        console.log('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            year,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.log('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.log('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.log('============= END : changeCarOwner ===========');
    }

    async changeCarColor(ctx, carNumber, newColor){
        console.log('============= START : changeCarColor ===========');
 	const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
	if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
	const car = JSON.parse(carAsBytes.toString());
        car.color = newColor;

	await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.log('============= END : changeCarColor ===========');
    }

    async deleteCar(ctx, carNumber){
	console.log('============= START : deleteCar ===========');
	const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
	if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
	const car = JSON.parse(carAsBytes.toString());

	await ctx.stub.deleteState(carNumber);	
	console.log('============= END : deleteCar ===========');	
    }

}

module.exports = FabCar;
