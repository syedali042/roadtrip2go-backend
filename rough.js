cityHotels.map(({id, rates}) => {
  if (rates.length < 1) return;

  const sortedRates = rates.sort((a, b) => {
    const {daily_prices: dailyPricesA} = a;
    const {daily_prices: dailyPricesB} = b;
    return dailyPricesA[0] - dailyPricesB[0];
  });

  const frates = rates.filter(
    ({payment_options: {payment_types}}) =>
      payment_types[0]?.cancellation_penalties?.free_cancellation_before !==
      null
  );

  const fratesSorted = frates.sort((a, b) => {
    const {payment_options: payment_optionsA} = a;
    const {payment_options: payment_optionsB} = b;
    const {payment_types: payment_typesA} = payment_optionsA;
    const {payment_types: payment_typesB} = payment_optionsB;

    return (
      payment_typesA[0]?.cancellation_penalties?.free_cancellation_before -
      payment_typesB[0]?.cancellation_penalties?.free_cancellation_before
    );
  });

  console.log(JSON.stringify(fratesSorted));

  // rates.map(({daily_prices, room_name, payment_options}) => {
  //   const {payment_types} = payment_options;
  //   if (
  //     payment_types[0]?.cancellation_penalties
  //       ?.free_cancellation_before !== null
  //   ) {
  //     suggestedHotel = {
  //       id,
  //       daily_prices,
  //       free_cancellation_before:
  //         payment_types[0]?.cancellation_penalties
  //           ?.free_cancellation_before,
  //     };
  //   } else {
  //     suggestedHotel = {
  //       id,
  //       daily_prices: sortedRates[0].daily_prices,
  //       free_cancellation_before: null,
  //     };
  //   }
  // });
});
