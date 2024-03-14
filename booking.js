const axios = require('axios');

module.exports.bookingTunnel = async ({data}) => {
  try {
    let response = {};
    const {details} = data;

    for (let key in details) {
      if (!response[key]) response[key] = {};

      const {hotelIds, checkin, checkout} = details[key];

      const guests = [
        {
          adults: 1,
          children: [],
        },
      ];

      const requestResponse = await axios.post(
        `https://api.worldota.net/api/b2b/v3/search/serp/hotels/`,
        {
          ids: hotelIds,
          language: 'en',
          currency: 'USD',
          checkin: checkin
            ? new Date(checkin).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10),
          checkout: checkout
            ? new Date(checkout).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10),
          guests,
        },
        {
          auth: {
            username: process.env.RATE_HAWK_USERNAME,
            password: process.env.RATE_HAWK_PASSWORD,
          },
        }
      );

      if (requestResponse) {
        const cityHotels = requestResponse.data?.data?.hotels;
        let cityHotel;
        let hotelWithCancellationFound;

        for (let i = 0; i <= cityHotels.length; i++) {
          const hotel = cityHotels[i];

          if (hotel?.rates?.length > 0) {
            const rates = hotel?.rates;
            for (let i = 0; i <= rates.length; i++) {
              const rate = rates[i];
              if (
                rate?.payment_options?.payment_types?.[0]
                  ?.cancellation_penalties?.free_cancellation_before
              ) {
                cityHotel = hotel;
                hotelWithCancellationFound = true;
              }
            }
          }
        }

        if (!hotelWithCancellationFound)
          cityHotel = requestResponse.data?.data?.hotels[0];

        if (cityHotel?.id) {
          const {id, rates} = cityHotel;

          if (!response[key][id]) response[key][id] = [];

          rates.map(({payment_options, room_name, daily_prices}) => {
            const cancellationDate =
              payment_options.payment_types[0].cancellation_penalties
                ?.free_cancellation_before;
            response[key][id] = [
              ...response[key][id],
              {amount: daily_prices[0], cancellationDate, room_name},
            ];
          });
        }
      }
    }

    for (let key in response) {
      const city = response[key];
      let sortedHotelRates;
      for (let key in city) {
        const hotelRates = city[key];

        sortedHotelRates = hotelRates.sort((a, b) => {
          const {cancellationDate: cancellationDateA} = a;
          const {cancellationDate: cancellationDateB} = b;

          return new Date(cancellationDateB) - new Date(cancellationDateA);
        });
      }
      city['bestCancellation'] = sortedHotelRates?.[0];
    }

    return {success: true, response};
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};
