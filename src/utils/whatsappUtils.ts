
interface RoundTripData {
  pickupCity: string;
  destinationCity: string;
  additionalCity: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
}

interface OneWayData {
  pickupCity: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
}

interface LocalData {
  pickupCity: string;
  package: string;
  pickupDate: string;
  pickupTime: string;
}

interface AirportData {
  pickupCity: string;
  airportName: string;
  pickupDate: string;
  pickupTime: string;
}

export const formatWhatsAppMessage = (
  activeTab: string,
  roundData: RoundTripData,
  onewayData: OneWayData,
  localData: LocalData,
  airportData: AirportData,
  airportSection: string,
  mobileNumber: string
): string => {
  let message = '';
  
  switch(activeTab) {
    case 'round':
      message = `Round Trip Booking:
Pickup City: ${roundData.pickupCity}
Destination City: ${roundData.destinationCity}
Additional City: ${roundData.additionalCity}
Pickup Date: ${roundData.pickupDate}
Pickup Time: ${roundData.pickupTime}
Return Date: ${roundData.returnDate}`;
      break;
    case 'oneway':
      message = `One Way Booking:
Pickup City: ${onewayData.pickupCity}
Destination: ${onewayData.destination}
Pickup Date: ${onewayData.pickupDate}
Pickup Time: ${onewayData.pickupTime}`;
      break;
    case 'local':
      message = `Local Booking:
Pickup City: ${localData.pickupCity}
Package: ${localData.package}
Pickup Date: ${localData.pickupDate}
Pickup Time: ${localData.pickupTime}`;
      break;
    case 'airport':
      message = `Airport Transfer (${airportSection === 'going-to' ? 'Going to Airport' : 'Coming from Airport'}):
Pickup City: ${airportData.pickupCity}
Airport Name: ${airportData.airportName}
Pickup Date: ${airportData.pickupDate}
Pickup Time: ${airportData.pickupTime}`;
      break;
  }
  
  message += `\nMobile Number: ${mobileNumber}`;
  
  return message;
};

export const sendToWhatsApp = (message: string) => {
  const whatsappUrl = `https://wa.me/917497974808?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};
