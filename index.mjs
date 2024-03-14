import axios from 'axios';

const data = {
  guests: [
    {
      adults: 2,
      children: [1],
    },
  ],
  locationAndDates: {
    'New York': {
      hotelIds: [
        'new_yorknew_york_hotel__casino',
        'new_york_capsule_hotel',
        'park_central_new_york',
        'hyatt_place_new_york_midtown_south',
      ],
      dates: ['2024/04/03', '2024/04/02', '2024/04/01'],
    },
    'New Haven': {
      hotelIds: [
        'clarion_hotel_and_suites',
        '606_new_haven',
        '607_new_haven',
        '620_new_haven',
        'new_haven_hotel',
      ],
      dates: ['2024/04/05', '2024/04/04', '2024/04/03'],
    },
    'Hart ford': {
      hotelIds: [
        'comfort_inn__suites_east_hartford',
        'cobblestone_hotel_and_suites_hartford',
        'hampton_inn_and_suites_east_hartford',
        'new_hartford_hotel',
        'ramada_east_hartford',
      ],
      dates: ['2024/04/07', '2024/04/06', '2024/04/05'],
    },
  },
};

const {guests, locationAndDates} = data;

const bookingTunnel = async () => {
  let response = {};
  for (let key in locationAndDates) {
    const {hotelIds, dates} = locationAndDates[key];
    var min = dates.reduce(function (a, b) {
      return a < b ? a : b;
    });
    var max = dates.reduce(function (a, b) {
      return a > b ? a : b;
    });

    // console.log(hotelIds);

    const requestResponse = await axios.post(
      `https://api.worldota.net/api/b2b/v3/search/serp/hotels/`,
      {
        ids: hotelIds,
        language: 'en',
        currency: 'USD',
        checkin: new Date(min).toISOString().substring(0, 10),
        checkout: new Date(max).toISOString().substring(0, 10),
        guests,
      },
      {
        auth: {
          username: '7229',
          password: 'c1f17348-c84b-433b-ad2c-86dc278579f7',
        },
      }
    );

    response[key] = requestResponse.data?.data?.hotels[0];
  }
  return response;
};

const response = await bookingTunnel();
console.log(response);

for (let key in response) {
  const {rates} = response[key];
}
