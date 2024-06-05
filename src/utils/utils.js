export const generateRandomDetails = () => {
    const randomPrice = Math.floor(Math.random() * 500) + 100;
    const randomDetails = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    return { price: randomPrice, details: randomDetails };
  };
  